# OpenAPIClient-php


The Signedly REST API lets your system upload documents, add signatories and
fields, send them for signing and download the signed result. Every path starts
with `/ap1/`, and every request and response body is JSON unless an endpoint says
otherwise (the uploads are `multipart/form-data`).

## Authentication

1. In the Signedly web app, open **Account & Settings → API** and generate a
   **client ID** and **client secret** for your organisation.
2. `POST /ap1/token/` with them. You get an `access_token` (valid **2 hours**) and
   a `refresh_token` (valid **7 days**). While both are still valid, calling
   `/ap1/token/` again returns the same pair.
3. Send the access token on every other call:
   `Authorization: Bearer <access_token>`.
4. When the access token expires, `POST /ap1/refreshtoken/` with the refresh token
   for a new access token. When the refresh token has expired too, call
   `/ap1/token/` again.

`/ap1/token/` and `/ap1/refreshtoken/` allow 60 calls a minute per IP address;
more answer 429. A missing, unknown or expired access token answers 403
(`\"Client not found\"` or `\"Access token expired\"`).

The API acts for your **organisation's admin account**: documents you upload
belong to it and appear in its Signedly web app, and you can reach only that
account's documents, templates, signatories and fields. Another organisation's
IDs answer 404, as if they didn't exist.

## Plans

What the API allows depends on the Signedly plan of your **organisation's admin
account** (Account & Settings → Account & Plan). The same rules apply to live and
test keys.

| What | Free | Personal Pro | Business Pro | Teams |
|---|---|---|---|---|
| Generate live and test keys (Account & Settings → API) | – | ✓ | ✓ | ✓ |
| Every endpoint, `/ap1/token/` and `/ap1/refreshtoken/` included | – | ✓ | ✓ | ✓ |
| `require_email_otp` on `POST /ap1/signatories/` and `POST /ap1/signatories/bulk/` | – | ✓ | ✓ | ✓ |
| Bulk send: `GET /ap1/bulk-sends/columns/` and `POST /ap1/bulk-sends/` | – | – | – | ✓ |

The API is part of the paid plans. On Free (or with no plan) every call answers
403 `\"... Your plan doesn't include API access.\"`, with live or test keys, also
with a token or keys made earlier; they work again once the plan is paid. On a
paid plan, a feature it doesn't include answers 400 with
`\"Your plan doesn't include ...\"` and changes nothing, and
`GET /ap1/bulk-sends/{id}/` still reports bulk sends already made.

Live documents also need an API contract with Signedly. Without one, or with an
unpaid API invoice, `POST /ap1/upload/` (except templates), `/ap1/upload_app/`,
`/ap1/documents/fromtemplate/` and `/ap1/bulk-sends/` answer 402 with live keys.
Test keys work without a contract (see Sandbox).

## Sending a document for signing

1. `POST /ap1/upload/` a PDF or DOCX (`type` 2). The document is prepared in the
   background: find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is
   the upload's `id`), and wait until `GET /ap1/documents/{id}/pages/` lists its
   pages.
2. `POST /ap1/signatories/` (one) or `POST /ap1/signatories/bulk/` (several) to
   add the people who sign.
3. `POST /ap1/documents/fields/` to place the fields each signatory fills in.
4. Send it:
   - `POST /ap1/document/send/` emails every signatory a signing link (with
     ordered signing, only the first; each next one is emailed in
     turn), or
   - `POST /ap1/document/send_url/` sends no email and returns the first
     signatory's signing link, for you to show or send yourself.
5. Poll `GET /ap1/documents-status-list/` (or `GET /ap1/documents/`) until the
   status is 6 (Completed), then `GET /ap1/document/download-link/` for the
   signed PDF and `GET /ap1/document/download-audit-link/` for its audit trail.

**From a template:** upload with `type` 4 and a `template_name` (or make the
template in the web app), place its fields with `POST /ap1/templates/fields/`,
then for each signing make a document with `POST /ap1/documents/fromtemplate/`,
add its signatory, and send it.

