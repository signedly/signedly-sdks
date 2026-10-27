"""Hand-written helpers, kept when the SDK is regenerated (.openapi-generator-ignore).

    from signedly.helpers import SignedlyClient, verify_webhook_signature
    from signedly.api.documents_api import DocumentsApi

    client = SignedlyClient(CLIENT_ID, CLIENT_SECRET)   # test keys work the same
    documents = DocumentsApi(client.api_client).list_documents()

The access token is fetched on the first call and renewed (refresh token, then
the keys again) shortly before it expires.
"""

import hashlib
import hmac
import threading
import time
from datetime import datetime, timezone

from signedly.api.authentication_api import AuthenticationApi
from signedly.api_client import ApiClient
from signedly.configuration import Configuration
from signedly.models.get_access_token_request import GetAccessTokenRequest
from signedly.models.refresh_access_token_request import RefreshAccessTokenRequest

LIVE_HOST = "https://l0ads.signedly.com"
RENEW_BEFORE = 120  # seconds before expiry
SIGNATURE_TOLERANCE = 300  # seconds


def _seconds(moment):
    if moment is None:
        return 0
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    return moment.timestamp()


class SignedlyClient:
    """An ApiClient that logs in with the client ID and secret and keeps the
    access token fresh. Pass `api_client` to any generated API class."""

    def __init__(self, client_id, client_secret, host=LIVE_HOST):
        self.client_id, self.client_secret = client_id, client_secret
        self.configuration = Configuration(host=host)
        self.configuration.refresh_api_key_hook = self._ensure_token
        self.api_client = ApiClient(self.configuration)
        self._auth = AuthenticationApi(ApiClient(Configuration(host=host)))
        self._lock = threading.Lock()
        self._expires = self._refresh_expires = 0
        self._refresh_token = None

    def _ensure_token(self, configuration):
        with self._lock:
            now = time.time()
            if now < self._expires - RENEW_BEFORE:
                return
            if self._refresh_token and now < self._refresh_expires - RENEW_BEFORE:
                token = self._auth.refresh_access_token(
                    RefreshAccessTokenRequest(refresh_token=self._refresh_token)
                )
            else:
                token = self._auth.get_access_token(
                    GetAccessTokenRequest(
                        client_id=self.client_id, client_secret=self.client_secret
                    )
                )
            self._refresh_token = token.refresh_token or self._refresh_token
            self._expires = _seconds(token.expiry_date)
            if token.refresh_token_expiry_date:
                self._refresh_expires = _seconds(token.refresh_token_expiry_date)
            configuration.api_key["Bearer"] = token.access_token
            configuration.api_key_prefix["Bearer"] = "Bearer"


def verify_webhook_signature(secret, signature_header, raw_body, now=None):
    """True if `Signedly-Signature` signs this raw body with the endpoint's secret
    and was made within 5 minutes. Pass the body exactly as received (bytes)."""
    try:
        parts = dict(item.split("=", 1) for item in signature_header.split(","))
        timestamp = int(parts["t"])
    except (KeyError, ValueError, AttributeError):
        return False
    if abs((time.time() if now is None else now) - timestamp) > SIGNATURE_TOLERANCE:
        return False
    body = raw_body.decode() if isinstance(raw_body, bytes) else raw_body
    expected = hmac.new(
        secret.encode(), f"{timestamp}.{body}".encode(), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(parts.get("v1", ""), expected)
