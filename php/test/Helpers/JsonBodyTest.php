<?php

namespace Signedly\Test\Helpers;

use PHPUnit\Framework\TestCase;
use Signedly\Api\SendingApi;
use Signedly\Configuration;
use Signedly\Model\SendDocumentRequest;
use Signedly\ObjectSerializer;

/**
 * JSON request bodies are encoded by the SDK itself, so they work on Guzzle 7 and
 * Guzzle 8 (which removed GuzzleHttp\Utils::jsonEncode).
 */
class JsonBodyTest extends TestCase
{
    public function testJsonEncodeEncodesAndRefusesWhatItCant(): void
    {
        $this->assertSame('{"a":1,"b":["x"]}', ObjectSerializer::jsonEncode(['a' => 1, 'b' => ['x']]));
        $this->expectException(\InvalidArgumentException::class);
        ObjectSerializer::jsonEncode("\xB1\x31");
    }

    public function testAJsonRequestCarriesItsBody(): void
    {
        $config = (new Configuration())->setHost('https://example.com');
        $api = new SendingApi(null, $config);
        $request = $api->sendDocumentRequest(new SendDocumentRequest([
            'document_id' => 'doc-1',
            'subject' => 'Please sign',
            'message' => 'Hi',
        ]));
        $this->assertSame('POST', $request->getMethod());
        $this->assertStringContainsString('application/json', $request->getHeaderLine('Content-Type'));
        $body = json_decode((string) $request->getBody(), true);
        $this->assertSame('doc-1', $body['document_id']);
        $this->assertSame('Please sign', $body['subject']);
    }
}
