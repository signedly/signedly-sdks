<?php
/**
 * CreateDocumentFieldsRequestInner
 *
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

namespace Signedly\Model;

use \ArrayAccess;
use \Signedly\ObjectSerializer;

/**
 * CreateDocumentFieldsRequestInner Class Doc Comment
 *
 * @category Class
 * @package  Signedly
 * @author   OpenAPI Generator team
 * @link     https://openapi-generator.tech
 * @implements \ArrayAccess<string, mixed>
 */
class CreateDocumentFieldsRequestInner implements ModelInterface, ArrayAccess, \JsonSerializable
{
    public const DISCRIMINATOR = null;

    /**
      * The original name of the model.
      *
      * @var string
      */
    protected static $openAPIModelName = 'create_document_fields_request_inner';

    /**
      * Array of property to type mappings. Used for (de)serialization
      *
      * @var string[]
      */
    protected static $openAPITypes = [
        'align' => 'int',
        'checked' => 'bool',
        'date_format' => 'int',
        'document_id' => 'string',
        'font' => 'string',
        'font_size' => 'int',
        'formula' => 'string',
        'group_name' => 'string',
        'height' => 'int',
        'is_multi_line' => 'bool',
        'is_required' => 'bool',
        'items' => '\Signedly\Model\UpdateDocumentFieldByBodyRequestItemsInner[]',
        'kind' => 'int',
        'label' => 'string',
        'max_length' => 'int',
        'number_format' => 'object',
        'page' => 'string',
        'page_number' => 'int',
        'placeholder' => 'string',
        'select_options' => 'string[]',
        'signatory_id' => 'string',
        'size' => 'int',
        'tool_tip' => 'string',
        'value' => 'string',
        'width' => 'float',
        'x' => 'float',
        'y' => 'float'
    ];

    /**
      * Array of property to format mappings. Used for (de)serialization
      *
      * @var string[]
      * @phpstan-var array<string, string|null>
      * @psalm-var array<string, string|null>
      */
    protected static $openAPIFormats = [
        'align' => null,
        'checked' => null,
        'date_format' => null,
        'document_id' => 'uuid',
        'font' => null,
        'font_size' => null,
        'formula' => null,
        'group_name' => null,
        'height' => null,
        'is_multi_line' => null,
        'is_required' => null,
        'items' => null,
        'kind' => null,
        'label' => null,
        'max_length' => null,
        'number_format' => null,
        'page' => 'uuid',
        'page_number' => null,
        'placeholder' => null,
        'select_options' => null,
        'signatory_id' => 'uuid',
        'size' => null,
        'tool_tip' => null,
        'value' => null,
        'width' => null,
        'x' => null,
        'y' => null
    ];

    /**
      * Array of nullable properties. Used for (de)serialization
      *
      * @var boolean[]
      */
    protected static array $openAPINullables = [
        'align' => false,
        'checked' => false,
        'date_format' => false,
        'document_id' => false,
        'font' => false,
        'font_size' => false,
        'formula' => false,
        'group_name' => false,
        'height' => false,
        'is_multi_line' => false,
        'is_required' => false,
        'items' => false,
        'kind' => false,
        'label' => false,
        'max_length' => false,
        'number_format' => false,
        'page' => false,
        'page_number' => false,
        'placeholder' => false,
        'select_options' => false,
        'signatory_id' => false,
        'size' => false,
        'tool_tip' => false,
        'value' => false,
        'width' => false,
        'x' => false,
        'y' => false
    ];

    /**
      * If a nullable field gets set to null, insert it here
      *
      * @var boolean[]
      */
    protected array $openAPINullablesSetToNull = [];

    /**
     * Array of property to type mappings. Used for (de)serialization
     *
     * @return array
     */
    public static function openAPITypes()
    {
        return self::$openAPITypes;
    }

    /**
     * Array of property to format mappings. Used for (de)serialization
     *
     * @return array
     */
    public static function openAPIFormats()
    {
        return self::$openAPIFormats;
    }

    /**
     * Array of nullable properties
     *
     * @return array
     */
    protected static function openAPINullables(): array
    {
        return self::$openAPINullables;
    }

    /**
     * Array of nullable field names deliberately set to null
     *
     * @return boolean[]
     */
    private function getOpenAPINullablesSetToNull(): array
    {
        return $this->openAPINullablesSetToNull;
    }

