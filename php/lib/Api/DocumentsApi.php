<?php
/**
 * DocumentsApi
 * PHP version 7.4
 *
 * @category Class
 * @package  Signedly
 * @author   OpenAPI Generator team
 * @link     https://openapi-generator.tech
 */

/**
 * Signedly API
 *
 * The Signedly REST API lets your system upload documents, add signatories and fields, send them for signing and download the signed result. Every path starts with `/ap1/`, and every request and response body is JSON unless an endpoint says otherwise (the uploads are `multipart/form-data`).  ## Authentication  1. In the Signedly web app, open **Account & Settings → API** and generate a    **client ID** and **client secret** for your organisation. 2. `POST /ap1/token/` with them. You get an `access_token` (valid **2 hours**) and    a `refresh_token` (valid **7 days**). While both are still valid, calling    `/ap1/token/` again returns the same pair. 3. Send the access token on every other call:    `Authorization: Bearer <access_token>`. 4. When the access token expires, `POST /ap1/refreshtoken/` with the refresh token    for a new access token. When the refresh token has expired too, call    `/ap1/token/` again.  `/ap1/token/` and `/ap1/refreshtoken/` allow 60 calls a minute per IP address; more answer 429. A missing, unknown or expired access token answers 403 (`\"Client not found\"` or `\"Access token expired\"`).  The API acts for your **organisation's admin account**: documents you upload belong to it and appear in its Signedly web app, and you can reach only that account's documents, templates, signatories and fields. Another organisation's IDs answer 404, as if they didn't exist.  ## Plans  What the API allows depends on the Signedly plan of your **organisation's admin account** (Account & Settings → Account & Plan). The same rules apply to live and test keys.  | What | Free | Personal Pro | Business Pro | Teams | |---|---|---|---|---| | Generate live and test keys (Account & Settings → API) | – | ✓ | ✓ | ✓ | | Every endpoint, `/ap1/token/` and `/ap1/refreshtoken/` included | – | ✓ | ✓ | ✓ | | `require_email_otp` on `POST /ap1/signatories/` and `POST /ap1/signatories/bulk/` | – | ✓ | ✓ | ✓ | | Bulk send: `GET /ap1/bulk-sends/columns/` and `POST /ap1/bulk-sends/` | – | – | – | ✓ |  The API is part of the paid plans. On Free (or with no plan) every call answers 403 `\"... Your plan doesn't include API access.\"`, with live or test keys, also with a token or keys made earlier; they work again once the plan is paid. On a paid plan, a feature it doesn't include answers 400 with `\"Your plan doesn't include ...\"` and changes nothing, and `GET /ap1/bulk-sends/{id}/` still reports bulk sends already made.  Live documents also need an API contract with Signedly. Without one, or with an unpaid API invoice, `POST /ap1/upload/` (except templates), `/ap1/upload_app/`, `/ap1/documents/fromtemplate/` and `/ap1/bulk-sends/` answer 402 with live keys. Test keys work without a contract (see Sandbox).  ## Sending a document for signing  1. `POST /ap1/upload/` a PDF or DOCX (`type` 2). The document is prepared in the    background: find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is    the upload's `id`), and wait until `GET /ap1/documents/{id}/pages/` lists its    pages. 2. `POST /ap1/signatories/` (one) or `POST /ap1/signatories/bulk/` (several) to    add the people who sign. 3. `POST /ap1/documents/fields/` to place the fields each signatory fills in. 4. Send it:    - `POST /ap1/document/send/` emails every signatory a signing link (with      ordered signing, only the first; each next one is emailed in      turn), or    - `POST /ap1/document/send_url/` sends no email and returns the first      signatory's signing link, for you to show or send yourself. 5. Poll `GET /ap1/documents-status-list/` (or `GET /ap1/documents/`) until the    status is 6 (Completed), then `GET /ap1/document/download-link/` for the    signed PDF and `GET /ap1/document/download-audit-link/` for its audit trail.  **From a template:** upload with `type` 4 and a `template_name` (or make the template in the web app), place its fields with `POST /ap1/templates/fields/`, then for each signing make a document with `POST /ap1/documents/fromtemplate/`, add its signatory, and send it.  **One signer, one call:** `POST /ap1/upload_app/` uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; the signer places their own signature. After signing they go to the `redirect_url` you sent, and the signed PDF and its audit trail are emailed to `final_email` (otherwise to your organisation's admin).  ## Quick start with curl  Each step uses an ID from the step before. `$API` is this server, e.g. `https://l0ads.signedly.com`.  ```bash # 1. Token curl -X POST $API/ap1/token/ -H 'Content-Type: application/json' \\   -d '{\"client_id\": \"<client id>\", \"client_secret\": \"<client secret>\"}' TOKEN=<access_token from the answer>  # 2. Upload a PDF (answers with the upload's id) curl -X POST $API/ap1/upload/ -H \"Authorization: Bearer $TOKEN\" \\   -F file=@nda.pdf -F name=nda-ann-lee -F type=2  # 3. Find the document, then wait until it has pages curl \"$API/ap1/documents/?name=nda-ann-lee\" -H \"Authorization: Bearer $TOKEN\" DOC=<results[0].id> curl $API/ap1/documents/$DOC/pages/ -H \"Authorization: Bearer $TOKEN\" PAGE=<[0].id>  # 4. Add the signatory curl -X POST $API/ap1/signatories/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"name\": \"Ann Lee\", \"email\": \"ann@example.com\"}' SIGNER=<id from the answer>  # 5. Place her signature: 150 × 40 points, 72 points from the left, 640 from the top curl -X POST $API/ap1/documents/fields/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '[{\"document_id\": \"'$DOC'\", \"signatory_id\": \"'$SIGNER'\", \"kind\": 2,         \"label\": \"Signature\", \"placeholder\": \"Sign here\", \"page\": \"'$PAGE'\",         \"page_number\": 0, \"x\": 72, \"y\": 640, \"width\": 150, \"height\": 40}]'  # 6. Send it (Ann gets the signing email) curl -X POST $API/ap1/document/send/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"subject\": \"Please sign the NDA\",        \"message\": \"Hi Ann, please sign by Friday.\", \"expiry_date\": \"2026-12-31\"}'  # 7. Poll until status is 6 (Completed), then get the signed PDF curl \"$API/ap1/documents-status-list/?document_ids=$DOC\" -H \"Authorization: Bearer $TOKEN\" curl \"$API/ap1/document/download-link/?id=$DOC\" -H \"Authorization: Bearer $TOKEN\" ```  ## Postman  Import the whole API into Postman with **Import → Link** and `<this server>/swaggerap1/postman.json`. Set `client_id` and `client_secret` in the collection's **Variables**, run **Get an access token** (it saves the token for every other request), and set `document_id` when a request needs one.  ## SDKs  Official client libraries, generated from this API's spec. Each also gets and renews the access token for you and checks webhook signatures:  | Language | Install | |---|---| | Python 3.8+ | `pip install signedly` | | Node / TypeScript | `npm install @signedly/sdk` | | PHP 7.4+ | `composer require signedly/sdk` | | Java 11+ | Maven or Gradle `com.signedly:signedly-sdk` |  Source and a quick start for each language: https://github.com/signedly/signedly-sdks  ## Webhooks  Instead of polling, add an endpoint with `POST /ap1/webhooks/` (or in **Account & Settings → API**) and Signedly posts your organisation's document events to it: `document.sent`, `document.viewed`, `document.signed`, `document.approved`, `document.completed`, `document.rejected` and `document.expired` (all of them, or the `events` you choose). Each is a JSON `POST`:  ```json {\"id\": \"5b7f…\", \"type\": \"document.signed\", \"created_at\": \"2026-10-27T09:12:00+00:00\",  \"test\": false,  \"data\": {\"document\": {\"id\": \"6f0c…\", \"name\": \"nda.pdf\", \"status\": 5},           \"recipient\": {\"id\": \"0b6e…\", \"email\": \"ann@example.com\", \"name\": \"Ann Lee\",                         \"role\": \"signer\"}}} ```  `recipient` is null for events no recipient caused (sent, completed, expired); `test` is true for documents made with your test keys. Fetch anything else, such as download links, with your access token: events never carry links.  **Check every event is from Signedly.** The `Signedly-Signature` header is `t=<unix seconds>,v1=<signature>`, where the signature is the hex HMAC-SHA256 of `<t>.<raw body>` with the endpoint's secret. Refuse an event whose signature doesn't match or whose `t` is more than 5 minutes off:  ```python import hashlib, hmac, time  def is_from_signedly(secret, header, raw_body):     parts = dict(item.split(\"=\", 1) for item in header.split(\",\"))     signed = f\"{parts['t']}.{raw_body.decode()}\".encode()     expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()     fresh = abs(time.time() - int(parts[\"t\"])) <= 300     return fresh and hmac.compare_digest(parts[\"v1\"], expected) ```  **Answer 2xx within 10 seconds**, then do the work. Anything else is retried after 1 and 5 minutes, then 30 minutes and 2, 5 and 10 hours (7 tries in about 18 hours). `Signedly-Event-Id` is the same on every try of an event: use it to ignore repeats. After 20 events in a row fail for good, Signedly switches the endpoint off and emails your organisation's admin; switch it on again with `PUT /ap1/webhooks/{id}/` and `\"is_active\": true`. Each endpoint's deliveries and their last answers are at `GET /ap1/webhooks/{id}/deliveries/`, and any can be sent again.  ## Sandbox  Build and test against the API without paying for documents: in **Account & Settings → API**, generate your **test keys**, and get a token with them at `/ap1/token/` as usual. Everything works the same, except that what you upload or make from a template with a test token is a **test document** (`is_test` on its upload):  - every page of its PDF and of its audit trail says **TEST – NOT LEGALLY BINDING**; - its emails are real, with `[TEST]` at the start of the subject; - it isn't billed or counted toward your plan; - your organisation can make 50 a calendar month (templates don't count); the next   upload answers 429.  ## Fields  Positions and sizes are in **PDF points** (1/72 inch), measured from the **top-left corner** of the page as it is displayed (rotation applied). `page_number` counts pages from 0. A field must sit wholly on its page (1 point of tolerance); otherwise it is refused with 400. A field's page and signatory can't be changed later: delete the field and add it again.  ## Status values  **Document `status`:** 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Signatories, fields and sends are only accepted while a document is 1–3 (not yet sent).  **Signatory `status`:** 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.  ## Lists  `GET /ap1/documents/`, `/ap1/documents-status-list/`, `/ap1/templates/`, `/ap1/logs/` and `/ap1/logs/hits/` are paged: pass `limit` (default 10) and `offset`, and read `count`, `next`, `previous` and `results` from the response.  ## Errors  | Status | Meaning | |---|---| | 400 | The request was refused, also when your plan doesn't include it (see Plans); the body says why (`{\"error\": \"...\"}`, or the name of each bad field with its messages). Nothing was changed. | | 403 | The access token is missing, unknown or expired; the client ID and secret or the refresh token were refused; the organisation's plan has no API access (Free, see Plans); or an `expiry_date` isn't in the future (`\"Invalid Date Entered\"`). | | 402 | No API contract, or an unpaid API invoice: live documents are refused (test keys keep working). | | 404 | The document, template, signatory or field doesn't exist or isn't yours. | | 429 | Too many token requests (wait a minute), or this month's 50 test documents are used. | | 5xx | Our side failed; retry later. |  A send that times out may still have worked: check the document's status before sending again (a second send of a sent document answers 400).  Download, view and audit links are valid for about 7 days; ask for a new one whenever you need it.
 *
 * The version of the OpenAPI document: v1
 * Contact: support@signedly.com
 * Generated by: https://openapi-generator.tech
 * Generator version: 7.10.0
 */

