<?php
/**
 * Hand-written helper, kept when the SDK is regenerated (.openapi-generator-ignore).
 *
 *   $ok = \Signedly\Helpers\Webhook::verifySignature(
 *       $secret, $_SERVER['HTTP_SIGNEDLY_SIGNATURE'], file_get_contents('php://input'));
 */

namespace Signedly\Helpers;

class Webhook
{
    private const TOLERANCE = 300;

    /** True if the Signedly-Signature header signs this raw body, made within 5 minutes. */
    public static function verifySignature(
        string $secret,
        string $signatureHeader,
        string $rawBody,
        ?int $now = null
    ): bool {
        $parts = [];
        foreach (explode(',', $signatureHeader) as $item) {
            $pair = explode('=', $item, 2);
            if (count($pair) === 2) {
                $parts[$pair[0]] = $pair[1];
            }
        }
        if (!isset($parts['t'], $parts['v1']) || !ctype_digit($parts['t'])) {
            return false;
        }
        if (abs(($now ?? time()) - (int) $parts['t']) > self::TOLERANCE) {
            return false;
        }
        $expected = hash_hmac('sha256', $parts['t'] . '.' . $rawBody, $secret);
        return hash_equals($expected, $parts['v1']);
    }
}