**One signer, one call:** `POST /ap1/upload_app/` uploads a PDF or DOCX for one
signer and returns their signing link in `redirect_url`; the signer places their
own signature. After signing they go to the `redirect_url` you sent, and the
signed PDF and its audit trail are emailed to `final_email` (otherwise to your
organisation's admin).

## Quick start with curl

Each step uses an ID from the step before. `$API` is this server, e.g.
`https://l0ads.signedly.com`.

```bash
# 1. Token
curl -X POST $API/ap1/token/ -H 'Content-Type: application/json' \\
  -d '{\"client_id\": \"<client id>\", \"client_secret\": \"<client secret>\"}'
TOKEN=<access_token from the answer>

# 2. Upload a PDF (answers with the upload's id)
curl -X POST $API/ap1/upload/ -H \"Authorization: Bearer $TOKEN\" \\
  -F file=@nda.pdf -F name=nda-ann-lee -F type=2

# 3. Find the document, then wait until it has pages
curl \"$API/ap1/documents/?name=nda-ann-lee\" -H \"Authorization: Bearer $TOKEN\"
DOC=<results[0].id>
curl $API/ap1/documents/$DOC/pages/ -H \"Authorization: Bearer $TOKEN\"
PAGE=<[0].id>

# 4. Add the signatory
curl -X POST $API/ap1/signatories/ -H \"Authorization: Bearer $TOKEN\" \\
  -H 'Content-Type: application/json' \\
  -d '{\"document_id\": \"'$DOC'\", \"name\": \"Ann Lee\", \"email\": \"ann@example.com\"}'
SIGNER=<id from the answer>

# 5. Place her signature: 150 × 40 points, 72 points from the left, 640 from the top
curl -X POST $API/ap1/documents/fields/ -H \"Authorization: Bearer $TOKEN\" \\
  -H 'Content-Type: application/json' \\
  -d '[{\"document_id\": \"'$DOC'\", \"signatory_id\": \"'$SIGNER'\", \"kind\": 2,
        \"label\": \"Signature\", \"placeholder\": \"Sign here\", \"page\": \"'$PAGE'\",
        \"page_number\": 0, \"x\": 72, \"y\": 640, \"width\": 150, \"height\": 40}]'

# 6. Send it (Ann gets the signing email)
curl -X POST $API/ap1/document/send/ -H \"Authorization: Bearer $TOKEN\" \\
  -H 'Content-Type: application/json' \\
  -d '{\"document_id\": \"'$DOC'\", \"subject\": \"Please sign the NDA\",
       \"message\": \"Hi Ann, please sign by Friday.\", \"expiry_date\": \"2026-12-31\"}'

# 7. Poll until status is 6 (Completed), then get the signed PDF
curl \"$API/ap1/documents-status-list/?document_ids=$DOC\" -H \"Authorization: Bearer $TOKEN\"
curl \"$API/ap1/document/download-link/?id=$DOC\" -H \"Authorization: Bearer $TOKEN\"
```

## Postman

Import the whole API into Postman with **Import → Link** and
`<this server>/swaggerap1/postman.json`. Set `client_id` and `client_secret` in the
collection's **Variables**, run **Get an access token** (it saves the token for
every other request), and set `document_id` when a request needs one.

## Webhooks

Instead of polling, add an endpoint with `POST /ap1/webhooks/` (or in **Account &
Settings → API**) and Signedly posts your organisation's document events to it:
`document.sent`, `document.viewed`, `document.signed`, `document.approved`,
`document.completed`, `document.rejected` and `document.expired` (all of them,
or the `events` you choose). Each is a JSON `POST`:

```json
{\"id\": \"5b7f…\", \"type\": \"document.signed\", \"created_at\": \"2026-10-27T09:12:00+00:00\",
 \"test\": false,
 \"data\": {\"document\": {\"id\": \"6f0c…\", \"name\": \"nda.pdf\", \"status\": 5},
          \"recipient\": {\"id\": \"0b6e…\", \"email\": \"ann@example.com\", \"name\": \"Ann Lee\",
                        \"role\": \"signer\"}}}
```

`recipient` is null for events no recipient caused (sent, completed, expired);
`test` is true for documents made with your test keys. Fetch anything else, such
as download links, with your access token: events never carry links.

**Check every event is from Signedly.** The `Signedly-Signature` header is
`t=<unix seconds>,v1=<signature>`, where the signature is the hex HMAC-SHA256 of
`<t>.<raw body>` with the endpoint's secret. Refuse an event whose signature
doesn't match or whose `t` is more than 5 minutes off:

```python
import hashlib, hmac, time

def is_from_signedly(secret, header, raw_body):
    parts = dict(item.split(\"=\", 1) for item in header.split(\",\"))
    signed = f\"{parts['t']}.{raw_body.decode()}\".encode()
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    fresh = abs(time.time() - int(parts[\"t\"])) <= 300
    return fresh and hmac.compare_digest(parts[\"v1\"], expected)
```