/**
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

namespace Signedly\Api;

use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7\MultipartStream;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\RequestOptions;
use Signedly\ApiException;
use Signedly\Configuration;
use Signedly\HeaderSelector;
use Signedly\ObjectSerializer;

/**
 * DocumentsApi Class Doc Comment
 *
 * @category Class
 * @package  Signedly
 * @author   OpenAPI Generator team
 * @link     https://openapi-generator.tech
 */
class DocumentsApi
{
    /**
     * @var ClientInterface
     */
    protected $client;

    /**
     * @var Configuration
     */
    protected $config;

    /**
     * @var HeaderSelector
     */
    protected $headerSelector;

    /**
     * @var int Host index
     */
    protected $hostIndex;

    /** @var string[] $contentTypes **/
    public const contentTypes = [
        'createDocumentFromTemplate' => [
            'application/json',
        ],
        'deleteDocument' => [
            'application/json',
        ],
        'getDownloadStatus' => [
            'application/json',
        ],
        'listDocumentPages' => [
            'application/json',
        ],
        'listDocumentStatuses' => [
            'application/json',
        ],
        'listDocuments' => [
            'application/json',
        ],
        'uploadDocument' => [
            'multipart/form-data',
        ],
        'uploadDocumentForOneSigner' => [
            'multipart/form-data',
        ],
    ];

    /**
     * @param ClientInterface $client
     * @param Configuration   $config
     * @param HeaderSelector  $selector
     * @param int             $hostIndex (Optional) host index to select the list of hosts if defined in the OpenAPI spec
     */
    public function __construct(
        ClientInterface $client = null,
        Configuration $config = null,
        HeaderSelector $selector = null,
        $hostIndex = 0
    ) {
        $this->client = $client ?: new Client();
        $this->config = $config ?: Configuration::getDefaultConfiguration();
        $this->headerSelector = $selector ?: new HeaderSelector();
        $this->hostIndex = $hostIndex;
    }

    /**
     * Set the host index
     *
     * @param int $hostIndex Host index (required)
     */
    public function setHostIndex($hostIndex): void
    {
        $this->hostIndex = $hostIndex;
    }

    /**
     * Get the host index
     *
     * @return int Host index
     */
    public function getHostIndex()
    {
        return $this->hostIndex;
    }

    /**
     * @return Configuration
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Operation createDocumentFromTemplate
     *
     * Make a document from a template
     *
     * @param  \Signedly\Model\CreateDocumentFromTemplateRequest $data data (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['createDocumentFromTemplate'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return \Signedly\Model\CreateDocumentFromTemplate200Response|array<string,mixed>|array<string,mixed>
     */
    public function createDocumentFromTemplate($data, string $contentType = self::contentTypes['createDocumentFromTemplate'][0])
    {
        list($response) = $this->createDocumentFromTemplateWithHttpInfo($data, $contentType);
        return $response;
    }

    /**
     * Operation createDocumentFromTemplateWithHttpInfo
     *
     * Make a document from a template
     *
     * @param  \Signedly\Model\CreateDocumentFromTemplateRequest $data (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['createDocumentFromTemplate'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return array of \Signedly\Model\CreateDocumentFromTemplate200Response|array<string,mixed>|array<string,mixed>, HTTP status code, HTTP response headers (array of strings)
     */
    public function createDocumentFromTemplateWithHttpInfo($data, string $contentType = self::contentTypes['createDocumentFromTemplate'][0])
    {
        $request = $this->createDocumentFromTemplateRequest($data, $contentType);

        try {
            $options = $this->createHttpClientOption();
            try {
                $response = $this->client->send($request, $options);
            } catch (RequestException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    $e->getResponse() ? $e->getResponse()->getHeaders() : null,
                    $e->getResponse() ? (string) $e->getResponse()->getBody() : null
                );
            } catch (ConnectException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    null,
                    null
                );
            }

            $statusCode = $response->getStatusCode();


            switch($statusCode) {
                case 200:
                    if ('\Signedly\Model\CreateDocumentFromTemplate200Response' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('\Signedly\Model\CreateDocumentFromTemplate200Response' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, '\Signedly\Model\CreateDocumentFromTemplate200Response', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 400:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 404:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
            }

            if ($statusCode < 200 || $statusCode > 299) {
                throw new ApiException(
                    sprintf(
                        '[%d] Error connecting to the API (%s)',
                        $statusCode,
                        (string) $request->getUri()
                    ),
                    $statusCode,
                    $response->getHeaders(),
                    (string) $response->getBody()
                );
            }

            $returnType = '\Signedly\Model\CreateDocumentFromTemplate200Response';
            if ($returnType === '\SplFileObject') {
                $content = $response->getBody(); //stream goes to serializer
            } else {
                $content = (string) $response->getBody();
                if ($returnType !== 'string') {
                    try {
                        $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                    } catch (\JsonException $exception) {
                        throw new ApiException(
                            sprintf(
                                'Error JSON decoding server response (%s)',
                                $request->getUri()
                            ),
                            $statusCode,
                            $response->getHeaders(),
                            $content
                        );
                    }
                }
            }

            return [
                ObjectSerializer::deserialize($content, $returnType, []),
                $response->getStatusCode(),
                $response->getHeaders()
            ];

        } catch (ApiException $e) {
            switch ($e->getCode()) {
                case 200:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        '\Signedly\Model\CreateDocumentFromTemplate200Response',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 400:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 404:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
            }
            throw $e;
        }
    }

    /**
     * Operation createDocumentFromTemplateAsync
     *
     * Make a document from a template
     *
     * @param  \Signedly\Model\CreateDocumentFromTemplateRequest $data (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['createDocumentFromTemplate'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function createDocumentFromTemplateAsync($data, string $contentType = self::contentTypes['createDocumentFromTemplate'][0])
    {
        return $this->createDocumentFromTemplateAsyncWithHttpInfo($data, $contentType)
            ->then(
                function ($response) {
                    return $response[0];
                }
            );
    }

    /**
     * Operation createDocumentFromTemplateAsyncWithHttpInfo
     *
     * Make a document from a template
     *
     * @param  \Signedly\Model\CreateDocumentFromTemplateRequest $data (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['createDocumentFromTemplate'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function createDocumentFromTemplateAsyncWithHttpInfo($data, string $contentType = self::contentTypes['createDocumentFromTemplate'][0])
    {
        $returnType = '\Signedly\Model\CreateDocumentFromTemplate200Response';
        $request = $this->createDocumentFromTemplateRequest($data, $contentType);

        return $this->client
            ->sendAsync($request, $this->createHttpClientOption())
            ->then(
                function ($response) use ($returnType) {
                    if ($returnType === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ($returnType !== 'string') {
                            $content = json_decode($content);
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, $returnType, []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                },
                function ($exception) {
                    $response = $exception->getResponse();
                    $statusCode = $response->getStatusCode();
                    throw new ApiException(
                        sprintf(
                            '[%d] Error connecting to the API (%s)',
                            $statusCode,
                            $exception->getRequest()->getUri()
                        ),
                        $statusCode,
                        $response->getHeaders(),
                        (string) $response->getBody()
                    );
                }
            );
    }

    /**
     * Create request for operation 'createDocumentFromTemplate'
     *
     * @param  \Signedly\Model\CreateDocumentFromTemplateRequest $data (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['createDocumentFromTemplate'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Psr7\Request
     */
    public function createDocumentFromTemplateRequest($data, string $contentType = self::contentTypes['createDocumentFromTemplate'][0])
    {

        // verify the required parameter 'data' is set
        if ($data === null || (is_array($data) && count($data) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $data when calling createDocumentFromTemplate'
            );
        }


        $resourcePath = '/ap1/documents/fromtemplate/';
        $formParams = [];
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;





        $headers = $this->headerSelector->selectHeaders(
            ['application/json', ],
            $contentType,
            $multipart
        );

        // for model (json/xml)
        if (isset($data)) {
            if (stripos($headers['Content-Type'], 'application/json') !== false) {
                # if Content-Type contains "application/json", json_encode the body
                $httpBody = ObjectSerializer::jsonEncode(ObjectSerializer::sanitizeForSerialization($data));
            } else {
                $httpBody = $data;
            }
        } elseif (count($formParams) > 0) {
            if ($multipart) {
                $multipartContents = [];
                foreach ($formParams as $formParamName => $formParamValue) {
                    $formParamValueItems = is_array($formParamValue) ? $formParamValue : [$formParamValue];
                    foreach ($formParamValueItems as $formParamValueItem) {
                        $multipartContents[] = [
                            'name' => $formParamName,
                            'contents' => $formParamValueItem
                        ];
                    }
                }
                // for HTTP post (form)
                $httpBody = new MultipartStream($multipartContents);

            } elseif (stripos($headers['Content-Type'], 'application/json') !== false) {
                # if Content-Type contains "application/json", json_encode the form parameters
                $httpBody = ObjectSerializer::jsonEncode($formParams);
            } else {
                // for HTTP post (form)
                $httpBody = ObjectSerializer::buildQuery($formParams);
            }
        }

        // this endpoint requires API key authentication
        $apiKey = $this->config->getApiKeyWithPrefix('Authorization');
        if ($apiKey !== null) {
            $headers['Authorization'] = $apiKey;
        }

        $defaultHeaders = [];
        if ($this->config->getUserAgent()) {
            $defaultHeaders['User-Agent'] = $this->config->getUserAgent();
        }

        $headers = array_merge(
            $defaultHeaders,
            $headerParams,
            $headers
        );

        $operationHost = $this->config->getHost();
        $query = ObjectSerializer::buildQuery($queryParams);
        return new Request(
            'POST',
            $operationHost . $resourcePath . ($query ? "?{$query}" : ''),
            $headers,
            $httpBody
        );
    }