    /**
     * Setter - Array of nullable field names deliberately set to null
     *
     * @param boolean[] $openAPINullablesSetToNull
     */
    private function setOpenAPINullablesSetToNull(array $openAPINullablesSetToNull): void
    {
        $this->openAPINullablesSetToNull = $openAPINullablesSetToNull;
    }

    /**
     * Checks if a property is nullable
     *
     * @param string $property
     * @return bool
     */
    public static function isNullable(string $property): bool
    {
        return self::openAPINullables()[$property] ?? false;
    }

    /**
     * Checks if a nullable property is set to null.
     *
     * @param string $property
     * @return bool
     */
    public function isNullableSetToNull(string $property): bool
    {
        return in_array($property, $this->getOpenAPINullablesSetToNull(), true);
    }

    /**
     * Array of attributes where the key is the local name,
     * and the value is the original name
     *
     * @var string[]
     */
    protected static $attributeMap = [
        'align' => 'align',
        'checked' => 'checked',
        'date_format' => 'date_format',
        'document_id' => 'document_id',
        'font' => 'font',
        'font_size' => 'font_size',
        'formula' => 'formula',
        'group_name' => 'group_name',
        'height' => 'height',
        'is_multi_line' => 'is_multi_line',
        'is_required' => 'is_required',
        'items' => 'items',
        'kind' => 'kind',
        'label' => 'label',
        'max_length' => 'max_length',
        'number_format' => 'number_format',
        'page' => 'page',
        'page_number' => 'page_number',
        'placeholder' => 'placeholder',
        'select_options' => 'select_options',
        'signatory_id' => 'signatory_id',
        'size' => 'size',
        'tool_tip' => 'tool_tip',
        'value' => 'value',
        'width' => 'width',
        'x' => 'x',
        'y' => 'y'
    ];

    /**
     * Array of attributes to setter functions (for deserialization of responses)
     *
     * @var string[]
     */
    protected static $setters = [
        'align' => 'setAlign',
        'checked' => 'setChecked',
        'date_format' => 'setDateFormat',
        'document_id' => 'setDocumentId',
        'font' => 'setFont',
        'font_size' => 'setFontSize',
        'formula' => 'setFormula',
        'group_name' => 'setGroupName',
        'height' => 'setHeight',
        'is_multi_line' => 'setIsMultiLine',
        'is_required' => 'setIsRequired',
        'items' => 'setItems',
        'kind' => 'setKind',
        'label' => 'setLabel',
        'max_length' => 'setMaxLength',
        'number_format' => 'setNumberFormat',
        'page' => 'setPage',
        'page_number' => 'setPageNumber',
        'placeholder' => 'setPlaceholder',
        'select_options' => 'setSelectOptions',
        'signatory_id' => 'setSignatoryId',
        'size' => 'setSize',
        'tool_tip' => 'setToolTip',
        'value' => 'setValue',
        'width' => 'setWidth',
        'x' => 'setX',
        'y' => 'setY'
    ];

    /**
     * Array of attributes to getter functions (for serialization of requests)
     *
     * @var string[]
     */
    protected static $getters = [
        'align' => 'getAlign',
        'checked' => 'getChecked',
        'date_format' => 'getDateFormat',
        'document_id' => 'getDocumentId',
        'font' => 'getFont',
        'font_size' => 'getFontSize',
        'formula' => 'getFormula',
        'group_name' => 'getGroupName',
        'height' => 'getHeight',
        'is_multi_line' => 'getIsMultiLine',
        'is_required' => 'getIsRequired',
        'items' => 'getItems',
        'kind' => 'getKind',
        'label' => 'getLabel',
        'max_length' => 'getMaxLength',
        'number_format' => 'getNumberFormat',
        'page' => 'getPage',
        'page_number' => 'getPageNumber',
        'placeholder' => 'getPlaceholder',
        'select_options' => 'getSelectOptions',
        'signatory_id' => 'getSignatoryId',
        'size' => 'getSize',
        'tool_tip' => 'getToolTip',
        'value' => 'getValue',
        'width' => 'getWidth',
        'x' => 'getX',
        'y' => 'getY'
    ];

    /**
     * Array of attributes where the key is the local name,
     * and the value is the original name
     *
     * @return array
     */
    public static function attributeMap()
    {
        return self::$attributeMap;
    }

