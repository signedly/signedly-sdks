# signedly

The Signedly REST API lets your system upload documents, add signatories and
fields, send them for signing and download the signed result. Every path starts
with `/ap1/`, and every request and response body is JSON unless an endpoint says
otherwise (the uploads are `multipart/form-data`).

## Authentication

1. In the Signedly web app, your organisation's **super admin** opens **Account &
   Settings → API** and generates a **client ID** and **client secret**. Only the
   super admin can see, regenerate or replace the keys and manage webhooks there,
   because a key acts for the organisation admin.
2. `POST /ap1/token/` with them. You get an `access_token` (valid **2 hours**) and
   a `refresh_token` (valid **7 days**). While both are still valid, calling
   `/ap1/token/` again returns the same pair.
3. Send the access token on every other call:
   `Authorization: Bearer <access_token>`.
4. When the access token expires, `POST /ap1/refreshtoken/` with the refresh token
   for a new access token. The refresh token stays the same and each refresh keeps
   it valid for 7 more days, up to 30 days after `/ap1/token/` made it. When it has
   expired, call `/ap1/token/` again. Your key pair has one token, shared by all your
   processes: after a refresh, the access token it replaced keeps working for 60
   seconds (never past its own expiry), so another process using it isn't refused
   mid-call; switch every process to the new one.

`/ap1/token/` and `/ap1/refreshtoken/` allow 60 calls a minute per IP address;
more answer 429. Every other call counts against your API client, separately for
the live and the test keys: **600 calls a minute** in all, of which **120 a
minute** may upload or send documents (`upload/`, `upload_app/`, `document/send/`,
`document/send_url/`, `document/update_and_send/`, `documents/fromtemplate/`,
`bulk-sends/`; a bulk send counts once, however many rows it has). Over a limit
the call answers 429 with `Retry-After` (seconds until the next minute) and
`X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` (Unix time);
wait that long and retry. Contact support@signedly.com if your integration needs
more. A missing, unknown or expired access token answers 403
(`\"Client not found\"` or `\"Access token expired\"`).

The API acts for your **organisation's admin account**: documents you upload
belong to it and appear in its Signedly web app, and you can reach only that
account's documents, templates, signatories and fields, plus every document your
API client made. When your super admin hands the organisation over, the API acts
for the new super admin and still reaches what it made before. Another
organisation's IDs answer 404, as if they didn't exist.

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
`/ap1/documents/fromtemplate/`, `/ap1/bulk-sends/` and sending a draft already
uploaded (`/ap1/document/send/`, `/ap1/document/send_url/`,
`/ap1/document/update_and_send/`) answer 402 with live keys.
Test keys work without a contract (see Sandbox).

## API billing

Live API documents are billed per document under your organisation's API contract,
on top of its Signedly plan. List prices (a contract can differ; prices exclude
tax):

| Tier | Per document | Monthly minimum |
|---|---|---|
| Basic | $0.80 / ₹60 | 100 documents |
| Standard | $0.50 / ₹40 | 250 documents |
| Premium | $0.25 / ₹20 | 1,000 documents |

- **What counts:** a live document your API client sends, once, when it's sent.
  `/ap1/upload_app/` documents count when they're made, because that route returns
  a signing link straight away. Every document of an API bulk send counts. Drafts
  never sent, templates, test-key documents and documents sent from the web app
  don't count. Sending again or archiving doesn't count twice. Months are calendar
  months in UTC; the API page in Account & Settings shows this month's count.
- **Rejected, voided and expired documents** are still billed: a document is
  billed when it's sent, whatever happens to it afterwards. A send refused before it
  goes out (a 4xx answer) isn't billed.
- **Minimum and overage:** on the 1st of each month your invoice charges that
  month's minimum upfront, plus last month's documents above its minimum at last
  month's price. Unused documents of the minimum don't roll over. The first month
  is charged in full, whatever day the contract starts.
- **Changing or ending a contract:** new terms apply from the next invoice. When a
  contract ends, live documents keep working to the end of its last month; the next
  invoice charges only that month's overage, and live documents are then refused
  (402) until a contract is in place again.
- **Paying:** an invoice is due 7 days after it's issued. Reminders go out 1, 7 and
  13 days after the due date; 14 days after it, live documents are paused (402)
  until every overdue invoice is paid, and work again as soon as it is. Test keys,
  your data and documents already sent are never affected.