    /**
     * Operation deleteDocument
     *
     * Delete a template or an unsent document
     *
     * @param  string $id The document&#39;s or template&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['deleteDocument'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return \Signedly\Model\SendDocument200Response|array<string,mixed>|array<string,mixed>|array<string,mixed>
     */
    public function deleteDocument($id, string $contentType = self::contentTypes['deleteDocument'][0])
    {
        list($response) = $this->deleteDocumentWithHttpInfo($id, $contentType);
        return $response;
    }

    /**
     * Operation deleteDocumentWithHttpInfo
     *
     * Delete a template or an unsent document
     *
     * @param  string $id The document&#39;s or template&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['deleteDocument'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return array of \Signedly\Model\SendDocument200Response|array<string,mixed>|array<string,mixed>|array<string,mixed>, HTTP status code, HTTP response headers (array of strings)
     */
    public function deleteDocumentWithHttpInfo($id, string $contentType = self::contentTypes['deleteDocument'][0])
    {
        $request = $this->deleteDocumentRequest($id, $contentType);

        try {
            $options = $this->createHttpClientOption();
            try {
                $response = $this->client->send($request, $options);
            } catch (RequestException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    $e->getResponse() ? $e->getResponse()->getHeaders() : null,
                    $e->getResponse() ? (string) $e->getResponse()->getBody() : null
                );
            } catch (ConnectException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    null,
                    null
                );
            }

            $statusCode = $response->getStatusCode();


            switch($statusCode) {
                case 204:
                    if ('\Signedly\Model\SendDocument200Response' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('\Signedly\Model\SendDocument200Response' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, '\Signedly\Model\SendDocument200Response', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 400:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 403:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 404:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
            }

            if ($statusCode < 200 || $statusCode > 299) {
                throw new ApiException(
                    sprintf(
                        '[%d] Error connecting to the API (%s)',
                        $statusCode,
                        (string) $request->getUri()
                    ),
                    $statusCode,
                    $response->getHeaders(),
                    (string) $response->getBody()
                );
            }

            $returnType = '\Signedly\Model\SendDocument200Response';
            if ($returnType === '\SplFileObject') {
                $content = $response->getBody(); //stream goes to serializer
            } else {
                $content = (string) $response->getBody();
                if ($returnType !== 'string') {
                    try {
                        $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                    } catch (\JsonException $exception) {
                        throw new ApiException(
                            sprintf(
                                'Error JSON decoding server response (%s)',
                                $request->getUri()
                            ),
                            $statusCode,
                            $response->getHeaders(),
                            $content
                        );
                    }
                }
            }

            return [
                ObjectSerializer::deserialize($content, $returnType, []),
                $response->getStatusCode(),
                $response->getHeaders()
            ];

        } catch (ApiException $e) {
            switch ($e->getCode()) {
                case 204:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        '\Signedly\Model\SendDocument200Response',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 400:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 403:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 404:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
            }
            throw $e;
        }
    }

    /**
     * Operation deleteDocumentAsync
     *
     * Delete a template or an unsent document
     *
     * @param  string $id The document&#39;s or template&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['deleteDocument'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function deleteDocumentAsync($id, string $contentType = self::contentTypes['deleteDocument'][0])
    {
        return $this->deleteDocumentAsyncWithHttpInfo($id, $contentType)
            ->then(
                function ($response) {
                    return $response[0];
                }
            );
    }

    /**
     * Operation deleteDocumentAsyncWithHttpInfo
     *
     * Delete a template or an unsent document
     *
     * @param  string $id The document&#39;s or template&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['deleteDocument'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function deleteDocumentAsyncWithHttpInfo($id, string $contentType = self::contentTypes['deleteDocument'][0])
    {
        $returnType = '\Signedly\Model\SendDocument200Response';
        $request = $this->deleteDocumentRequest($id, $contentType);

        return $this->client
            ->sendAsync($request, $this->createHttpClientOption())
            ->then(
                function ($response) use ($returnType) {
                    if ($returnType === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ($returnType !== 'string') {
                            $content = json_decode($content);
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, $returnType, []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                },
                function ($exception) {
                    $response = $exception->getResponse();
                    $statusCode = $response->getStatusCode();
                    throw new ApiException(
                        sprintf(
                            '[%d] Error connecting to the API (%s)',
                            $statusCode,
                            $exception->getRequest()->getUri()
                        ),
                        $statusCode,
                        $response->getHeaders(),
                        (string) $response->getBody()
                    );
                }
            );
    }

    /**
     * Create request for operation 'deleteDocument'
     *
     * @param  string $id The document&#39;s or template&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['deleteDocument'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Psr7\Request
     */
    public function deleteDocumentRequest($id, string $contentType = self::contentTypes['deleteDocument'][0])
    {

        // verify the required parameter 'id' is set
        if ($id === null || (is_array($id) && count($id) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $id when calling deleteDocument'
            );
        }


        $resourcePath = '/ap1/documents-status/{id}/';
        $formParams = [];
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;



        // path params
        if ($id !== null) {
            $resourcePath = str_replace(
                '{' . 'id' . '}',
                ObjectSerializer::toPathValue($id),
                $resourcePath
            );
        }


        $headers = $this->headerSelector->selectHeaders(
            ['application/json', ],
            $contentType,
            $multipart
        );

        // for model (json/xml)
        if (count($formParams) > 0) {
            if ($multipart) {
                $multipartContents = [];
                foreach ($formParams as $formParamName => $formParamValue) {
                    $formParamValueItems = is_array($formParamValue) ? $formParamValue : [$formParamValue];
                    foreach ($formParamValueItems as $formParamValueItem) {
                        $multipartContents[] = [
                            'name' => $formParamName,
                            'contents' => $formParamValueItem
                        ];
                    }
                }
                // for HTTP post (form)
                $httpBody = new MultipartStream($multipartContents);

            } elseif (stripos($headers['Content-Type'], 'application/json') !== false) {
                # if Content-Type contains "application/json", json_encode the form parameters
                $httpBody = ObjectSerializer::jsonEncode($formParams);
            } else {
                // for HTTP post (form)
                $httpBody = ObjectSerializer::buildQuery($formParams);
            }
        }

        // this endpoint requires API key authentication
        $apiKey = $this->config->getApiKeyWithPrefix('Authorization');
        if ($apiKey !== null) {
            $headers['Authorization'] = $apiKey;
        }

        $defaultHeaders = [];
        if ($this->config->getUserAgent()) {
            $defaultHeaders['User-Agent'] = $this->config->getUserAgent();
        }

        $headers = array_merge(
            $defaultHeaders,
            $headerParams,
            $headers
        );

        $operationHost = $this->config->getHost();
        $query = ObjectSerializer::buildQuery($queryParams);
        return new Request(
            'DELETE',
            $operationHost . $resourcePath . ($query ? "?{$query}" : ''),
            $headers,
            $httpBody
        );
    }

    /**
     * Operation getDownloadStatus
     *
     * Check whether the signed PDF is ready
     *
     * @param  string $id The document&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['getDownloadStatus'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return \Signedly\Model\GetDownloadStatus200Response|array<string,mixed>|array<string,mixed>
     */
    public function getDownloadStatus($id, string $contentType = self::contentTypes['getDownloadStatus'][0])
    {
        list($response) = $this->getDownloadStatusWithHttpInfo($id, $contentType);
        return $response;
    }

    /**
     * Operation getDownloadStatusWithHttpInfo
     *
     * Check whether the signed PDF is ready
     *
     * @param  string $id The document&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['getDownloadStatus'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return array of \Signedly\Model\GetDownloadStatus200Response|array<string,mixed>|array<string,mixed>, HTTP status code, HTTP response headers (array of strings)
     */
    public function getDownloadStatusWithHttpInfo($id, string $contentType = self::contentTypes['getDownloadStatus'][0])
    {
        $request = $this->getDownloadStatusRequest($id, $contentType);

        try {
            $options = $this->createHttpClientOption();
            try {
                $response = $this->client->send($request, $options);
            } catch (RequestException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    $e->getResponse() ? $e->getResponse()->getHeaders() : null,
                    $e->getResponse() ? (string) $e->getResponse()->getBody() : null
                );
            } catch (ConnectException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    null,
                    null
                );
            }

            $statusCode = $response->getStatusCode();


            switch($statusCode) {
                case 200:
                    if ('\Signedly\Model\GetDownloadStatus200Response' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('\Signedly\Model\GetDownloadStatus200Response' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, '\Signedly\Model\GetDownloadStatus200Response', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 403:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 404:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
            }

            if ($statusCode < 200 || $statusCode > 299) {
                throw new ApiException(
                    sprintf(
                        '[%d] Error connecting to the API (%s)',
                        $statusCode,
                        (string) $request->getUri()
                    ),
                    $statusCode,
                    $response->getHeaders(),
                    (string) $response->getBody()
                );
            }

            $returnType = '\Signedly\Model\GetDownloadStatus200Response';
            if ($returnType === '\SplFileObject') {
                $content = $response->getBody(); //stream goes to serializer
            } else {
                $content = (string) $response->getBody();
                if ($returnType !== 'string') {
                    try {
                        $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                    } catch (\JsonException $exception) {
                        throw new ApiException(
                            sprintf(
                                'Error JSON decoding server response (%s)',
                                $request->getUri()
                            ),
                            $statusCode,
                            $response->getHeaders(),
                            $content
                        );
                    }
                }
            }

            return [
                ObjectSerializer::deserialize($content, $returnType, []),
                $response->getStatusCode(),
                $response->getHeaders()
            ];

        } catch (ApiException $e) {
            switch ($e->getCode()) {
                case 200:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        '\Signedly\Model\GetDownloadStatus200Response',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 403:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 404:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
            }
            throw $e;
        }
    }