    /**
     * Array of attributes to setter functions (for deserialization of responses)
     *
     * @return array
     */
    public static function setters()
    {
        return self::$setters;
    }

    /**
     * Array of attributes to getter functions (for serialization of requests)
     *
     * @return array
     */
    public static function getters()
    {
        return self::$getters;
    }

    /**
     * The original name of the model.
     *
     * @return string
     */
    public function getModelName()
    {
        return self::$openAPIModelName;
    }

    public const FONT_ROBOTO = 'Roboto';
    public const FONT_OPEN_SANS = 'Open Sans';
    public const FONT_LATO = 'Lato';
    public const FONT_INTER = 'Inter';

    /**
     * Gets allowable values of the enum
     *
     * @return string[]
     */
    public function getFontAllowableValues()
    {
        return [
            self::FONT_ROBOTO,
            self::FONT_OPEN_SANS,
            self::FONT_LATO,
            self::FONT_INTER,
        ];
    }

    /**
     * Associative array for storing property values
     *
     * @var mixed[]
     */
    protected $container = [];

    /**
     * Constructor
     *
     * @param mixed[] $data Associated array of property values
     *                      initializing the model
     */
    public function __construct(?array $data = null)
    {
        $this->setIfExists('align', $data ?? [], null);
        $this->setIfExists('checked', $data ?? [], false);
        $this->setIfExists('date_format', $data ?? [], null);
        $this->setIfExists('document_id', $data ?? [], null);
        $this->setIfExists('font', $data ?? [], 'Roboto');
        $this->setIfExists('font_size', $data ?? [], null);
        $this->setIfExists('formula', $data ?? [], null);
        $this->setIfExists('group_name', $data ?? [], null);
        $this->setIfExists('height', $data ?? [], null);
        $this->setIfExists('is_multi_line', $data ?? [], false);
        $this->setIfExists('is_required', $data ?? [], true);
        $this->setIfExists('items', $data ?? [], null);
        $this->setIfExists('kind', $data ?? [], null);
        $this->setIfExists('label', $data ?? [], null);
        $this->setIfExists('max_length', $data ?? [], null);
        $this->setIfExists('number_format', $data ?? [], null);
        $this->setIfExists('page', $data ?? [], null);
        $this->setIfExists('page_number', $data ?? [], null);
        $this->setIfExists('placeholder', $data ?? [], null);
        $this->setIfExists('select_options', $data ?? [], null);
        $this->setIfExists('signatory_id', $data ?? [], null);
        $this->setIfExists('size', $data ?? [], null);
        $this->setIfExists('tool_tip', $data ?? [], null);
        $this->setIfExists('value', $data ?? [], null);
        $this->setIfExists('width', $data ?? [], null);
        $this->setIfExists('x', $data ?? [], null);
        $this->setIfExists('y', $data ?? [], null);
    }

    /**
    * Sets $this->container[$variableName] to the given data or to the given default Value; if $variableName
    * is nullable and its value is set to null in the $fields array, then mark it as "set to null" in the
    * $this->openAPINullablesSetToNull array
    *
    * @param string $variableName
    * @param array  $fields
    * @param mixed  $defaultValue
    */
    private function setIfExists(string $variableName, array $fields, $defaultValue): void
    {
        if (self::isNullable($variableName) && array_key_exists($variableName, $fields) && is_null($fields[$variableName])) {
            $this->openAPINullablesSetToNull[] = $variableName;
        }

        $this->container[$variableName] = $fields[$variableName] ?? $defaultValue;
    }

    /**
     * Show all the invalid properties with reasons.
     *
     * @return array invalid properties with reasons
     */
    public function listInvalidProperties()
    {
        $invalidProperties = [];

        if ($this->container['document_id'] === null) {
            $invalidProperties[] = "'document_id' can't be null";
        }
        $allowedValues = $this->getFontAllowableValues();
        if (!is_null($this->container['font']) && !in_array($this->container['font'], $allowedValues, true)) {
            $invalidProperties[] = sprintf(
                "invalid value '%s' for 'font', must be one of '%s'",
                $this->container['font'],
                implode("', '", $allowedValues)
            );
        }

        if ($this->container['height'] === null) {
            $invalidProperties[] = "'height' can't be null";
        }
        if ($this->container['kind'] === null) {
            $invalidProperties[] = "'kind' can't be null";
        }
        if ($this->container['label'] === null) {
            $invalidProperties[] = "'label' can't be null";
        }
        if ($this->container['page'] === null) {
            $invalidProperties[] = "'page' can't be null";
        }
        if ($this->container['page_number'] === null) {
            $invalidProperties[] = "'page_number' can't be null";
        }
        if ($this->container['placeholder'] === null) {
            $invalidProperties[] = "'placeholder' can't be null";
        }
        if ($this->container['signatory_id'] === null) {
            $invalidProperties[] = "'signatory_id' can't be null";
        }
        if ($this->container['width'] === null) {
            $invalidProperties[] = "'width' can't be null";
        }
        return $invalidProperties;
    }

