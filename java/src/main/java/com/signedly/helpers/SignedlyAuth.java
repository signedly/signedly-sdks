package com.signedly.helpers;

import com.signedly.api.AuthenticationApi;
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.model.GetAccessTokenRequest;
import com.signedly.model.RefreshAccessToken200Response;
import com.signedly.model.RefreshAccessTokenRequest;
import java.time.Instant;

/**
 * Hand-written helper, kept when the SDK is regenerated (.openapi-generator-ignore).
 *
 * <pre>
 * ApiClient client = SignedlyAuth.client(clientId, clientSecret); // test keys too
 * new DocumentsApi(client).listDocuments(null, null, null, null, null);
 * </pre>
 *
 * Every request carries a fresh access token: fetched on the first call, renewed
 * (refresh token, then the keys again) shortly before it expires. When Signedly refuses
 * the keys, the API call throws that {@link ApiException} (403 and the reason).
 */
public final class SignedlyAuth {
  public static final String LIVE_HOST = "https://l0ads.signedly.com";
  private static final long RENEW_BEFORE_SECONDS = 120;

  private final String clientId;
  private final String clientSecret;
  private final AuthenticationApi auth;
  private String access = "";
  private String refresh = "";
  private Instant expires = Instant.EPOCH;
  private Instant refreshExpires = Instant.EPOCH;

  private SignedlyAuth(String clientId, String clientSecret, String host) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    ApiClient plain = new ApiClient();
    plain.updateBaseUri(host);
    this.auth = new AuthenticationApi(plain);
  }

  public static ApiClient client(String clientId, String clientSecret) {
    return client(clientId, clientSecret, LIVE_HOST);
  }

  public static ApiClient client(String clientId, String clientSecret, String host) {
    SignedlyAuth tokens = new SignedlyAuth(clientId, clientSecret, host);
    ApiClient client = new ApiClient();
    client.updateBaseUri(host);
    return client.setRequestInterceptor(
        request -> request.header("Authorization", "Bearer " + tokens.token()));
  }

  synchronized String token() {
    Instant now = Instant.now();
    if (now.isBefore(expires.minusSeconds(RENEW_BEFORE_SECONDS))) {
      return access;
    }
    try {
      RefreshAccessToken200Response answer =
          !refresh.isEmpty() && now.isBefore(refreshExpires.minusSeconds(RENEW_BEFORE_SECONDS))
              ? auth.refreshAccessToken(new RefreshAccessTokenRequest().refreshToken(refresh))
              : auth.getAccessToken(
                  new GetAccessTokenRequest().clientId(clientId).clientSecret(clientSecret));
      access = answer.getAccessToken();
      if (answer.getRefreshToken() != null) {
        refresh = answer.getRefreshToken();
      }
      expires = answer.getExpiryDate() == null ? Instant.EPOCH : answer.getExpiryDate().toInstant();
      if (answer.getRefreshTokenExpiryDate() != null) {
        refreshExpires = answer.getRefreshTokenExpiryDate().toInstant();
      }
      return access;
    } catch (ApiException e) {
      throw SignedlyAuth.<RuntimeException>asIs(e);
    }
  }

  /**
   * Throws the token call's ApiException unchanged. The request interceptor's type
   * (Consumer) can't declare it, but every API method that runs the interceptor does,
   * so the caller's {@code catch (ApiException e)} gets refused keys with their status
   * code and body, like any other refused request.
   */
  @SuppressWarnings("unchecked")
  private static <E extends Throwable> E asIs(Throwable e) throws E {
    throw (E) e;
  }
}