    /**
     * Operation getDownloadStatusAsync
     *
     * Check whether the signed PDF is ready
     *
     * @param  string $id The document&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['getDownloadStatus'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function getDownloadStatusAsync($id, string $contentType = self::contentTypes['getDownloadStatus'][0])
    {
        return $this->getDownloadStatusAsyncWithHttpInfo($id, $contentType)
            ->then(
                function ($response) {
                    return $response[0];
                }
            );
    }

    /**
     * Operation getDownloadStatusAsyncWithHttpInfo
     *
     * Check whether the signed PDF is ready
     *
     * @param  string $id The document&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['getDownloadStatus'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function getDownloadStatusAsyncWithHttpInfo($id, string $contentType = self::contentTypes['getDownloadStatus'][0])
    {
        $returnType = '\Signedly\Model\GetDownloadStatus200Response';
        $request = $this->getDownloadStatusRequest($id, $contentType);

        return $this->client
            ->sendAsync($request, $this->createHttpClientOption())
            ->then(
                function ($response) use ($returnType) {
                    if ($returnType === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ($returnType !== 'string') {
                            $content = json_decode($content);
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, $returnType, []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                },
                function ($exception) {
                    $response = $exception->getResponse();
                    $statusCode = $response->getStatusCode();
                    throw new ApiException(
                        sprintf(
                            '[%d] Error connecting to the API (%s)',
                            $statusCode,
                            $exception->getRequest()->getUri()
                        ),
                        $statusCode,
                        $response->getHeaders(),
                        (string) $response->getBody()
                    );
                }
            );
    }

    /**
     * Create request for operation 'getDownloadStatus'
     *
     * @param  string $id The document&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['getDownloadStatus'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Psr7\Request
     */
    public function getDownloadStatusRequest($id, string $contentType = self::contentTypes['getDownloadStatus'][0])
    {

        // verify the required parameter 'id' is set
        if ($id === null || (is_array($id) && count($id) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $id when calling getDownloadStatus'
            );
        }


        $resourcePath = '/ap1/documents-status/{id}/';
        $formParams = [];
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;



        // path params
        if ($id !== null) {
            $resourcePath = str_replace(
                '{' . 'id' . '}',
                ObjectSerializer::toPathValue($id),
                $resourcePath
            );
        }


        $headers = $this->headerSelector->selectHeaders(
            ['application/json', ],
            $contentType,
            $multipart
        );

        // for model (json/xml)
        if (count($formParams) > 0) {
            if ($multipart) {
                $multipartContents = [];
                foreach ($formParams as $formParamName => $formParamValue) {
                    $formParamValueItems = is_array($formParamValue) ? $formParamValue : [$formParamValue];
                    foreach ($formParamValueItems as $formParamValueItem) {
                        $multipartContents[] = [
                            'name' => $formParamName,
                            'contents' => $formParamValueItem
                        ];
                    }
                }
                // for HTTP post (form)
                $httpBody = new MultipartStream($multipartContents);

            } elseif (stripos($headers['Content-Type'], 'application/json') !== false) {
                # if Content-Type contains "application/json", json_encode the form parameters
                $httpBody = ObjectSerializer::jsonEncode($formParams);
            } else {
                // for HTTP post (form)
                $httpBody = ObjectSerializer::buildQuery($formParams);
            }
        }

        // this endpoint requires API key authentication
        $apiKey = $this->config->getApiKeyWithPrefix('Authorization');
        if ($apiKey !== null) {
            $headers['Authorization'] = $apiKey;
        }

        $defaultHeaders = [];
        if ($this->config->getUserAgent()) {
            $defaultHeaders['User-Agent'] = $this->config->getUserAgent();
        }

        $headers = array_merge(
            $defaultHeaders,
            $headerParams,
            $headers
        );

        $operationHost = $this->config->getHost();
        $query = ObjectSerializer::buildQuery($queryParams);
        return new Request(
            'GET',
            $operationHost . $resourcePath . ($query ? "?{$query}" : ''),
            $headers,
            $httpBody
        );
    }

    /**
     * Operation listDocumentPages
     *
     * List a document&#39;s pages and their fields
     *
     * @param  string $id The document&#39;s or template&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocumentPages'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return \Signedly\Model\Page[]|array<string,mixed>
     */
    public function listDocumentPages($id, string $contentType = self::contentTypes['listDocumentPages'][0])
    {
        list($response) = $this->listDocumentPagesWithHttpInfo($id, $contentType);
        return $response;
    }

    /**
     * Operation listDocumentPagesWithHttpInfo
     *
     * List a document&#39;s pages and their fields
     *
     * @param  string $id The document&#39;s or template&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocumentPages'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return array of \Signedly\Model\Page[]|array<string,mixed>, HTTP status code, HTTP response headers (array of strings)
     */
    public function listDocumentPagesWithHttpInfo($id, string $contentType = self::contentTypes['listDocumentPages'][0])
    {
        $request = $this->listDocumentPagesRequest($id, $contentType);

        try {
            $options = $this->createHttpClientOption();
            try {
                $response = $this->client->send($request, $options);
            } catch (RequestException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    $e->getResponse() ? $e->getResponse()->getHeaders() : null,
                    $e->getResponse() ? (string) $e->getResponse()->getBody() : null
                );
            } catch (ConnectException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    null,
                    null
                );
            }

            $statusCode = $response->getStatusCode();


            switch($statusCode) {
                case 200:
                    if ('\Signedly\Model\Page[]' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('\Signedly\Model\Page[]' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, '\Signedly\Model\Page[]', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 404:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
            }

            if ($statusCode < 200 || $statusCode > 299) {
                throw new ApiException(
                    sprintf(
                        '[%d] Error connecting to the API (%s)',
                        $statusCode,
                        (string) $request->getUri()
                    ),
                    $statusCode,
                    $response->getHeaders(),
                    (string) $response->getBody()
                );
            }

            $returnType = '\Signedly\Model\Page[]';
            if ($returnType === '\SplFileObject') {
                $content = $response->getBody(); //stream goes to serializer
            } else {
                $content = (string) $response->getBody();
                if ($returnType !== 'string') {
                    try {
                        $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                    } catch (\JsonException $exception) {
                        throw new ApiException(
                            sprintf(
                                'Error JSON decoding server response (%s)',
                                $request->getUri()
                            ),
                            $statusCode,
                            $response->getHeaders(),
                            $content
                        );
                    }
                }
            }

            return [
                ObjectSerializer::deserialize($content, $returnType, []),
                $response->getStatusCode(),
                $response->getHeaders()
            ];

        } catch (ApiException $e) {
            switch ($e->getCode()) {
                case 200:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        '\Signedly\Model\Page[]',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 404:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
            }
            throw $e;
        }
    }

    /**
     * Operation listDocumentPagesAsync
     *
     * List a document&#39;s pages and their fields
     *
     * @param  string $id The document&#39;s or template&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocumentPages'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function listDocumentPagesAsync($id, string $contentType = self::contentTypes['listDocumentPages'][0])
    {
        return $this->listDocumentPagesAsyncWithHttpInfo($id, $contentType)
            ->then(
                function ($response) {
                    return $response[0];
                }
            );
    }

    /**
     * Operation listDocumentPagesAsyncWithHttpInfo
     *
     * List a document&#39;s pages and their fields
     *
     * @param  string $id The document&#39;s or template&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocumentPages'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function listDocumentPagesAsyncWithHttpInfo($id, string $contentType = self::contentTypes['listDocumentPages'][0])
    {
        $returnType = '\Signedly\Model\Page[]';
        $request = $this->listDocumentPagesRequest($id, $contentType);

        return $this->client
            ->sendAsync($request, $this->createHttpClientOption())
            ->then(
                function ($response) use ($returnType) {
                    if ($returnType === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ($returnType !== 'string') {
                            $content = json_decode($content);
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, $returnType, []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                },
                function ($exception) {
                    $response = $exception->getResponse();
                    $statusCode = $response->getStatusCode();
                    throw new ApiException(
                        sprintf(
                            '[%d] Error connecting to the API (%s)',
                            $statusCode,
                            $exception->getRequest()->getUri()
                        ),
                        $statusCode,
                        $response->getHeaders(),
                        (string) $response->getBody()
                    );
                }
            );
    }

    /**
     * Create request for operation 'listDocumentPages'
     *
     * @param  string $id The document&#39;s or template&#39;s ID. (required)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocumentPages'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Psr7\Request
     */
    public function listDocumentPagesRequest($id, string $contentType = self::contentTypes['listDocumentPages'][0])
    {

        // verify the required parameter 'id' is set
        if ($id === null || (is_array($id) && count($id) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $id when calling listDocumentPages'
            );
        }


        $resourcePath = '/ap1/documents/{id}/pages/';
        $formParams = [];
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;



        // path params
        if ($id !== null) {
            $resourcePath = str_replace(
                '{' . 'id' . '}',
                ObjectSerializer::toPathValue($id),
                $resourcePath
            );
        }


        $headers = $this->headerSelector->selectHeaders(
            ['application/json', ],
            $contentType,
            $multipart
        );

        // for model (json/xml)
        if (count($formParams) > 0) {
            if ($multipart) {
                $multipartContents = [];
                foreach ($formParams as $formParamName => $formParamValue) {
                    $formParamValueItems = is_array($formParamValue) ? $formParamValue : [$formParamValue];
                    foreach ($formParamValueItems as $formParamValueItem) {
                        $multipartContents[] = [
                            'name' => $formParamName,
                            'contents' => $formParamValueItem
                        ];
                    }
                }
                // for HTTP post (form)
                $httpBody = new MultipartStream($multipartContents);

            } elseif (stripos($headers['Content-Type'], 'application/json') !== false) {
                # if Content-Type contains "application/json", json_encode the form parameters
                $httpBody = ObjectSerializer::jsonEncode($formParams);
            } else {
                // for HTTP post (form)
                $httpBody = ObjectSerializer::buildQuery($formParams);
            }
        }

        // this endpoint requires API key authentication
        $apiKey = $this->config->getApiKeyWithPrefix('Authorization');
        if ($apiKey !== null) {
            $headers['Authorization'] = $apiKey;
        }

        $defaultHeaders = [];
        if ($this->config->getUserAgent()) {
            $defaultHeaders['User-Agent'] = $this->config->getUserAgent();
        }

        $headers = array_merge(
            $defaultHeaders,
            $headerParams,
            $headers
        );

        $operationHost = $this->config->getHost();
        $query = ObjectSerializer::buildQuery($queryParams);
        return new Request(
            'GET',
            $operationHost . $resourcePath . ($query ? "?{$query}" : ''),
            $headers,
            $httpBody
        );
    }

