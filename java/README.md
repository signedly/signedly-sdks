# signedly-sdk

Signedly API

- API version: v1

- Generator version: 7.10.0


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


  For more information, please visit [https://signedly.com](https://signedly.com)

*Automatically generated by the [OpenAPI Generator](https://openapi-generator.tech)*

## Requirements

Building the API client library requires:

1. Java 11+
2. Maven/Gradle

## Installation

To install the API client library to your local Maven repository, simply execute:

```shell
mvn clean install
```

To deploy it to a remote Maven repository instead, configure the settings of the repository and execute:

```shell
mvn clean deploy
```

Refer to the [OSSRH Guide](http://central.sonatype.org/pages/ossrh-guide.html) for more information.

### Maven users

Add this dependency to your project's POM:

```xml
<dependency>
  <groupId>com.signedly</groupId>
  <artifactId>signedly-sdk</artifactId>
  <version>0.1.0</version>
  <scope>compile</scope>
</dependency>
```

### Gradle users

Add this dependency to your project's build file:

```groovy
compile "com.signedly:signedly-sdk:0.1.0"
```

### Others

At first generate the JAR by executing:

```shell
mvn clean package
```

Then manually install the following JARs:

- `target/signedly-sdk-0.1.0.jar`
- `target/lib/*.jar`

## Getting Started

Please follow the [installation](#installation) instruction and execute the following Java code:

```java

import com.signedly.client.*;
import com.signedly.model.*;
import com.signedly.api.ApiRequestLogsApi;

public class ApiRequestLogsApiExample {

    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        // Configure clients using the `defaultClient` object, such as
        // overriding the host and port, timeout, etc.
        ApiRequestLogsApi apiInstance = new ApiRequestLogsApi(defaultClient);
        String method = "GET"; // String | Only this HTTP method.
        String path = "path_example"; // String | Only paths that contain this, e.g. `/ap1/document/`.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            RequestCountPage result = apiInstance.listRequestCounts(method, path, limit, offset);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling ApiRequestLogsApi#listRequestCounts");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}

```

## Documentation for API Endpoints

All URIs are relative to *https://l0ads.signedly.com*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*ApiRequestLogsApi* | [**listRequestCounts**](docs/ApiRequestLogsApi.md#listRequestCounts) | **GET** /ap1/logs/hits/ | Count your API calls per path
*ApiRequestLogsApi* | [**listRequestCountsWithHttpInfo**](docs/ApiRequestLogsApi.md#listRequestCountsWithHttpInfo) | **GET** /ap1/logs/hits/ | Count your API calls per path
*ApiRequestLogsApi* | [**listRequestLogs**](docs/ApiRequestLogsApi.md#listRequestLogs) | **GET** /ap1/logs/ | List your API calls
*ApiRequestLogsApi* | [**listRequestLogsWithHttpInfo**](docs/ApiRequestLogsApi.md#listRequestLogsWithHttpInfo) | **GET** /ap1/logs/ | List your API calls
*AuthenticationApi* | [**getAccessToken**](docs/AuthenticationApi.md#getAccessToken) | **POST** /ap1/token/ | Get an access token
*AuthenticationApi* | [**getAccessTokenWithHttpInfo**](docs/AuthenticationApi.md#getAccessTokenWithHttpInfo) | **POST** /ap1/token/ | Get an access token
*AuthenticationApi* | [**refreshAccessToken**](docs/AuthenticationApi.md#refreshAccessToken) | **POST** /ap1/refreshtoken/ | Refresh the access token
*AuthenticationApi* | [**refreshAccessTokenWithHttpInfo**](docs/AuthenticationApi.md#refreshAccessTokenWithHttpInfo) | **POST** /ap1/refreshtoken/ | Refresh the access token
*BulkSendingApi* | [**createBulkSend**](docs/BulkSendingApi.md#createBulkSend) | **POST** /ap1/bulk-sends/ | Send a template to many people
*BulkSendingApi* | [**createBulkSendWithHttpInfo**](docs/BulkSendingApi.md#createBulkSendWithHttpInfo) | **POST** /ap1/bulk-sends/ | Send a template to many people
*BulkSendingApi* | [**getBulkSend**](docs/BulkSendingApi.md#getBulkSend) | **GET** /ap1/bulk-sends/{id}/ | Follow a bulk send
*BulkSendingApi* | [**getBulkSendWithHttpInfo**](docs/BulkSendingApi.md#getBulkSendWithHttpInfo) | **GET** /ap1/bulk-sends/{id}/ | Follow a bulk send
*BulkSendingApi* | [**listBulkSendColumns**](docs/BulkSendingApi.md#listBulkSendColumns) | **GET** /ap1/bulk-sends/columns/ | List the columns a template&#39;s bulk send needs
*BulkSendingApi* | [**listBulkSendColumnsWithHttpInfo**](docs/BulkSendingApi.md#listBulkSendColumnsWithHttpInfo) | **GET** /ap1/bulk-sends/columns/ | List the columns a template&#39;s bulk send needs
*DocumentsApi* | [**createDocumentFromTemplate**](docs/DocumentsApi.md#createDocumentFromTemplate) | **POST** /ap1/documents/fromtemplate/ | Make a document from a template
*DocumentsApi* | [**createDocumentFromTemplateWithHttpInfo**](docs/DocumentsApi.md#createDocumentFromTemplateWithHttpInfo) | **POST** /ap1/documents/fromtemplate/ | Make a document from a template
*DocumentsApi* | [**deleteDocument**](docs/DocumentsApi.md#deleteDocument) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document
*DocumentsApi* | [**deleteDocumentWithHttpInfo**](docs/DocumentsApi.md#deleteDocumentWithHttpInfo) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document
*DocumentsApi* | [**getDownloadStatus**](docs/DocumentsApi.md#getDownloadStatus) | **GET** /ap1/documents-status/{id}/ | Check whether the signed PDF is ready
*DocumentsApi* | [**getDownloadStatusWithHttpInfo**](docs/DocumentsApi.md#getDownloadStatusWithHttpInfo) | **GET** /ap1/documents-status/{id}/ | Check whether the signed PDF is ready
*DocumentsApi* | [**listDocumentPages**](docs/DocumentsApi.md#listDocumentPages) | **GET** /ap1/documents/{id}/pages/ | List a document&#39;s pages and their fields
*DocumentsApi* | [**listDocumentPagesWithHttpInfo**](docs/DocumentsApi.md#listDocumentPagesWithHttpInfo) | **GET** /ap1/documents/{id}/pages/ | List a document&#39;s pages and their fields
*DocumentsApi* | [**listDocumentStatuses**](docs/DocumentsApi.md#listDocumentStatuses) | **GET** /ap1/documents-status-list/ | List the status of your organisation&#39;s documents
*DocumentsApi* | [**listDocumentStatusesWithHttpInfo**](docs/DocumentsApi.md#listDocumentStatusesWithHttpInfo) | **GET** /ap1/documents-status-list/ | List the status of your organisation&#39;s documents
*DocumentsApi* | [**listDocuments**](docs/DocumentsApi.md#listDocuments) | **GET** /ap1/documents/ | List the documents this API client created
*DocumentsApi* | [**listDocumentsWithHttpInfo**](docs/DocumentsApi.md#listDocumentsWithHttpInfo) | **GET** /ap1/documents/ | List the documents this API client created
*DocumentsApi* | [**uploadDocument**](docs/DocumentsApi.md#uploadDocument) | **POST** /ap1/upload/ | Upload a document or template
*DocumentsApi* | [**uploadDocumentWithHttpInfo**](docs/DocumentsApi.md#uploadDocumentWithHttpInfo) | **POST** /ap1/upload/ | Upload a document or template
*DocumentsApi* | [**uploadDocumentForOneSigner**](docs/DocumentsApi.md#uploadDocumentForOneSigner) | **POST** /ap1/upload_app/ | Upload a document for one signer and get their signing link
*DocumentsApi* | [**uploadDocumentForOneSignerWithHttpInfo**](docs/DocumentsApi.md#uploadDocumentForOneSignerWithHttpInfo) | **POST** /ap1/upload_app/ | Upload a document for one signer and get their signing link
*DownloadsApi* | [**getAuditTrailLink**](docs/DownloadsApi.md#getAuditTrailLink) | **GET** /ap1/document/download-audit-link/ | Get a link to the audit trail
*DownloadsApi* | [**getAuditTrailLinkWithHttpInfo**](docs/DownloadsApi.md#getAuditTrailLinkWithHttpInfo) | **GET** /ap1/document/download-audit-link/ | Get a link to the audit trail
*DownloadsApi* | [**getDownloadLink**](docs/DownloadsApi.md#getDownloadLink) | **GET** /ap1/document/download-link/ | Get a link to the signed PDF
*DownloadsApi* | [**getDownloadLinkWithHttpInfo**](docs/DownloadsApi.md#getDownloadLinkWithHttpInfo) | **GET** /ap1/document/download-link/ | Get a link to the signed PDF
*DownloadsApi* | [**getViewLink**](docs/DownloadsApi.md#getViewLink) | **GET** /ap1/document/view-link/ | Get a link to view the document
*DownloadsApi* | [**getViewLinkWithHttpInfo**](docs/DownloadsApi.md#getViewLinkWithHttpInfo) | **GET** /ap1/document/view-link/ | Get a link to view the document
*FieldsApi* | [**createDocumentFields**](docs/FieldsApi.md#createDocumentFields) | **POST** /ap1/documents/fields/ | Add fields to a document
*FieldsApi* | [**createDocumentFieldsWithHttpInfo**](docs/FieldsApi.md#createDocumentFieldsWithHttpInfo) | **POST** /ap1/documents/fields/ | Add fields to a document
*FieldsApi* | [**createTemplateFields**](docs/FieldsApi.md#createTemplateFields) | **POST** /ap1/templates/fields/ | Add fields to a template
*FieldsApi* | [**createTemplateFieldsWithHttpInfo**](docs/FieldsApi.md#createTemplateFieldsWithHttpInfo) | **POST** /ap1/templates/fields/ | Add fields to a template
*FieldsApi* | [**deleteField**](docs/FieldsApi.md#deleteField) | **DELETE** /ap1/documents/fields/{id}/ | Delete a field
*FieldsApi* | [**deleteFieldWithHttpInfo**](docs/FieldsApi.md#deleteFieldWithHttpInfo) | **DELETE** /ap1/documents/fields/{id}/ | Delete a field
*FieldsApi* | [**listDocumentFields**](docs/FieldsApi.md#listDocumentFields) | **GET** /ap1/documents/fields/ | List a document&#39;s fields
*FieldsApi* | [**listDocumentFieldsWithHttpInfo**](docs/FieldsApi.md#listDocumentFieldsWithHttpInfo) | **GET** /ap1/documents/fields/ | List a document&#39;s fields
*FieldsApi* | [**listTemplateFields**](docs/FieldsApi.md#listTemplateFields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields
*FieldsApi* | [**listTemplateFieldsWithHttpInfo**](docs/FieldsApi.md#listTemplateFieldsWithHttpInfo) | **GET** /ap1/templates/fields/ | List a template&#39;s fields
*FieldsApi* | [**updateDocumentField**](docs/FieldsApi.md#updateDocumentField) | **PUT** /ap1/documents/fields/{id}/ | Change a document&#39;s field
*FieldsApi* | [**updateDocumentFieldWithHttpInfo**](docs/FieldsApi.md#updateDocumentFieldWithHttpInfo) | **PUT** /ap1/documents/fields/{id}/ | Change a document&#39;s field
*FieldsApi* | [**updateDocumentFieldByBody**](docs/FieldsApi.md#updateDocumentFieldByBody) | **PUT** /ap1/documents/fields/ | Change a document&#39;s field (ID in the body)
*FieldsApi* | [**updateDocumentFieldByBodyWithHttpInfo**](docs/FieldsApi.md#updateDocumentFieldByBodyWithHttpInfo) | **PUT** /ap1/documents/fields/ | Change a document&#39;s field (ID in the body)
*FieldsApi* | [**updateTemplateField**](docs/FieldsApi.md#updateTemplateField) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field
*FieldsApi* | [**updateTemplateFieldWithHttpInfo**](docs/FieldsApi.md#updateTemplateFieldWithHttpInfo) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field
*SendingApi* | [**fillAndSendDocument**](docs/SendingApi.md#fillAndSendDocument) | **POST** /ap1/document/update_and_send/ | Fill in fields, add a signatory and send, in one call
*SendingApi* | [**fillAndSendDocumentWithHttpInfo**](docs/SendingApi.md#fillAndSendDocumentWithHttpInfo) | **POST** /ap1/document/update_and_send/ | Fill in fields, add a signatory and send, in one call
*SendingApi* | [**sendDocument**](docs/SendingApi.md#sendDocument) | **POST** /ap1/document/send/ | Send a document for signing by email
*SendingApi* | [**sendDocumentWithHttpInfo**](docs/SendingApi.md#sendDocumentWithHttpInfo) | **POST** /ap1/document/send/ | Send a document for signing by email
*SendingApi* | [**sendDocumentByLink**](docs/SendingApi.md#sendDocumentByLink) | **POST** /ap1/document/send_url/ | Send a document and get the signing link
*SendingApi* | [**sendDocumentByLinkWithHttpInfo**](docs/SendingApi.md#sendDocumentByLinkWithHttpInfo) | **POST** /ap1/document/send_url/ | Send a document and get the signing link
*SignatoriesApi* | [**createSignatories**](docs/SignatoriesApi.md#createSignatories) | **POST** /ap1/signatories/bulk/ | Add several signatories
*SignatoriesApi* | [**createSignatoriesWithHttpInfo**](docs/SignatoriesApi.md#createSignatoriesWithHttpInfo) | **POST** /ap1/signatories/bulk/ | Add several signatories
*SignatoriesApi* | [**createSignatory**](docs/SignatoriesApi.md#createSignatory) | **POST** /ap1/signatories/ | Add a signatory
*SignatoriesApi* | [**createSignatoryWithHttpInfo**](docs/SignatoriesApi.md#createSignatoryWithHttpInfo) | **POST** /ap1/signatories/ | Add a signatory
*SignatoriesApi* | [**deleteSignatory**](docs/SignatoriesApi.md#deleteSignatory) | **DELETE** /ap1/signatories/{id}/ | Remove a signatory
*SignatoriesApi* | [**deleteSignatoryWithHttpInfo**](docs/SignatoriesApi.md#deleteSignatoryWithHttpInfo) | **DELETE** /ap1/signatories/{id}/ | Remove a signatory
*SignatoriesApi* | [**listSignatories**](docs/SignatoriesApi.md#listSignatories) | **GET** /ap1/signatories/ | List a document&#39;s signatories
*SignatoriesApi* | [**listSignatoriesWithHttpInfo**](docs/SignatoriesApi.md#listSignatoriesWithHttpInfo) | **GET** /ap1/signatories/ | List a document&#39;s signatories
*TemplatesApi* | [**createTemplateFields**](docs/TemplatesApi.md#createTemplateFields) | **POST** /ap1/templates/fields/ | Add fields to a template
*TemplatesApi* | [**createTemplateFieldsWithHttpInfo**](docs/TemplatesApi.md#createTemplateFieldsWithHttpInfo) | **POST** /ap1/templates/fields/ | Add fields to a template
*TemplatesApi* | [**deleteDocument**](docs/TemplatesApi.md#deleteDocument) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document
*TemplatesApi* | [**deleteDocumentWithHttpInfo**](docs/TemplatesApi.md#deleteDocumentWithHttpInfo) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document
*TemplatesApi* | [**listTemplateFields**](docs/TemplatesApi.md#listTemplateFields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields
*TemplatesApi* | [**listTemplateFieldsWithHttpInfo**](docs/TemplatesApi.md#listTemplateFieldsWithHttpInfo) | **GET** /ap1/templates/fields/ | List a template&#39;s fields
*TemplatesApi* | [**listTemplates**](docs/TemplatesApi.md#listTemplates) | **GET** /ap1/templates/ | List your organisation&#39;s templates
*TemplatesApi* | [**listTemplatesWithHttpInfo**](docs/TemplatesApi.md#listTemplatesWithHttpInfo) | **GET** /ap1/templates/ | List your organisation&#39;s templates
*TemplatesApi* | [**updateTemplateField**](docs/TemplatesApi.md#updateTemplateField) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field
*TemplatesApi* | [**updateTemplateFieldWithHttpInfo**](docs/TemplatesApi.md#updateTemplateFieldWithHttpInfo) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field
*WebhooksApi* | [**createWebhookEndpoint**](docs/WebhooksApi.md#createWebhookEndpoint) | **POST** /ap1/webhooks/ | Add a webhook endpoint
*WebhooksApi* | [**createWebhookEndpointWithHttpInfo**](docs/WebhooksApi.md#createWebhookEndpointWithHttpInfo) | **POST** /ap1/webhooks/ | Add a webhook endpoint
*WebhooksApi* | [**deleteWebhookEndpoint**](docs/WebhooksApi.md#deleteWebhookEndpoint) | **DELETE** /ap1/webhooks/{id}/ | Delete a webhook endpoint
*WebhooksApi* | [**deleteWebhookEndpointWithHttpInfo**](docs/WebhooksApi.md#deleteWebhookEndpointWithHttpInfo) | **DELETE** /ap1/webhooks/{id}/ | Delete a webhook endpoint
*WebhooksApi* | [**getWebhookEndpoint**](docs/WebhooksApi.md#getWebhookEndpoint) | **GET** /ap1/webhooks/{id}/ | Get a webhook endpoint
*WebhooksApi* | [**getWebhookEndpointWithHttpInfo**](docs/WebhooksApi.md#getWebhookEndpointWithHttpInfo) | **GET** /ap1/webhooks/{id}/ | Get a webhook endpoint
*WebhooksApi* | [**listWebhookDeliveries**](docs/WebhooksApi.md#listWebhookDeliveries) | **GET** /ap1/webhooks/{id}/deliveries/ | List an endpoint&#39;s deliveries
*WebhooksApi* | [**listWebhookDeliveriesWithHttpInfo**](docs/WebhooksApi.md#listWebhookDeliveriesWithHttpInfo) | **GET** /ap1/webhooks/{id}/deliveries/ | List an endpoint&#39;s deliveries
*WebhooksApi* | [**listWebhookEndpoints**](docs/WebhooksApi.md#listWebhookEndpoints) | **GET** /ap1/webhooks/ | List your webhook endpoints
*WebhooksApi* | [**listWebhookEndpointsWithHttpInfo**](docs/WebhooksApi.md#listWebhookEndpointsWithHttpInfo) | **GET** /ap1/webhooks/ | List your webhook endpoints
*WebhooksApi* | [**redeliverWebhook**](docs/WebhooksApi.md#redeliverWebhook) | **POST** /ap1/webhooks/deliveries/{id}/redeliver/ | Send a delivery again
*WebhooksApi* | [**redeliverWebhookWithHttpInfo**](docs/WebhooksApi.md#redeliverWebhookWithHttpInfo) | **POST** /ap1/webhooks/deliveries/{id}/redeliver/ | Send a delivery again
*WebhooksApi* | [**rotateWebhookSecret**](docs/WebhooksApi.md#rotateWebhookSecret) | **POST** /ap1/webhooks/{id}/rotate-secret/ | Replace a webhook endpoint&#39;s secret
*WebhooksApi* | [**rotateWebhookSecretWithHttpInfo**](docs/WebhooksApi.md#rotateWebhookSecretWithHttpInfo) | **POST** /ap1/webhooks/{id}/rotate-secret/ | Replace a webhook endpoint&#39;s secret
*WebhooksApi* | [**sendTestWebhook**](docs/WebhooksApi.md#sendTestWebhook) | **POST** /ap1/webhooks/{id}/test/ | Send a test event
*WebhooksApi* | [**sendTestWebhookWithHttpInfo**](docs/WebhooksApi.md#sendTestWebhookWithHttpInfo) | **POST** /ap1/webhooks/{id}/test/ | Send a test event
*WebhooksApi* | [**updateWebhookEndpoint**](docs/WebhooksApi.md#updateWebhookEndpoint) | **PUT** /ap1/webhooks/{id}/ | Change or switch a webhook endpoint on or off
*WebhooksApi* | [**updateWebhookEndpointWithHttpInfo**](docs/WebhooksApi.md#updateWebhookEndpointWithHttpInfo) | **PUT** /ap1/webhooks/{id}/ | Change or switch a webhook endpoint on or off


## Documentation for Models

 - [CreateBulkSend202Response](docs/CreateBulkSend202Response.md)
 - [CreateBulkSendRequest](docs/CreateBulkSendRequest.md)
 - [CreateDocumentFieldsRequestInner](docs/CreateDocumentFieldsRequestInner.md)
 - [CreateDocumentFromTemplate200Response](docs/CreateDocumentFromTemplate200Response.md)
 - [CreateDocumentFromTemplateRequest](docs/CreateDocumentFromTemplateRequest.md)
 - [CreateDocumentFromTemplateRequestRecipientsInner](docs/CreateDocumentFromTemplateRequestRecipientsInner.md)
 - [CreateSignatoriesRequest](docs/CreateSignatoriesRequest.md)
 - [CreateSignatoriesRequestSignatoriesInner](docs/CreateSignatoriesRequestSignatoriesInner.md)
 - [CreateSignatoryRequest](docs/CreateSignatoryRequest.md)
 - [CreateTemplateFieldsRequestInner](docs/CreateTemplateFieldsRequestInner.md)
 - [CreateWebhookEndpointRequest](docs/CreateWebhookEndpointRequest.md)
 - [DeleteFieldRequest](docs/DeleteFieldRequest.md)
 - [Document](docs/Document.md)
 - [DocumentPage](docs/DocumentPage.md)
 - [DocumentStatusPage](docs/DocumentStatusPage.md)
 - [DocumentStatusRow](docs/DocumentStatusRow.md)
 - [Field](docs/Field.md)
 - [FillAndSendDocumentRequest](docs/FillAndSendDocumentRequest.md)
 - [FillAndSendDocumentRequestElementsInner](docs/FillAndSendDocumentRequestElementsInner.md)
 - [GetAccessTokenRequest](docs/GetAccessTokenRequest.md)
 - [GetAuditTrailLink200Response](docs/GetAuditTrailLink200Response.md)
 - [GetDownloadStatus200Response](docs/GetDownloadStatus200Response.md)
 - [ListBulkSendColumns200ResponseInner](docs/ListBulkSendColumns200ResponseInner.md)
 - [Page](docs/Page.md)
 - [RefreshAccessToken200Response](docs/RefreshAccessToken200Response.md)
 - [RefreshAccessTokenRequest](docs/RefreshAccessTokenRequest.md)
 - [RequestCountPage](docs/RequestCountPage.md)
 - [RequestHit](docs/RequestHit.md)
 - [RequestLog](docs/RequestLog.md)
 - [RequestLogPage](docs/RequestLogPage.md)
 - [SendDocument200Response](docs/SendDocument200Response.md)
 - [SendDocumentByLink200Response](docs/SendDocumentByLink200Response.md)
 - [SendDocumentByLinkRequest](docs/SendDocumentByLinkRequest.md)
 - [SendDocumentRequest](docs/SendDocumentRequest.md)
 - [Signatory](docs/Signatory.md)
 - [Template](docs/Template.md)
 - [TemplateField](docs/TemplateField.md)
 - [TemplatePage](docs/TemplatePage.md)
 - [UpdateDocumentFieldByBodyRequest](docs/UpdateDocumentFieldByBodyRequest.md)
 - [UpdateDocumentFieldByBodyRequestItemsInner](docs/UpdateDocumentFieldByBodyRequestItemsInner.md)
 - [UpdateWebhookEndpointRequest](docs/UpdateWebhookEndpointRequest.md)
 - [Upload](docs/Upload.md)
 - [UploadDocumentForOneSigner200Response](docs/UploadDocumentForOneSigner200Response.md)
 - [UploadDocumentForOneSignerRequest](docs/UploadDocumentForOneSignerRequest.md)
 - [UploadDocumentRequest](docs/UploadDocumentRequest.md)
 - [WebhookDelivery](docs/WebhookDelivery.md)
 - [WebhookDeliveryPage](docs/WebhookDeliveryPage.md)
 - [WebhookEndpoint](docs/WebhookEndpoint.md)
 - [WebhookEndpointWithSecret](docs/WebhookEndpointWithSecret.md)


<a id="documentation-for-authorization"></a>
## Documentation for Authorization


Authentication schemes defined for the API:
<a id="Bearer"></a>
### Bearer


- **Type**: API key
- **API key parameter name**: Authorization
- **Location**: HTTP header


## Recommendation

It's recommended to create an instance of `ApiClient` per thread in a multithreaded environment to avoid any potential issues.
However, the instances of the api clients created from the `ApiClient` are thread-safe and can be re-used.

## Author

info@signedly.com