**Answer 2xx within 10 seconds**, then do the work. Anything else is retried after
1 and 5 minutes, then 30 minutes and 2, 5 and 10 hours (7 tries in about 18
hours). `Signedly-Event-Id` is the same on every try of an event: use it to
ignore repeats. After 20 events in a row fail for good, Signedly switches the
endpoint off and emails your organisation's admin; switch it on again with
`PUT /ap1/webhooks/{id}/` and `\"is_active\": true`. Each endpoint's deliveries and
their last answers are at `GET /ap1/webhooks/{id}/deliveries/`, and any can be
sent again.

## Sandbox

Build and test against the API without paying for documents: in **Account &
Settings → API**, generate your **test keys**, and get a token with them at
`/ap1/token/` as usual. Everything works the same, except that what you upload or
make from a template with a test token is a **test document** (`is_test` on its
upload):

- every page of its PDF and of its audit trail says **TEST – NOT LEGALLY BINDING**;
- its emails are real, with `[TEST]` at the start of the subject;
- it isn't billed or counted toward your plan;
- your organisation can make 50 a calendar month (templates don't count); the next
  upload answers 429.

## Fields

Positions and sizes are in **PDF points** (1/72 inch), measured from the
**top-left corner** of the page as it is displayed (rotation applied).
`page_number` counts pages from 0. A field must sit wholly on its page (1 point
of tolerance); otherwise it is refused with 400. A field's page and signatory
can't be changed later: delete the field and add it again.

## Status values

**Document `status`:** 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent ·
5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Signatories,
fields and sends are only accepted while a document is 1–3 (not yet sent).

**Signatory `status`:** 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.

## Lists

`GET /ap1/documents/`, `/ap1/documents-status-list/`, `/ap1/templates/`,
`/ap1/logs/` and `/ap1/logs/hits/` are paged: pass `limit` (default 10) and
`offset`, and read `count`, `next`, `previous` and `results` from the response.

## Errors

| Status | Meaning |
|---|---|
| 400 | The request was refused, also when your plan doesn't include it (see Plans); the body says why (`{\"error\": \"...\"}`, or the name of each bad field with its messages). Nothing was changed. |
| 403 | The access token is missing, unknown or expired; the client ID and secret or the refresh token were refused; the organisation's plan has no API access (Free, see Plans); or an `expiry_date` isn't in the future (`\"Invalid Date Entered\"`). |
| 402 | No API contract, or an unpaid API invoice: live documents are refused (test keys keep working). |
| 404 | The document, template, signatory or field doesn't exist or isn't yours. |
| 429 | Too many token requests (wait a minute), or this month's 50 test documents are used. |
| 5xx | Our side failed; retry later. |

A send that times out may still have worked: check the document's status before
sending again (a second send of a sent document answers 400).

Download, view and audit links are valid for about 7 days; ask for a new one
whenever you need it.


For more information, please visit [https://signedly.com](https://signedly.com).

## Installation & Usage

### Requirements

PHP 7.4 and later.
Should also work with PHP 8.0.

### Composer

To install the bindings via [Composer](https://getcomposer.org/), add the following to `composer.json`:

```json
{
  "repositories": [
    {
      "type": "vcs",
      "url": "https://github.com/signedly/signedly-sdks.git"
    }
  ],
  "require": {
    "signedly/signedly-sdks": "*@dev"
  }
}
```

Then run `composer install`

### Manual Installation

Download the files and include `autoload.php`:

```php
<?php
require_once('/path/to/OpenAPIClient-php/vendor/autoload.php');
```

## Getting Started

Please follow the [installation procedure](#installation--usage) and then run the following:

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\APIRequestLogsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$method = 'method_example'; // string | Only this HTTP method.
$path = 'path_example'; // string | Only paths that contain this, e.g. `/ap1/document/`.
$limit = 56; // int | How many results to return (default 10).
$offset = 56; // int | How many results to skip.

try {
    $result = $apiInstance->listRequestCounts($method, $path, $limit, $offset);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling APIRequestLogsApi->listRequestCounts: ', $e->getMessage(), PHP_EOL;
}

```

## API Endpoints

All URIs are relative to *https://l0ads.signedly.com*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*APIRequestLogsApi* | [**listRequestCounts**](docs/Api/APIRequestLogsApi.md#listrequestcounts) | **GET** /ap1/logs/hits/ | Count your API calls per path
*APIRequestLogsApi* | [**listRequestLogs**](docs/Api/APIRequestLogsApi.md#listrequestlogs) | **GET** /ap1/logs/ | List your API calls
*AuthenticationApi* | [**getAccessToken**](docs/Api/AuthenticationApi.md#getaccesstoken) | **POST** /ap1/token/ | Get an access token
*AuthenticationApi* | [**refreshAccessToken**](docs/Api/AuthenticationApi.md#refreshaccesstoken) | **POST** /ap1/refreshtoken/ | Refresh the access token
*BulkSendingApi* | [**createBulkSend**](docs/Api/BulkSendingApi.md#createbulksend) | **POST** /ap1/bulk-sends/ | Send a template to many people
*BulkSendingApi* | [**getBulkSend**](docs/Api/BulkSendingApi.md#getbulksend) | **GET** /ap1/bulk-sends/{id}/ | Follow a bulk send
*BulkSendingApi* | [**listBulkSendColumns**](docs/Api/BulkSendingApi.md#listbulksendcolumns) | **GET** /ap1/bulk-sends/columns/ | List the columns a template&#39;s bulk send needs
*DocumentsApi* | [**createDocumentFromTemplate**](docs/Api/DocumentsApi.md#createdocumentfromtemplate) | **POST** /ap1/documents/fromtemplate/ | Make a document from a template
*DocumentsApi* | [**deleteDocument**](docs/Api/DocumentsApi.md#deletedocument) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document
*DocumentsApi* | [**getDownloadStatus**](docs/Api/DocumentsApi.md#getdownloadstatus) | **GET** /ap1/documents-status/{id}/ | Check whether the signed PDF is ready
*DocumentsApi* | [**listDocumentPages**](docs/Api/DocumentsApi.md#listdocumentpages) | **GET** /ap1/documents/{id}/pages/ | List a document&#39;s pages and their fields
*DocumentsApi* | [**listDocumentStatuses**](docs/Api/DocumentsApi.md#listdocumentstatuses) | **GET** /ap1/documents-status-list/ | List the status of your organisation&#39;s documents
*DocumentsApi* | [**listDocuments**](docs/Api/DocumentsApi.md#listdocuments) | **GET** /ap1/documents/ | List the documents this API client created
*DocumentsApi* | [**uploadDocument**](docs/Api/DocumentsApi.md#uploaddocument) | **POST** /ap1/upload/ | Upload a document or template
*DocumentsApi* | [**uploadDocumentForOneSigner**](docs/Api/DocumentsApi.md#uploaddocumentforonesigner) | **POST** /ap1/upload_app/ | Upload a document for one signer and get their signing link
*DownloadsApi* | [**getAuditTrailLink**](docs/Api/DownloadsApi.md#getaudittraillink) | **GET** /ap1/document/download-audit-link/ | Get a link to the audit trail
*DownloadsApi* | [**getDownloadLink**](docs/Api/DownloadsApi.md#getdownloadlink) | **GET** /ap1/document/download-link/ | Get a link to the signed PDF
*DownloadsApi* | [**getViewLink**](docs/Api/DownloadsApi.md#getviewlink) | **GET** /ap1/document/view-link/ | Get a link to view the document
*FieldsApi* | [**createDocumentFields**](docs/Api/FieldsApi.md#createdocumentfields) | **POST** /ap1/documents/fields/ | Add fields to a document
*FieldsApi* | [**createTemplateFields**](docs/Api/FieldsApi.md#createtemplatefields) | **POST** /ap1/templates/fields/ | Add fields to a template
*FieldsApi* | [**deleteField**](docs/Api/FieldsApi.md#deletefield) | **DELETE** /ap1/documents/fields/{id}/ | Delete a field
*FieldsApi* | [**listDocumentFields**](docs/Api/FieldsApi.md#listdocumentfields) | **GET** /ap1/documents/fields/ | List a document&#39;s fields
*FieldsApi* | [**listTemplateFields**](docs/Api/FieldsApi.md#listtemplatefields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields
*FieldsApi* | [**updateDocumentField**](docs/Api/FieldsApi.md#updatedocumentfield) | **PUT** /ap1/documents/fields/{id}/ | Change a document&#39;s field
*FieldsApi* | [**updateDocumentFieldByBody**](docs/Api/FieldsApi.md#updatedocumentfieldbybody) | **PUT** /ap1/documents/fields/ | Change a document&#39;s field (ID in the body)
*FieldsApi* | [**updateTemplateField**](docs/Api/FieldsApi.md#updatetemplatefield) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field
*SendingApi* | [**fillAndSendDocument**](docs/Api/SendingApi.md#fillandsenddocument) | **POST** /ap1/document/update_and_send/ | Fill in fields, add a signatory and send, in one call
*SendingApi* | [**sendDocument**](docs/Api/SendingApi.md#senddocument) | **POST** /ap1/document/send/ | Send a document for signing by email
*SendingApi* | [**sendDocumentByLink**](docs/Api/SendingApi.md#senddocumentbylink) | **POST** /ap1/document/send_url/ | Send a document and get the signing link
*SignatoriesApi* | [**createSignatories**](docs/Api/SignatoriesApi.md#createsignatories) | **POST** /ap1/signatories/bulk/ | Add several signatories
*SignatoriesApi* | [**createSignatory**](docs/Api/SignatoriesApi.md#createsignatory) | **POST** /ap1/signatories/ | Add a signatory
*SignatoriesApi* | [**deleteSignatory**](docs/Api/SignatoriesApi.md#deletesignatory) | **DELETE** /ap1/signatories/{id}/ | Remove a signatory
*SignatoriesApi* | [**listSignatories**](docs/Api/SignatoriesApi.md#listsignatories) | **GET** /ap1/signatories/ | List a document&#39;s signatories
*TemplatesApi* | [**createTemplateFields**](docs/Api/TemplatesApi.md#createtemplatefields) | **POST** /ap1/templates/fields/ | Add fields to a template
*TemplatesApi* | [**deleteDocument**](docs/Api/TemplatesApi.md#deletedocument) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document
*TemplatesApi* | [**listTemplateFields**](docs/Api/TemplatesApi.md#listtemplatefields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields
*TemplatesApi* | [**listTemplates**](docs/Api/TemplatesApi.md#listtemplates) | **GET** /ap1/templates/ | List your organisation&#39;s templates
*TemplatesApi* | [**updateTemplateField**](docs/Api/TemplatesApi.md#updatetemplatefield) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field
*WebhooksApi* | [**createWebhookEndpoint**](docs/Api/WebhooksApi.md#createwebhookendpoint) | **POST** /ap1/webhooks/ | Add a webhook endpoint
*WebhooksApi* | [**deleteWebhookEndpoint**](docs/Api/WebhooksApi.md#deletewebhookendpoint) | **DELETE** /ap1/webhooks/{id}/ | Delete a webhook endpoint
*WebhooksApi* | [**getWebhookEndpoint**](docs/Api/WebhooksApi.md#getwebhookendpoint) | **GET** /ap1/webhooks/{id}/ | Get a webhook endpoint
*WebhooksApi* | [**listWebhookDeliveries**](docs/Api/WebhooksApi.md#listwebhookdeliveries) | **GET** /ap1/webhooks/{id}/deliveries/ | List an endpoint&#39;s deliveries
*WebhooksApi* | [**listWebhookEndpoints**](docs/Api/WebhooksApi.md#listwebhookendpoints) | **GET** /ap1/webhooks/ | List your webhook endpoints
*WebhooksApi* | [**redeliverWebhook**](docs/Api/WebhooksApi.md#redeliverwebhook) | **POST** /ap1/webhooks/deliveries/{id}/redeliver/ | Send a delivery again
*WebhooksApi* | [**rotateWebhookSecret**](docs/Api/WebhooksApi.md#rotatewebhooksecret) | **POST** /ap1/webhooks/{id}/rotate-secret/ | Replace a webhook endpoint&#39;s secret
*WebhooksApi* | [**sendTestWebhook**](docs/Api/WebhooksApi.md#sendtestwebhook) | **POST** /ap1/webhooks/{id}/test/ | Send a test event
*WebhooksApi* | [**updateWebhookEndpoint**](docs/Api/WebhooksApi.md#updatewebhookendpoint) | **PUT** /ap1/webhooks/{id}/ | Change or switch a webhook endpoint on or off

## Models

- [CreateBulkSend202Response](docs/Model/CreateBulkSend202Response.md)
- [CreateBulkSendRequest](docs/Model/CreateBulkSendRequest.md)
- [CreateDocumentFieldsRequestInner](docs/Model/CreateDocumentFieldsRequestInner.md)
- [CreateDocumentFromTemplate200Response](docs/Model/CreateDocumentFromTemplate200Response.md)
- [CreateDocumentFromTemplateRequest](docs/Model/CreateDocumentFromTemplateRequest.md)
- [CreateDocumentFromTemplateRequestRecipientsInner](docs/Model/CreateDocumentFromTemplateRequestRecipientsInner.md)
- [CreateSignatoriesRequest](docs/Model/CreateSignatoriesRequest.md)
- [CreateSignatoriesRequestSignatoriesInner](docs/Model/CreateSignatoriesRequestSignatoriesInner.md)
- [CreateSignatoryRequest](docs/Model/CreateSignatoryRequest.md)
- [CreateTemplateFieldsRequestInner](docs/Model/CreateTemplateFieldsRequestInner.md)
- [CreateWebhookEndpointRequest](docs/Model/CreateWebhookEndpointRequest.md)
- [DeleteFieldRequest](docs/Model/DeleteFieldRequest.md)
- [Document](docs/Model/Document.md)
- [DocumentPage](docs/Model/DocumentPage.md)
- [DocumentStatusPage](docs/Model/DocumentStatusPage.md)
- [DocumentStatusRow](docs/Model/DocumentStatusRow.md)
- [Field](docs/Model/Field.md)
- [FillAndSendDocumentRequest](docs/Model/FillAndSendDocumentRequest.md)
- [FillAndSendDocumentRequestElementsInner](docs/Model/FillAndSendDocumentRequestElementsInner.md)
- [GetAccessTokenRequest](docs/Model/GetAccessTokenRequest.md)
- [GetAuditTrailLink200Response](docs/Model/GetAuditTrailLink200Response.md)
- [GetDownloadStatus200Response](docs/Model/GetDownloadStatus200Response.md)
- [ListBulkSendColumns200ResponseInner](docs/Model/ListBulkSendColumns200ResponseInner.md)
- [Page](docs/Model/Page.md)
- [RefreshAccessToken200Response](docs/Model/RefreshAccessToken200Response.md)
- [RefreshAccessTokenRequest](docs/Model/RefreshAccessTokenRequest.md)
- [RequestCountPage](docs/Model/RequestCountPage.md)
- [RequestHit](docs/Model/RequestHit.md)
- [RequestLog](docs/Model/RequestLog.md)
- [RequestLogPage](docs/Model/RequestLogPage.md)
- [SendDocument200Response](docs/Model/SendDocument200Response.md)
- [SendDocumentByLink200Response](docs/Model/SendDocumentByLink200Response.md)
- [SendDocumentByLinkRequest](docs/Model/SendDocumentByLinkRequest.md)
- [SendDocumentRequest](docs/Model/SendDocumentRequest.md)
- [Signatory](docs/Model/Signatory.md)
- [Template](docs/Model/Template.md)
- [TemplateField](docs/Model/TemplateField.md)
- [TemplatePage](docs/Model/TemplatePage.md)
- [UpdateDocumentFieldByBodyRequest](docs/Model/UpdateDocumentFieldByBodyRequest.md)
- [UpdateDocumentFieldByBodyRequestItemsInner](docs/Model/UpdateDocumentFieldByBodyRequestItemsInner.md)
- [UpdateWebhookEndpointRequest](docs/Model/UpdateWebhookEndpointRequest.md)
- [Upload](docs/Model/Upload.md)
- [UploadDocumentForOneSigner200Response](docs/Model/UploadDocumentForOneSigner200Response.md)
- [UploadDocumentForOneSignerRequest](docs/Model/UploadDocumentForOneSignerRequest.md)
- [UploadDocumentRequest](docs/Model/UploadDocumentRequest.md)
- [WebhookDelivery](docs/Model/WebhookDelivery.md)
- [WebhookDeliveryPage](docs/Model/WebhookDeliveryPage.md)
- [WebhookEndpoint](docs/Model/WebhookEndpoint.md)
- [WebhookEndpointWithSecret](docs/Model/WebhookEndpointWithSecret.md)

## Authorization

Authentication schemes defined for the API:
### Bearer

- **Type**: API key
- **API key parameter name**: Authorization
- **Location**: HTTP header


## Tests

To run the tests, use:

```bash
composer install
vendor/bin/phpunit
```

## Author

info@signedly.com

## About this package

This PHP package is automatically generated by the [OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `v1`
    - Package version: `0.1.0`
    - Generator version: `7.10.0`
- Build package: `org.openapitools.codegen.languages.PhpClientCodegen`