    /**
     * Validate all the properties in the model
     * return true if all passed
     *
     * @return bool True if all properties are valid
     */
    public function valid()
    {
        return count($this->listInvalidProperties()) === 0;
    }


    /**
     * Gets align
     *
     * @return int|null
     */
    public function getAlign()
    {
        return $this->container['align'];
    }

    /**
     * Sets align
     *
     * @param int|null $align Text: 0 Left · 1 Center · 2 Right.
     *
     * @return self
     */
    public function setAlign($align)
    {
        if (is_null($align)) {
            throw new \InvalidArgumentException('non-nullable align cannot be null');
        }
        $this->container['align'] = $align;

        return $this;
    }

    /**
     * Gets checked
     *
     * @return bool|null
     */
    public function getChecked()
    {
        return $this->container['checked'];
    }

    /**
     * Sets checked
     *
     * @param bool|null $checked Checkbox: true starts it ticked.
     *
     * @return self
     */
    public function setChecked($checked)
    {
        if (is_null($checked)) {
            throw new \InvalidArgumentException('non-nullable checked cannot be null');
        }
        $this->container['checked'] = $checked;

        return $this;
    }

    /**
     * Gets date_format
     *
     * @return int|null
     */
    public function getDateFormat()
    {
        return $this->container['date_format'];
    }

    /**
     * Sets date_format
     *
     * @param int|null $date_format Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy.
     *
     * @return self
     */
    public function setDateFormat($date_format)
    {
        if (is_null($date_format)) {
            throw new \InvalidArgumentException('non-nullable date_format cannot be null');
        }
        $this->container['date_format'] = $date_format;

        return $this;
    }

    /**
     * Gets document_id
     *
     * @return string
     */
    public function getDocumentId()
    {
        return $this->container['document_id'];
    }

    /**
     * Sets document_id
     *
     * @param string $document_id The document's ID.
     *
     * @return self
     */
    public function setDocumentId($document_id)
    {
        if (is_null($document_id)) {
            throw new \InvalidArgumentException('non-nullable document_id cannot be null');
        }
        $this->container['document_id'] = $document_id;

        return $this;
    }

    /**
     * Gets font
     *
     * @return string|null
     */
    public function getFont()
    {
        return $this->container['font'];
    }

    /**
     * Sets font
     *
     * @param string|null $font Text, Date and Dropdown: the font.
     *
     * @return self
     */
    public function setFont($font)
    {
        if (is_null($font)) {
            throw new \InvalidArgumentException('non-nullable font cannot be null');
        }
        $allowedValues = $this->getFontAllowableValues();
        if (!in_array($font, $allowedValues, true)) {
            throw new \InvalidArgumentException(
                sprintf(
                    "Invalid value '%s' for 'font', must be one of '%s'",
                    $font,
                    implode("', '", $allowedValues)
                )
            );
        }
        $this->container['font'] = $font;

        return $this;
    }

    /**
     * Gets font_size
     *
     * @return int|null
     */
    public function getFontSize()
    {
        return $this->container['font_size'];
    }

    /**
     * Sets font_size
     *
     * @param int|null $font_size Text and Dropdown: the font size in points. Date fields always use 10.
     *
     * @return self
     */
    public function setFontSize($font_size)
    {
        if (is_null($font_size)) {
            throw new \InvalidArgumentException('non-nullable font_size cannot be null');
        }
        $this->container['font_size'] = $font_size;

        return $this;
    }

    /**
     * Gets formula
     *
     * @return string|null
     */
    public function getFormula()
    {
        return $this->container['formula'];
    }