- **Tax:** prices exclude tax; INR invoices show GST as its own line when it
  applies.
- **Refunds** are handled by hand: email support@signedly.com.

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
   - `POST /ap1/document/send_url/` returns the first signatory's signing
     link, for you to show or send yourself, and emails them nothing; any other
     signatories are emailed as by `send/` (all at once, or with ordered signing
     each in turn after the one before signs).
5. Poll `GET /ap1/documents-status-list/` (or `GET /ap1/documents/`) until the
   status is 6 (Completed), then `GET /ap1/document/download-link/` for the
   signed PDF and `GET /ap1/document/download-audit-link/` for its audit trail.

**The two document lists differ on purpose.** `GET /ap1/documents/` lists only the
documents this API client made through the API. `GET /ap1/documents-status-list/`
lists every document of the organisation's admin, including ones made in the web app.
Use the first to see your integration's own documents, and the second for everything
the admin account owns.

**From a template:** upload with `type` 4 and a `template_name` (or make the
template in the web app), place its fields with `POST /ap1/templates/fields/`
(each on the role named by its `signatory_id`, a role's `id` from
`GET /ap1/signatories/?document_id=<template ID>`; without one, on the first role),
then for each signing make a document with `POST /ap1/documents/fromtemplate/`,
add its signatory, and send it.