    /**
     * Operation listDocumentStatuses
     *
     * List the status of your organisation&#39;s documents
     *
     * @param  string $name Only documents whose name contains this (any case). (optional)
     * @param  int[] $status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
     * @param  string[] $document_ids Only these documents. Repeat it or separate IDs with commas. (optional)
     * @param  int $limit How many results to return (default 10). (optional)
     * @param  int $offset How many results to skip. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocumentStatuses'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return \Signedly\Model\DocumentStatusPage|array<string,mixed>
     */
    public function listDocumentStatuses($name = null, $status = null, $document_ids = null, $limit = null, $offset = null, string $contentType = self::contentTypes['listDocumentStatuses'][0])
    {
        list($response) = $this->listDocumentStatusesWithHttpInfo($name, $status, $document_ids, $limit, $offset, $contentType);
        return $response;
    }

    /**
     * Operation listDocumentStatusesWithHttpInfo
     *
     * List the status of your organisation&#39;s documents
     *
     * @param  string $name Only documents whose name contains this (any case). (optional)
     * @param  int[] $status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
     * @param  string[] $document_ids Only these documents. Repeat it or separate IDs with commas. (optional)
     * @param  int $limit How many results to return (default 10). (optional)
     * @param  int $offset How many results to skip. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocumentStatuses'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return array of \Signedly\Model\DocumentStatusPage|array<string,mixed>, HTTP status code, HTTP response headers (array of strings)
     */
    public function listDocumentStatusesWithHttpInfo($name = null, $status = null, $document_ids = null, $limit = null, $offset = null, string $contentType = self::contentTypes['listDocumentStatuses'][0])
    {
        $request = $this->listDocumentStatusesRequest($name, $status, $document_ids, $limit, $offset, $contentType);

        try {
            $options = $this->createHttpClientOption();
            try {
                $response = $this->client->send($request, $options);
            } catch (RequestException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    $e->getResponse() ? $e->getResponse()->getHeaders() : null,
                    $e->getResponse() ? (string) $e->getResponse()->getBody() : null
                );
            } catch (ConnectException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    null,
                    null
                );
            }

            $statusCode = $response->getStatusCode();


            switch($statusCode) {
                case 200:
                    if ('\Signedly\Model\DocumentStatusPage' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('\Signedly\Model\DocumentStatusPage' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, '\Signedly\Model\DocumentStatusPage', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 400:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
            }

            if ($statusCode < 200 || $statusCode > 299) {
                throw new ApiException(
                    sprintf(
                        '[%d] Error connecting to the API (%s)',
                        $statusCode,
                        (string) $request->getUri()
                    ),
                    $statusCode,
                    $response->getHeaders(),
                    (string) $response->getBody()
                );
            }

            $returnType = '\Signedly\Model\DocumentStatusPage';
            if ($returnType === '\SplFileObject') {
                $content = $response->getBody(); //stream goes to serializer
            } else {
                $content = (string) $response->getBody();
                if ($returnType !== 'string') {
                    try {
                        $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                    } catch (\JsonException $exception) {
                        throw new ApiException(
                            sprintf(
                                'Error JSON decoding server response (%s)',
                                $request->getUri()
                            ),
                            $statusCode,
                            $response->getHeaders(),
                            $content
                        );
                    }
                }
            }

            return [
                ObjectSerializer::deserialize($content, $returnType, []),
                $response->getStatusCode(),
                $response->getHeaders()
            ];

        } catch (ApiException $e) {
            switch ($e->getCode()) {
                case 200:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        '\Signedly\Model\DocumentStatusPage',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 400:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
            }
            throw $e;
        }
    }

    /**
     * Operation listDocumentStatusesAsync
     *
     * List the status of your organisation&#39;s documents
     *
     * @param  string $name Only documents whose name contains this (any case). (optional)
     * @param  int[] $status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
     * @param  string[] $document_ids Only these documents. Repeat it or separate IDs with commas. (optional)
     * @param  int $limit How many results to return (default 10). (optional)
     * @param  int $offset How many results to skip. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocumentStatuses'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function listDocumentStatusesAsync($name = null, $status = null, $document_ids = null, $limit = null, $offset = null, string $contentType = self::contentTypes['listDocumentStatuses'][0])
    {
        return $this->listDocumentStatusesAsyncWithHttpInfo($name, $status, $document_ids, $limit, $offset, $contentType)
            ->then(
                function ($response) {
                    return $response[0];
                }
            );
    }

    /**
     * Operation listDocumentStatusesAsyncWithHttpInfo
     *
     * List the status of your organisation&#39;s documents
     *
     * @param  string $name Only documents whose name contains this (any case). (optional)
     * @param  int[] $status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
     * @param  string[] $document_ids Only these documents. Repeat it or separate IDs with commas. (optional)
     * @param  int $limit How many results to return (default 10). (optional)
     * @param  int $offset How many results to skip. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocumentStatuses'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function listDocumentStatusesAsyncWithHttpInfo($name = null, $status = null, $document_ids = null, $limit = null, $offset = null, string $contentType = self::contentTypes['listDocumentStatuses'][0])
    {
        $returnType = '\Signedly\Model\DocumentStatusPage';
        $request = $this->listDocumentStatusesRequest($name, $status, $document_ids, $limit, $offset, $contentType);

        return $this->client
            ->sendAsync($request, $this->createHttpClientOption())
            ->then(
                function ($response) use ($returnType) {
                    if ($returnType === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ($returnType !== 'string') {
                            $content = json_decode($content);
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, $returnType, []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                },
                function ($exception) {
                    $response = $exception->getResponse();
                    $statusCode = $response->getStatusCode();
                    throw new ApiException(
                        sprintf(
                            '[%d] Error connecting to the API (%s)',
                            $statusCode,
                            $exception->getRequest()->getUri()
                        ),
                        $statusCode,
                        $response->getHeaders(),
                        (string) $response->getBody()
                    );
                }
            );
    }

    /**
     * Create request for operation 'listDocumentStatuses'
     *
     * @param  string $name Only documents whose name contains this (any case). (optional)
     * @param  int[] $status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
     * @param  string[] $document_ids Only these documents. Repeat it or separate IDs with commas. (optional)
     * @param  int $limit How many results to return (default 10). (optional)
     * @param  int $offset How many results to skip. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocumentStatuses'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Psr7\Request
     */
    public function listDocumentStatusesRequest($name = null, $status = null, $document_ids = null, $limit = null, $offset = null, string $contentType = self::contentTypes['listDocumentStatuses'][0])
    {







        $resourcePath = '/ap1/documents-status-list/';
        $formParams = [];
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;

        // query params
        $queryParams = array_merge($queryParams, ObjectSerializer::toQueryValue(
            $name,
            'name', // param base name
            'string', // openApiType
            '', // style
            false, // explode
            false // required
        ) ?? []);
        // query params
        $queryParams = array_merge($queryParams, ObjectSerializer::toQueryValue(
            $status,
            'status', // param base name
            'array', // openApiType
            'form', // style
            true, // explode
            false // required
        ) ?? []);
        // query params
        $queryParams = array_merge($queryParams, ObjectSerializer::toQueryValue(
            $document_ids,
            'document_ids', // param base name
            'array', // openApiType
            'form', // style
            true, // explode
            false // required
        ) ?? []);
        // query params
        $queryParams = array_merge($queryParams, ObjectSerializer::toQueryValue(
            $limit,
            'limit', // param base name
            'integer', // openApiType
            '', // style
            false, // explode
            false // required
        ) ?? []);
        // query params
        $queryParams = array_merge($queryParams, ObjectSerializer::toQueryValue(
            $offset,
            'offset', // param base name
            'integer', // openApiType
            '', // style
            false, // explode
            false // required
        ) ?? []);




        $headers = $this->headerSelector->selectHeaders(
            ['application/json', ],
            $contentType,
            $multipart
        );

        // for model (json/xml)
        if (count($formParams) > 0) {
            if ($multipart) {
                $multipartContents = [];
                foreach ($formParams as $formParamName => $formParamValue) {
                    $formParamValueItems = is_array($formParamValue) ? $formParamValue : [$formParamValue];
                    foreach ($formParamValueItems as $formParamValueItem) {
                        $multipartContents[] = [
                            'name' => $formParamName,
                            'contents' => $formParamValueItem
                        ];
                    }
                }
                // for HTTP post (form)
                $httpBody = new MultipartStream($multipartContents);

            } elseif (stripos($headers['Content-Type'], 'application/json') !== false) {
                # if Content-Type contains "application/json", json_encode the form parameters
                $httpBody = ObjectSerializer::jsonEncode($formParams);
            } else {
                // for HTTP post (form)
                $httpBody = ObjectSerializer::buildQuery($formParams);
            }
        }

        // this endpoint requires API key authentication
        $apiKey = $this->config->getApiKeyWithPrefix('Authorization');
        if ($apiKey !== null) {
            $headers['Authorization'] = $apiKey;
        }

        $defaultHeaders = [];
        if ($this->config->getUserAgent()) {
            $defaultHeaders['User-Agent'] = $this->config->getUserAgent();
        }

        $headers = array_merge(
            $defaultHeaders,
            $headerParams,
            $headers
        );

        $operationHost = $this->config->getHost();
        $query = ObjectSerializer::buildQuery($queryParams);
        return new Request(
            'GET',
            $operationHost . $resourcePath . ($query ? "?{$query}" : ''),
            $headers,
            $httpBody
        );
    }

