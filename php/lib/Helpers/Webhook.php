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

    /** True if the Signedly-Signature header signs this raw body, made within 5 minutes;
     * with several v1 values (a secret rotation), any of them may match. */
    public static function verifySignature(
        string $secret,
        string $signatureHeader,
        string $rawBody,
        ?int $now = null
    ): bool {
        // During a secret rotation the header carries one v1 per secret
        // (t=…,v1=<new>,v1=<old>): any of them may match.
        $timestamp = null;
        $signatures = [];
        foreach (explode(',', $signatureHeader) as $item) {
            $pair = explode('=', $item, 2);
            if (count($pair) !== 2) {
                continue;
            }
            if ($pair[0] === 't') {
                $timestamp = $pair[1];
            } elseif ($pair[0] === 'v1' && $pair[1] !== '') {
                $signatures[] = $pair[1];
            }
        }
        if ($timestamp === null || !$signatures || !ctype_digit($timestamp)) {
            return false;
        }
        if (abs(($now ?? time()) - (int) $timestamp) > self::TOLERANCE) {
            return false;
        }
        $expected = hash_hmac('sha256', $timestamp . '.' . $rawBody, $secret);
        foreach ($signatures as $signature) {
            if (hash_equals($expected, $signature)) {
                return true;
            }
        }
        return false;
    }
}