    /**
     * Sets formula
     *
     * @param string|null $formula Text field: makes it a calculated field, worked out when the document is sent from other fields by their labels in brackets, e.g. `round([CTC] * 40%)` or `if([Grade] = \"A\", 50000, 20000)`. Refused if a name is unknown or the formulas loop.
     *
     * @return self
     */
    public function setFormula($formula)
    {
        if (is_null($formula)) {
            throw new \InvalidArgumentException('non-nullable formula cannot be null');
        }
        $this->container['formula'] = $formula;

        return $this;
    }

    /**
     * Gets group_name
     *
     * @return string|null
     */
    public function getGroupName()
    {
        return $this->container['group_name'];
    }

    /**
     * Sets group_name
     *
     * @param string|null $group_name Radio: required; the name of the option group.
     *
     * @return self
     */
    public function setGroupName($group_name)
    {
        if (is_null($group_name)) {
            throw new \InvalidArgumentException('non-nullable group_name cannot be null');
        }
        $this->container['group_name'] = $group_name;

        return $this;
    }

    /**
     * Gets height
     *
     * @return int
     */
    public function getHeight()
    {
        return $this->container['height'];
    }

    /**
     * Sets height
     *
     * @param int $height In PDF points (1/72 inch), whole: the field's height (each option's, for Radio).
     *
     * @return self
     */
    public function setHeight($height)
    {
        if (is_null($height)) {
            throw new \InvalidArgumentException('non-nullable height cannot be null');
        }
        $this->container['height'] = $height;

        return $this;
    }

    /**
     * Gets is_multi_line
     *
     * @return bool|null
     */
    public function getIsMultiLine()
    {
        return $this->container['is_multi_line'];
    }

    /**
     * Sets is_multi_line
     *
     * @param bool|null $is_multi_line Text: true lets the signer type several lines.
     *
     * @return self
     */
    public function setIsMultiLine($is_multi_line)
    {
        if (is_null($is_multi_line)) {
            throw new \InvalidArgumentException('non-nullable is_multi_line cannot be null');
        }
        $this->container['is_multi_line'] = $is_multi_line;

        return $this;
    }

    /**
     * Gets is_required
     *
     * @return bool|null
     */
    public function getIsRequired()
    {
        return $this->container['is_required'];
    }

    /**
     * Sets is_required
     *
     * @param bool|null $is_required False lets the signer leave it empty.
     *
     * @return self
     */
    public function setIsRequired($is_required)
    {
        if (is_null($is_required)) {
            throw new \InvalidArgumentException('non-nullable is_required cannot be null');
        }
        $this->container['is_required'] = $is_required;

        return $this;
    }

    /**
     * Gets items
     *
     * @return \Signedly\Model\UpdateDocumentFieldByBodyRequestItemsInner[]|null
     */
    public function getItems()
    {
        return $this->container['items'];
    }

    /**
     * Sets items
     *
     * @param \Signedly\Model\UpdateDocumentFieldByBodyRequestItemsInner[]|null $items Radio: required; the options, at least two, each `width` x `height`. `selected` 1 starts that option chosen.
     *
     * @return self
     */
    public function setItems($items)
    {
        if (is_null($items)) {
            throw new \InvalidArgumentException('non-nullable items cannot be null');
        }
        $this->container['items'] = $items;

        return $this;
    }

    /**
     * Gets kind
     *
     * @return int
     */
    public function getKind()
    {
        return $this->container['kind'];
    }

    /**
     * Sets kind
     *
     * @param int $kind The field's type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp.
     *
     * @return self
     */
    public function setKind($kind)
    {
        if (is_null($kind)) {
            throw new \InvalidArgumentException('non-nullable kind cannot be null');
        }
        $this->container['kind'] = $kind;

        return $this;
    }

    /**
     * Gets label
     *
     * @return string
     */
    public function getLabel()
    {
        return $this->container['label'];
    }

    /**
     * Sets label
     *
     * @param string $label The field's name, shown to the signer.
     *
     * @return self
     */
    public function setLabel($label)
    {
        if (is_null($label)) {
            throw new \InvalidArgumentException('non-nullable label cannot be null');
        }
        $this->container['label'] = $label;

        return $this;
    }

    /**
     * Gets max_length
     *
     * @return int|null
     */
    public function getMaxLength()
    {
        return $this->container['max_length'];
    }