    /**
     * Operation listDocuments
     *
     * List the documents this API client created
     *
     * @param  string $name Only documents whose name contains this (any case). (optional)
     * @param  int[] $status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
     * @param  string[] $document_ids Only these documents. Repeat it or separate IDs with commas. (optional)
     * @param  int $limit How many results to return (default 10). (optional)
     * @param  int $offset How many results to skip. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocuments'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return \Signedly\Model\DocumentPage|array<string,mixed>
     */
    public function listDocuments($name = null, $status = null, $document_ids = null, $limit = null, $offset = null, string $contentType = self::contentTypes['listDocuments'][0])
    {
        list($response) = $this->listDocumentsWithHttpInfo($name, $status, $document_ids, $limit, $offset, $contentType);
        return $response;
    }

    /**
     * Operation listDocumentsWithHttpInfo
     *
     * List the documents this API client created
     *
     * @param  string $name Only documents whose name contains this (any case). (optional)
     * @param  int[] $status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
     * @param  string[] $document_ids Only these documents. Repeat it or separate IDs with commas. (optional)
     * @param  int $limit How many results to return (default 10). (optional)
     * @param  int $offset How many results to skip. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocuments'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return array of \Signedly\Model\DocumentPage|array<string,mixed>, HTTP status code, HTTP response headers (array of strings)
     */
    public function listDocumentsWithHttpInfo($name = null, $status = null, $document_ids = null, $limit = null, $offset = null, string $contentType = self::contentTypes['listDocuments'][0])
    {
        $request = $this->listDocumentsRequest($name, $status, $document_ids, $limit, $offset, $contentType);

        try {
            $options = $this->createHttpClientOption();
            try {
                $response = $this->client->send($request, $options);
            } catch (RequestException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    $e->getResponse() ? $e->getResponse()->getHeaders() : null,
                    $e->getResponse() ? (string) $e->getResponse()->getBody() : null
                );
            } catch (ConnectException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    null,
                    null
                );
            }

            $statusCode = $response->getStatusCode();


            switch($statusCode) {
                case 200:
                    if ('\Signedly\Model\DocumentPage' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('\Signedly\Model\DocumentPage' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, '\Signedly\Model\DocumentPage', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 400:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
            }

            if ($statusCode < 200 || $statusCode > 299) {
                throw new ApiException(
                    sprintf(
                        '[%d] Error connecting to the API (%s)',
                        $statusCode,
                        (string) $request->getUri()
                    ),
                    $statusCode,
                    $response->getHeaders(),
                    (string) $response->getBody()
                );
            }

            $returnType = '\Signedly\Model\DocumentPage';
            if ($returnType === '\SplFileObject') {
                $content = $response->getBody(); //stream goes to serializer
            } else {
                $content = (string) $response->getBody();
                if ($returnType !== 'string') {
                    try {
                        $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                    } catch (\JsonException $exception) {
                        throw new ApiException(
                            sprintf(
                                'Error JSON decoding server response (%s)',
                                $request->getUri()
                            ),
                            $statusCode,
                            $response->getHeaders(),
                            $content
                        );
                    }
                }
            }

            return [
                ObjectSerializer::deserialize($content, $returnType, []),
                $response->getStatusCode(),
                $response->getHeaders()
            ];

        } catch (ApiException $e) {
            switch ($e->getCode()) {
                case 200:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        '\Signedly\Model\DocumentPage',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 400:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
            }
            throw $e;
        }
    }

    /**
     * Operation listDocumentsAsync
     *
     * List the documents this API client created
     *
     * @param  string $name Only documents whose name contains this (any case). (optional)
     * @param  int[] $status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
     * @param  string[] $document_ids Only these documents. Repeat it or separate IDs with commas. (optional)
     * @param  int $limit How many results to return (default 10). (optional)
     * @param  int $offset How many results to skip. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocuments'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function listDocumentsAsync($name = null, $status = null, $document_ids = null, $limit = null, $offset = null, string $contentType = self::contentTypes['listDocuments'][0])
    {
        return $this->listDocumentsAsyncWithHttpInfo($name, $status, $document_ids, $limit, $offset, $contentType)
            ->then(
                function ($response) {
                    return $response[0];
                }
            );
    }

    /**
     * Operation listDocumentsAsyncWithHttpInfo
     *
     * List the documents this API client created
     *
     * @param  string $name Only documents whose name contains this (any case). (optional)
     * @param  int[] $status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
     * @param  string[] $document_ids Only these documents. Repeat it or separate IDs with commas. (optional)
     * @param  int $limit How many results to return (default 10). (optional)
     * @param  int $offset How many results to skip. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocuments'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function listDocumentsAsyncWithHttpInfo($name = null, $status = null, $document_ids = null, $limit = null, $offset = null, string $contentType = self::contentTypes['listDocuments'][0])
    {
        $returnType = '\Signedly\Model\DocumentPage';
        $request = $this->listDocumentsRequest($name, $status, $document_ids, $limit, $offset, $contentType);

        return $this->client
            ->sendAsync($request, $this->createHttpClientOption())
            ->then(
                function ($response) use ($returnType) {
                    if ($returnType === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ($returnType !== 'string') {
                            $content = json_decode($content);
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, $returnType, []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                },
                function ($exception) {
                    $response = $exception->getResponse();
                    $statusCode = $response->getStatusCode();
                    throw new ApiException(
                        sprintf(
                            '[%d] Error connecting to the API (%s)',
                            $statusCode,
                            $exception->getRequest()->getUri()
                        ),
                        $statusCode,
                        $response->getHeaders(),
                        (string) $response->getBody()
                    );
                }
            );
    }

    /**
     * Create request for operation 'listDocuments'
     *
     * @param  string $name Only documents whose name contains this (any case). (optional)
     * @param  int[] $status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
     * @param  string[] $document_ids Only these documents. Repeat it or separate IDs with commas. (optional)
     * @param  int $limit How many results to return (default 10). (optional)
     * @param  int $offset How many results to skip. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['listDocuments'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Psr7\Request
     */
    public function listDocumentsRequest($name = null, $status = null, $document_ids = null, $limit = null, $offset = null, string $contentType = self::contentTypes['listDocuments'][0])
    {







        $resourcePath = '/ap1/documents/';
        $formParams = [];
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;

        // query params
        $queryParams = array_merge($queryParams, ObjectSerializer::toQueryValue(
            $name,
            'name', // param base name
            'string', // openApiType
            '', // style
            false, // explode
            false // required
        ) ?? []);
        // query params
        $queryParams = array_merge($queryParams, ObjectSerializer::toQueryValue(
            $status,
            'status', // param base name
            'array', // openApiType
            'form', // style
            true, // explode
            false // required
        ) ?? []);
        // query params
        $queryParams = array_merge($queryParams, ObjectSerializer::toQueryValue(
            $document_ids,
            'document_ids', // param base name
            'array', // openApiType
            'form', // style
            true, // explode
            false // required
        ) ?? []);
        // query params
        $queryParams = array_merge($queryParams, ObjectSerializer::toQueryValue(
            $limit,
            'limit', // param base name
            'integer', // openApiType
            '', // style
            false, // explode
            false // required
        ) ?? []);
        // query params
        $queryParams = array_merge($queryParams, ObjectSerializer::toQueryValue(
            $offset,
            'offset', // param base name
            'integer', // openApiType
            '', // style
            false, // explode
            false // required
        ) ?? []);




        $headers = $this->headerSelector->selectHeaders(
            ['application/json', ],
            $contentType,
            $multipart
        );

        // for model (json/xml)
        if (count($formParams) > 0) {
            if ($multipart) {
                $multipartContents = [];
                foreach ($formParams as $formParamName => $formParamValue) {
                    $formParamValueItems = is_array($formParamValue) ? $formParamValue : [$formParamValue];
                    foreach ($formParamValueItems as $formParamValueItem) {
                        $multipartContents[] = [
                            'name' => $formParamName,
                            'contents' => $formParamValueItem
                        ];
                    }
                }
                // for HTTP post (form)
                $httpBody = new MultipartStream($multipartContents);

            } elseif (stripos($headers['Content-Type'], 'application/json') !== false) {
                # if Content-Type contains "application/json", json_encode the form parameters
                $httpBody = ObjectSerializer::jsonEncode($formParams);
            } else {
                // for HTTP post (form)
                $httpBody = ObjectSerializer::buildQuery($formParams);
            }
        }

        // this endpoint requires API key authentication
        $apiKey = $this->config->getApiKeyWithPrefix('Authorization');
        if ($apiKey !== null) {
            $headers['Authorization'] = $apiKey;
        }

        $defaultHeaders = [];
        if ($this->config->getUserAgent()) {
            $defaultHeaders['User-Agent'] = $this->config->getUserAgent();
        }

        $headers = array_merge(
            $defaultHeaders,
            $headerParams,
            $headers
        );

        $operationHost = $this->config->getHost();
        $query = ObjectSerializer::buildQuery($queryParams);
        return new Request(
            'GET',
            $operationHost . $resourcePath . ($query ? "?{$query}" : ''),
            $headers,
            $httpBody
        );
    }

    /**
     * Operation uploadDocument
     *
     * Upload a document or template
     *
     * @param  \SplFileObject $file A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB. (required)
     * @param  string $name The document&#39;s name. It must differ from every other upload of this API client. (required)
     * @param  int $type 2 Document · 4 Template (required)
     * @param  string $template_name The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['uploadDocument'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return \Signedly\Model\Upload|array<string,mixed>
     */
    public function uploadDocument($file, $name, $type, $template_name = null, string $contentType = self::contentTypes['uploadDocument'][0])
    {
        list($response) = $this->uploadDocumentWithHttpInfo($file, $name, $type, $template_name, $contentType);
        return $response;
    }

