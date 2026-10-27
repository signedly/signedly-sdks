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
}