    /**
     * Sets max_length
     *
     * @param int|null $max_length Text: the most characters the signer may type (1–550).
     *
     * @return self
     */
    public function setMaxLength($max_length)
    {
        if (is_null($max_length)) {
            throw new \InvalidArgumentException('non-nullable max_length cannot be null');
        }
        $this->container['max_length'] = $max_length;

        return $this;
    }

    /**
     * Gets number_format
     *
     * @return object|null
     */
    public function getNumberFormat()
    {
        return $this->container['number_format'];
    }

    /**
     * Sets number_format
     *
     * @param object|null $number_format How a calculated number is shown, e.g. {\"kind\": \"number\", \"style\": \"indian\", \"decimals\": 2} or {\"kind\": \"words\", \"currency\": \"INR\"}.
     *
     * @return self
     */
    public function setNumberFormat($number_format)
    {
        if (is_null($number_format)) {
            throw new \InvalidArgumentException('non-nullable number_format cannot be null');
        }
        $this->container['number_format'] = $number_format;

        return $this;
    }

    /**
     * Gets page
     *
     * @return string
     */
    public function getPage()
    {
        return $this->container['page'];
    }

    /**
     * Sets page
     *
     * @param string $page The ID of the page the field is on (GET /ap1/documents/{id}/pages/).
     *
     * @return self
     */
    public function setPage($page)
    {
        if (is_null($page)) {
            throw new \InvalidArgumentException('non-nullable page cannot be null');
        }
        $this->container['page'] = $page;

        return $this;
    }

    /**
     * Gets page_number
     *
     * @return int
     */
    public function getPageNumber()
    {
        return $this->container['page_number'];
    }

    /**
     * Sets page_number
     *
     * @param int $page_number That page's number, counting from 0 (the first page is 0).
     *
     * @return self
     */
    public function setPageNumber($page_number)
    {
        if (is_null($page_number)) {
            throw new \InvalidArgumentException('non-nullable page_number cannot be null');
        }
        $this->container['page_number'] = $page_number;

        return $this;
    }

    /**
     * Gets placeholder
     *
     * @return string
     */
    public function getPlaceholder()
    {
        return $this->container['placeholder'];
    }

    /**
     * Sets placeholder
     *
     * @param string $placeholder Hint text shown while the field is empty. Send an empty string for Checkbox and Radio.
     *
     * @return self
     */
    public function setPlaceholder($placeholder)
    {
        if (is_null($placeholder)) {
            throw new \InvalidArgumentException('non-nullable placeholder cannot be null');
        }
        $this->container['placeholder'] = $placeholder;

        return $this;
    }

    /**
     * Gets select_options
     *
     * @return string[]|null
     */
    public function getSelectOptions()
    {
        return $this->container['select_options'];
    }

    /**
     * Sets select_options
     *
     * @param string[]|null $select_options Dropdown: required; the choices the signer picks from, at least one (up to 100 characters each).
     *
     * @return self
     */
    public function setSelectOptions($select_options)
    {
        if (is_null($select_options)) {
            throw new \InvalidArgumentException('non-nullable select_options cannot be null');
        }
        $this->container['select_options'] = $select_options;

        return $this;
    }

    /**
     * Gets signatory_id
     *
     * @return string
     */
    public function getSignatoryId()
    {
        return $this->container['signatory_id'];
    }

    /**
     * Sets signatory_id
     *
     * @param string $signatory_id The signatory who fills in this field (from GET /ap1/signatories/).
     *
     * @return self
     */
    public function setSignatoryId($signatory_id)
    {
        if (is_null($signatory_id)) {
            throw new \InvalidArgumentException('non-nullable signatory_id cannot be null');
        }
        $this->container['signatory_id'] = $signatory_id;

        return $this;
    }

    /**
     * Gets size
     *
     * @return int|null
     */
    public function getSize()
    {
        return $this->container['size'];
    }

    /**
     * Sets size
     *
     * @param int|null $size Checkbox and Radio: the side of the tick or dot in points, centred in the box. Defaults to the box's smaller side.
     *
     * @return self
     */
    public function setSize($size)
    {
        if (is_null($size)) {
            throw new \InvalidArgumentException('non-nullable size cannot be null');
        }
        $this->container['size'] = $size;

        return $this;
    }