    /**
     * Operation uploadDocumentWithHttpInfo
     *
     * Upload a document or template
     *
     * @param  \SplFileObject $file A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB. (required)
     * @param  string $name The document&#39;s name. It must differ from every other upload of this API client. (required)
     * @param  int $type 2 Document · 4 Template (required)
     * @param  string $template_name The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['uploadDocument'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return array of \Signedly\Model\Upload|array<string,mixed>, HTTP status code, HTTP response headers (array of strings)
     */
    public function uploadDocumentWithHttpInfo($file, $name, $type, $template_name = null, string $contentType = self::contentTypes['uploadDocument'][0])
    {
        $request = $this->uploadDocumentRequest($file, $name, $type, $template_name, $contentType);

        try {
            $options = $this->createHttpClientOption();
            try {
                $response = $this->client->send($request, $options);
            } catch (RequestException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    $e->getResponse() ? $e->getResponse()->getHeaders() : null,
                    $e->getResponse() ? (string) $e->getResponse()->getBody() : null
                );
            } catch (ConnectException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    null,
                    null
                );
            }

            $statusCode = $response->getStatusCode();


            switch($statusCode) {
                case 200:
                    if ('\Signedly\Model\Upload' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('\Signedly\Model\Upload' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, '\Signedly\Model\Upload', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 400:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
            }

            if ($statusCode < 200 || $statusCode > 299) {
                throw new ApiException(
                    sprintf(
                        '[%d] Error connecting to the API (%s)',
                        $statusCode,
                        (string) $request->getUri()
                    ),
                    $statusCode,
                    $response->getHeaders(),
                    (string) $response->getBody()
                );
            }

            $returnType = '\Signedly\Model\Upload';
            if ($returnType === '\SplFileObject') {
                $content = $response->getBody(); //stream goes to serializer
            } else {
                $content = (string) $response->getBody();
                if ($returnType !== 'string') {
                    try {
                        $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                    } catch (\JsonException $exception) {
                        throw new ApiException(
                            sprintf(
                                'Error JSON decoding server response (%s)',
                                $request->getUri()
                            ),
                            $statusCode,
                            $response->getHeaders(),
                            $content
                        );
                    }
                }
            }

            return [
                ObjectSerializer::deserialize($content, $returnType, []),
                $response->getStatusCode(),
                $response->getHeaders()
            ];

        } catch (ApiException $e) {
            switch ($e->getCode()) {
                case 200:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        '\Signedly\Model\Upload',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 400:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
            }
            throw $e;
        }
    }

    /**
     * Operation uploadDocumentAsync
     *
     * Upload a document or template
     *
     * @param  \SplFileObject $file A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB. (required)
     * @param  string $name The document&#39;s name. It must differ from every other upload of this API client. (required)
     * @param  int $type 2 Document · 4 Template (required)
     * @param  string $template_name The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['uploadDocument'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function uploadDocumentAsync($file, $name, $type, $template_name = null, string $contentType = self::contentTypes['uploadDocument'][0])
    {
        return $this->uploadDocumentAsyncWithHttpInfo($file, $name, $type, $template_name, $contentType)
            ->then(
                function ($response) {
                    return $response[0];
                }
            );
    }

    /**
     * Operation uploadDocumentAsyncWithHttpInfo
     *
     * Upload a document or template
     *
     * @param  \SplFileObject $file A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB. (required)
     * @param  string $name The document&#39;s name. It must differ from every other upload of this API client. (required)
     * @param  int $type 2 Document · 4 Template (required)
     * @param  string $template_name The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['uploadDocument'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function uploadDocumentAsyncWithHttpInfo($file, $name, $type, $template_name = null, string $contentType = self::contentTypes['uploadDocument'][0])
    {
        $returnType = '\Signedly\Model\Upload';
        $request = $this->uploadDocumentRequest($file, $name, $type, $template_name, $contentType);

        return $this->client
            ->sendAsync($request, $this->createHttpClientOption())
            ->then(
                function ($response) use ($returnType) {
                    if ($returnType === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ($returnType !== 'string') {
                            $content = json_decode($content);
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, $returnType, []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                },
                function ($exception) {
                    $response = $exception->getResponse();
                    $statusCode = $response->getStatusCode();
                    throw new ApiException(
                        sprintf(
                            '[%d] Error connecting to the API (%s)',
                            $statusCode,
                            $exception->getRequest()->getUri()
                        ),
                        $statusCode,
                        $response->getHeaders(),
                        (string) $response->getBody()
                    );
                }
            );
    }

    /**
     * Create request for operation 'uploadDocument'
     *
     * @param  \SplFileObject $file A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB. (required)
     * @param  string $name The document&#39;s name. It must differ from every other upload of this API client. (required)
     * @param  int $type 2 Document · 4 Template (required)
     * @param  string $template_name The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['uploadDocument'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Psr7\Request
     */
    public function uploadDocumentRequest($file, $name, $type, $template_name = null, string $contentType = self::contentTypes['uploadDocument'][0])
    {

        // verify the required parameter 'file' is set
        if ($file === null || (is_array($file) && count($file) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $file when calling uploadDocument'
            );
        }

        // verify the required parameter 'name' is set
        if ($name === null || (is_array($name) && count($name) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $name when calling uploadDocument'
            );
        }

        // verify the required parameter 'type' is set
        if ($type === null || (is_array($type) && count($type) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $type when calling uploadDocument'
            );
        }



        $resourcePath = '/ap1/upload/';
        $formParams = [];
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;




        // form params
        if ($file !== null) {
            $multipart = true;
            $formParams['file'] = [];
            $paramFiles = is_array($file) ? $file : [$file];
            foreach ($paramFiles as $paramFile) {
                $formParams['file'][] = \GuzzleHttp\Psr7\Utils::tryFopen(
                    ObjectSerializer::toFormValue($paramFile),
                    'rb'
                );
            }
        }
        // form params
        if ($name !== null) {
            $formParams['name'] = ObjectSerializer::toFormValue($name);
        }
        // form params
        if ($type !== null) {
            $formParams['type'] = ObjectSerializer::toFormValue($type);
        }
        // form params
        if ($template_name !== null) {
            $formParams['template_name'] = ObjectSerializer::toFormValue($template_name);
        }

        $headers = $this->headerSelector->selectHeaders(
            ['application/json', ],
            $contentType,
            $multipart
        );

        // for model (json/xml)
        if (count($formParams) > 0) {
            if ($multipart) {
                $multipartContents = [];
                foreach ($formParams as $formParamName => $formParamValue) {
                    $formParamValueItems = is_array($formParamValue) ? $formParamValue : [$formParamValue];
                    foreach ($formParamValueItems as $formParamValueItem) {
                        $multipartContents[] = [
                            'name' => $formParamName,
                            'contents' => $formParamValueItem
                        ];
                    }
                }
                // for HTTP post (form)
                $httpBody = new MultipartStream($multipartContents);

            } elseif (stripos($headers['Content-Type'], 'application/json') !== false) {
                # if Content-Type contains "application/json", json_encode the form parameters
                $httpBody = ObjectSerializer::jsonEncode($formParams);
            } else {
                // for HTTP post (form)
                $httpBody = ObjectSerializer::buildQuery($formParams);
            }
        }

        // this endpoint requires API key authentication
        $apiKey = $this->config->getApiKeyWithPrefix('Authorization');
        if ($apiKey !== null) {
            $headers['Authorization'] = $apiKey;
        }

        $defaultHeaders = [];
        if ($this->config->getUserAgent()) {
            $defaultHeaders['User-Agent'] = $this->config->getUserAgent();
        }

        $headers = array_merge(
            $defaultHeaders,
            $headerParams,
            $headers
        );

        $operationHost = $this->config->getHost();
        $query = ObjectSerializer::buildQuery($queryParams);
        return new Request(
            'POST',
            $operationHost . $resourcePath . ($query ? "?{$query}" : ''),
            $headers,
            $httpBody
        );
    }

    /**
     * Operation uploadDocumentForOneSigner
     *
     * Upload a document for one signer and get their signing link
     *
     * @param  \SplFileObject $file A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. (required)
     * @param  string $signee_name The signer&#39;s name. (required)
     * @param  string $signee_email The signer&#39;s email address. (required)
     * @param  string $redirect_url Where the signer is sent after signing. (required)
     * @param  string $final_email Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['uploadDocumentForOneSigner'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return \Signedly\Model\UploadDocumentForOneSigner200Response|array<string,mixed>|array<string,mixed>
     */
    public function uploadDocumentForOneSigner($file, $signee_name, $signee_email, $redirect_url, $final_email = null, string $contentType = self::contentTypes['uploadDocumentForOneSigner'][0])
    {
        list($response) = $this->uploadDocumentForOneSignerWithHttpInfo($file, $signee_name, $signee_email, $redirect_url, $final_email, $contentType);
        return $response;
    }

