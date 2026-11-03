import hashlib
import hmac

from signedly.helpers import verify_webhook_signature


def sign(secret, timestamp, body):
    digest = hmac.new(secret.encode(), f"{timestamp}.{body}".encode(), hashlib.sha256)
    return f"t={timestamp},v1={digest.hexdigest()}"


def test_a_good_signature_verifies():
    header = sign("whsec_x", 1000, '{"id":"1"}')
    assert verify_webhook_signature("whsec_x", header, b'{"id":"1"}', now=1000)


def test_wrong_secret_changed_body_or_old_signature_fail():
    header = sign("whsec_x", 1000, '{"id":"1"}')
    assert not verify_webhook_signature("whsec_y", header, b'{"id":"1"}', now=1000)
    assert not verify_webhook_signature("whsec_x", header, b'{"id":"2"}', now=1000)
    assert not verify_webhook_signature("whsec_x", header, b'{"id":"1"}', now=1301)
    assert not verify_webhook_signature("whsec_x", "garbage", b"{}", now=1000)


def test_the_client_logs_in_then_refreshes_before_expiry(monkeypatch):
    from datetime import datetime, timedelta, timezone
    from types import SimpleNamespace

    from signedly import helpers

    calls = []
    now = [datetime(2026, 1, 1, tzinfo=timezone.utc).timestamp()]
    monkeypatch.setattr(helpers.time, "time", lambda: now[0])

    def token(name):
        start = datetime.fromtimestamp(now[0], tz=timezone.utc)
        return SimpleNamespace(
            access_token=f"{name}-{len(calls)}",
            refresh_token="r1",
            expiry_date=start + timedelta(hours=2),
            refresh_token_expiry_date=start + timedelta(days=7),
        )

    class FakeAuth:
        def get_access_token(self, request):
            made = token("access")
            calls.append(("token", request.client_id))
            return made

        def refresh_access_token(self, request):
            made = token("refreshed")
            calls.append(("refresh", request.refresh_token))
            return made

    client = helpers.SignedlyClient("id", "secret")
    client._auth = FakeAuth()
    config = client.configuration
    assert config.get_api_key_with_prefix("Bearer") == "Bearer access-0"
    assert config.get_api_key_with_prefix("Bearer") == "Bearer access-0"  # reused
    now[0] += 2 * 3600 - 60  # within RENEW_BEFORE of expiry
    assert config.get_api_key_with_prefix("Bearer") == "Bearer refreshed-1"
    assert calls == [("token", "id"), ("refresh", "r1")]


def test_requests_carry_the_token(monkeypatch):
    """The generated client adds the Authorization header from auth_settings(),
    which skips the hook unless "Bearer" is already in api_key."""
    from types import SimpleNamespace

    from signedly import helpers

    class FakeAuth:
        def get_access_token(self, request):
            return SimpleNamespace(
                access_token="tok-1",
                refresh_token=None,
                expiry_date=None,
                refresh_token_expiry_date=None,
            )

    client = helpers.SignedlyClient("id", "secret")
    client._auth = FakeAuth()
    settings = client.configuration.auth_settings()
    assert settings["Bearer"]["value"] == "Bearer tok-1"
    assert settings["Bearer"]["key"] == "Authorization"
