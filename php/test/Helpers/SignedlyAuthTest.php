<?php

namespace Signedly\Test\Helpers;

use PHPUnit\Framework\TestCase;
use Signedly\Api\AuthenticationApi;
use Signedly\ApiException;
use Signedly\Helpers\SignedlyAuth;
use Signedly\Model\RefreshAccessToken200Response;

/**
 * config() logs in with the keys, renews with the refresh token, and falls back to
 * the keys when the refresh token is refused (signed out, or replaced).
 */
class SignedlyAuthTest extends TestCase
{
    /** An AuthenticationApi that answers from memory and records the calls. */
    private function fakeAuth(bool $refuseRefresh): AuthenticationApi
    {
        return new class ($refuseRefresh) extends AuthenticationApi {
            public array $calls = [];
            private bool $refuseRefresh;
            private int $issued = 0;

            public function __construct(bool $refuseRefresh)
            {
                $this->refuseRefresh = $refuseRefresh;
            }

            private function token(): RefreshAccessToken200Response
            {
                $this->issued += 1;
                // Expires within the renewal margin, so every config() call renews.
                return new RefreshAccessToken200Response([
                    'access_token' => 'tok-' . $this->issued,
                    'refresh_token' => 'ref-1',
                    'expiry_date' => new \DateTime('+60 seconds'),
                    'refresh_token_expiry_date' => new \DateTime('+7 days'),
                ]);
            }

            public function getAccessToken($data, string $contentType = 'application/json')
            {
                $this->calls[] = 'token';
                return $this->token();
            }

            public function refreshAccessToken($data, string $contentType = 'application/json')
            {
                $this->calls[] = 'refresh';
                if ($this->refuseRefresh) {
                    throw new ApiException('Token not found', 403);
                }
                return $this->token();
            }
        };
    }

    private function authWith(AuthenticationApi $fake): SignedlyAuth
    {
        $auth = new SignedlyAuth('id', 'secret', 'http://127.0.0.1:1');
        $property = new \ReflectionProperty(SignedlyAuth::class, 'auth');
        if (PHP_VERSION_ID < 80100) {
            $property->setAccessible(true); // needed before PHP 8.1 only
        }
        $property->setValue($auth, $fake);
        return $auth;
    }

    public function testRenewsWithTheRefreshToken(): void
    {
        $fake = $this->fakeAuth(false);
        $auth = $this->authWith($fake);
        $this->assertSame('tok-1', $auth->config()->getApiKey('Authorization'));
        $this->assertSame('tok-2', $auth->config()->getApiKey('Authorization'));
        $this->assertSame(['token', 'refresh'], $fake->calls);
    }

    public function testRefusedRefreshTokenFallsBackToTheKeys(): void
    {
        $fake = $this->fakeAuth(true);
        $auth = $this->authWith($fake);
        $this->assertSame('tok-1', $auth->config()->getApiKey('Authorization'));
        $this->assertSame('tok-2', $auth->config()->getApiKey('Authorization'));
        $this->assertSame(['token', 'refresh', 'token'], $fake->calls);
    }
}