    /**
     * Operation uploadDocumentForOneSignerWithHttpInfo
     *
     * Upload a document for one signer and get their signing link
     *
     * @param  \SplFileObject $file A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. (required)
     * @param  string $signee_name The signer&#39;s name. (required)
     * @param  string $signee_email The signer&#39;s email address. (required)
     * @param  string $redirect_url Where the signer is sent after signing. (required)
     * @param  string $final_email Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['uploadDocumentForOneSigner'] to see the possible values for this operation
     *
     * @throws \Signedly\ApiException on non-2xx response or if the response body is not in the expected format
     * @throws \InvalidArgumentException
     * @return array of \Signedly\Model\UploadDocumentForOneSigner200Response|array<string,mixed>|array<string,mixed>, HTTP status code, HTTP response headers (array of strings)
     */
    public function uploadDocumentForOneSignerWithHttpInfo($file, $signee_name, $signee_email, $redirect_url, $final_email = null, string $contentType = self::contentTypes['uploadDocumentForOneSigner'][0])
    {
        $request = $this->uploadDocumentForOneSignerRequest($file, $signee_name, $signee_email, $redirect_url, $final_email, $contentType);

        try {
            $options = $this->createHttpClientOption();
            try {
                $response = $this->client->send($request, $options);
            } catch (RequestException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    $e->getResponse() ? $e->getResponse()->getHeaders() : null,
                    $e->getResponse() ? (string) $e->getResponse()->getBody() : null
                );
            } catch (ConnectException $e) {
                throw new ApiException(
                    "[{$e->getCode()}] {$e->getMessage()}",
                    (int) $e->getCode(),
                    null,
                    null
                );
            }

            $statusCode = $response->getStatusCode();


            switch($statusCode) {
                case 200:
                    if ('\Signedly\Model\UploadDocumentForOneSigner200Response' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('\Signedly\Model\UploadDocumentForOneSigner200Response' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, '\Signedly\Model\UploadDocumentForOneSigner200Response', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 400:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                case 502:
                    if ('array<string,mixed>' === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ('array<string,mixed>' !== 'string') {
                            try {
                                $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                            } catch (\JsonException $exception) {
                                throw new ApiException(
                                    sprintf(
                                        'Error JSON decoding server response (%s)',
                                        $request->getUri()
                                    ),
                                    $statusCode,
                                    $response->getHeaders(),
                                    $content
                                );
                            }
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, 'array<string,mixed>', []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
            }

            if ($statusCode < 200 || $statusCode > 299) {
                throw new ApiException(
                    sprintf(
                        '[%d] Error connecting to the API (%s)',
                        $statusCode,
                        (string) $request->getUri()
                    ),
                    $statusCode,
                    $response->getHeaders(),
                    (string) $response->getBody()
                );
            }

            $returnType = '\Signedly\Model\UploadDocumentForOneSigner200Response';
            if ($returnType === '\SplFileObject') {
                $content = $response->getBody(); //stream goes to serializer
            } else {
                $content = (string) $response->getBody();
                if ($returnType !== 'string') {
                    try {
                        $content = json_decode($content, false, 512, JSON_THROW_ON_ERROR);
                    } catch (\JsonException $exception) {
                        throw new ApiException(
                            sprintf(
                                'Error JSON decoding server response (%s)',
                                $request->getUri()
                            ),
                            $statusCode,
                            $response->getHeaders(),
                            $content
                        );
                    }
                }
            }

            return [
                ObjectSerializer::deserialize($content, $returnType, []),
                $response->getStatusCode(),
                $response->getHeaders()
            ];

        } catch (ApiException $e) {
            switch ($e->getCode()) {
                case 200:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        '\Signedly\Model\UploadDocumentForOneSigner200Response',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 400:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
                case 502:
                    $data = ObjectSerializer::deserialize(
                        $e->getResponseBody(),
                        'array<string,mixed>',
                        $e->getResponseHeaders()
                    );
                    $e->setResponseObject($data);
                    break;
            }
            throw $e;
        }
    }

    /**
     * Operation uploadDocumentForOneSignerAsync
     *
     * Upload a document for one signer and get their signing link
     *
     * @param  \SplFileObject $file A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. (required)
     * @param  string $signee_name The signer&#39;s name. (required)
     * @param  string $signee_email The signer&#39;s email address. (required)
     * @param  string $redirect_url Where the signer is sent after signing. (required)
     * @param  string $final_email Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['uploadDocumentForOneSigner'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function uploadDocumentForOneSignerAsync($file, $signee_name, $signee_email, $redirect_url, $final_email = null, string $contentType = self::contentTypes['uploadDocumentForOneSigner'][0])
    {
        return $this->uploadDocumentForOneSignerAsyncWithHttpInfo($file, $signee_name, $signee_email, $redirect_url, $final_email, $contentType)
            ->then(
                function ($response) {
                    return $response[0];
                }
            );
    }

    /**
     * Operation uploadDocumentForOneSignerAsyncWithHttpInfo
     *
     * Upload a document for one signer and get their signing link
     *
     * @param  \SplFileObject $file A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. (required)
     * @param  string $signee_name The signer&#39;s name. (required)
     * @param  string $signee_email The signer&#39;s email address. (required)
     * @param  string $redirect_url Where the signer is sent after signing. (required)
     * @param  string $final_email Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['uploadDocumentForOneSigner'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Promise\PromiseInterface
     */
    public function uploadDocumentForOneSignerAsyncWithHttpInfo($file, $signee_name, $signee_email, $redirect_url, $final_email = null, string $contentType = self::contentTypes['uploadDocumentForOneSigner'][0])
    {
        $returnType = '\Signedly\Model\UploadDocumentForOneSigner200Response';
        $request = $this->uploadDocumentForOneSignerRequest($file, $signee_name, $signee_email, $redirect_url, $final_email, $contentType);

        return $this->client
            ->sendAsync($request, $this->createHttpClientOption())
            ->then(
                function ($response) use ($returnType) {
                    if ($returnType === '\SplFileObject') {
                        $content = $response->getBody(); //stream goes to serializer
                    } else {
                        $content = (string) $response->getBody();
                        if ($returnType !== 'string') {
                            $content = json_decode($content);
                        }
                    }

                    return [
                        ObjectSerializer::deserialize($content, $returnType, []),
                        $response->getStatusCode(),
                        $response->getHeaders()
                    ];
                },
                function ($exception) {
                    $response = $exception->getResponse();
                    $statusCode = $response->getStatusCode();
                    throw new ApiException(
                        sprintf(
                            '[%d] Error connecting to the API (%s)',
                            $statusCode,
                            $exception->getRequest()->getUri()
                        ),
                        $statusCode,
                        $response->getHeaders(),
                        (string) $response->getBody()
                    );
                }
            );
    }

    /**
     * Create request for operation 'uploadDocumentForOneSigner'
     *
     * @param  \SplFileObject $file A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. (required)
     * @param  string $signee_name The signer&#39;s name. (required)
     * @param  string $signee_email The signer&#39;s email address. (required)
     * @param  string $redirect_url Where the signer is sent after signing. (required)
     * @param  string $final_email Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. (optional)
     * @param  string $contentType The value for the Content-Type header. Check self::contentTypes['uploadDocumentForOneSigner'] to see the possible values for this operation
     *
     * @throws \InvalidArgumentException
     * @return \GuzzleHttp\Psr7\Request
     */
    public function uploadDocumentForOneSignerRequest($file, $signee_name, $signee_email, $redirect_url, $final_email = null, string $contentType = self::contentTypes['uploadDocumentForOneSigner'][0])
    {

        // verify the required parameter 'file' is set
        if ($file === null || (is_array($file) && count($file) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $file when calling uploadDocumentForOneSigner'
            );
        }

        // verify the required parameter 'signee_name' is set
        if ($signee_name === null || (is_array($signee_name) && count($signee_name) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $signee_name when calling uploadDocumentForOneSigner'
            );
        }

        // verify the required parameter 'signee_email' is set
        if ($signee_email === null || (is_array($signee_email) && count($signee_email) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $signee_email when calling uploadDocumentForOneSigner'
            );
        }

        // verify the required parameter 'redirect_url' is set
        if ($redirect_url === null || (is_array($redirect_url) && count($redirect_url) === 0)) {
            throw new \InvalidArgumentException(
                'Missing the required parameter $redirect_url when calling uploadDocumentForOneSigner'
            );
        }



        $resourcePath = '/ap1/upload_app/';
        $formParams = [];
        $queryParams = [];
        $headerParams = [];
        $httpBody = '';
        $multipart = false;




        // form params
        if ($file !== null) {
            $multipart = true;
            $formParams['file'] = [];
            $paramFiles = is_array($file) ? $file : [$file];
            foreach ($paramFiles as $paramFile) {
                $formParams['file'][] = \GuzzleHttp\Psr7\Utils::tryFopen(
                    ObjectSerializer::toFormValue($paramFile),
                    'rb'
                );
            }
        }
        // form params
        if ($signee_name !== null) {
            $formParams['signee_name'] = ObjectSerializer::toFormValue($signee_name);
        }
        // form params
        if ($signee_email !== null) {
            $formParams['signee_email'] = ObjectSerializer::toFormValue($signee_email);
        }
        // form params
        if ($redirect_url !== null) {
            $formParams['redirect_url'] = ObjectSerializer::toFormValue($redirect_url);
        }
        // form params
        if ($final_email !== null) {
            $formParams['final_email'] = ObjectSerializer::toFormValue($final_email);
        }

        $headers = $this->headerSelector->selectHeaders(
            ['application/json', ],
            $contentType,
            $multipart
        );

        // for model (json/xml)
        if (count($formParams) > 0) {
            if ($multipart) {
                $multipartContents = [];
                foreach ($formParams as $formParamName => $formParamValue) {
                    $formParamValueItems = is_array($formParamValue) ? $formParamValue : [$formParamValue];
                    foreach ($formParamValueItems as $formParamValueItem) {
                        $multipartContents[] = [
                            'name' => $formParamName,
                            'contents' => $formParamValueItem
                        ];
                    }
                }
                // for HTTP post (form)
                $httpBody = new MultipartStream($multipartContents);

            } elseif (stripos($headers['Content-Type'], 'application/json') !== false) {
                # if Content-Type contains "application/json", json_encode the form parameters
                $httpBody = ObjectSerializer::jsonEncode($formParams);
            } else {
                // for HTTP post (form)
                $httpBody = ObjectSerializer::buildQuery($formParams);
            }
        }

        // this endpoint requires API key authentication
        $apiKey = $this->config->getApiKeyWithPrefix('Authorization');
        if ($apiKey !== null) {
            $headers['Authorization'] = $apiKey;
        }

        $defaultHeaders = [];
        if ($this->config->getUserAgent()) {
            $defaultHeaders['User-Agent'] = $this->config->getUserAgent();
        }

        $headers = array_merge(
            $defaultHeaders,
            $headerParams,
            $headers
        );

        $operationHost = $this->config->getHost();
        $query = ObjectSerializer::buildQuery($queryParams);
        return new Request(
            'POST',
            $operationHost . $resourcePath . ($query ? "?{$query}" : ''),
            $headers,
            $httpBody
        );
    }

    /**
     * Create http client option
     *
     * @throws \RuntimeException on file opening failure
     * @return array of http client options
     */
    protected function createHttpClientOption()
    {
        $options = [];
        if ($this->config->getDebug()) {
            $options[RequestOptions::DEBUG] = fopen($this->config->getDebugFile(), 'a');
            if (!$options[RequestOptions::DEBUG]) {
                throw new \RuntimeException('Failed to open the debug file: ' . $this->config->getDebugFile());
            }
        }

        return $options;
    }
}