**One signer, one call:** `POST /ap1/upload_app/` uploads a PDF or DOCX for one
signer and returns their signing link in `redirect_url`; the signer places their
own signature. After signing they go to the `redirect_url` you sent, and the
signed PDF and its audit trail are emailed to `final_email` (otherwise to your
organisation's admin).

**A PDF that is already digitally signed** (Adobe, DocuSign, a DSC or Aadhaar
eSign) is accepted, but signing it on Signedly invalidates those signatures. The
upload and send answers (`upload/`, `upload_app/`, `send/`, `send_url/`,
`update_and_send/`) say so: `existing_signatures` has the `count` (null when the
file couldn't be checked) and the signers' `names`, and `warnings` holds the text
to show your user, e.g. \"This PDF already has 1 digital signature (by Asha Rao).
Signing it on Signedly will invalidate it.\" `warnings` is empty when there is
nothing to warn about. Nothing is refused because of it.

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

## SDKs

Official client libraries, generated from this API's spec. Each also gets and
renews the access token for you and checks webhook signatures:

| Language | Install |
|---|---|
| Python 3.8+ | `pip install signedly` |
| Node / TypeScript | `npm install @signedly/sdk` |
| PHP 7.4+ | `composer require signedly/sdk` |
| Java 11+ | Maven or Gradle `com.signedly:signedly-sdk` |

Source and a quick start for each language:
https://github.com/signedly/signedly-sdks

## Webhooks

Instead of polling, add an endpoint with `POST /ap1/webhooks/` (or in **Account &
Settings → API**) and Signedly posts your organisation's document events to it:
`document.sent`, `document.viewed`, `document.signed`, `document.approved`,
`document.completed`, `document.rejected`, `document.expired` and
`document.voided` (all of them,
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
doesn't match or whose `t` is more than 5 minutes off. The header can carry more
than one `v1` (after you rotate the secret, see below): accept the event if any
of them matches. The signature with the old secret is always the last `v1`, so a
check that reads only the last one keeps working until you switch secrets.

```python
import hashlib, hmac, time

def is_from_signedly(secret, header, raw_body):
    items = [item.split(\"=\", 1) for item in header.split(\",\")]
    t = next(value for name, value in items if name == \"t\")
    signed = f\"{t}.{raw_body.decode()}\".encode()
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    fresh = abs(time.time() - int(t)) <= 300
    return fresh and any(
        hmac.compare_digest(value, expected) for name, value in items if name == \"v1\"
    )
```

**Rotating the secret** (`POST /ap1/webhooks/{id}/rotate-secret/`, or in Account &
Settings → API) gives a new secret. For the next 24 hours every event is signed
with both the new and the old one, so you can deploy the new secret without
refusing events; `previous_secret_expires_at` says when the old one stops. If the
old secret leaked, send `{\"expire_previous\": true}` and it stops at once.

**Answer 2xx within 10 seconds**, then do the work. Anything else is retried after
1 and 5 minutes, then 30 minutes and 2, 5 and 10 hours (7 tries in about 18
hours). `Signedly-Event-Id` is the same on every try of an event: use it to
ignore repeats. After 20 events in a row fail for good, Signedly switches the
endpoint off and emails your organisation's admin; switch it on again with
`PUT /ap1/webhooks/{id}/` and `\"is_active\": true`. Each endpoint's deliveries and
their last answers are at `GET /ap1/webhooks/{id}/deliveries/`, and any can be
sent again. Webhook history is kept for **30 days**: a delivery that succeeded or
failed more than 30 days ago is deleted and can't be sent again.

**Delivery is at least once and in no set order.** Build your endpoint for both:

- *The same event can arrive more than once:* an answer that came after the 10
  seconds, a lost connection after your server got the event, or a delivery you
  send again from the deliveries list. Every copy has the same `Signedly-Event-Id`
  and the same body (`id`, `created_at`, `data`); only `t` and the signature in
  `Signedly-Signature` are new. Keep the event ids you've handled and skip repeats.
- *Events can arrive out of order:* each is sent on its own and retries mix in, so
  `document.signed` can come after `document.completed`. `created_at` is when the
  event happened, not when it was sent: order by it, or fetch the document
  (`GET /ap1/documents-status/{id}/`) for its current status.
- *What counts as a failure:* any answer that isn't 2xx within 10 seconds,
  redirects (3xx) included, since they aren't followed; timeouts; connection and
  TLS errors; and a URL that no longer points to a public address. Each is retried
  on the schedule above. An endpoint that is switched off, or an organisation
  whose plan has no API access, gets nothing, and those deliveries fail at once
  without counting toward switching the endpoint off.
- *Where events go:* only `https://` URLs on public internet addresses, checked
  when you save the endpoint and before every try.

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
  upload answers 429;
- a test token sees and acts only on test documents: a live document answers 404
  and isn't listed. It can use your templates (list them, read their fields, make
  documents and bulk sends from them) but not change or delete a live one.
- `/ap1/logs/` and `/ap1/logs/hits/` show a test token only calls made with your
  test keys, and a live token only live calls (add `is_test=true` to see the
  test calls). Webhook deliveries listed or resent with a test token are only
  those of test documents' events (`\"test\": true`).

## Fields

Positions and sizes are in **PDF points** (1/72 inch), measured from the
**top-left corner** of the page as it is displayed (rotation applied).
`page_number` counts pages from 0: send the `id` and `page_number` that
`GET /ap1/documents/{id}/pages/` lists for the same page. A field needs a known
`kind` and a `width` and `height` above 0, and must sit wholly on its page (1 point
of tolerance); otherwise it is refused with 400. A field's page and signatory
can't be changed later: delete the field and add it again.

## Status values

**Document `status`:** 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent ·
5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired · 10 Voided
(stopped by its sender in the web app; its links no longer sign). Signatories,
fields and sends are only accepted while a document is 1–3 (not yet sent).

**Signatory `status`:** 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.

## Lists

`GET /ap1/documents/`, `/ap1/documents-status-list/`, `/ap1/templates/`,
`/ap1/logs/` and `/ap1/logs/hits/` are paged: pass `limit` (default 10, at most
100; a larger value gets 100) and `offset`, and read `count`, `next`, `previous` and
`results` from the response. Follow `next` until it is null to read every result.

## Errors

| Status | Meaning |
|---|---|
| 400 | The request was refused, also when your plan doesn't include it (see Plans); the body says why (`{\"error\": \"...\"}`, or the name of each bad field with its messages). Nothing was changed. |
| 403 | The access token is missing, unknown or expired; the client ID and secret or the refresh token were refused; the organisation's plan has no API access (Free, see Plans); or an `expiry_date` isn't in the future (`\"Invalid Date Entered\"`). |
| 402 | No API contract, or an unpaid API invoice: live documents are refused (test keys keep working). |
| 404 | The document, template, signatory or field doesn't exist or isn't yours. |
| 429 | Too many requests this minute (see the limits under Authentication; wait `Retry-After` seconds), or this month's 50 test documents are used. |
| 5xx | Our side failed; retry later. |

A send that times out may still have worked: check the document's status before
sending again (a second send of a sent document answers 400).

Download, view and audit links are valid for about 7 days; ask for a new one
whenever you need it.

## Versioning and changes

The API has one version today, `/ap1/`. A **breaking change** is only ever made in
a new version path (for example `/ap1/v2/`): the current one keeps working, and
its end (sunset) date is announced at least **6 months** ahead, by email to every
API client's organisation admin and here in these docs.

Breaking means: removing or renaming a route, a field or an enum value; a new
required input; a changed status code or error shape; a changed meaning of an
existing field.

Not breaking, and made without notice: new routes; new optional inputs; new fields
in responses and webhook payloads; new webhook event types; new enum values in
responses; clearer error messages. **Ignore fields and event types you don't
know**, so these changes never break your integration.

The SDKs follow the API: a breaking change comes with a new major SDK version
(see SDKs).


This Python package is automatically generated by the [OpenAPI Generator](https://openapi-generator.tech) project:

- API version: v1
- Package version: 0.1.3
- Generator version: 7.10.0
- Build package: org.openapitools.codegen.languages.PythonClientCodegen
For more information, please visit [https://signedly.com](https://signedly.com)

## Requirements

Python 3.8+

## Installation & Usage

```sh
pip install signedly
```

Generate a client ID and secret in Signedly under **Account & Settings → API** (test keys for the sandbox, live keys for real documents). The helper fetches the access token on the first call and renews it before it expires.

```python
from signedly.helpers import SignedlyClient
from signedly.api.documents_api import DocumentsApi

client = SignedlyClient(CLIENT_ID, CLIENT_SECRET)
for document in DocumentsApi(client.api_client).list_documents().results:
    print(document.id, document.status)
```

Check every webhook event with `signedly.helpers.verify_webhook_signature(secret, header, raw_body)`, passing the raw request body.

The whole API (every endpoint, field and status) is documented at https://l0ads.signedly.com/swaggerap1/. The [repository README](https://github.com/signedly/signedly-sdks#readme) covers the usual flow, webhooks and the sandbox.

## Getting Started

Calling an endpoint with the generated client and an access token you manage yourself:

```python

import signedly
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: Bearer
configuration.api_key['Bearer'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Bearer'] = 'Bearer'


# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.APIRequestLogsApi(api_client)
    method = 'method_example' # str | Only this HTTP method. (optional)
    path = 'path_example' # str | Only paths that contain this, e.g. `/ap1/document/`. (optional)
    is_test = True # bool | Live token only: `true` lists the calls made with your test keys instead of the live ones. A test token always sees only test-key calls. (optional)
    limit = 56 # int | How many results to return (default 10, at most 100). (optional)
    offset = 56 # int | How many results to skip. (optional)

    try:
        # Count your API calls per path
        api_response = api_instance.list_request_counts(method=method, path=path, is_test=is_test, limit=limit, offset=offset)
        print("The response of APIRequestLogsApi->list_request_counts:\n")
        pprint(api_response)
    except ApiException as e:
        print("Exception when calling APIRequestLogsApi->list_request_counts: %s\n" % e)

```

## Documentation for API Endpoints

All URIs are relative to *https://l0ads.signedly.com*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*APIRequestLogsApi* | [**list_request_counts**](docs/APIRequestLogsApi.md#list_request_counts) | **GET** /ap1/logs/hits/ | Count your API calls per path
*APIRequestLogsApi* | [**list_request_logs**](docs/APIRequestLogsApi.md#list_request_logs) | **GET** /ap1/logs/ | List your API calls
*AuthenticationApi* | [**get_access_token**](docs/AuthenticationApi.md#get_access_token) | **POST** /ap1/token/ | Get an access token
*AuthenticationApi* | [**refresh_access_token**](docs/AuthenticationApi.md#refresh_access_token) | **POST** /ap1/refreshtoken/ | Refresh the access token
*BulkSendingApi* | [**create_bulk_send**](docs/BulkSendingApi.md#create_bulk_send) | **POST** /ap1/bulk-sends/ | Send a template to many people
*BulkSendingApi* | [**get_bulk_send**](docs/BulkSendingApi.md#get_bulk_send) | **GET** /ap1/bulk-sends/{id}/ | Follow a bulk send
*BulkSendingApi* | [**list_bulk_send_columns**](docs/BulkSendingApi.md#list_bulk_send_columns) | **GET** /ap1/bulk-sends/columns/ | List the columns a template&#39;s bulk send needs
*DocumentsApi* | [**create_document_from_template**](docs/DocumentsApi.md#create_document_from_template) | **POST** /ap1/documents/fromtemplate/ | Make a document from a template
*DocumentsApi* | [**delete_document**](docs/DocumentsApi.md#delete_document) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document
*DocumentsApi* | [**get_download_status**](docs/DocumentsApi.md#get_download_status) | **GET** /ap1/documents-status/{id}/ | Check whether the signed PDF is ready
*DocumentsApi* | [**list_document_pages**](docs/DocumentsApi.md#list_document_pages) | **GET** /ap1/documents/{id}/pages/ | List a document&#39;s pages and their fields
*DocumentsApi* | [**list_document_statuses**](docs/DocumentsApi.md#list_document_statuses) | **GET** /ap1/documents-status-list/ | List the status of your organisation&#39;s documents
*DocumentsApi* | [**list_documents**](docs/DocumentsApi.md#list_documents) | **GET** /ap1/documents/ | List your organisation&#39;s documents
*DocumentsApi* | [**upload_document**](docs/DocumentsApi.md#upload_document) | **POST** /ap1/upload/ | Upload a document or template
*DocumentsApi* | [**upload_document_for_one_signer**](docs/DocumentsApi.md#upload_document_for_one_signer) | **POST** /ap1/upload_app/ | Upload a document for one signer and get their signing link
*DownloadsApi* | [**get_audit_trail_link**](docs/DownloadsApi.md#get_audit_trail_link) | **GET** /ap1/document/download-audit-link/ | Get a link to the audit trail
*DownloadsApi* | [**get_download_link**](docs/DownloadsApi.md#get_download_link) | **GET** /ap1/document/download-link/ | Get a link to the signed PDF
*DownloadsApi* | [**get_view_link**](docs/DownloadsApi.md#get_view_link) | **GET** /ap1/document/view-link/ | Get a link to view the document
*FieldsApi* | [**create_document_fields**](docs/FieldsApi.md#create_document_fields) | **POST** /ap1/documents/fields/ | Add fields to a document
*FieldsApi* | [**create_template_fields**](docs/FieldsApi.md#create_template_fields) | **POST** /ap1/templates/fields/ | Add fields to a template
*FieldsApi* | [**delete_field**](docs/FieldsApi.md#delete_field) | **DELETE** /ap1/documents/fields/{id}/ | Delete a field
*FieldsApi* | [**list_document_fields**](docs/FieldsApi.md#list_document_fields) | **GET** /ap1/documents/fields/ | List a document&#39;s fields
*FieldsApi* | [**list_template_fields**](docs/FieldsApi.md#list_template_fields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields
*FieldsApi* | [**update_document_field**](docs/FieldsApi.md#update_document_field) | **PUT** /ap1/documents/fields/{id}/ | Change a document&#39;s field
*FieldsApi* | [**update_document_field_by_body**](docs/FieldsApi.md#update_document_field_by_body) | **PUT** /ap1/documents/fields/ | Change a document&#39;s field (ID in the body)
*FieldsApi* | [**update_template_field**](docs/FieldsApi.md#update_template_field) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field
*SendingApi* | [**fill_and_send_document**](docs/SendingApi.md#fill_and_send_document) | **POST** /ap1/document/update_and_send/ | Fill in fields, add a signatory and send, in one call
*SendingApi* | [**send_document**](docs/SendingApi.md#send_document) | **POST** /ap1/document/send/ | Send a document for signing by email
*SendingApi* | [**send_document_by_link**](docs/SendingApi.md#send_document_by_link) | **POST** /ap1/document/send_url/ | Send a document and get the signing link
*SignatoriesApi* | [**create_signatories**](docs/SignatoriesApi.md#create_signatories) | **POST** /ap1/signatories/bulk/ | Add several signatories
*SignatoriesApi* | [**create_signatory**](docs/SignatoriesApi.md#create_signatory) | **POST** /ap1/signatories/ | Add a signatory
*SignatoriesApi* | [**delete_signatory**](docs/SignatoriesApi.md#delete_signatory) | **DELETE** /ap1/signatories/{id}/ | Remove a signatory
*SignatoriesApi* | [**list_signatories**](docs/SignatoriesApi.md#list_signatories) | **GET** /ap1/signatories/ | List a document&#39;s signatories
*TemplatesApi* | [**create_template_fields**](docs/TemplatesApi.md#create_template_fields) | **POST** /ap1/templates/fields/ | Add fields to a template
*TemplatesApi* | [**delete_document**](docs/TemplatesApi.md#delete_document) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document
*TemplatesApi* | [**list_template_fields**](docs/TemplatesApi.md#list_template_fields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields
*TemplatesApi* | [**list_templates**](docs/TemplatesApi.md#list_templates) | **GET** /ap1/templates/ | List your organisation&#39;s templates
*TemplatesApi* | [**update_template_field**](docs/TemplatesApi.md#update_template_field) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field
*WebhooksApi* | [**create_webhook_endpoint**](docs/WebhooksApi.md#create_webhook_endpoint) | **POST** /ap1/webhooks/ | Add a webhook endpoint
*WebhooksApi* | [**delete_webhook_endpoint**](docs/WebhooksApi.md#delete_webhook_endpoint) | **DELETE** /ap1/webhooks/{id}/ | Delete a webhook endpoint
*WebhooksApi* | [**get_webhook_endpoint**](docs/WebhooksApi.md#get_webhook_endpoint) | **GET** /ap1/webhooks/{id}/ | Get a webhook endpoint
*WebhooksApi* | [**list_webhook_deliveries**](docs/WebhooksApi.md#list_webhook_deliveries) | **GET** /ap1/webhooks/{id}/deliveries/ | List an endpoint&#39;s deliveries
*WebhooksApi* | [**list_webhook_endpoints**](docs/WebhooksApi.md#list_webhook_endpoints) | **GET** /ap1/webhooks/ | List your webhook endpoints
*WebhooksApi* | [**redeliver_webhook**](docs/WebhooksApi.md#redeliver_webhook) | **POST** /ap1/webhooks/deliveries/{id}/redeliver/ | Send a delivery again
*WebhooksApi* | [**rotate_webhook_secret**](docs/WebhooksApi.md#rotate_webhook_secret) | **POST** /ap1/webhooks/{id}/rotate-secret/ | Replace a webhook endpoint&#39;s secret
*WebhooksApi* | [**send_test_webhook**](docs/WebhooksApi.md#send_test_webhook) | **POST** /ap1/webhooks/{id}/test/ | Send a test event
*WebhooksApi* | [**update_webhook_endpoint**](docs/WebhooksApi.md#update_webhook_endpoint) | **PUT** /ap1/webhooks/{id}/ | Change or switch a webhook endpoint on or off


## Documentation For Models

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
 - [DeleteDocument204Response](docs/DeleteDocument204Response.md)
 - [DeleteFieldRequest](docs/DeleteFieldRequest.md)
 - [Document](docs/Document.md)
 - [DocumentPage](docs/DocumentPage.md)
 - [DocumentStatusPage](docs/DocumentStatusPage.md)
 - [DocumentStatusRow](docs/DocumentStatusRow.md)
 - [FillAndSendDocumentRequest](docs/FillAndSendDocumentRequest.md)
 - [FillAndSendDocumentRequestElementsInner](docs/FillAndSendDocumentRequestElementsInner.md)
 - [GetAccessTokenRequest](docs/GetAccessTokenRequest.md)
 - [GetAuditTrailLink200Response](docs/GetAuditTrailLink200Response.md)
 - [GetDownloadStatus200Response](docs/GetDownloadStatus200Response.md)
 - [ListBulkSendColumns200ResponseInner](docs/ListBulkSendColumns200ResponseInner.md)
 - [ModelField](docs/ModelField.md)
 - [Page](docs/Page.md)
 - [RefreshAccessToken200Response](docs/RefreshAccessToken200Response.md)
 - [RefreshAccessTokenRequest](docs/RefreshAccessTokenRequest.md)
 - [RequestCountPage](docs/RequestCountPage.md)
 - [RequestHit](docs/RequestHit.md)
 - [RequestLog](docs/RequestLog.md)
 - [RequestLogPage](docs/RequestLogPage.md)
 - [RotateWebhookSecretRequest](docs/RotateWebhookSecretRequest.md)
 - [SendDocument200Response](docs/SendDocument200Response.md)
 - [SendDocument200ResponseExistingSignatures](docs/SendDocument200ResponseExistingSignatures.md)
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
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="Bearer"></a>
### Bearer

- **Type**: API key
- **API key parameter name**: Authorization
- **Location**: HTTP header


## Author

support@signedly.com