    /**
     * Gets tool_tip
     *
     * @return string|null
     */
    public function getToolTip()
    {
        return $this->container['tool_tip'];
    }

    /**
     * Sets tool_tip
     *
     * @param string|null $tool_tip Shown when the signer points at the field. Defaults to the label.
     *
     * @return self
     */
    public function setToolTip($tool_tip)
    {
        if (is_null($tool_tip)) {
            throw new \InvalidArgumentException('non-nullable tool_tip cannot be null');
        }
        $this->container['tool_tip'] = $tool_tip;

        return $this;
    }

    /**
     * Gets value
     *
     * @return string|null
     */
    public function getValue()
    {
        return $this->container['value'];
    }

    /**
     * Sets value
     *
     * @param string|null $value Leave it out for an empty field the signer fills in; a value given is prefilled.
     *
     * @return self
     */
    public function setValue($value)
    {
        if (is_null($value)) {
            throw new \InvalidArgumentException('non-nullable value cannot be null');
        }
        $this->container['value'] = $value;

        return $this;
    }

    /**
     * Gets width
     *
     * @return float
     */
    public function getWidth()
    {
        return $this->container['width'];
    }

    /**
     * Sets width
     *
     * @param float $width In PDF points (1/72 inch): the field's width (each option's, for Radio). The field must fit on its page.
     *
     * @return self
     */
    public function setWidth($width)
    {
        if (is_null($width)) {
            throw new \InvalidArgumentException('non-nullable width cannot be null');
        }
        $this->container['width'] = $width;

        return $this;
    }

    /**
     * Gets x
     *
     * @return float|null
     */
    public function getX()
    {
        return $this->container['x'];
    }

    /**
     * Sets x
     *
     * @param float|null $x In PDF points (1/72 inch): from the page's left edge to the field's left edge. Required for every type but Radio (whose options have their own).
     *
     * @return self
     */
    public function setX($x)
    {
        if (is_null($x)) {
            throw new \InvalidArgumentException('non-nullable x cannot be null');
        }
        $this->container['x'] = $x;

        return $this;
    }

    /**
     * Gets y
     *
     * @return float|null
     */
    public function getY()
    {
        return $this->container['y'];
    }

    /**
     * Sets y
     *
     * @param float|null $y In PDF points (1/72 inch): from the page's top edge to the field's top edge. Required for every type but Radio.
     *
     * @return self
     */
    public function setY($y)
    {
        if (is_null($y)) {
            throw new \InvalidArgumentException('non-nullable y cannot be null');
        }
        $this->container['y'] = $y;

        return $this;
    }
    /**
     * Returns true if offset exists. False otherwise.
     *
     * @param integer $offset Offset
     *
     * @return boolean
     */
    public function offsetExists($offset): bool
    {
        return isset($this->container[$offset]);
    }

    /**
     * Gets offset.
     *
     * @param integer $offset Offset
     *
     * @return mixed|null
     */
    #[\ReturnTypeWillChange]
    public function offsetGet($offset)
    {
        return $this->container[$offset] ?? null;
    }

    /**
     * Sets value based on offset.
     *
     * @param int|null $offset Offset
     * @param mixed    $value  Value to be set
     *
     * @return void
     */
    public function offsetSet($offset, $value): void
    {
        if (is_null($offset)) {
            $this->container[] = $value;
        } else {
            $this->container[$offset] = $value;
        }
    }

    /**
     * Unsets offset.
     *
     * @param integer $offset Offset
     *
     * @return void
     */
    public function offsetUnset($offset): void
    {
        unset($this->container[$offset]);
    }

    /**
     * Serializes the object to a value that can be serialized natively by json_encode().
     * @link https://www.php.net/manual/en/jsonserializable.jsonserialize.php
     *
     * @return mixed Returns data which can be serialized by json_encode(), which is a value
     * of any type other than a resource.
     */
    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
       return ObjectSerializer::sanitizeForSerialization($this);
    }

    /**
     * Gets the string presentation of the object
     *
     * @return string
     */
    public function __toString()
    {
        return json_encode(
            ObjectSerializer::sanitizeForSerialization($this),
            JSON_PRETTY_PRINT
        );
    }

    /**
     * Gets a header-safe presentation of the object
     *
     * @return string
     */
    public function toHeaderValue()
    {
        return json_encode(ObjectSerializer::sanitizeForSerialization($this));
    }
}


