<?php

namespace Signedly\Test\Helpers;

use PHPUnit\Framework\TestCase;
use Signedly\Helpers\Webhook;

class WebhookTest extends TestCase
{
    private function sign(string $secret, int $t, string $body): string
    {
        return 't=' . $t . ',v1=' . hash_hmac('sha256', $t . '.' . $body, $secret);
    }

    public function testGoodSignatureVerifiesAndBadOnesFail(): void
    {
        $header = $this->sign('whsec_x', 1000, '{"id":"1"}');
        $this->assertTrue(Webhook::verifySignature('whsec_x', $header, '{"id":"1"}', 1000));
        $this->assertFalse(Webhook::verifySignature('whsec_y', $header, '{"id":"1"}', 1000));
        $this->assertFalse(Webhook::verifySignature('whsec_x', $header, '{"id":"2"}', 1000));
        $this->assertFalse(Webhook::verifySignature('whsec_x', $header, '{"id":"1"}', 1301));
        $this->assertFalse(Webhook::verifySignature('whsec_x', 'garbage', '{}', 1000));
    }

    public function testDuringASecretRotationEitherSecretsV1Verifies(): void
    {
        $body = '{"id":"1"}';
        $new = explode(',v1=', $this->sign('whsec_new', 1000, $body))[1];
        $old = explode(',v1=', $this->sign('whsec_old', 1000, $body))[1];
        foreach (["t=1000,v1=$new,v1=$old", "t=1000,v1=$old,v1=$new"] as $header) {
            $this->assertTrue(Webhook::verifySignature('whsec_new', $header, $body, 1000));
            $this->assertTrue(Webhook::verifySignature('whsec_old', $header, $body, 1000));
            $this->assertFalse(Webhook::verifySignature('whsec_other', $header, $body, 1000));
        }
        $this->assertTrue(Webhook::verifySignature('whsec_new', "t=1000,v1=00,v1=$new", $body, 1000));
        $this->assertFalse(Webhook::verifySignature('whsec_new', 't=1000,v1=00,v1=11', $body, 1000));
    }
}
