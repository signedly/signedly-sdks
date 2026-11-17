<?php
/**
 * Hand-written helper, kept when the SDK is regenerated (.openapi-generator-ignore).
 *
 *   $auth = new \Signedly\Helpers\SignedlyAuth($clientId, $clientSecret); // test keys too
 *   $documents = (new \Signedly\Api\DocumentsApi(null, $auth->config()))->listDocuments();
 *
 * config() fetches the access token the first time and renews it (refresh token,
 * then the keys again) shortly before it expires; call it again for long jobs.
 */

namespace Signedly\Helpers;

use Signedly\Api\AuthenticationApi;
use Signedly\Configuration;
use Signedly\ApiException;
use Signedly\Model\GetAccessTokenRequest;
use Signedly\Model\RefreshAccessTokenRequest;

class SignedlyAuth
{
    public const LIVE_HOST = 'https://l0ads.signedly.com';
    private const RENEW_BEFORE = 120;

    private string $clientId;
    private string $clientSecret;
    private Configuration $config;
    private AuthenticationApi $auth;
    private string $refreshToken = '';
    private int $expires = 0;
    private int $refreshExpires = 0;

    public function __construct(
        string $clientId,
        string $clientSecret,
        string $host = self::LIVE_HOST
    ) {
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
        $this->config = (new Configuration())->setHost($host);
        $this->auth = new AuthenticationApi(null, (new Configuration())->setHost($host));
    }

    public function config(): Configuration
    {
        $now = time();
        if ($now < $this->expires - self::RENEW_BEFORE) {
            return $this->config;
        }
        $token = null;
        if ($this->refreshToken !== '' && $now < $this->refreshExpires - self::RENEW_BEFORE) {
            try {
                $token = $this->auth->refreshAccessToken(
                    new RefreshAccessTokenRequest(['refresh_token' => $this->refreshToken])
                );
            } catch (ApiException $refused) {
                // A refused refresh token (signed out, or replaced) isn't fatal:
                // log in again with the keys.
                $this->refreshToken = '';
            }
        }
        if ($token === null) {
            $token = $this->auth->getAccessToken(new GetAccessTokenRequest([
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
            ]));
        }
        $this->refreshToken = $token->getRefreshToken() ?: $this->refreshToken;
        $this->expires = $token->getExpiryDate() ? $token->getExpiryDate()->getTimestamp() : 0;
        if ($token->getRefreshTokenExpiryDate()) {
            $this->refreshExpires = $token->getRefreshTokenExpiryDate()->getTimestamp();
        }
        $this->config->setApiKey('Authorization', $token->getAccessToken());
        $this->config->setApiKeyPrefix('Authorization', 'Bearer');
        return $this->config;
    }
}
