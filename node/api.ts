/* tslint:disable */
/* eslint-disable */
/**
 * Signedly API
 *  The Signedly REST API lets your system upload documents, add signatories and fields, send them for signing and download the signed result. Every path starts with `/ap1/`, and every request and response body is JSON unless an endpoint says otherwise (the uploads are `multipart/form-data`).  ## Authentication  1. In the Signedly web app, open **Account & Settings → API** and generate a    **client ID** and **client secret** for your organisation. 2. `POST /ap1/token/` with them. You get an `access_token` (valid **2 hours**) and    a `refresh_token` (valid **7 days**). While both are still valid, calling    `/ap1/token/` again returns the same pair. 3. Send the access token on every other call:    `Authorization: Bearer <access_token>`. 4. When the access token expires, `POST /ap1/refreshtoken/` with the refresh token    for a new access token. When the refresh token has expired too, call    `/ap1/token/` again.  `/ap1/token/` and `/ap1/refreshtoken/` allow 60 calls a minute per IP address; more answer 429. A missing, unknown or expired access token answers 403 (`\"Client not found\"` or `\"Access token expired\"`).  The API acts for your **organisation\'s admin account**: documents you upload belong to it and appear in its Signedly web app, and you can reach only that account\'s documents, templates, signatories and fields. Another organisation\'s IDs answer 404, as if they didn\'t exist.  ## Plans  What the API allows depends on the Signedly plan of your **organisation\'s admin account** (Account & Settings → Account & Plan). The same rules apply to live and test keys.  | What | Free | Personal Pro | Business Pro | Teams | |---|---|---|---|---| | Generate live and test keys (Account & Settings → API) | – | ✓ | ✓ | ✓ | | Every endpoint, `/ap1/token/` and `/ap1/refreshtoken/` included | – | ✓ | ✓ | ✓ | | `require_email_otp` on `POST /ap1/signatories/` and `POST /ap1/signatories/bulk/` | – | ✓ | ✓ | ✓ | | Bulk send: `GET /ap1/bulk-sends/columns/` and `POST /ap1/bulk-sends/` | – | – | – | ✓ |  The API is part of the paid plans. On Free (or with no plan) every call answers 403 `\"... Your plan doesn\'t include API access.\"`, with live or test keys, also with a token or keys made earlier; they work again once the plan is paid. On a paid plan, a feature it doesn\'t include answers 400 with `\"Your plan doesn\'t include ...\"` and changes nothing, and `GET /ap1/bulk-sends/{id}/` still reports bulk sends already made.  Live documents also need an API contract with Signedly. Without one, or with an unpaid API invoice, `POST /ap1/upload/` (except templates), `/ap1/upload_app/`, `/ap1/documents/fromtemplate/` and `/ap1/bulk-sends/` answer 402 with live keys. Test keys work without a contract (see Sandbox).  ## Sending a document for signing  1. `POST /ap1/upload/` a PDF or DOCX (`type` 2). The document is prepared in the    background: find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is    the upload\'s `id`), and wait until `GET /ap1/documents/{id}/pages/` lists its    pages. 2. `POST /ap1/signatories/` (one) or `POST /ap1/signatories/bulk/` (several) to    add the people who sign. 3. `POST /ap1/documents/fields/` to place the fields each signatory fills in. 4. Send it:    - `POST /ap1/document/send/` emails every signatory a signing link (with      ordered signing, only the first; each next one is emailed in      turn), or    - `POST /ap1/document/send_url/` sends no email and returns the first      signatory\'s signing link, for you to show or send yourself. 5. Poll `GET /ap1/documents-status-list/` (or `GET /ap1/documents/`) until the    status is 6 (Completed), then `GET /ap1/document/download-link/` for the    signed PDF and `GET /ap1/document/download-audit-link/` for its audit trail.  **From a template:** upload with `type` 4 and a `template_name` (or make the template in the web app), place its fields with `POST /ap1/templates/fields/`, then for each signing make a document with `POST /ap1/documents/fromtemplate/`, add its signatory, and send it.  **One signer, one call:** `POST /ap1/upload_app/` uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; the signer places their own signature. After signing they go to the `redirect_url` you sent, and the signed PDF and its audit trail are emailed to `final_email` (otherwise to your organisation\'s admin).  ## Quick start with curl  Each step uses an ID from the step before. `$API` is this server, e.g. `https://l0ads.signedly.com`.  ```bash # 1. Token curl -X POST $API/ap1/token/ -H \'Content-Type: application/json\' \\   -d \'{\"client_id\": \"<client id>\", \"client_secret\": \"<client secret>\"}\' TOKEN=<access_token from the answer>  # 2. Upload a PDF (answers with the upload\'s id) curl -X POST $API/ap1/upload/ -H \"Authorization: Bearer $TOKEN\" \\   -F file=@nda.pdf -F name=nda-ann-lee -F type=2  # 3. Find the document, then wait until it has pages curl \"$API/ap1/documents/?name=nda-ann-lee\" -H \"Authorization: Bearer $TOKEN\" DOC=<results[0].id> curl $API/ap1/documents/$DOC/pages/ -H \"Authorization: Bearer $TOKEN\" PAGE=<[0].id>  # 4. Add the signatory curl -X POST $API/ap1/signatories/ -H \"Authorization: Bearer $TOKEN\" \\   -H \'Content-Type: application/json\' \\   -d \'{\"document_id\": \"\'$DOC\'\", \"name\": \"Ann Lee\", \"email\": \"ann@example.com\"}\' SIGNER=<id from the answer>  # 5. Place her signature: 150 × 40 points, 72 points from the left, 640 from the top curl -X POST $API/ap1/documents/fields/ -H \"Authorization: Bearer $TOKEN\" \\   -H \'Content-Type: application/json\' \\   -d \'[{\"document_id\": \"\'$DOC\'\", \"signatory_id\": \"\'$SIGNER\'\", \"kind\": 2,         \"label\": \"Signature\", \"placeholder\": \"Sign here\", \"page\": \"\'$PAGE\'\",         \"page_number\": 0, \"x\": 72, \"y\": 640, \"width\": 150, \"height\": 40}]\'  # 6. Send it (Ann gets the signing email) curl -X POST $API/ap1/document/send/ -H \"Authorization: Bearer $TOKEN\" \\   -H \'Content-Type: application/json\' \\   -d \'{\"document_id\": \"\'$DOC\'\", \"subject\": \"Please sign the NDA\",        \"message\": \"Hi Ann, please sign by Friday.\", \"expiry_date\": \"2026-12-31\"}\'  # 7. Poll until status is 6 (Completed), then get the signed PDF curl \"$API/ap1/documents-status-list/?document_ids=$DOC\" -H \"Authorization: Bearer $TOKEN\" curl \"$API/ap1/document/download-link/?id=$DOC\" -H \"Authorization: Bearer $TOKEN\" ```  ## Postman  Import the whole API into Postman with **Import → Link** and `<this server>/swaggerap1/postman.json`. Set `client_id` and `client_secret` in the collection\'s **Variables**, run **Get an access token** (it saves the token for every other request), and set `document_id` when a request needs one.  ## Webhooks  Instead of polling, add an endpoint with `POST /ap1/webhooks/` (or in **Account & Settings → API**) and Signedly posts your organisation\'s document events to it: `document.sent`, `document.viewed`, `document.signed`, `document.approved`, `document.completed`, `document.rejected` and `document.expired` (all of them, or the `events` you choose). Each is a JSON `POST`:  ```json {\"id\": \"5b7f…\", \"type\": \"document.signed\", \"created_at\": \"2026-10-27T09:12:00+00:00\",  \"test\": false,  \"data\": {\"document\": {\"id\": \"6f0c…\", \"name\": \"nda.pdf\", \"status\": 5},           \"recipient\": {\"id\": \"0b6e…\", \"email\": \"ann@example.com\", \"name\": \"Ann Lee\",                         \"role\": \"signer\"}}} ```  `recipient` is null for events no recipient caused (sent, completed, expired); `test` is true for documents made with your test keys. Fetch anything else, such as download links, with your access token: events never carry links.  **Check every event is from Signedly.** The `Signedly-Signature` header is `t=<unix seconds>,v1=<signature>`, where the signature is the hex HMAC-SHA256 of `<t>.<raw body>` with the endpoint\'s secret. Refuse an event whose signature doesn\'t match or whose `t` is more than 5 minutes off:  ```python import hashlib, hmac, time  def is_from_signedly(secret, header, raw_body):     parts = dict(item.split(\"=\", 1) for item in header.split(\",\"))     signed = f\"{parts[\'t\']}.{raw_body.decode()}\".encode()     expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()     fresh = abs(time.time() - int(parts[\"t\"])) <= 300     return fresh and hmac.compare_digest(parts[\"v1\"], expected) ```  **Answer 2xx within 10 seconds**, then do the work. Anything else is retried after 1 and 5 minutes, then 30 minutes and 2, 5 and 10 hours (7 tries in about 18 hours). `Signedly-Event-Id` is the same on every try of an event: use it to ignore repeats. After 20 events in a row fail for good, Signedly switches the endpoint off and emails your organisation\'s admin; switch it on again with `PUT /ap1/webhooks/{id}/` and `\"is_active\": true`. Each endpoint\'s deliveries and their last answers are at `GET /ap1/webhooks/{id}/deliveries/`, and any can be sent again.  ## Sandbox  Build and test against the API without paying for documents: in **Account & Settings → API**, generate your **test keys**, and get a token with them at `/ap1/token/` as usual. Everything works the same, except that what you upload or make from a template with a test token is a **test document** (`is_test` on its upload):  - every page of its PDF and of its audit trail says **TEST – NOT LEGALLY BINDING**; - its emails are real, with `[TEST]` at the start of the subject; - it isn\'t billed or counted toward your plan; - your organisation can make 50 a calendar month (templates don\'t count); the next   upload answers 429.  ## Fields  Positions and sizes are in **PDF points** (1/72 inch), measured from the **top-left corner** of the page as it is displayed (rotation applied). `page_number` counts pages from 0. A field must sit wholly on its page (1 point of tolerance); otherwise it is refused with 400. A field\'s page and signatory can\'t be changed later: delete the field and add it again.  ## Status values  **Document `status`:** 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Signatories, fields and sends are only accepted while a document is 1–3 (not yet sent).  **Signatory `status`:** 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.  ## Lists  `GET /ap1/documents/`, `/ap1/documents-status-list/`, `/ap1/templates/`, `/ap1/logs/` and `/ap1/logs/hits/` are paged: pass `limit` (default 10) and `offset`, and read `count`, `next`, `previous` and `results` from the response.  ## Errors  | Status | Meaning | |---|---| | 400 | The request was refused, also when your plan doesn\'t include it (see Plans); the body says why (`{\"error\": \"...\"}`, or the name of each bad field with its messages). Nothing was changed. | | 403 | The access token is missing, unknown or expired; the client ID and secret or the refresh token were refused; the organisation\'s plan has no API access (Free, see Plans); or an `expiry_date` isn\'t in the future (`\"Invalid Date Entered\"`). | | 402 | No API contract, or an unpaid API invoice: live documents are refused (test keys keep working). | | 404 | The document, template, signatory or field doesn\'t exist or isn\'t yours. | | 429 | Too many token requests (wait a minute), or this month\'s 50 test documents are used. | | 5xx | Our side failed; retry later. |  A send that times out may still have worked: check the document\'s status before sending again (a second send of a sent document answers 400).  Download, view and audit links are valid for about 7 days; ask for a new one whenever you need it. 
 *
 * The version of the OpenAPI document: v1
 * Contact: info@signedly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface CreateBulkSend202Response
 */
export interface CreateBulkSend202Response {
    /**
     * Each document: id, status and its signatories\' email and status.
     * @type {Array<object>}
     * @memberof CreateBulkSend202Response
     */
    'documents'?: Array<object>;
    /**
     * Documents made and sent so far.
     * @type {number}
     * @memberof CreateBulkSend202Response
     */
    'documents_made'?: number;
    /**
     * Rows that couldn\'t be sent, with why.
     * @type {Array<object>}
     * @memberof CreateBulkSend202Response
     */
    'failed_rows'?: Array<object>;
    /**
     * The bulk send\'s ID.
     * @type {string}
     * @memberof CreateBulkSend202Response
     */
    'id'?: string;
    /**
     * Sent with test keys: its documents are test documents.
     * @type {boolean}
     * @memberof CreateBulkSend202Response
     */
    'is_test'?: boolean;
    /**
     * The day it was sent.
     * @type {string}
     * @memberof CreateBulkSend202Response
     */
    'sent_at'?: string;
    /**
     * 1 Created · 2 CSV Uploaded · 3 Sent · 4 Ready
     * @type {number}
     * @memberof CreateBulkSend202Response
     */
    'status'?: number;
    /**
     * Its template.
     * @type {string}
     * @memberof CreateBulkSend202Response
     */
    'template_id'?: string;
    /**
     * Rows in the file: one document each.
     * @type {number}
     * @memberof CreateBulkSend202Response
     */
    'total_documents'?: number;
}
/**
 * 
 * @export
 * @interface CreateBulkSendRequest
 */
export interface CreateBulkSendRequest {
    /**
     * The last day the document can be signed, YYYY-MM-DD; it must be in the future.
     * @type {string}
     * @memberof CreateBulkSendRequest
     */
    'expiry_date': string;
    /**
     * Where signers go after signing.
     * @type {string}
     * @memberof CreateBulkSendRequest
     */
    'finish_redirect_url'?: string;
    /**
     * The emails\' message; may use {{column}} tags.
     * @type {string}
     * @memberof CreateBulkSendRequest
     */
    'message'?: string;
    /**
     * Where signers go after declining.
     * @type {string}
     * @memberof CreateBulkSendRequest
     */
    'reject_redirect_url'?: string;
    /**
     * Instead of `file`: one object per document, {column: value}.
     * @type {Array<{ [key: string]: any; }>}
     * @memberof CreateBulkSendRequest
     */
    'rows'?: Array<{ [key: string]: any; }>;
    /**
     * The emails\' subject; may use {{column}} tags.
     * @type {string}
     * @memberof CreateBulkSendRequest
     */
    'subject': string;
    /**
     * The template\'s ID.
     * @type {string}
     * @memberof CreateBulkSendRequest
     */
    'template_id': string;
}
/**
 * 
 * @export
 * @interface CreateDocumentFieldsRequestInner
 */
export interface CreateDocumentFieldsRequestInner {
    /**
     * Text: 0 Left · 1 Center · 2 Right.
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'align'?: number;
    /**
     * Checkbox: true starts it ticked.
     * @type {boolean}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'checked'?: boolean;
    /**
     * Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy.
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'date_format'?: number;
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'document_id': string;
    /**
     * Text, Date and Dropdown: the font.
     * @type {string}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'font'?: CreateDocumentFieldsRequestInnerFontEnum;
    /**
     * Text and Dropdown: the font size in points. Date fields always use 10.
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'font_size'?: number;
    /**
     * Text field: makes it a calculated field, worked out when the document is sent from other fields by their labels in brackets, e.g. `round([CTC] * 40%)` or `if([Grade] = \"A\", 50000, 20000)`. Refused if a name is unknown or the formulas loop.
     * @type {string}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'formula'?: string;
    /**
     * Radio: required; the name of the option group.
     * @type {string}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'group_name'?: string;
    /**
     * In PDF points (1/72 inch), whole: the field\'s height (each option\'s, for Radio).
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'height': number;
    /**
     * Text: true lets the signer type several lines.
     * @type {boolean}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'is_multi_line'?: boolean;
    /**
     * False lets the signer leave it empty.
     * @type {boolean}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'is_required'?: boolean;
    /**
     * Radio: required; the options, at least two, each `width` x `height`. `selected` 1 starts that option chosen.
     * @type {Array<UpdateDocumentFieldByBodyRequestItemsInner>}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'items'?: Array<UpdateDocumentFieldByBodyRequestItemsInner>;
    /**
     * The field\'s type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp.
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'kind': number;
    /**
     * The field\'s name, shown to the signer.
     * @type {string}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'label': string;
    /**
     * Text: the most characters the signer may type (1–550).
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'max_length'?: number;
    /**
     * How a calculated number is shown, e.g. {\"kind\": \"number\", \"style\": \"indian\", \"decimals\": 2} or {\"kind\": \"words\", \"currency\": \"INR\"}.
     * @type {object}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'number_format'?: object;
    /**
     * The ID of the page the field is on (GET /ap1/documents/{id}/pages/).
     * @type {string}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'page': string;
    /**
     * That page\'s number, counting from 0 (the first page is 0).
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'page_number': number;
    /**
     * Hint text shown while the field is empty. Send an empty string for Checkbox and Radio.
     * @type {string}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'placeholder': string;
    /**
     * Dropdown: required; the choices the signer picks from, at least one (up to 100 characters each).
     * @type {Array<string>}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'select_options'?: Array<string>;
    /**
     * The signatory who fills in this field (from GET /ap1/signatories/).
     * @type {string}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'signatory_id': string;
    /**
     * Checkbox and Radio: the side of the tick or dot in points, centred in the box. Defaults to the box\'s smaller side.
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'size'?: number;
    /**
     * Shown when the signer points at the field. Defaults to the label.
     * @type {string}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'tool_tip'?: string;
    /**
     * In PDF points (1/72 inch): the field\'s width (each option\'s, for Radio). The field must fit on its page.
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'width': number;
    /**
     * In PDF points (1/72 inch): from the page\'s left edge to the field\'s left edge. Required for every type but Radio (whose options have their own).
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'x'?: number;
    /**
     * In PDF points (1/72 inch): from the page\'s top edge to the field\'s top edge. Required for every type but Radio.
     * @type {number}
     * @memberof CreateDocumentFieldsRequestInner
     */
    'y'?: number;
}

export const CreateDocumentFieldsRequestInnerFontEnum = {
    Roboto: 'Roboto',
    OpenSans: 'Open Sans',
    Lato: 'Lato',
    Inter: 'Inter'
} as const;

export type CreateDocumentFieldsRequestInnerFontEnum = typeof CreateDocumentFieldsRequestInnerFontEnum[keyof typeof CreateDocumentFieldsRequestInnerFontEnum];

/**
 * 
 * @export
 * @interface CreateDocumentFromTemplate200Response
 */
export interface CreateDocumentFromTemplate200Response {
    /**
     * When it was made.
     * @type {string}
     * @memberof CreateDocumentFromTemplate200Response
     */
    'created_at'?: string;
    /**
     * The new document\'s ID.
     * @type {string}
     * @memberof CreateDocumentFromTemplate200Response
     */
    'id'?: string;
    /**
     * The file type, e.g. `application/pdf`.
     * @type {string}
     * @memberof CreateDocumentFromTemplate200Response
     */
    'mimetype'?: string;
    /**
     * Its name.
     * @type {string}
     * @memberof CreateDocumentFromTemplate200Response
     */
    'name'?: string;
    /**
     * Its status: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired.
     * @type {number}
     * @memberof CreateDocumentFromTemplate200Response
     */
    'status'?: number;
    /**
     * Always 2 (Document).
     * @type {number}
     * @memberof CreateDocumentFromTemplate200Response
     */
    'type'?: number;
    /**
     * When it last changed.
     * @type {string}
     * @memberof CreateDocumentFromTemplate200Response
     */
    'updated_at'?: string;
}
/**
 * 
 * @export
 * @interface CreateDocumentFromTemplateRequest
 */
export interface CreateDocumentFromTemplateRequest {
    [key: string]: string | any;

    /**
     * The new document\'s name. It must differ from every other upload of this API client.
     * @type {string}
     * @memberof CreateDocumentFromTemplateRequest
     */
    'name': string;
    /**
     * Who fills each open role, by the role\'s name (as in the template, e.g. \"Employee\"): every open role exactly once.
     * @type {Array<CreateDocumentFromTemplateRequestRecipientsInner>}
     * @memberof CreateDocumentFromTemplateRequest
     */
    'recipients'?: Array<CreateDocumentFromTemplateRequestRecipientsInner>;
    /**
     * True: recipients sign one after another in the roles\' order; false: all at once. Leave out for the template\'s setting.
     * @type {boolean}
     * @memberof CreateDocumentFromTemplateRequest
     */
    'signing_order'?: boolean;
    /**
     * The template\'s ID.
     * @type {string}
     * @memberof CreateDocumentFromTemplateRequest
     */
    'template_id': string;
}
/**
 * 
 * @export
 * @interface CreateDocumentFromTemplateRequestRecipientsInner
 */
export interface CreateDocumentFromTemplateRequestRecipientsInner {
    /**
     * Their email address.
     * @type {string}
     * @memberof CreateDocumentFromTemplateRequestRecipientsInner
     */
    'email': string;
    /**
     * The person\'s name.
     * @type {string}
     * @memberof CreateDocumentFromTemplateRequestRecipientsInner
     */
    'name': string;
    /**
     * The template role\'s name.
     * @type {string}
     * @memberof CreateDocumentFromTemplateRequestRecipientsInner
     */
    'role': string;
}
/**
 * 
 * @export
 * @interface CreateSignatoriesRequest
 */
export interface CreateSignatoriesRequest {
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof CreateSignatoriesRequest
     */
    'document_id': string;
    /**
     * True: they sign one after another, in this order, each emailed when it is their turn. False (the default): all are emailed at once.
     * @type {boolean}
     * @memberof CreateSignatoriesRequest
     */
    'is_ordered_signing'?: boolean;
    /**
     * The signatories, at least one.
     * @type {Array<CreateSignatoriesRequestSignatoriesInner>}
     * @memberof CreateSignatoriesRequest
     */
    'signatories': Array<CreateSignatoriesRequestSignatoriesInner>;
}
/**
 * 
 * @export
 * @interface CreateSignatoriesRequestSignatoriesInner
 */
export interface CreateSignatoriesRequestSignatoriesInner {
    /**
     * The signatory\'s email address.
     * @type {string}
     * @memberof CreateSignatoriesRequestSignatoriesInner
     */
    'email': string;
    /**
     * The signatory\'s name.
     * @type {string}
     * @memberof CreateSignatoriesRequestSignatoriesInner
     */
    'name': string;
    /**
     * True: whenever they open their signing link, a one-time code is e-mailed to them first (needs Personal Pro, Business Pro or Teams; see Plans).
     * @type {boolean}
     * @memberof CreateSignatoriesRequestSignatoriesInner
     */
    'require_email_otp'?: boolean;
}
/**
 * 
 * @export
 * @interface CreateSignatoryRequest
 */
export interface CreateSignatoryRequest {
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof CreateSignatoryRequest
     */
    'document_id': string;
    /**
     * The signatory\'s email address; the signing link goes there.
     * @type {string}
     * @memberof CreateSignatoryRequest
     */
    'email': string;
    /**
     * The signatory\'s name.
     * @type {string}
     * @memberof CreateSignatoryRequest
     */
    'name': string;
    /**
     * True: whenever they open their signing link, a one-time code is e-mailed to them first (needs Personal Pro, Business Pro or Teams; see Plans).
     * @type {boolean}
     * @memberof CreateSignatoryRequest
     */
    'require_email_otp'?: boolean;
}
/**
 * 
 * @export
 * @interface CreateTemplateFieldsRequestInner
 */
export interface CreateTemplateFieldsRequestInner {
    /**
     * Text: 0 Left · 1 Center · 2 Right.
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'align'?: number;
    /**
     * Checkbox: true starts it ticked.
     * @type {boolean}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'checked'?: boolean;
    /**
     * Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy.
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'date_format'?: number;
    /**
     * The template\'s ID.
     * @type {string}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'document_id': string;
    /**
     * Text, Date and Dropdown: the font.
     * @type {string}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'font'?: CreateTemplateFieldsRequestInnerFontEnum;
    /**
     * Text and Dropdown: the font size in points. Date fields always use 10.
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'font_size'?: number;
    /**
     * Text field: makes it a calculated field, worked out when the document is sent from other fields by their labels in brackets, e.g. `round([CTC] * 40%)` or `if([Grade] = \"A\", 50000, 20000)`. Refused if a name is unknown or the formulas loop.
     * @type {string}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'formula'?: string;
    /**
     * Radio: required; the name of the option group.
     * @type {string}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'group_name'?: string;
    /**
     * In PDF points (1/72 inch), whole: the field\'s height (each option\'s, for Radio).
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'height': number;
    /**
     * Text: true lets the signer type several lines.
     * @type {boolean}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'is_multi_line'?: boolean;
    /**
     * False lets the signer leave it empty.
     * @type {boolean}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'is_required'?: boolean;
    /**
     * Radio: required; the options, at least two, each `width` x `height`. `selected` 1 starts that option chosen.
     * @type {Array<UpdateDocumentFieldByBodyRequestItemsInner>}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'items'?: Array<UpdateDocumentFieldByBodyRequestItemsInner>;
    /**
     * The field\'s type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp.
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'kind': number;
    /**
     * The field\'s name, shown to the signer.
     * @type {string}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'label': string;
    /**
     * Text: the most characters the signer may type (1–550).
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'max_length'?: number;
    /**
     * How a calculated number is shown, e.g. {\"kind\": \"number\", \"style\": \"indian\", \"decimals\": 2} or {\"kind\": \"words\", \"currency\": \"INR\"}.
     * @type {object}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'number_format'?: object;
    /**
     * The ID of the page the field is on (GET /ap1/documents/{id}/pages/).
     * @type {string}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'page': string;
    /**
     * That page\'s number, counting from 0 (the first page is 0).
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'page_number': number;
    /**
     * Hint text shown while the field is empty. Send an empty string for Checkbox and Radio.
     * @type {string}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'placeholder': string;
    /**
     * True: the signer can\'t change the field\'s value.
     * @type {boolean}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'readonly'?: boolean;
    /**
     * Dropdown: required; the choices the signer picks from, at least one (up to 100 characters each).
     * @type {Array<string>}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'select_options'?: Array<string>;
    /**
     * Checkbox and Radio: the side of the tick or dot in points, centred in the box. Defaults to the box\'s smaller side.
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'size'?: number;
    /**
     * Shown when the signer points at the field. Defaults to the label.
     * @type {string}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'tool_tip'?: string;
    /**
     * In PDF points (1/72 inch): the field\'s width (each option\'s, for Radio). The field must fit on its page.
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'width': number;
    /**
     * In PDF points (1/72 inch): from the page\'s left edge to the field\'s left edge. Required for every type but Radio (whose options have their own).
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'x'?: number;
    /**
     * In PDF points (1/72 inch): from the page\'s top edge to the field\'s top edge. Required for every type but Radio.
     * @type {number}
     * @memberof CreateTemplateFieldsRequestInner
     */
    'y'?: number;
}

export const CreateTemplateFieldsRequestInnerFontEnum = {
    Roboto: 'Roboto',
    OpenSans: 'Open Sans',
    Lato: 'Lato',
    Inter: 'Inter'
} as const;

export type CreateTemplateFieldsRequestInnerFontEnum = typeof CreateTemplateFieldsRequestInnerFontEnum[keyof typeof CreateTemplateFieldsRequestInnerFontEnum];

/**
 * 
 * @export
 * @interface CreateWebhookEndpointRequest
 */
export interface CreateWebhookEndpointRequest {
    /**
     * Your note about it (up to 200 characters).
     * @type {string}
     * @memberof CreateWebhookEndpointRequest
     */
    'description'?: string;
    /**
     * The event types to send; leave out for all: `document.approved`, `document.completed`, `document.expired`, `document.rejected`, `document.sent`, `document.signed`, `document.viewed`.
     * @type {Array<string>}
     * @memberof CreateWebhookEndpointRequest
     */
    'events'?: Array<CreateWebhookEndpointRequestEventsEnum>;
    /**
     * Where to post events: https://, on a public internet address. Redirects aren\'t followed.
     * @type {string}
     * @memberof CreateWebhookEndpointRequest
     */
    'url': string;
}

export const CreateWebhookEndpointRequestEventsEnum = {
    Approved: 'document.approved',
    Completed: 'document.completed',
    Expired: 'document.expired',
    Rejected: 'document.rejected',
    Sent: 'document.sent',
    Signed: 'document.signed',
    Viewed: 'document.viewed'
} as const;

export type CreateWebhookEndpointRequestEventsEnum = typeof CreateWebhookEndpointRequestEventsEnum[keyof typeof CreateWebhookEndpointRequestEventsEnum];

/**
 * 
 * @export
 * @interface DeleteFieldRequest
 */
export interface DeleteFieldRequest {
    /**
     * The ID of the document (or template) the item is on.
     * @type {string}
     * @memberof DeleteFieldRequest
     */
    'document_id': string;
}
/**
 * 
 * @export
 * @interface Document
 */
export interface Document {
    /**
     * When it was made.
     * @type {string}
     * @memberof Document
     */
    'created_at'?: string;
    /**
     * The document\'s name.
     * @type {string}
     * @memberof Document
     */
    'document_name'?: string;
    /**
     * The last day it can be signed, or null.
     * @type {string}
     * @memberof Document
     */
    'expired_at'?: string | null;
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof Document
     */
    'id'?: string;
    /**
     * True for a copy made by a bulk send.
     * @type {boolean}
     * @memberof Document
     */
    'is_bulk_signing'?: boolean;
    /**
     * Always false here.
     * @type {boolean}
     * @memberof Document
     */
    'is_template'?: boolean;
    /**
     * The signing email\'s message, once sent.
     * @type {string}
     * @memberof Document
     */
    'message'?: string | null;
    /**
     * Its pages, each with its fields.
     * @type {Array<Page>}
     * @memberof Document
     */
    'pages'?: Array<Page>;
    /**
     * When it was sent, or null.
     * @type {string}
     * @memberof Document
     */
    'sent_at'?: string | null;
    /**
     * Who signs it.
     * @type {Array<Signatory>}
     * @memberof Document
     */
    'signatories'?: Array<Signatory>;
    /**
     * 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired
     * @type {number}
     * @memberof Document
     */
    'status'?: number;
    /**
     * The signing email\'s subject, once sent.
     * @type {string}
     * @memberof Document
     */
    'subject'?: string;
    /**
     * When it last changed.
     * @type {string}
     * @memberof Document
     */
    'updated_at'?: string;
    /**
     * 
     * @type {Upload}
     * @memberof Document
     */
    'upload'?: Upload;
}
/**
 * 
 * @export
 * @interface DocumentPage
 */
export interface DocumentPage {
    /**
     * How many results in all.
     * @type {number}
     * @memberof DocumentPage
     */
    'count': number;
    /**
     * The next page, or null.
     * @type {string}
     * @memberof DocumentPage
     */
    'next': string | null;
    /**
     * The previous page, or null.
     * @type {string}
     * @memberof DocumentPage
     */
    'previous': string | null;
    /**
     * 
     * @type {Array<Document>}
     * @memberof DocumentPage
     */
    'results': Array<Document>;
}
/**
 * 
 * @export
 * @interface DocumentStatusPage
 */
export interface DocumentStatusPage {
    /**
     * How many results in all.
     * @type {number}
     * @memberof DocumentStatusPage
     */
    'count': number;
    /**
     * The next page, or null.
     * @type {string}
     * @memberof DocumentStatusPage
     */
    'next': string | null;
    /**
     * The previous page, or null.
     * @type {string}
     * @memberof DocumentStatusPage
     */
    'previous': string | null;
    /**
     * 
     * @type {Array<DocumentStatusRow>}
     * @memberof DocumentStatusPage
     */
    'results': Array<DocumentStatusRow>;
}
/**
 * 
 * @export
 * @interface DocumentStatusRow
 */
export interface DocumentStatusRow {
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof DocumentStatusRow
     */
    'id': string;
    /**
     * 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired
     * @type {number}
     * @memberof DocumentStatusRow
     */
    'status': number;
}
/**
 * 
 * @export
 * @interface Field
 */
export interface Field {
    /**
     * Text: 0 Left · 1 Center · 2 Right.
     * @type {number}
     * @memberof Field
     */
    'align'?: number;
    /**
     * Checkbox: ticked or not.
     * @type {boolean}
     * @memberof Field
     */
    'checked'?: boolean;
    /**
     * When the field was added.
     * @type {string}
     * @memberof Field
     */
    'created_at'?: string;
    /**
     * Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy.
     * @type {number}
     * @memberof Field
     */
    'date_format'?: number;
    /**
     * Text, Date and Dropdown: the font.
     * @type {string}
     * @memberof Field
     */
    'font'?: string;
    /**
     * Text and Dropdown: the font size in points (Date: 10).
     * @type {number}
     * @memberof Field
     */
    'font_size'?: number;
    /**
     * A calculated field\'s formula, or null.
     * @type {string}
     * @memberof Field
     */
    'formula'?: string | null;
    /**
     * Radio: the option group\'s name.
     * @type {string}
     * @memberof Field
     */
    'group_name'?: string | null;
    /**
     * In PDF points (1/72 inch): the field\'s height.
     * @type {number}
     * @memberof Field
     */
    'height'?: number;
    /**
     * The field\'s ID.
     * @type {string}
     * @memberof Field
     */
    'id'?: string;
    /**
     * Text: the signer may type several lines.
     * @type {boolean}
     * @memberof Field
     */
    'is_multi_line'?: boolean;
    /**
     * False: the signer may leave it empty.
     * @type {boolean}
     * @memberof Field
     */
    'is_required'?: boolean;
    /**
     * Radio: the options, each `{x, y, selected}`.
     * @type {Array<object>}
     * @memberof Field
     */
    'items'?: Array<object>;
    /**
     * The field\'s type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp.
     * @type {number}
     * @memberof Field
     */
    'kind'?: number;
    /**
     * The field\'s name, shown to the signer.
     * @type {string}
     * @memberof Field
     */
    'label'?: string | null;
    /**
     * Text: the most characters the signer may type.
     * @type {number}
     * @memberof Field
     */
    'max_length'?: number | null;
    /**
     * How a calculated number is shown, or null.
     * @type {object}
     * @memberof Field
     */
    'number_format'?: object | null;
    /**
     * The ID of the page the field is on.
     * @type {string}
     * @memberof Field
     */
    'page'?: string;
    /**
     * That page\'s number, counting from 0.
     * @type {number}
     * @memberof Field
     */
    'page_number'?: number;
    /**
     * Hint text shown while the field is empty.
     * @type {string}
     * @memberof Field
     */
    'placeholder'?: string | null;
    /**
     * Dropdown: the choices the signer picks from.
     * @type {Array<string>}
     * @memberof Field
     */
    'select_options'?: Array<string>;
    /**
     * The ID of the signatory who fills it in.
     * @type {string}
     * @memberof Field
     */
    'signatory_id'?: string;
    /**
     * Checkbox and Radio: the side of the tick or dot in points.
     * @type {number}
     * @memberof Field
     */
    'size'?: number;
    /**
     * Shown when the signer points at the field.
     * @type {string}
     * @memberof Field
     */
    'tool_tip'?: string | null;
    /**
     * When the field last changed.
     * @type {string}
     * @memberof Field
     */
    'updated_at'?: string;
    /**
     * The field\'s current value.
     * @type {string}
     * @memberof Field
     */
    'value'?: string | null;
    /**
     * In PDF points (1/72 inch): the field\'s width.
     * @type {number}
     * @memberof Field
     */
    'width'?: number;
    /**
     * In PDF points (1/72 inch): from the page\'s left edge to the field\'s left edge.
     * @type {number}
     * @memberof Field
     */
    'x'?: number | null;
    /**
     * In PDF points (1/72 inch): from the page\'s top edge to the field\'s top edge.
     * @type {number}
     * @memberof Field
     */
    'y'?: number | null;
}
/**
 * 
 * @export
 * @interface FillAndSendDocumentRequest
 */
export interface FillAndSendDocumentRequest {
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof FillAndSendDocumentRequest
     */
    'document_id': string;
    /**
     * The fields to change; the others keep their values.
     * @type {Array<FillAndSendDocumentRequestElementsInner>}
     * @memberof FillAndSendDocumentRequest
     */
    'elements'?: Array<FillAndSendDocumentRequestElementsInner>;
    /**
     * The signatory\'s email address.
     * @type {string}
     * @memberof FillAndSendDocumentRequest
     */
    'email': string;
    /**
     * The last day the document can be signed, YYYY-MM-DD; it must be in the future.
     * @type {string}
     * @memberof FillAndSendDocumentRequest
     */
    'expiry_date': string;
    /**
     * The email\'s message; may be empty (\"\"), not null.
     * @type {string}
     * @memberof FillAndSendDocumentRequest
     */
    'message': string;
    /**
     * The signatory\'s name.
     * @type {string}
     * @memberof FillAndSendDocumentRequest
     */
    'name': string;
    /**
     * One more reminder this many days before the deadline (2–30); 0 is off. Every signatory still waiting is also reminded the day before it.
     * @type {number}
     * @memberof FillAndSendDocumentRequest
     */
    'reminder_before_expiry_days'?: number;
    /**
     * Automatic reminders: email each signatory who hasn\'t signed yet every this many days (1–30) after they were asked; 0 is off. Left out, your organisation\'s default applies (off unless set in the web app).
     * @type {number}
     * @memberof FillAndSendDocumentRequest
     */
    'reminder_every_days'?: number;
    /**
     * At most this many automatic reminders per signatory (1–10; 3 if left out while `reminder_every_days` is on).
     * @type {number}
     * @memberof FillAndSendDocumentRequest
     */
    'reminder_max'?: number;
    /**
     * The email\'s subject.
     * @type {string}
     * @memberof FillAndSendDocumentRequest
     */
    'subject': string;
}
/**
 * 
 * @export
 * @interface FillAndSendDocumentRequestElementsInner
 */
export interface FillAndSendDocumentRequestElementsInner {
    /**
     * Checkbox: ticked or not.
     * @type {boolean}
     * @memberof FillAndSendDocumentRequestElementsInner
     */
    'checked'?: boolean;
    /**
     * The field\'s ID.
     * @type {string}
     * @memberof FillAndSendDocumentRequestElementsInner
     */
    'id': string;
    /**
     * Optional: the field\'s page (one of this document\'s).
     * @type {string}
     * @memberof FillAndSendDocumentRequestElementsInner
     */
    'page'?: string;
    /**
     * Optional: the field\'s signatory (one of this document\'s).
     * @type {string}
     * @memberof FillAndSendDocumentRequestElementsInner
     */
    'signee'?: string;
    /**
     * The field\'s value.
     * @type {string}
     * @memberof FillAndSendDocumentRequestElementsInner
     */
    'value'?: string;
}
/**
 * 
 * @export
 * @interface GetAccessTokenRequest
 */
export interface GetAccessTokenRequest {
    /**
     * Your client ID.
     * @type {string}
     * @memberof GetAccessTokenRequest
     */
    'client_id': string;
    /**
     * Your client secret.
     * @type {string}
     * @memberof GetAccessTokenRequest
     */
    'client_secret': string;
}
/**
 * 
 * @export
 * @interface GetAuditTrailLink200Response
 */
export interface GetAuditTrailLink200Response {
    /**
     * A link to the PDF, valid for about 7 days.
     * @type {string}
     * @memberof GetAuditTrailLink200Response
     */
    'url'?: string;
}
/**
 * 
 * @export
 * @interface GetDownloadStatus200Response
 */
export interface GetDownloadStatus200Response {
    /**
     * True once GET /ap1/document/download-link/ gives the signed PDF.
     * @type {boolean}
     * @memberof GetDownloadStatus200Response
     */
    'download_status'?: boolean;
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof GetDownloadStatus200Response
     */
    'id'?: string;
}
/**
 * 
 * @export
 * @interface ListBulkSendColumns200ResponseInner
 */
export interface ListBulkSendColumns200ResponseInner {
    /**
     * The header to use.
     * @type {string}
     * @memberof ListBulkSendColumns200ResponseInner
     */
    'column'?: string;
    /**
     * An example value.
     * @type {string}
     * @memberof ListBulkSendColumns200ResponseInner
     */
    'example'?: string;
    /**
     * What to put in it.
     * @type {string}
     * @memberof ListBulkSendColumns200ResponseInner
     */
    'hint'?: string;
}
/**
 * 
 * @export
 * @interface Page
 */
export interface Page {
    /**
     * The fields on the page.
     * @type {Array<Field>}
     * @memberof Page
     */
    'fields'?: Array<Field>;
    /**
     * The page\'s ID; use it as a field\'s `page`.
     * @type {string}
     * @memberof Page
     */
    'id'?: string;
    /**
     * The page\'s number, counting from 0.
     * @type {number}
     * @memberof Page
     */
    'page_number'?: number;
}
/**
 * 
 * @export
 * @interface RefreshAccessToken200Response
 */
export interface RefreshAccessToken200Response {
    /**
     * Send as `Authorization: Bearer <access_token>`.
     * @type {string}
     * @memberof RefreshAccessToken200Response
     */
    'access_token'?: string;
    /**
     * True once a call was made with the expired token.
     * @type {boolean}
     * @memberof RefreshAccessToken200Response
     */
    'expired'?: boolean;
    /**
     * When the access token expires (2 hours after it was made).
     * @type {string}
     * @memberof RefreshAccessToken200Response
     */
    'expiry_date'?: string;
    /**
     * Gets a new access token at /ap1/refreshtoken/.
     * @type {string}
     * @memberof RefreshAccessToken200Response
     */
    'refresh_token'?: string;
    /**
     * When the refresh token expires (7 days after it was made).
     * @type {string}
     * @memberof RefreshAccessToken200Response
     */
    'refresh_token_expiry_date'?: string;
    /**
     * When the tokens last changed.
     * @type {string}
     * @memberof RefreshAccessToken200Response
     */
    'updated_at'?: string;
}
/**
 * 
 * @export
 * @interface RefreshAccessTokenRequest
 */
export interface RefreshAccessTokenRequest {
    /**
     * The refresh token from /ap1/token/.
     * @type {string}
     * @memberof RefreshAccessTokenRequest
     */
    'refresh_token': string;
}
/**
 * 
 * @export
 * @interface RequestCountPage
 */
export interface RequestCountPage {
    /**
     * How many results in all.
     * @type {number}
     * @memberof RequestCountPage
     */
    'count': number;
    /**
     * The next page, or null.
     * @type {string}
     * @memberof RequestCountPage
     */
    'next': string | null;
    /**
     * The previous page, or null.
     * @type {string}
     * @memberof RequestCountPage
     */
    'previous': string | null;
    /**
     * 
     * @type {Array<RequestHit>}
     * @memberof RequestCountPage
     */
    'results': Array<RequestHit>;
}
/**
 * 
 * @export
 * @interface RequestHit
 */
export interface RequestHit {
    /**
     * The HTTP method.
     * @type {string}
     * @memberof RequestHit
     */
    'method'?: string;
    /**
     * The path called.
     * @type {string}
     * @memberof RequestHit
     */
    'path'?: string;
    /**
     * How many calls this client has made to it.
     * @type {number}
     * @memberof RequestHit
     */
    'total_hits'?: number;
}
/**
 * 
 * @export
 * @interface RequestLog
 */
export interface RequestLog {
    /**
     * The request\'s body, credentials redacted.
     * @type {string}
     * @memberof RequestLog
     */
    'body'?: string;
    /**
     * When the call was made.
     * @type {string}
     * @memberof RequestLog
     */
    'created_at'?: string;
    /**
     * The request\'s headers, credentials redacted.
     * @type {string}
     * @memberof RequestLog
     */
    'headers'?: string;
    /**
     * The call\'s ID.
     * @type {string}
     * @memberof RequestLog
     */
    'id'?: string;
    /**
     * The caller\'s IP address.
     * @type {string}
     * @memberof RequestLog
     */
    'ip_address'?: string;
    /**
     * The HTTP method.
     * @type {string}
     * @memberof RequestLog
     */
    'method'?: string;
    /**
     * The path called.
     * @type {string}
     * @memberof RequestLog
     */
    'path'?: string;
    /**
     * The query parameters.
     * @type {string}
     * @memberof RequestLog
     */
    'query_params'?: string;
}
/**
 * 
 * @export
 * @interface RequestLogPage
 */
export interface RequestLogPage {
    /**
     * How many results in all.
     * @type {number}
     * @memberof RequestLogPage
     */
    'count': number;
    /**
     * The next page, or null.
     * @type {string}
     * @memberof RequestLogPage
     */
    'next': string | null;
    /**
     * The previous page, or null.
     * @type {string}
     * @memberof RequestLogPage
     */
    'previous': string | null;
    /**
     * 
     * @type {Array<RequestLog>}
     * @memberof RequestLogPage
     */
    'results': Array<RequestLog>;
}
/**
 * 
 * @export
 * @interface SendDocument200Response
 */
export interface SendDocument200Response {
    /**
     * What was done.
     * @type {string}
     * @memberof SendDocument200Response
     */
    'detail'?: string;
}
/**
 * 
 * @export
 * @interface SendDocumentByLink200Response
 */
export interface SendDocumentByLink200Response {
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof SendDocumentByLink200Response
     */
    'document_id'?: string;
    /**
     * The signatory\'s signing link.
     * @type {string}
     * @memberof SendDocumentByLink200Response
     */
    'url'?: string;
}
/**
 * 
 * @export
 * @interface SendDocumentByLinkRequest
 */
export interface SendDocumentByLinkRequest {
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof SendDocumentByLinkRequest
     */
    'document_id': string;
    /**
     * The last day the document can be signed, YYYY-MM-DD; it must be in the future.
     * @type {string}
     * @memberof SendDocumentByLinkRequest
     */
    'expiry_date': string;
}
/**
 * 
 * @export
 * @interface SendDocumentRequest
 */
export interface SendDocumentRequest {
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof SendDocumentRequest
     */
    'document_id': string;
    /**
     * The last day the document can be signed, YYYY-MM-DD; it must be in the future.
     * @type {string}
     * @memberof SendDocumentRequest
     */
    'expiry_date': string;
    /**
     * The email\'s message; may be empty (\"\"), not null.
     * @type {string}
     * @memberof SendDocumentRequest
     */
    'message': string;
    /**
     * One more reminder this many days before the deadline (2–30); 0 is off. Every signatory still waiting is also reminded the day before it.
     * @type {number}
     * @memberof SendDocumentRequest
     */
    'reminder_before_expiry_days'?: number;
    /**
     * Automatic reminders: email each signatory who hasn\'t signed yet every this many days (1–30) after they were asked; 0 is off. Left out, your organisation\'s default applies (off unless set in the web app).
     * @type {number}
     * @memberof SendDocumentRequest
     */
    'reminder_every_days'?: number;
    /**
     * At most this many automatic reminders per signatory (1–10; 3 if left out while `reminder_every_days` is on).
     * @type {number}
     * @memberof SendDocumentRequest
     */
    'reminder_max'?: number;
    /**
     * The email\'s subject.
     * @type {string}
     * @memberof SendDocumentRequest
     */
    'subject': string;
}
/**
 * 
 * @export
 * @interface Signatory
 */
export interface Signatory {
    /**
     * When they were added.
     * @type {string}
     * @memberof Signatory
     */
    'created_at'?: string;
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof Signatory
     */
    'document_id'?: string;
    /**
     * The signatory\'s email address.
     * @type {string}
     * @memberof Signatory
     */
    'email'?: string;
    /**
     * The signatory\'s ID.
     * @type {string}
     * @memberof Signatory
     */
    'id'?: string;
    /**
     * The signatory\'s name.
     * @type {string}
     * @memberof Signatory
     */
    'name'?: string | null;
    /**
     * Their place in the signing order, from 0.
     * @type {number}
     * @memberof Signatory
     */
    'position'?: number;
    /**
     * A one-time code is e-mailed to them when they open their link.
     * @type {boolean}
     * @memberof Signatory
     */
    'require_email_otp'?: boolean;
    /**
     * 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected
     * @type {number}
     * @memberof Signatory
     */
    'status'?: number;
    /**
     * When they last changed.
     * @type {string}
     * @memberof Signatory
     */
    'updated_at'?: string;
}
/**
 * 
 * @export
 * @interface Template
 */
export interface Template {
    /**
     * When it was made.
     * @type {string}
     * @memberof Template
     */
    'created_at'?: string;
    /**
     * The template\'s ID.
     * @type {string}
     * @memberof Template
     */
    'id'?: string;
    /**
     * Its pages, each with its fields.
     * @type {Array<Page>}
     * @memberof Template
     */
    'pages'?: Array<Page>;
    /**
     * 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired
     * @type {number}
     * @memberof Template
     */
    'status'?: number;
    /**
     * The template\'s title.
     * @type {string}
     * @memberof Template
     */
    'title'?: string | null;
    /**
     * When it last changed.
     * @type {string}
     * @memberof Template
     */
    'updated_at'?: string;
    /**
     * 
     * @type {Upload}
     * @memberof Template
     */
    'upload'?: Upload;
}
/**
 * 
 * @export
 * @interface TemplateField
 */
export interface TemplateField {
    /**
     * Text: 0 Left · 1 Center · 2 Right.
     * @type {number}
     * @memberof TemplateField
     */
    'align'?: number;
    /**
     * Checkbox: ticked or not.
     * @type {boolean}
     * @memberof TemplateField
     */
    'checked'?: boolean;
    /**
     * When the field was added.
     * @type {string}
     * @memberof TemplateField
     */
    'created_at'?: string;
    /**
     * Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy.
     * @type {number}
     * @memberof TemplateField
     */
    'date_format'?: number;
    /**
     * Text, Date and Dropdown: the font.
     * @type {string}
     * @memberof TemplateField
     */
    'font'?: string;
    /**
     * Text and Dropdown: the font size in points (Date: 10).
     * @type {number}
     * @memberof TemplateField
     */
    'font_size'?: number;
    /**
     * A calculated field\'s formula, or null.
     * @type {string}
     * @memberof TemplateField
     */
    'formula'?: string | null;
    /**
     * Radio: the option group\'s name.
     * @type {string}
     * @memberof TemplateField
     */
    'group_name'?: string | null;
    /**
     * In PDF points (1/72 inch): the field\'s height.
     * @type {number}
     * @memberof TemplateField
     */
    'height'?: number;
    /**
     * The field\'s ID.
     * @type {string}
     * @memberof TemplateField
     */
    'id'?: string;
    /**
     * Text: the signer may type several lines.
     * @type {boolean}
     * @memberof TemplateField
     */
    'is_multi_line'?: boolean;
    /**
     * False: the signer may leave it empty.
     * @type {boolean}
     * @memberof TemplateField
     */
    'is_required'?: boolean;
    /**
     * Radio: the options, each `{x, y, selected}`.
     * @type {Array<object>}
     * @memberof TemplateField
     */
    'items'?: Array<object>;
    /**
     * The field\'s type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp.
     * @type {number}
     * @memberof TemplateField
     */
    'kind'?: number;
    /**
     * The field\'s name, shown to the signer.
     * @type {string}
     * @memberof TemplateField
     */
    'label'?: string | null;
    /**
     * Text: the most characters the signer may type.
     * @type {number}
     * @memberof TemplateField
     */
    'max_length'?: number | null;
    /**
     * How a calculated number is shown, or null.
     * @type {object}
     * @memberof TemplateField
     */
    'number_format'?: object | null;
    /**
     * The ID of the page the field is on.
     * @type {string}
     * @memberof TemplateField
     */
    'page'?: string;
    /**
     * That page\'s number, counting from 0.
     * @type {number}
     * @memberof TemplateField
     */
    'page_number'?: number;
    /**
     * Hint text shown while the field is empty.
     * @type {string}
     * @memberof TemplateField
     */
    'placeholder'?: string | null;
    /**
     * True: the signer can\'t change the value.
     * @type {boolean}
     * @memberof TemplateField
     */
    'readonly'?: boolean;
    /**
     * Dropdown: the choices the signer picks from.
     * @type {Array<string>}
     * @memberof TemplateField
     */
    'select_options'?: Array<string>;
    /**
     * Checkbox and Radio: the side of the tick or dot in points.
     * @type {number}
     * @memberof TemplateField
     */
    'size'?: number;
    /**
     * Shown when the signer points at the field.
     * @type {string}
     * @memberof TemplateField
     */
    'tool_tip'?: string | null;
    /**
     * When the field last changed.
     * @type {string}
     * @memberof TemplateField
     */
    'updated_at'?: string;
    /**
     * The field\'s current value.
     * @type {string}
     * @memberof TemplateField
     */
    'value'?: string | null;
    /**
     * In PDF points (1/72 inch): the field\'s width.
     * @type {number}
     * @memberof TemplateField
     */
    'width'?: number;
    /**
     * In PDF points (1/72 inch): from the page\'s left edge to the field\'s left edge.
     * @type {number}
     * @memberof TemplateField
     */
    'x'?: number | null;
    /**
     * In PDF points (1/72 inch): from the page\'s top edge to the field\'s top edge.
     * @type {number}
     * @memberof TemplateField
     */
    'y'?: number | null;
}
/**
 * 
 * @export
 * @interface TemplatePage
 */
export interface TemplatePage {
    /**
     * How many results in all.
     * @type {number}
     * @memberof TemplatePage
     */
    'count': number;
    /**
     * The next page, or null.
     * @type {string}
     * @memberof TemplatePage
     */
    'next': string | null;
    /**
     * The previous page, or null.
     * @type {string}
     * @memberof TemplatePage
     */
    'previous': string | null;
    /**
     * 
     * @type {Array<Template>}
     * @memberof TemplatePage
     */
    'results': Array<Template>;
}
/**
 * 
 * @export
 * @interface UpdateDocumentFieldByBodyRequest
 */
export interface UpdateDocumentFieldByBodyRequest {
    /**
     * Text: 0 Left · 1 Center · 2 Right.
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'align'?: number;
    /**
     * Checkbox: true starts it ticked.
     * @type {boolean}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'checked'?: boolean;
    /**
     * Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy.
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'date_format'?: number;
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'document_id': string;
    /**
     * The ID of the field to change.
     * @type {string}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'element_id': string;
    /**
     * Text, Date and Dropdown: the font.
     * @type {string}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'font'?: UpdateDocumentFieldByBodyRequestFontEnum;
    /**
     * Text and Dropdown: the font size in points. Date fields always use 10.
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'font_size'?: number;
    /**
     * Text field: makes it a calculated field, worked out when the document is sent from other fields by their labels in brackets, e.g. `round([CTC] * 40%)` or `if([Grade] = \"A\", 50000, 20000)`. Refused if a name is unknown or the formulas loop.
     * @type {string}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'formula'?: string;
    /**
     * Radio: required; the name of the option group.
     * @type {string}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'group_name'?: string;
    /**
     * In PDF points (1/72 inch), whole: the field\'s height (each option\'s, for Radio).
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'height': number;
    /**
     * Text: true lets the signer type several lines.
     * @type {boolean}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'is_multi_line'?: boolean;
    /**
     * False lets the signer leave it empty.
     * @type {boolean}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'is_required'?: boolean;
    /**
     * Radio: required; the options, at least two, each `width` x `height`. `selected` 1 starts that option chosen.
     * @type {Array<UpdateDocumentFieldByBodyRequestItemsInner>}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'items'?: Array<UpdateDocumentFieldByBodyRequestItemsInner>;
    /**
     * The field\'s type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp.
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'kind': number;
    /**
     * The field\'s name, shown to the signer.
     * @type {string}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'label': string;
    /**
     * Text: the most characters the signer may type (1–550).
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'max_length'?: number;
    /**
     * How a calculated number is shown, e.g. {\"kind\": \"number\", \"style\": \"indian\", \"decimals\": 2} or {\"kind\": \"words\", \"currency\": \"INR\"}.
     * @type {object}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'number_format'?: object;
    /**
     * The ID of the page the field is on (GET /ap1/documents/{id}/pages/).
     * @type {string}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'page': string;
    /**
     * That page\'s number, counting from 0 (the first page is 0).
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'page_number': number;
    /**
     * Hint text shown while the field is empty. Send an empty string for Checkbox and Radio.
     * @type {string}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'placeholder': string;
    /**
     * Dropdown: required; the choices the signer picks from, at least one (up to 100 characters each).
     * @type {Array<string>}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'select_options'?: Array<string>;
    /**
     * The signatory who fills in this field (from GET /ap1/signatories/).
     * @type {string}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'signatory_id': string;
    /**
     * Checkbox and Radio: the side of the tick or dot in points, centred in the box. Defaults to the box\'s smaller side.
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'size'?: number;
    /**
     * Shown when the signer points at the field. Defaults to the label.
     * @type {string}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'tool_tip'?: string;
    /**
     * In PDF points (1/72 inch): the field\'s width (each option\'s, for Radio). The field must fit on its page.
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'width': number;
    /**
     * In PDF points (1/72 inch): from the page\'s left edge to the field\'s left edge. Required for every type but Radio (whose options have their own).
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'x'?: number;
    /**
     * In PDF points (1/72 inch): from the page\'s top edge to the field\'s top edge. Required for every type but Radio.
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequest
     */
    'y'?: number;
}

export const UpdateDocumentFieldByBodyRequestFontEnum = {
    Roboto: 'Roboto',
    OpenSans: 'Open Sans',
    Lato: 'Lato',
    Inter: 'Inter'
} as const;

export type UpdateDocumentFieldByBodyRequestFontEnum = typeof UpdateDocumentFieldByBodyRequestFontEnum[keyof typeof UpdateDocumentFieldByBodyRequestFontEnum];

/**
 * 
 * @export
 * @interface UpdateDocumentFieldByBodyRequestItemsInner
 */
export interface UpdateDocumentFieldByBodyRequestItemsInner {
    /**
     * 1 chosen, 0 not.
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequestItemsInner
     */
    'selected': number;
    /**
     * In PDF points (1/72 inch), from the page\'s left edge.
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequestItemsInner
     */
    'x': number;
    /**
     * In PDF points (1/72 inch), from the page\'s top edge.
     * @type {number}
     * @memberof UpdateDocumentFieldByBodyRequestItemsInner
     */
    'y': number;
}
/**
 * 
 * @export
 * @interface UpdateWebhookEndpointRequest
 */
export interface UpdateWebhookEndpointRequest {
    /**
     * Your note about it (up to 200 characters).
     * @type {string}
     * @memberof UpdateWebhookEndpointRequest
     */
    'description'?: string;
    /**
     * The event types to send; leave out for all: `document.approved`, `document.completed`, `document.expired`, `document.rejected`, `document.sent`, `document.signed`, `document.viewed`.
     * @type {Array<string>}
     * @memberof UpdateWebhookEndpointRequest
     */
    'events'?: Array<UpdateWebhookEndpointRequestEventsEnum>;
    /**
     * False stops sending events to it; true resumes.
     * @type {boolean}
     * @memberof UpdateWebhookEndpointRequest
     */
    'is_active'?: boolean;
    /**
     * Where to post events: https://, on a public internet address. Redirects aren\'t followed.
     * @type {string}
     * @memberof UpdateWebhookEndpointRequest
     */
    'url'?: string;
}

export const UpdateWebhookEndpointRequestEventsEnum = {
    Approved: 'document.approved',
    Completed: 'document.completed',
    Expired: 'document.expired',
    Rejected: 'document.rejected',
    Sent: 'document.sent',
    Signed: 'document.signed',
    Viewed: 'document.viewed'
} as const;

export type UpdateWebhookEndpointRequestEventsEnum = typeof UpdateWebhookEndpointRequestEventsEnum[keyof typeof UpdateWebhookEndpointRequestEventsEnum];

/**
 * 
 * @export
 * @interface Upload
 */
export interface Upload {
    /**
     * When it was uploaded.
     * @type {string}
     * @memberof Upload
     */
    'created_at'?: string;
    /**
     * The upload\'s ID.
     * @type {string}
     * @memberof Upload
     */
    'id'?: string;
    /**
     * Made with your test keys: a watermarked test document, not billed (see Sandbox).
     * @type {boolean}
     * @memberof Upload
     */
    'is_test'?: boolean;
    /**
     * The file\'s type.
     * @type {string}
     * @memberof Upload
     */
    'mimetype'?: string;
    /**
     * The name given at upload.
     * @type {string}
     * @memberof Upload
     */
    'name'?: string;
    /**
     * 1 Uploading · 2 Uploaded · 3 Processing · 4 Processed · 5 Error
     * @type {number}
     * @memberof Upload
     */
    'status'?: number;
    /**
     * 2 Document · 4 Template
     * @type {number}
     * @memberof Upload
     */
    'type'?: number;
    /**
     * When it last changed.
     * @type {string}
     * @memberof Upload
     */
    'updated_at'?: string;
}
/**
 * 
 * @export
 * @interface UploadDocumentForOneSigner200Response
 */
export interface UploadDocumentForOneSigner200Response {
    /**
     * The document\'s ID.
     * @type {string}
     * @memberof UploadDocumentForOneSigner200Response
     */
    'id'?: string;
    /**
     * The signer\'s signing link (not the `redirect_url` you sent).
     * @type {string}
     * @memberof UploadDocumentForOneSigner200Response
     */
    'redirect_url'?: string;
}
/**
 * 
 * @export
 * @interface UploadDocumentForOneSignerRequest
 */
export interface UploadDocumentForOneSignerRequest {
    /**
     * A PDF or DOCX file. A PDF that can\'t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that.
     * @type {File}
     * @memberof UploadDocumentForOneSignerRequest
     */
    'file': File;
    /**
     * The signer\'s name.
     * @type {string}
     * @memberof UploadDocumentForOneSignerRequest
     */
    'signee_name': string;
    /**
     * The signer\'s email address.
     * @type {string}
     * @memberof UploadDocumentForOneSignerRequest
     */
    'signee_email': string;
    /**
     * Where the signer is sent after signing.
     * @type {string}
     * @memberof UploadDocumentForOneSignerRequest
     */
    'redirect_url': string;
    /**
     * Who gets the signed PDF and audit trail by email. Without it, your organisation\'s admin does.
     * @type {string}
     * @memberof UploadDocumentForOneSignerRequest
     */
    'final_email'?: string;
}
/**
 * 
 * @export
 * @interface UploadDocumentRequest
 */
export interface UploadDocumentRequest {
    /**
     * A PDF or DOCX file. A PDF that can\'t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB.
     * @type {File}
     * @memberof UploadDocumentRequest
     */
    'file': File;
    /**
     * The document\'s name. It must differ from every other upload of this API client.
     * @type {string}
     * @memberof UploadDocumentRequest
     */
    'name': string;
    /**
     * 2 Document · 4 Template
     * @type {number}
     * @memberof UploadDocumentRequest
     */
    'type': UploadDocumentRequestTypeEnum;
    /**
     * The template\'s title. Required with `type` 4; it must differ from this API client\'s other templates.
     * @type {string}
     * @memberof UploadDocumentRequest
     */
    'template_name'?: string;
}

export const UploadDocumentRequestTypeEnum = {
    NUMBER_2: 2,
    NUMBER_4: 4
} as const;

export type UploadDocumentRequestTypeEnum = typeof UploadDocumentRequestTypeEnum[keyof typeof UploadDocumentRequestTypeEnum];

/**
 * 
 * @export
 * @interface WebhookDelivery
 */
export interface WebhookDelivery {
    /**
     * Tries so far.
     * @type {number}
     * @memberof WebhookDelivery
     */
    'attempts'?: number;
    /**
     * When the event was queued.
     * @type {string}
     * @memberof WebhookDelivery
     */
    'created_at'?: string;
    /**
     * When it succeeded, or null.
     * @type {string}
     * @memberof WebhookDelivery
     */
    'delivered_at'?: string;
    /**
     * How long the last try took.
     * @type {number}
     * @memberof WebhookDelivery
     */
    'duration_ms'?: number;
    /**
     * The event\'s ID (Signedly-Event-Id).
     * @type {string}
     * @memberof WebhookDelivery
     */
    'event_id'?: string;
    /**
     * e.g. document.signed
     * @type {string}
     * @memberof WebhookDelivery
     */
    'event_type'?: string;
    /**
     * The delivery\'s ID.
     * @type {string}
     * @memberof WebhookDelivery
     */
    'id'?: string;
    /**
     * Why the last try failed, or empty.
     * @type {string}
     * @memberof WebhookDelivery
     */
    'last_error'?: string;
    /**
     * Your endpoint\'s last HTTP answer, or null.
     * @type {number}
     * @memberof WebhookDelivery
     */
    'last_status_code'?: number;
    /**
     * When it is tried next, while pending.
     * @type {string}
     * @memberof WebhookDelivery
     */
    'next_attempt_at'?: string;
    /**
     * The body sent.
     * @type {object}
     * @memberof WebhookDelivery
     */
    'payload'?: object;
    /**
     * The start of your endpoint\'s last answer.
     * @type {string}
     * @memberof WebhookDelivery
     */
    'response_snippet'?: string;
    /**
     * pending (being tried), succeeded or failed.
     * @type {string}
     * @memberof WebhookDelivery
     */
    'status'?: string;
}
/**
 * 
 * @export
 * @interface WebhookDeliveryPage
 */
export interface WebhookDeliveryPage {
    /**
     * How many results in all.
     * @type {number}
     * @memberof WebhookDeliveryPage
     */
    'count': number;
    /**
     * The next page, or null.
     * @type {string}
     * @memberof WebhookDeliveryPage
     */
    'next': string | null;
    /**
     * The previous page, or null.
     * @type {string}
     * @memberof WebhookDeliveryPage
     */
    'previous': string | null;
    /**
     * 
     * @type {Array<WebhookDelivery>}
     * @memberof WebhookDeliveryPage
     */
    'results': Array<WebhookDelivery>;
}
/**
 * 
 * @export
 * @interface WebhookEndpoint
 */
export interface WebhookEndpoint {
    /**
     * When made.
     * @type {string}
     * @memberof WebhookEndpoint
     */
    'created_at'?: string;
    /**
     * Your note about it.
     * @type {string}
     * @memberof WebhookEndpoint
     */
    'description'?: string;
    /**
     * When Signedly switched it off, or null.
     * @type {string}
     * @memberof WebhookEndpoint
     */
    'disabled_at'?: string;
    /**
     * The event types to send (empty: all).
     * @type {Array<string>}
     * @memberof WebhookEndpoint
     */
    'events'?: Array<string>;
    /**
     * Events that failed for good since the last success.
     * @type {number}
     * @memberof WebhookEndpoint
     */
    'failures_in_a_row'?: number;
    /**
     * The endpoint\'s ID.
     * @type {string}
     * @memberof WebhookEndpoint
     */
    'id'?: string;
    /**
     * False when you or Signedly switched it off; true switches it on.
     * @type {boolean}
     * @memberof WebhookEndpoint
     */
    'is_active'?: boolean;
    /**
     * Last change.
     * @type {string}
     * @memberof WebhookEndpoint
     */
    'updated_at'?: string;
    /**
     * Where events are posted: https://, public.
     * @type {string}
     * @memberof WebhookEndpoint
     */
    'url': string;
}
/**
 * 
 * @export
 * @interface WebhookEndpointWithSecret
 */
export interface WebhookEndpointWithSecret {
    /**
     * When made.
     * @type {string}
     * @memberof WebhookEndpointWithSecret
     */
    'created_at'?: string;
    /**
     * Your note about it.
     * @type {string}
     * @memberof WebhookEndpointWithSecret
     */
    'description'?: string;
    /**
     * When Signedly switched it off, or null.
     * @type {string}
     * @memberof WebhookEndpointWithSecret
     */
    'disabled_at'?: string;
    /**
     * The event types to send (empty: all).
     * @type {Array<string>}
     * @memberof WebhookEndpointWithSecret
     */
    'events'?: Array<string>;
    /**
     * Events that failed for good since the last success.
     * @type {number}
     * @memberof WebhookEndpointWithSecret
     */
    'failures_in_a_row'?: number;
    /**
     * The endpoint\'s ID.
     * @type {string}
     * @memberof WebhookEndpointWithSecret
     */
    'id'?: string;
    /**
     * False when you or Signedly switched it off; true switches it on.
     * @type {boolean}
     * @memberof WebhookEndpointWithSecret
     */
    'is_active'?: boolean;
    /**
     * Signs every event (Signedly-Signature). Shown only when made or rotated: keep it.
     * @type {string}
     * @memberof WebhookEndpointWithSecret
     */
    'secret'?: string;
    /**
     * Last change.
     * @type {string}
     * @memberof WebhookEndpointWithSecret
     */
    'updated_at'?: string;
    /**
     * Where events are posted: https://, public.
     * @type {string}
     * @memberof WebhookEndpointWithSecret
     */
    'url': string;
}

/**
 * APIRequestLogsApi - axios parameter creator
 * @export
 */
export const APIRequestLogsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * How many calls this API client has made to each path and method, most recently used first. Paged: see `limit` and `offset`.
         * @summary Count your API calls per path
         * @param {ListRequestCountsMethodEnum} [method] Only this HTTP method.
         * @param {string} [path] Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listRequestCounts: async (method?: ListRequestCountsMethodEnum, path?: string, limit?: number, offset?: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/ap1/logs/hits/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (method !== undefined) {
                localVarQueryParameter['method'] = method;
            }

            if (path !== undefined) {
                localVarQueryParameter['path'] = path;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * This API client\'s calls, newest first, with their headers and bodies (credentials and tokens are redacted). Paged: see `limit` and `offset`.
         * @summary List your API calls
         * @param {ListRequestLogsMethodEnum} [method] Only this HTTP method.
         * @param {string} [path] Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;.
         * @param {string} [ipAddress] Only calls from this IP address.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listRequestLogs: async (method?: ListRequestLogsMethodEnum, path?: string, ipAddress?: string, limit?: number, offset?: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/ap1/logs/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (method !== undefined) {
                localVarQueryParameter['method'] = method;
            }

            if (path !== undefined) {
                localVarQueryParameter['path'] = path;
            }

            if (ipAddress !== undefined) {
                localVarQueryParameter['ip_address'] = ipAddress;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * APIRequestLogsApi - functional programming interface
 * @export
 */
export const APIRequestLogsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = APIRequestLogsApiAxiosParamCreator(configuration)
    return {
        /**
         * How many calls this API client has made to each path and method, most recently used first. Paged: see `limit` and `offset`.
         * @summary Count your API calls per path
         * @param {ListRequestCountsMethodEnum} [method] Only this HTTP method.
         * @param {string} [path] Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listRequestCounts(method?: ListRequestCountsMethodEnum, path?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RequestCountPage>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listRequestCounts(method, path, limit, offset, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['APIRequestLogsApi.listRequestCounts']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * This API client\'s calls, newest first, with their headers and bodies (credentials and tokens are redacted). Paged: see `limit` and `offset`.
         * @summary List your API calls
         * @param {ListRequestLogsMethodEnum} [method] Only this HTTP method.
         * @param {string} [path] Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;.
         * @param {string} [ipAddress] Only calls from this IP address.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listRequestLogs(method?: ListRequestLogsMethodEnum, path?: string, ipAddress?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RequestLogPage>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listRequestLogs(method, path, ipAddress, limit, offset, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['APIRequestLogsApi.listRequestLogs']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * APIRequestLogsApi - factory interface
 * @export
 */
export const APIRequestLogsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = APIRequestLogsApiFp(configuration)
    return {
        /**
         * How many calls this API client has made to each path and method, most recently used first. Paged: see `limit` and `offset`.
         * @summary Count your API calls per path
         * @param {ListRequestCountsMethodEnum} [method] Only this HTTP method.
         * @param {string} [path] Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listRequestCounts(method?: ListRequestCountsMethodEnum, path?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig): AxiosPromise<RequestCountPage> {
            return localVarFp.listRequestCounts(method, path, limit, offset, options).then((request) => request(axios, basePath));
        },
        /**
         * This API client\'s calls, newest first, with their headers and bodies (credentials and tokens are redacted). Paged: see `limit` and `offset`.
         * @summary List your API calls
         * @param {ListRequestLogsMethodEnum} [method] Only this HTTP method.
         * @param {string} [path] Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;.
         * @param {string} [ipAddress] Only calls from this IP address.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listRequestLogs(method?: ListRequestLogsMethodEnum, path?: string, ipAddress?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig): AxiosPromise<RequestLogPage> {
            return localVarFp.listRequestLogs(method, path, ipAddress, limit, offset, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * APIRequestLogsApi - object-oriented interface
 * @export
 * @class APIRequestLogsApi
 * @extends {BaseAPI}
 */
export class APIRequestLogsApi extends BaseAPI {
    /**
     * How many calls this API client has made to each path and method, most recently used first. Paged: see `limit` and `offset`.
     * @summary Count your API calls per path
     * @param {ListRequestCountsMethodEnum} [method] Only this HTTP method.
     * @param {string} [path] Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;.
     * @param {number} [limit] How many results to return (default 10).
     * @param {number} [offset] How many results to skip.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof APIRequestLogsApi
     */
    public listRequestCounts(method?: ListRequestCountsMethodEnum, path?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig) {
        return APIRequestLogsApiFp(this.configuration).listRequestCounts(method, path, limit, offset, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * This API client\'s calls, newest first, with their headers and bodies (credentials and tokens are redacted). Paged: see `limit` and `offset`.
     * @summary List your API calls
     * @param {ListRequestLogsMethodEnum} [method] Only this HTTP method.
     * @param {string} [path] Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;.
     * @param {string} [ipAddress] Only calls from this IP address.
     * @param {number} [limit] How many results to return (default 10).
     * @param {number} [offset] How many results to skip.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof APIRequestLogsApi
     */
    public listRequestLogs(method?: ListRequestLogsMethodEnum, path?: string, ipAddress?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig) {
        return APIRequestLogsApiFp(this.configuration).listRequestLogs(method, path, ipAddress, limit, offset, options).then((request) => request(this.axios, this.basePath));
    }
}

/**
 * @export
 */
export const ListRequestCountsMethodEnum = {
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT',
    Delete: 'DELETE'
} as const;
export type ListRequestCountsMethodEnum = typeof ListRequestCountsMethodEnum[keyof typeof ListRequestCountsMethodEnum];
/**
 * @export
 */
export const ListRequestLogsMethodEnum = {
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT',
    Delete: 'DELETE'
} as const;
export type ListRequestLogsMethodEnum = typeof ListRequestLogsMethodEnum[keyof typeof ListRequestLogsMethodEnum];


/**
 * AuthenticationApi - axios parameter creator
 * @export
 */
export const AuthenticationApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Exchanges your client ID and secret (Account & Settings → API in the web app) for an access token, valid 2 hours, and a refresh token, valid 7 days. While both are still valid, the same pair is returned again; once either has expired, a new pair is made. Your test keys get a test token of their own (see Sandbox).
         * @summary Get an access token
         * @param {GetAccessTokenRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAccessToken: async (data: GetAccessTokenRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('getAccessToken', 'data', data)
            const localVarPath = `/ap1/token/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Makes a new access token, valid 2 hours, with the refresh token. The refresh token itself isn\'t renewed: when it expires (7 days after /ap1/token/ made it), call /ap1/token/ again.
         * @summary Refresh the access token
         * @param {RefreshAccessTokenRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        refreshAccessToken: async (data: RefreshAccessTokenRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('refreshAccessToken', 'data', data)
            const localVarPath = `/ap1/refreshtoken/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AuthenticationApi - functional programming interface
 * @export
 */
export const AuthenticationApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AuthenticationApiAxiosParamCreator(configuration)
    return {
        /**
         * Exchanges your client ID and secret (Account & Settings → API in the web app) for an access token, valid 2 hours, and a refresh token, valid 7 days. While both are still valid, the same pair is returned again; once either has expired, a new pair is made. Your test keys get a test token of their own (see Sandbox).
         * @summary Get an access token
         * @param {GetAccessTokenRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAccessToken(data: GetAccessTokenRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RefreshAccessToken200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAccessToken(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthenticationApi.getAccessToken']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Makes a new access token, valid 2 hours, with the refresh token. The refresh token itself isn\'t renewed: when it expires (7 days after /ap1/token/ made it), call /ap1/token/ again.
         * @summary Refresh the access token
         * @param {RefreshAccessTokenRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async refreshAccessToken(data: RefreshAccessTokenRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RefreshAccessToken200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.refreshAccessToken(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthenticationApi.refreshAccessToken']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * AuthenticationApi - factory interface
 * @export
 */
export const AuthenticationApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AuthenticationApiFp(configuration)
    return {
        /**
         * Exchanges your client ID and secret (Account & Settings → API in the web app) for an access token, valid 2 hours, and a refresh token, valid 7 days. While both are still valid, the same pair is returned again; once either has expired, a new pair is made. Your test keys get a test token of their own (see Sandbox).
         * @summary Get an access token
         * @param {GetAccessTokenRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAccessToken(data: GetAccessTokenRequest, options?: RawAxiosRequestConfig): AxiosPromise<RefreshAccessToken200Response> {
            return localVarFp.getAccessToken(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Makes a new access token, valid 2 hours, with the refresh token. The refresh token itself isn\'t renewed: when it expires (7 days after /ap1/token/ made it), call /ap1/token/ again.
         * @summary Refresh the access token
         * @param {RefreshAccessTokenRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        refreshAccessToken(data: RefreshAccessTokenRequest, options?: RawAxiosRequestConfig): AxiosPromise<RefreshAccessToken200Response> {
            return localVarFp.refreshAccessToken(data, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AuthenticationApi - object-oriented interface
 * @export
 * @class AuthenticationApi
 * @extends {BaseAPI}
 */
export class AuthenticationApi extends BaseAPI {
    /**
     * Exchanges your client ID and secret (Account & Settings → API in the web app) for an access token, valid 2 hours, and a refresh token, valid 7 days. While both are still valid, the same pair is returned again; once either has expired, a new pair is made. Your test keys get a test token of their own (see Sandbox).
     * @summary Get an access token
     * @param {GetAccessTokenRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthenticationApi
     */
    public getAccessToken(data: GetAccessTokenRequest, options?: RawAxiosRequestConfig) {
        return AuthenticationApiFp(this.configuration).getAccessToken(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Makes a new access token, valid 2 hours, with the refresh token. The refresh token itself isn\'t renewed: when it expires (7 days after /ap1/token/ made it), call /ap1/token/ again.
     * @summary Refresh the access token
     * @param {RefreshAccessTokenRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthenticationApi
     */
    public refreshAccessToken(data: RefreshAccessTokenRequest, options?: RawAxiosRequestConfig) {
        return AuthenticationApiFp(this.configuration).refreshAccessToken(data, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * BulkSendingApi - axios parameter creator
 * @export
 */
export const BulkSendingApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Makes and sends one document per row from one of your templates, as the web app\'s Bulk Sending does: each row fills the template\'s roles and fields. Give the rows as a CSV or Excel `file` (multipart) or as JSON `rows`, with the columns from GET /ap1/bulk-sends/columns/. The whole file is checked first: if any row has a problem nothing is sent and the answer lists every one. Up to 1,000 rows; each document is billed like a single send. `subject` and `message` may use {{column}} tags. Needs the Teams plan, with live or test keys. The documents are made in the background: follow them with GET /ap1/bulk-sends/{id}/ (or webhooks).
         * @summary Send a template to many people
         * @param {CreateBulkSendRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createBulkSend: async (data: CreateBulkSendRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('createBulkSend', 'data', data)
            const localVarPath = `/ap1/bulk-sends/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * How far the bulk send is: documents made so far, rows that failed, and each document\'s status and signatories.
         * @summary Follow a bulk send
         * @param {string} id The bulk send\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getBulkSend: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getBulkSend', 'id', id)
            const localVarPath = `/ap1/bulk-sends/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * The columns of a bulk send file (or `rows`) for this template, in order: the recipient\'s name and email, each other open role\'s name and email, and one per field the sender fills in, each with what to put in it. Needs the Teams plan, like the bulk send itself.
         * @summary List the columns a template\'s bulk send needs
         * @param {string} templateId The template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listBulkSendColumns: async (templateId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'templateId' is not null or undefined
            assertParamExists('listBulkSendColumns', 'templateId', templateId)
            const localVarPath = `/ap1/bulk-sends/columns/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (templateId !== undefined) {
                localVarQueryParameter['template_id'] = templateId;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * BulkSendingApi - functional programming interface
 * @export
 */
export const BulkSendingApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = BulkSendingApiAxiosParamCreator(configuration)
    return {
        /**
         * Makes and sends one document per row from one of your templates, as the web app\'s Bulk Sending does: each row fills the template\'s roles and fields. Give the rows as a CSV or Excel `file` (multipart) or as JSON `rows`, with the columns from GET /ap1/bulk-sends/columns/. The whole file is checked first: if any row has a problem nothing is sent and the answer lists every one. Up to 1,000 rows; each document is billed like a single send. `subject` and `message` may use {{column}} tags. Needs the Teams plan, with live or test keys. The documents are made in the background: follow them with GET /ap1/bulk-sends/{id}/ (or webhooks).
         * @summary Send a template to many people
         * @param {CreateBulkSendRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createBulkSend(data: CreateBulkSendRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CreateBulkSend202Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createBulkSend(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['BulkSendingApi.createBulkSend']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * How far the bulk send is: documents made so far, rows that failed, and each document\'s status and signatories.
         * @summary Follow a bulk send
         * @param {string} id The bulk send\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getBulkSend(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CreateBulkSend202Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getBulkSend(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['BulkSendingApi.getBulkSend']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * The columns of a bulk send file (or `rows`) for this template, in order: the recipient\'s name and email, each other open role\'s name and email, and one per field the sender fills in, each with what to put in it. Needs the Teams plan, like the bulk send itself.
         * @summary List the columns a template\'s bulk send needs
         * @param {string} templateId The template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listBulkSendColumns(templateId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<ListBulkSendColumns200ResponseInner>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listBulkSendColumns(templateId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['BulkSendingApi.listBulkSendColumns']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * BulkSendingApi - factory interface
 * @export
 */
export const BulkSendingApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = BulkSendingApiFp(configuration)
    return {
        /**
         * Makes and sends one document per row from one of your templates, as the web app\'s Bulk Sending does: each row fills the template\'s roles and fields. Give the rows as a CSV or Excel `file` (multipart) or as JSON `rows`, with the columns from GET /ap1/bulk-sends/columns/. The whole file is checked first: if any row has a problem nothing is sent and the answer lists every one. Up to 1,000 rows; each document is billed like a single send. `subject` and `message` may use {{column}} tags. Needs the Teams plan, with live or test keys. The documents are made in the background: follow them with GET /ap1/bulk-sends/{id}/ (or webhooks).
         * @summary Send a template to many people
         * @param {CreateBulkSendRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createBulkSend(data: CreateBulkSendRequest, options?: RawAxiosRequestConfig): AxiosPromise<CreateBulkSend202Response> {
            return localVarFp.createBulkSend(data, options).then((request) => request(axios, basePath));
        },
        /**
         * How far the bulk send is: documents made so far, rows that failed, and each document\'s status and signatories.
         * @summary Follow a bulk send
         * @param {string} id The bulk send\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getBulkSend(id: string, options?: RawAxiosRequestConfig): AxiosPromise<CreateBulkSend202Response> {
            return localVarFp.getBulkSend(id, options).then((request) => request(axios, basePath));
        },
        /**
         * The columns of a bulk send file (or `rows`) for this template, in order: the recipient\'s name and email, each other open role\'s name and email, and one per field the sender fills in, each with what to put in it. Needs the Teams plan, like the bulk send itself.
         * @summary List the columns a template\'s bulk send needs
         * @param {string} templateId The template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listBulkSendColumns(templateId: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<ListBulkSendColumns200ResponseInner>> {
            return localVarFp.listBulkSendColumns(templateId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * BulkSendingApi - object-oriented interface
 * @export
 * @class BulkSendingApi
 * @extends {BaseAPI}
 */
export class BulkSendingApi extends BaseAPI {
    /**
     * Makes and sends one document per row from one of your templates, as the web app\'s Bulk Sending does: each row fills the template\'s roles and fields. Give the rows as a CSV or Excel `file` (multipart) or as JSON `rows`, with the columns from GET /ap1/bulk-sends/columns/. The whole file is checked first: if any row has a problem nothing is sent and the answer lists every one. Up to 1,000 rows; each document is billed like a single send. `subject` and `message` may use {{column}} tags. Needs the Teams plan, with live or test keys. The documents are made in the background: follow them with GET /ap1/bulk-sends/{id}/ (or webhooks).
     * @summary Send a template to many people
     * @param {CreateBulkSendRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BulkSendingApi
     */
    public createBulkSend(data: CreateBulkSendRequest, options?: RawAxiosRequestConfig) {
        return BulkSendingApiFp(this.configuration).createBulkSend(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * How far the bulk send is: documents made so far, rows that failed, and each document\'s status and signatories.
     * @summary Follow a bulk send
     * @param {string} id The bulk send\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BulkSendingApi
     */
    public getBulkSend(id: string, options?: RawAxiosRequestConfig) {
        return BulkSendingApiFp(this.configuration).getBulkSend(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * The columns of a bulk send file (or `rows`) for this template, in order: the recipient\'s name and email, each other open role\'s name and email, and one per field the sender fills in, each with what to put in it. Needs the Teams plan, like the bulk send itself.
     * @summary List the columns a template\'s bulk send needs
     * @param {string} templateId The template\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BulkSendingApi
     */
    public listBulkSendColumns(templateId: string, options?: RawAxiosRequestConfig) {
        return BulkSendingApiFp(this.configuration).listBulkSendColumns(templateId, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * DocumentsApi - axios parameter creator
 * @export
 */
export const DocumentsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template\'s signing order. Fill the open roles here with `recipients`, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can\'t be sent. To prefill a field, add a key with the field\'s label and the value, e.g. `\"Company\": \"Acme Ltd\"`.
         * @summary Make a document from a template
         * @param {CreateDocumentFromTemplateRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createDocumentFromTemplate: async (data: CreateDocumentFromTemplateRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('createDocumentFromTemplate', 'data', data)
            const localVarPath = `/ap1/documents/fromtemplate/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can\'t be deleted.
         * @summary Delete a template or an unsent document
         * @param {string} id The document\&#39;s or template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteDocument: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteDocument', 'id', id)
            const localVarPath = `/ap1/documents-status/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Says whether the document\'s signed PDF can be downloaded yet (`download_status`). For the document\'s signing status, use `GET /ap1/documents-status-list/?document_ids=<id>`.
         * @summary Check whether the signed PDF is ready
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDownloadStatus: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getDownloadStatus', 'id', id)
            const localVarPath = `/ap1/documents-status/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * The document\'s (or template\'s) pages, in order, each with its fields. Use a page\'s `id` and `page_number` when placing a field on it. A new upload has no pages until it has been processed.
         * @summary List a document\'s pages and their fields
         * @param {string} id The document\&#39;s or template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listDocumentPages: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('listDocumentPages', 'id', id)
            const localVarPath = `/ap1/documents/{id}/pages/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * The ID and status of every document of your organisation\'s admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren\'t listed. A light way to poll for completed documents. Paged: see `limit` and `offset`.
         * @summary List the status of your organisation\'s documents
         * @param {string} [name] Only documents whose name contains this (any case).
         * @param {Array<number>} [status] Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;).
         * @param {Array<string>} [documentIds] Only these documents. Repeat it or separate IDs with commas.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listDocumentStatuses: async (name?: string, status?: Array<number>, documentIds?: Array<string>, limit?: number, offset?: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/ap1/documents-status-list/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (name !== undefined) {
                localVarQueryParameter['name'] = name;
            }

            if (status) {
                localVarQueryParameter['status'] = status;
            }

            if (documentIds) {
                localVarQueryParameter['document_ids'] = documentIds;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren\'t listed. Paged: see `limit` and `offset`.
         * @summary List the documents this API client created
         * @param {string} [name] Only documents whose name contains this (any case).
         * @param {Array<number>} [status] Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;).
         * @param {Array<string>} [documentIds] Only these documents. Repeat it or separate IDs with commas.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listDocuments: async (name?: string, status?: Array<number>, documentIds?: Array<string>, limit?: number, offset?: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/ap1/documents/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (name !== undefined) {
                localVarQueryParameter['name'] = name;
            }

            if (status) {
                localVarQueryParameter['status'] = status;
            }

            if (documentIds) {
                localVarQueryParameter['document_ids'] = documentIds;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Uploads a PDF or DOCX file of up to 2 MB as a document (`type` 2) or a template (`type` 4). The answer is the upload; the document itself is made in the background. Find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is this upload\'s `id`), or a template in `GET /ap1/templates/`, and wait until `GET /ap1/documents/{id}/pages/` lists its pages before placing fields.
         * @summary Upload a document or template
         * @param {File} file A PDF or DOCX file. A PDF that can\\\&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB.
         * @param {string} name The document\\\&#39;s name. It must differ from every other upload of this API client.
         * @param {UploadDocumentTypeEnum} type 2 Document · 4 Template
         * @param {string} [templateName] The template\\\&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client\\\&#39;s other templates.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadDocument: async (file: File, name: string, type: UploadDocumentTypeEnum, templateName?: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'file' is not null or undefined
            assertParamExists('uploadDocument', 'file', file)
            // verify required parameter 'name' is not null or undefined
            assertParamExists('uploadDocument', 'name', name)
            // verify required parameter 'type' is not null or undefined
            assertParamExists('uploadDocument', 'type', type)
            const localVarPath = `/ap1/upload/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


            if (file !== undefined) { 
                localVarFormParams.append('file', file as any);
            }
    
            if (name !== undefined) { 
                localVarFormParams.append('name', name as any);
            }
    
            if (type !== undefined) { 
                localVarFormParams.append('type', type as any);
            }
    
            if (templateName !== undefined) { 
                localVarFormParams.append('template_name', templateName as any);
            }
    
    
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; give it to the signer. They place their own signature on the signing page and are then sent to the `redirect_url` you gave. The signed PDF and its audit trail are emailed to `final_email`, or to your organisation\'s admin without one.
         * @summary Upload a document for one signer and get their signing link
         * @param {File} file A PDF or DOCX file. A PDF that can\\\&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that.
         * @param {string} signeeName The signer\\\&#39;s name.
         * @param {string} signeeEmail The signer\\\&#39;s email address.
         * @param {string} redirectUrl Where the signer is sent after signing.
         * @param {string} [finalEmail] Who gets the signed PDF and audit trail by email. Without it, your organisation\\\&#39;s admin does.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadDocumentForOneSigner: async (file: File, signeeName: string, signeeEmail: string, redirectUrl: string, finalEmail?: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'file' is not null or undefined
            assertParamExists('uploadDocumentForOneSigner', 'file', file)
            // verify required parameter 'signeeName' is not null or undefined
            assertParamExists('uploadDocumentForOneSigner', 'signeeName', signeeName)
            // verify required parameter 'signeeEmail' is not null or undefined
            assertParamExists('uploadDocumentForOneSigner', 'signeeEmail', signeeEmail)
            // verify required parameter 'redirectUrl' is not null or undefined
            assertParamExists('uploadDocumentForOneSigner', 'redirectUrl', redirectUrl)
            const localVarPath = `/ap1/upload_app/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


            if (file !== undefined) { 
                localVarFormParams.append('file', file as any);
            }
    
            if (signeeName !== undefined) { 
                localVarFormParams.append('signee_name', signeeName as any);
            }
    
            if (signeeEmail !== undefined) { 
                localVarFormParams.append('signee_email', signeeEmail as any);
            }
    
            if (redirectUrl !== undefined) { 
                localVarFormParams.append('redirect_url', redirectUrl as any);
            }
    
            if (finalEmail !== undefined) { 
                localVarFormParams.append('final_email', finalEmail as any);
            }
    
    
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DocumentsApi - functional programming interface
 * @export
 */
export const DocumentsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DocumentsApiAxiosParamCreator(configuration)
    return {
        /**
         * Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template\'s signing order. Fill the open roles here with `recipients`, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can\'t be sent. To prefill a field, add a key with the field\'s label and the value, e.g. `\"Company\": \"Acme Ltd\"`.
         * @summary Make a document from a template
         * @param {CreateDocumentFromTemplateRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createDocumentFromTemplate(data: CreateDocumentFromTemplateRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CreateDocumentFromTemplate200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createDocumentFromTemplate(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DocumentsApi.createDocumentFromTemplate']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can\'t be deleted.
         * @summary Delete a template or an unsent document
         * @param {string} id The document\&#39;s or template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteDocument(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SendDocument200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteDocument(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DocumentsApi.deleteDocument']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Says whether the document\'s signed PDF can be downloaded yet (`download_status`). For the document\'s signing status, use `GET /ap1/documents-status-list/?document_ids=<id>`.
         * @summary Check whether the signed PDF is ready
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getDownloadStatus(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetDownloadStatus200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getDownloadStatus(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DocumentsApi.getDownloadStatus']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * The document\'s (or template\'s) pages, in order, each with its fields. Use a page\'s `id` and `page_number` when placing a field on it. A new upload has no pages until it has been processed.
         * @summary List a document\'s pages and their fields
         * @param {string} id The document\&#39;s or template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listDocumentPages(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Page>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listDocumentPages(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DocumentsApi.listDocumentPages']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * The ID and status of every document of your organisation\'s admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren\'t listed. A light way to poll for completed documents. Paged: see `limit` and `offset`.
         * @summary List the status of your organisation\'s documents
         * @param {string} [name] Only documents whose name contains this (any case).
         * @param {Array<number>} [status] Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;).
         * @param {Array<string>} [documentIds] Only these documents. Repeat it or separate IDs with commas.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listDocumentStatuses(name?: string, status?: Array<number>, documentIds?: Array<string>, limit?: number, offset?: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<DocumentStatusPage>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listDocumentStatuses(name, status, documentIds, limit, offset, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DocumentsApi.listDocumentStatuses']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren\'t listed. Paged: see `limit` and `offset`.
         * @summary List the documents this API client created
         * @param {string} [name] Only documents whose name contains this (any case).
         * @param {Array<number>} [status] Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;).
         * @param {Array<string>} [documentIds] Only these documents. Repeat it or separate IDs with commas.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listDocuments(name?: string, status?: Array<number>, documentIds?: Array<string>, limit?: number, offset?: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<DocumentPage>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listDocuments(name, status, documentIds, limit, offset, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DocumentsApi.listDocuments']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Uploads a PDF or DOCX file of up to 2 MB as a document (`type` 2) or a template (`type` 4). The answer is the upload; the document itself is made in the background. Find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is this upload\'s `id`), or a template in `GET /ap1/templates/`, and wait until `GET /ap1/documents/{id}/pages/` lists its pages before placing fields.
         * @summary Upload a document or template
         * @param {File} file A PDF or DOCX file. A PDF that can\\\&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB.
         * @param {string} name The document\\\&#39;s name. It must differ from every other upload of this API client.
         * @param {UploadDocumentTypeEnum} type 2 Document · 4 Template
         * @param {string} [templateName] The template\\\&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client\\\&#39;s other templates.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async uploadDocument(file: File, name: string, type: UploadDocumentTypeEnum, templateName?: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Upload>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.uploadDocument(file, name, type, templateName, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DocumentsApi.uploadDocument']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; give it to the signer. They place their own signature on the signing page and are then sent to the `redirect_url` you gave. The signed PDF and its audit trail are emailed to `final_email`, or to your organisation\'s admin without one.
         * @summary Upload a document for one signer and get their signing link
         * @param {File} file A PDF or DOCX file. A PDF that can\\\&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that.
         * @param {string} signeeName The signer\\\&#39;s name.
         * @param {string} signeeEmail The signer\\\&#39;s email address.
         * @param {string} redirectUrl Where the signer is sent after signing.
         * @param {string} [finalEmail] Who gets the signed PDF and audit trail by email. Without it, your organisation\\\&#39;s admin does.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async uploadDocumentForOneSigner(file: File, signeeName: string, signeeEmail: string, redirectUrl: string, finalEmail?: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UploadDocumentForOneSigner200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.uploadDocumentForOneSigner(file, signeeName, signeeEmail, redirectUrl, finalEmail, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DocumentsApi.uploadDocumentForOneSigner']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * DocumentsApi - factory interface
 * @export
 */
export const DocumentsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DocumentsApiFp(configuration)
    return {
        /**
         * Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template\'s signing order. Fill the open roles here with `recipients`, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can\'t be sent. To prefill a field, add a key with the field\'s label and the value, e.g. `\"Company\": \"Acme Ltd\"`.
         * @summary Make a document from a template
         * @param {CreateDocumentFromTemplateRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createDocumentFromTemplate(data: CreateDocumentFromTemplateRequest, options?: RawAxiosRequestConfig): AxiosPromise<CreateDocumentFromTemplate200Response> {
            return localVarFp.createDocumentFromTemplate(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can\'t be deleted.
         * @summary Delete a template or an unsent document
         * @param {string} id The document\&#39;s or template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteDocument(id: string, options?: RawAxiosRequestConfig): AxiosPromise<SendDocument200Response> {
            return localVarFp.deleteDocument(id, options).then((request) => request(axios, basePath));
        },
        /**
         * Says whether the document\'s signed PDF can be downloaded yet (`download_status`). For the document\'s signing status, use `GET /ap1/documents-status-list/?document_ids=<id>`.
         * @summary Check whether the signed PDF is ready
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDownloadStatus(id: string, options?: RawAxiosRequestConfig): AxiosPromise<GetDownloadStatus200Response> {
            return localVarFp.getDownloadStatus(id, options).then((request) => request(axios, basePath));
        },
        /**
         * The document\'s (or template\'s) pages, in order, each with its fields. Use a page\'s `id` and `page_number` when placing a field on it. A new upload has no pages until it has been processed.
         * @summary List a document\'s pages and their fields
         * @param {string} id The document\&#39;s or template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listDocumentPages(id: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<Page>> {
            return localVarFp.listDocumentPages(id, options).then((request) => request(axios, basePath));
        },
        /**
         * The ID and status of every document of your organisation\'s admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren\'t listed. A light way to poll for completed documents. Paged: see `limit` and `offset`.
         * @summary List the status of your organisation\'s documents
         * @param {string} [name] Only documents whose name contains this (any case).
         * @param {Array<number>} [status] Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;).
         * @param {Array<string>} [documentIds] Only these documents. Repeat it or separate IDs with commas.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listDocumentStatuses(name?: string, status?: Array<number>, documentIds?: Array<string>, limit?: number, offset?: number, options?: RawAxiosRequestConfig): AxiosPromise<DocumentStatusPage> {
            return localVarFp.listDocumentStatuses(name, status, documentIds, limit, offset, options).then((request) => request(axios, basePath));
        },
        /**
         * The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren\'t listed. Paged: see `limit` and `offset`.
         * @summary List the documents this API client created
         * @param {string} [name] Only documents whose name contains this (any case).
         * @param {Array<number>} [status] Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;).
         * @param {Array<string>} [documentIds] Only these documents. Repeat it or separate IDs with commas.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listDocuments(name?: string, status?: Array<number>, documentIds?: Array<string>, limit?: number, offset?: number, options?: RawAxiosRequestConfig): AxiosPromise<DocumentPage> {
            return localVarFp.listDocuments(name, status, documentIds, limit, offset, options).then((request) => request(axios, basePath));
        },
        /**
         * Uploads a PDF or DOCX file of up to 2 MB as a document (`type` 2) or a template (`type` 4). The answer is the upload; the document itself is made in the background. Find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is this upload\'s `id`), or a template in `GET /ap1/templates/`, and wait until `GET /ap1/documents/{id}/pages/` lists its pages before placing fields.
         * @summary Upload a document or template
         * @param {File} file A PDF or DOCX file. A PDF that can\\\&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB.
         * @param {string} name The document\\\&#39;s name. It must differ from every other upload of this API client.
         * @param {UploadDocumentTypeEnum} type 2 Document · 4 Template
         * @param {string} [templateName] The template\\\&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client\\\&#39;s other templates.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadDocument(file: File, name: string, type: UploadDocumentTypeEnum, templateName?: string, options?: RawAxiosRequestConfig): AxiosPromise<Upload> {
            return localVarFp.uploadDocument(file, name, type, templateName, options).then((request) => request(axios, basePath));
        },
        /**
         * Uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; give it to the signer. They place their own signature on the signing page and are then sent to the `redirect_url` you gave. The signed PDF and its audit trail are emailed to `final_email`, or to your organisation\'s admin without one.
         * @summary Upload a document for one signer and get their signing link
         * @param {File} file A PDF or DOCX file. A PDF that can\\\&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that.
         * @param {string} signeeName The signer\\\&#39;s name.
         * @param {string} signeeEmail The signer\\\&#39;s email address.
         * @param {string} redirectUrl Where the signer is sent after signing.
         * @param {string} [finalEmail] Who gets the signed PDF and audit trail by email. Without it, your organisation\\\&#39;s admin does.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        uploadDocumentForOneSigner(file: File, signeeName: string, signeeEmail: string, redirectUrl: string, finalEmail?: string, options?: RawAxiosRequestConfig): AxiosPromise<UploadDocumentForOneSigner200Response> {
            return localVarFp.uploadDocumentForOneSigner(file, signeeName, signeeEmail, redirectUrl, finalEmail, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DocumentsApi - object-oriented interface
 * @export
 * @class DocumentsApi
 * @extends {BaseAPI}
 */
export class DocumentsApi extends BaseAPI {
    /**
     * Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template\'s signing order. Fill the open roles here with `recipients`, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can\'t be sent. To prefill a field, add a key with the field\'s label and the value, e.g. `\"Company\": \"Acme Ltd\"`.
     * @summary Make a document from a template
     * @param {CreateDocumentFromTemplateRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentsApi
     */
    public createDocumentFromTemplate(data: CreateDocumentFromTemplateRequest, options?: RawAxiosRequestConfig) {
        return DocumentsApiFp(this.configuration).createDocumentFromTemplate(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can\'t be deleted.
     * @summary Delete a template or an unsent document
     * @param {string} id The document\&#39;s or template\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentsApi
     */
    public deleteDocument(id: string, options?: RawAxiosRequestConfig) {
        return DocumentsApiFp(this.configuration).deleteDocument(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Says whether the document\'s signed PDF can be downloaded yet (`download_status`). For the document\'s signing status, use `GET /ap1/documents-status-list/?document_ids=<id>`.
     * @summary Check whether the signed PDF is ready
     * @param {string} id The document\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentsApi
     */
    public getDownloadStatus(id: string, options?: RawAxiosRequestConfig) {
        return DocumentsApiFp(this.configuration).getDownloadStatus(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * The document\'s (or template\'s) pages, in order, each with its fields. Use a page\'s `id` and `page_number` when placing a field on it. A new upload has no pages until it has been processed.
     * @summary List a document\'s pages and their fields
     * @param {string} id The document\&#39;s or template\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentsApi
     */
    public listDocumentPages(id: string, options?: RawAxiosRequestConfig) {
        return DocumentsApiFp(this.configuration).listDocumentPages(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * The ID and status of every document of your organisation\'s admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren\'t listed. A light way to poll for completed documents. Paged: see `limit` and `offset`.
     * @summary List the status of your organisation\'s documents
     * @param {string} [name] Only documents whose name contains this (any case).
     * @param {Array<number>} [status] Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;).
     * @param {Array<string>} [documentIds] Only these documents. Repeat it or separate IDs with commas.
     * @param {number} [limit] How many results to return (default 10).
     * @param {number} [offset] How many results to skip.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentsApi
     */
    public listDocumentStatuses(name?: string, status?: Array<number>, documentIds?: Array<string>, limit?: number, offset?: number, options?: RawAxiosRequestConfig) {
        return DocumentsApiFp(this.configuration).listDocumentStatuses(name, status, documentIds, limit, offset, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren\'t listed. Paged: see `limit` and `offset`.
     * @summary List the documents this API client created
     * @param {string} [name] Only documents whose name contains this (any case).
     * @param {Array<number>} [status] Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;).
     * @param {Array<string>} [documentIds] Only these documents. Repeat it or separate IDs with commas.
     * @param {number} [limit] How many results to return (default 10).
     * @param {number} [offset] How many results to skip.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentsApi
     */
    public listDocuments(name?: string, status?: Array<number>, documentIds?: Array<string>, limit?: number, offset?: number, options?: RawAxiosRequestConfig) {
        return DocumentsApiFp(this.configuration).listDocuments(name, status, documentIds, limit, offset, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Uploads a PDF or DOCX file of up to 2 MB as a document (`type` 2) or a template (`type` 4). The answer is the upload; the document itself is made in the background. Find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is this upload\'s `id`), or a template in `GET /ap1/templates/`, and wait until `GET /ap1/documents/{id}/pages/` lists its pages before placing fields.
     * @summary Upload a document or template
     * @param {File} file A PDF or DOCX file. A PDF that can\\\&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB.
     * @param {string} name The document\\\&#39;s name. It must differ from every other upload of this API client.
     * @param {UploadDocumentTypeEnum} type 2 Document · 4 Template
     * @param {string} [templateName] The template\\\&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client\\\&#39;s other templates.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentsApi
     */
    public uploadDocument(file: File, name: string, type: UploadDocumentTypeEnum, templateName?: string, options?: RawAxiosRequestConfig) {
        return DocumentsApiFp(this.configuration).uploadDocument(file, name, type, templateName, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; give it to the signer. They place their own signature on the signing page and are then sent to the `redirect_url` you gave. The signed PDF and its audit trail are emailed to `final_email`, or to your organisation\'s admin without one.
     * @summary Upload a document for one signer and get their signing link
     * @param {File} file A PDF or DOCX file. A PDF that can\\\&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that.
     * @param {string} signeeName The signer\\\&#39;s name.
     * @param {string} signeeEmail The signer\\\&#39;s email address.
     * @param {string} redirectUrl Where the signer is sent after signing.
     * @param {string} [finalEmail] Who gets the signed PDF and audit trail by email. Without it, your organisation\\\&#39;s admin does.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentsApi
     */
    public uploadDocumentForOneSigner(file: File, signeeName: string, signeeEmail: string, redirectUrl: string, finalEmail?: string, options?: RawAxiosRequestConfig) {
        return DocumentsApiFp(this.configuration).uploadDocumentForOneSigner(file, signeeName, signeeEmail, redirectUrl, finalEmail, options).then((request) => request(this.axios, this.basePath));
    }
}

/**
 * @export
 */
export const UploadDocumentTypeEnum = {
    NUMBER_2: 2,
    NUMBER_4: 4
} as const;
export type UploadDocumentTypeEnum = typeof UploadDocumentTypeEnum[keyof typeof UploadDocumentTypeEnum];


/**
 * DownloadsApi - axios parameter creator
 * @export
 */
export const DownloadsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * A link to the document\'s audit trail PDF: who did what, when and from where. It is made when the document is completed; ask for it after GET /ap1/document/download-link/ gives the signed PDF.
         * @summary Get a link to the audit trail
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAuditTrailLink: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getAuditTrailLink', 'id', id)
            const localVarPath = `/ap1/document/download-audit-link/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (id !== undefined) {
                localVarQueryParameter['id'] = id;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * A link to the final signed PDF, once every signatory has signed and it has been sealed. Until then the answer is 202: try again later.
         * @summary Get a link to the signed PDF
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDownloadLink: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getDownloadLink', 'id', id)
            const localVarPath = `/ap1/document/download-link/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (id !== undefined) {
                localVarQueryParameter['id'] = id;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * A link to the document\'s PDF as it stands now, with the values and signatures applied so far. For the final signed PDF, use GET /ap1/document/download-link/.
         * @summary Get a link to view the document
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getViewLink: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getViewLink', 'id', id)
            const localVarPath = `/ap1/document/view-link/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (id !== undefined) {
                localVarQueryParameter['id'] = id;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DownloadsApi - functional programming interface
 * @export
 */
export const DownloadsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DownloadsApiAxiosParamCreator(configuration)
    return {
        /**
         * A link to the document\'s audit trail PDF: who did what, when and from where. It is made when the document is completed; ask for it after GET /ap1/document/download-link/ gives the signed PDF.
         * @summary Get a link to the audit trail
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAuditTrailLink(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetAuditTrailLink200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAuditTrailLink(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DownloadsApi.getAuditTrailLink']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * A link to the final signed PDF, once every signatory has signed and it has been sealed. Until then the answer is 202: try again later.
         * @summary Get a link to the signed PDF
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getDownloadLink(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetAuditTrailLink200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getDownloadLink(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DownloadsApi.getDownloadLink']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * A link to the document\'s PDF as it stands now, with the values and signatures applied so far. For the final signed PDF, use GET /ap1/document/download-link/.
         * @summary Get a link to view the document
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getViewLink(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetAuditTrailLink200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getViewLink(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DownloadsApi.getViewLink']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * DownloadsApi - factory interface
 * @export
 */
export const DownloadsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DownloadsApiFp(configuration)
    return {
        /**
         * A link to the document\'s audit trail PDF: who did what, when and from where. It is made when the document is completed; ask for it after GET /ap1/document/download-link/ gives the signed PDF.
         * @summary Get a link to the audit trail
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAuditTrailLink(id: string, options?: RawAxiosRequestConfig): AxiosPromise<GetAuditTrailLink200Response> {
            return localVarFp.getAuditTrailLink(id, options).then((request) => request(axios, basePath));
        },
        /**
         * A link to the final signed PDF, once every signatory has signed and it has been sealed. Until then the answer is 202: try again later.
         * @summary Get a link to the signed PDF
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDownloadLink(id: string, options?: RawAxiosRequestConfig): AxiosPromise<GetAuditTrailLink200Response> {
            return localVarFp.getDownloadLink(id, options).then((request) => request(axios, basePath));
        },
        /**
         * A link to the document\'s PDF as it stands now, with the values and signatures applied so far. For the final signed PDF, use GET /ap1/document/download-link/.
         * @summary Get a link to view the document
         * @param {string} id The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getViewLink(id: string, options?: RawAxiosRequestConfig): AxiosPromise<GetAuditTrailLink200Response> {
            return localVarFp.getViewLink(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DownloadsApi - object-oriented interface
 * @export
 * @class DownloadsApi
 * @extends {BaseAPI}
 */
export class DownloadsApi extends BaseAPI {
    /**
     * A link to the document\'s audit trail PDF: who did what, when and from where. It is made when the document is completed; ask for it after GET /ap1/document/download-link/ gives the signed PDF.
     * @summary Get a link to the audit trail
     * @param {string} id The document\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DownloadsApi
     */
    public getAuditTrailLink(id: string, options?: RawAxiosRequestConfig) {
        return DownloadsApiFp(this.configuration).getAuditTrailLink(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * A link to the final signed PDF, once every signatory has signed and it has been sealed. Until then the answer is 202: try again later.
     * @summary Get a link to the signed PDF
     * @param {string} id The document\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DownloadsApi
     */
    public getDownloadLink(id: string, options?: RawAxiosRequestConfig) {
        return DownloadsApiFp(this.configuration).getDownloadLink(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * A link to the document\'s PDF as it stands now, with the values and signatures applied so far. For the final signed PDF, use GET /ap1/document/download-link/.
     * @summary Get a link to view the document
     * @param {string} id The document\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DownloadsApi
     */
    public getViewLink(id: string, options?: RawAxiosRequestConfig) {
        return DownloadsApiFp(this.configuration).getViewLink(id, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * FieldsApi - axios parameter creator
 * @export
 */
export const FieldsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Places fields on a document, each assigned to a signatory. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). A field must sit wholly on its page (1 point of tolerance). For a template, use POST /ap1/templates/fields/.
         * @summary Add fields to a document
         * @param {Array<CreateDocumentFieldsRequestInner>} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createDocumentFields: async (data: Array<CreateDocumentFieldsRequestInner>, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('createDocumentFields', 'data', data)
            const localVarPath = `/ap1/documents/fields/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).
         * @summary Add fields to a template
         * @param {Array<CreateTemplateFieldsRequestInner>} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTemplateFields: async (data: Array<CreateTemplateFieldsRequestInner>, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('createTemplateFields', 'data', data)
            const localVarPath = `/ap1/templates/fields/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Deletes a field of a template, or of a document that isn\'t sent yet. The document\'s or template\'s ID goes in the JSON body.
         * @summary Delete a field
         * @param {string} id The field\&#39;s ID.
         * @param {DeleteFieldRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteField: async (id: string, data: DeleteFieldRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteField', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('deleteField', 'data', data)
            const localVarPath = `/ap1/documents/fields/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * The fields of a document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared).
         * @summary List a document\'s fields
         * @param {string} documentId The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listDocumentFields: async (documentId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'documentId' is not null or undefined
            assertParamExists('listDocumentFields', 'documentId', documentId)
            const localVarPath = `/ap1/documents/fields/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (documentId !== undefined) {
                localVarQueryParameter['document_id'] = documentId;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * The fields of a template (or of any of your documents).
         * @summary List a template\'s fields
         * @param {string} documentId The template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listTemplateFields: async (documentId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'documentId' is not null or undefined
            assertParamExists('listTemplateFields', 'documentId', documentId)
            const localVarPath = `/ap1/templates/fields/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (documentId !== undefined) {
                localVarQueryParameter['document_id'] = documentId;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Changes a document\'s field; send all of its values, as when adding it. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can\'t change: delete the field and add it again. For a template\'s field, use PUT /ap1/templates/fields/{id}/.
         * @summary Change a document\'s field
         * @param {string} id The field\&#39;s ID.
         * @param {CreateDocumentFieldsRequestInner} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateDocumentField: async (id: string, data: CreateDocumentFieldsRequestInner, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('updateDocumentField', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('updateDocumentField', 'data', data)
            const localVarPath = `/ap1/documents/fields/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Changes a document\'s field, named by `element_id` in the body; the same as PUT /ap1/documents/fields/{id}/. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can\'t change: delete the field and add it again.
         * @summary Change a document\'s field (ID in the body)
         * @param {UpdateDocumentFieldByBodyRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateDocumentFieldByBody: async (data: UpdateDocumentFieldByBodyRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('updateDocumentFieldByBody', 'data', data)
            const localVarPath = `/ap1/documents/fields/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Changes a template\'s field; send all of its values, as when adding it. Its page can\'t change: delete the field and add it again.
         * @summary Change a template\'s field
         * @param {string} id The field\&#39;s ID.
         * @param {CreateTemplateFieldsRequestInner} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateTemplateField: async (id: string, data: CreateTemplateFieldsRequestInner, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('updateTemplateField', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('updateTemplateField', 'data', data)
            const localVarPath = `/ap1/templates/fields/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * FieldsApi - functional programming interface
 * @export
 */
export const FieldsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = FieldsApiAxiosParamCreator(configuration)
    return {
        /**
         * Places fields on a document, each assigned to a signatory. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). A field must sit wholly on its page (1 point of tolerance). For a template, use POST /ap1/templates/fields/.
         * @summary Add fields to a document
         * @param {Array<CreateDocumentFieldsRequestInner>} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createDocumentFields(data: Array<CreateDocumentFieldsRequestInner>, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Field>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createDocumentFields(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['FieldsApi.createDocumentFields']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).
         * @summary Add fields to a template
         * @param {Array<CreateTemplateFieldsRequestInner>} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createTemplateFields(data: Array<CreateTemplateFieldsRequestInner>, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TemplateField>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createTemplateFields(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['FieldsApi.createTemplateFields']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Deletes a field of a template, or of a document that isn\'t sent yet. The document\'s or template\'s ID goes in the JSON body.
         * @summary Delete a field
         * @param {string} id The field\&#39;s ID.
         * @param {DeleteFieldRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteField(id: string, data: DeleteFieldRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SendDocument200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteField(id, data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['FieldsApi.deleteField']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * The fields of a document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared).
         * @summary List a document\'s fields
         * @param {string} documentId The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listDocumentFields(documentId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Field>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listDocumentFields(documentId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['FieldsApi.listDocumentFields']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * The fields of a template (or of any of your documents).
         * @summary List a template\'s fields
         * @param {string} documentId The template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listTemplateFields(documentId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TemplateField>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listTemplateFields(documentId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['FieldsApi.listTemplateFields']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Changes a document\'s field; send all of its values, as when adding it. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can\'t change: delete the field and add it again. For a template\'s field, use PUT /ap1/templates/fields/{id}/.
         * @summary Change a document\'s field
         * @param {string} id The field\&#39;s ID.
         * @param {CreateDocumentFieldsRequestInner} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateDocumentField(id: string, data: CreateDocumentFieldsRequestInner, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Field>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateDocumentField(id, data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['FieldsApi.updateDocumentField']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Changes a document\'s field, named by `element_id` in the body; the same as PUT /ap1/documents/fields/{id}/. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can\'t change: delete the field and add it again.
         * @summary Change a document\'s field (ID in the body)
         * @param {UpdateDocumentFieldByBodyRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateDocumentFieldByBody(data: UpdateDocumentFieldByBodyRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Field>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateDocumentFieldByBody(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['FieldsApi.updateDocumentFieldByBody']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Changes a template\'s field; send all of its values, as when adding it. Its page can\'t change: delete the field and add it again.
         * @summary Change a template\'s field
         * @param {string} id The field\&#39;s ID.
         * @param {CreateTemplateFieldsRequestInner} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateTemplateField(id: string, data: CreateTemplateFieldsRequestInner, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TemplateField>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateTemplateField(id, data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['FieldsApi.updateTemplateField']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * FieldsApi - factory interface
 * @export
 */
export const FieldsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = FieldsApiFp(configuration)
    return {
        /**
         * Places fields on a document, each assigned to a signatory. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). A field must sit wholly on its page (1 point of tolerance). For a template, use POST /ap1/templates/fields/.
         * @summary Add fields to a document
         * @param {Array<CreateDocumentFieldsRequestInner>} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createDocumentFields(data: Array<CreateDocumentFieldsRequestInner>, options?: RawAxiosRequestConfig): AxiosPromise<Array<Field>> {
            return localVarFp.createDocumentFields(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).
         * @summary Add fields to a template
         * @param {Array<CreateTemplateFieldsRequestInner>} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTemplateFields(data: Array<CreateTemplateFieldsRequestInner>, options?: RawAxiosRequestConfig): AxiosPromise<Array<TemplateField>> {
            return localVarFp.createTemplateFields(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Deletes a field of a template, or of a document that isn\'t sent yet. The document\'s or template\'s ID goes in the JSON body.
         * @summary Delete a field
         * @param {string} id The field\&#39;s ID.
         * @param {DeleteFieldRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteField(id: string, data: DeleteFieldRequest, options?: RawAxiosRequestConfig): AxiosPromise<SendDocument200Response> {
            return localVarFp.deleteField(id, data, options).then((request) => request(axios, basePath));
        },
        /**
         * The fields of a document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared).
         * @summary List a document\'s fields
         * @param {string} documentId The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listDocumentFields(documentId: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<Field>> {
            return localVarFp.listDocumentFields(documentId, options).then((request) => request(axios, basePath));
        },
        /**
         * The fields of a template (or of any of your documents).
         * @summary List a template\'s fields
         * @param {string} documentId The template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listTemplateFields(documentId: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<TemplateField>> {
            return localVarFp.listTemplateFields(documentId, options).then((request) => request(axios, basePath));
        },
        /**
         * Changes a document\'s field; send all of its values, as when adding it. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can\'t change: delete the field and add it again. For a template\'s field, use PUT /ap1/templates/fields/{id}/.
         * @summary Change a document\'s field
         * @param {string} id The field\&#39;s ID.
         * @param {CreateDocumentFieldsRequestInner} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateDocumentField(id: string, data: CreateDocumentFieldsRequestInner, options?: RawAxiosRequestConfig): AxiosPromise<Field> {
            return localVarFp.updateDocumentField(id, data, options).then((request) => request(axios, basePath));
        },
        /**
         * Changes a document\'s field, named by `element_id` in the body; the same as PUT /ap1/documents/fields/{id}/. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can\'t change: delete the field and add it again.
         * @summary Change a document\'s field (ID in the body)
         * @param {UpdateDocumentFieldByBodyRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateDocumentFieldByBody(data: UpdateDocumentFieldByBodyRequest, options?: RawAxiosRequestConfig): AxiosPromise<Field> {
            return localVarFp.updateDocumentFieldByBody(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Changes a template\'s field; send all of its values, as when adding it. Its page can\'t change: delete the field and add it again.
         * @summary Change a template\'s field
         * @param {string} id The field\&#39;s ID.
         * @param {CreateTemplateFieldsRequestInner} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateTemplateField(id: string, data: CreateTemplateFieldsRequestInner, options?: RawAxiosRequestConfig): AxiosPromise<TemplateField> {
            return localVarFp.updateTemplateField(id, data, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * FieldsApi - object-oriented interface
 * @export
 * @class FieldsApi
 * @extends {BaseAPI}
 */
export class FieldsApi extends BaseAPI {
    /**
     * Places fields on a document, each assigned to a signatory. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). A field must sit wholly on its page (1 point of tolerance). For a template, use POST /ap1/templates/fields/.
     * @summary Add fields to a document
     * @param {Array<CreateDocumentFieldsRequestInner>} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FieldsApi
     */
    public createDocumentFields(data: Array<CreateDocumentFieldsRequestInner>, options?: RawAxiosRequestConfig) {
        return FieldsApiFp(this.configuration).createDocumentFields(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).
     * @summary Add fields to a template
     * @param {Array<CreateTemplateFieldsRequestInner>} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FieldsApi
     */
    public createTemplateFields(data: Array<CreateTemplateFieldsRequestInner>, options?: RawAxiosRequestConfig) {
        return FieldsApiFp(this.configuration).createTemplateFields(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Deletes a field of a template, or of a document that isn\'t sent yet. The document\'s or template\'s ID goes in the JSON body.
     * @summary Delete a field
     * @param {string} id The field\&#39;s ID.
     * @param {DeleteFieldRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FieldsApi
     */
    public deleteField(id: string, data: DeleteFieldRequest, options?: RawAxiosRequestConfig) {
        return FieldsApiFp(this.configuration).deleteField(id, data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * The fields of a document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared).
     * @summary List a document\'s fields
     * @param {string} documentId The document\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FieldsApi
     */
    public listDocumentFields(documentId: string, options?: RawAxiosRequestConfig) {
        return FieldsApiFp(this.configuration).listDocumentFields(documentId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * The fields of a template (or of any of your documents).
     * @summary List a template\'s fields
     * @param {string} documentId The template\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FieldsApi
     */
    public listTemplateFields(documentId: string, options?: RawAxiosRequestConfig) {
        return FieldsApiFp(this.configuration).listTemplateFields(documentId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Changes a document\'s field; send all of its values, as when adding it. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can\'t change: delete the field and add it again. For a template\'s field, use PUT /ap1/templates/fields/{id}/.
     * @summary Change a document\'s field
     * @param {string} id The field\&#39;s ID.
     * @param {CreateDocumentFieldsRequestInner} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FieldsApi
     */
    public updateDocumentField(id: string, data: CreateDocumentFieldsRequestInner, options?: RawAxiosRequestConfig) {
        return FieldsApiFp(this.configuration).updateDocumentField(id, data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Changes a document\'s field, named by `element_id` in the body; the same as PUT /ap1/documents/fields/{id}/. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can\'t change: delete the field and add it again.
     * @summary Change a document\'s field (ID in the body)
     * @param {UpdateDocumentFieldByBodyRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FieldsApi
     */
    public updateDocumentFieldByBody(data: UpdateDocumentFieldByBodyRequest, options?: RawAxiosRequestConfig) {
        return FieldsApiFp(this.configuration).updateDocumentFieldByBody(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Changes a template\'s field; send all of its values, as when adding it. Its page can\'t change: delete the field and add it again.
     * @summary Change a template\'s field
     * @param {string} id The field\&#39;s ID.
     * @param {CreateTemplateFieldsRequestInner} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FieldsApi
     */
    public updateTemplateField(id: string, data: CreateTemplateFieldsRequestInner, options?: RawAxiosRequestConfig) {
        return FieldsApiFp(this.configuration).updateTemplateField(id, data, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * SendingApi - axios parameter creator
 * @export
 */
export const SendingApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Sets the values of the document\'s fields, adds one signatory (`name`, `email`), and emails the signatories their signing links, like POST /ap1/document/send/. All or nothing: if anything is refused, nothing changes. A retry after a timed-out call that worked answers 400 (already sent); treat that as success. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page.
         * @summary Fill in fields, add a signatory and send, in one call
         * @param {FillAndSendDocumentRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        fillAndSendDocument: async (data: FillAndSendDocumentRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('fillAndSendDocument', 'data', data)
            const localVarPath = `/ap1/document/update_and_send/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Emails each signatory a signing link with your subject and message (with ordered signing, only the first; each next one is emailed in turn). The document needs at least one field, and every signatory at least one field. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document\'s status before sending again.
         * @summary Send a document for signing by email
         * @param {SendDocumentRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sendDocument: async (data: SendDocumentRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('sendDocument', 'data', data)
            const localVarPath = `/ap1/document/send/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Marks the document sent without emailing anyone, and returns its signatory\'s signing link to show or send yourself. Meant for a document with one signatory. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document\'s status before sending again.
         * @summary Send a document and get the signing link
         * @param {SendDocumentByLinkRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sendDocumentByLink: async (data: SendDocumentByLinkRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('sendDocumentByLink', 'data', data)
            const localVarPath = `/ap1/document/send_url/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * SendingApi - functional programming interface
 * @export
 */
export const SendingApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SendingApiAxiosParamCreator(configuration)
    return {
        /**
         * Sets the values of the document\'s fields, adds one signatory (`name`, `email`), and emails the signatories their signing links, like POST /ap1/document/send/. All or nothing: if anything is refused, nothing changes. A retry after a timed-out call that worked answers 400 (already sent); treat that as success. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page.
         * @summary Fill in fields, add a signatory and send, in one call
         * @param {FillAndSendDocumentRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async fillAndSendDocument(data: FillAndSendDocumentRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SendDocument200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.fillAndSendDocument(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['SendingApi.fillAndSendDocument']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Emails each signatory a signing link with your subject and message (with ordered signing, only the first; each next one is emailed in turn). The document needs at least one field, and every signatory at least one field. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document\'s status before sending again.
         * @summary Send a document for signing by email
         * @param {SendDocumentRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async sendDocument(data: SendDocumentRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SendDocument200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.sendDocument(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['SendingApi.sendDocument']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Marks the document sent without emailing anyone, and returns its signatory\'s signing link to show or send yourself. Meant for a document with one signatory. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document\'s status before sending again.
         * @summary Send a document and get the signing link
         * @param {SendDocumentByLinkRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async sendDocumentByLink(data: SendDocumentByLinkRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SendDocumentByLink200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.sendDocumentByLink(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['SendingApi.sendDocumentByLink']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * SendingApi - factory interface
 * @export
 */
export const SendingApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SendingApiFp(configuration)
    return {
        /**
         * Sets the values of the document\'s fields, adds one signatory (`name`, `email`), and emails the signatories their signing links, like POST /ap1/document/send/. All or nothing: if anything is refused, nothing changes. A retry after a timed-out call that worked answers 400 (already sent); treat that as success. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page.
         * @summary Fill in fields, add a signatory and send, in one call
         * @param {FillAndSendDocumentRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        fillAndSendDocument(data: FillAndSendDocumentRequest, options?: RawAxiosRequestConfig): AxiosPromise<SendDocument200Response> {
            return localVarFp.fillAndSendDocument(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Emails each signatory a signing link with your subject and message (with ordered signing, only the first; each next one is emailed in turn). The document needs at least one field, and every signatory at least one field. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document\'s status before sending again.
         * @summary Send a document for signing by email
         * @param {SendDocumentRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sendDocument(data: SendDocumentRequest, options?: RawAxiosRequestConfig): AxiosPromise<SendDocument200Response> {
            return localVarFp.sendDocument(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Marks the document sent without emailing anyone, and returns its signatory\'s signing link to show or send yourself. Meant for a document with one signatory. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document\'s status before sending again.
         * @summary Send a document and get the signing link
         * @param {SendDocumentByLinkRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sendDocumentByLink(data: SendDocumentByLinkRequest, options?: RawAxiosRequestConfig): AxiosPromise<SendDocumentByLink200Response> {
            return localVarFp.sendDocumentByLink(data, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * SendingApi - object-oriented interface
 * @export
 * @class SendingApi
 * @extends {BaseAPI}
 */
export class SendingApi extends BaseAPI {
    /**
     * Sets the values of the document\'s fields, adds one signatory (`name`, `email`), and emails the signatories their signing links, like POST /ap1/document/send/. All or nothing: if anything is refused, nothing changes. A retry after a timed-out call that worked answers 400 (already sent); treat that as success. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page.
     * @summary Fill in fields, add a signatory and send, in one call
     * @param {FillAndSendDocumentRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SendingApi
     */
    public fillAndSendDocument(data: FillAndSendDocumentRequest, options?: RawAxiosRequestConfig) {
        return SendingApiFp(this.configuration).fillAndSendDocument(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Emails each signatory a signing link with your subject and message (with ordered signing, only the first; each next one is emailed in turn). The document needs at least one field, and every signatory at least one field. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document\'s status before sending again.
     * @summary Send a document for signing by email
     * @param {SendDocumentRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SendingApi
     */
    public sendDocument(data: SendDocumentRequest, options?: RawAxiosRequestConfig) {
        return SendingApiFp(this.configuration).sendDocument(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Marks the document sent without emailing anyone, and returns its signatory\'s signing link to show or send yourself. Meant for a document with one signatory. A template can\'t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document\'s status before sending again.
     * @summary Send a document and get the signing link
     * @param {SendDocumentByLinkRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SendingApi
     */
    public sendDocumentByLink(data: SendDocumentByLinkRequest, options?: RawAxiosRequestConfig) {
        return SendingApiFp(this.configuration).sendDocumentByLink(data, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * SignatoriesApi - axios parameter creator
 * @export
 */
export const SignatoriesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Adds several signatories at once, in the order given. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). All or nothing: if one is refused (a repeated email, say), none is added. On a document made from a template, they fill its open roles in signing order, each with that role\'s fields.
         * @summary Add several signatories
         * @param {CreateSignatoriesRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createSignatories: async (data: CreateSignatoriesRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('createSignatories', 'data', data)
            const localVarPath = `/ap1/signatories/bulk/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Adds a person who signs the document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). On a document made from a template, each signatory takes the next open template role, in signing order, with its fields; once every role is filled, more are added.
         * @summary Add a signatory
         * @param {CreateSignatoryRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createSignatory: async (data: CreateSignatoryRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('createSignatory', 'data', data)
            const localVarPath = `/ap1/signatories/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Removes a signatory, and the fields assigned to them, from the document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). The document\'s ID goes in the JSON body.
         * @summary Remove a signatory
         * @param {string} id The signatory\&#39;s ID.
         * @param {DeleteFieldRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteSignatory: async (id: string, data: DeleteFieldRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteSignatory', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('deleteSignatory', 'data', data)
            const localVarPath = `/ap1/signatories/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * The document\'s signatories with their signing status: 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.
         * @summary List a document\'s signatories
         * @param {string} documentId The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listSignatories: async (documentId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'documentId' is not null or undefined
            assertParamExists('listSignatories', 'documentId', documentId)
            const localVarPath = `/ap1/signatories/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (documentId !== undefined) {
                localVarQueryParameter['document_id'] = documentId;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * SignatoriesApi - functional programming interface
 * @export
 */
export const SignatoriesApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = SignatoriesApiAxiosParamCreator(configuration)
    return {
        /**
         * Adds several signatories at once, in the order given. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). All or nothing: if one is refused (a repeated email, say), none is added. On a document made from a template, they fill its open roles in signing order, each with that role\'s fields.
         * @summary Add several signatories
         * @param {CreateSignatoriesRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createSignatories(data: CreateSignatoriesRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Signatory>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createSignatories(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['SignatoriesApi.createSignatories']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Adds a person who signs the document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). On a document made from a template, each signatory takes the next open template role, in signing order, with its fields; once every role is filled, more are added.
         * @summary Add a signatory
         * @param {CreateSignatoryRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createSignatory(data: CreateSignatoryRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Signatory>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createSignatory(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['SignatoriesApi.createSignatory']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Removes a signatory, and the fields assigned to them, from the document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). The document\'s ID goes in the JSON body.
         * @summary Remove a signatory
         * @param {string} id The signatory\&#39;s ID.
         * @param {DeleteFieldRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteSignatory(id: string, data: DeleteFieldRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SendDocument200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteSignatory(id, data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['SignatoriesApi.deleteSignatory']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * The document\'s signatories with their signing status: 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.
         * @summary List a document\'s signatories
         * @param {string} documentId The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listSignatories(documentId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Signatory>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listSignatories(documentId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['SignatoriesApi.listSignatories']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * SignatoriesApi - factory interface
 * @export
 */
export const SignatoriesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = SignatoriesApiFp(configuration)
    return {
        /**
         * Adds several signatories at once, in the order given. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). All or nothing: if one is refused (a repeated email, say), none is added. On a document made from a template, they fill its open roles in signing order, each with that role\'s fields.
         * @summary Add several signatories
         * @param {CreateSignatoriesRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createSignatories(data: CreateSignatoriesRequest, options?: RawAxiosRequestConfig): AxiosPromise<Array<Signatory>> {
            return localVarFp.createSignatories(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Adds a person who signs the document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). On a document made from a template, each signatory takes the next open template role, in signing order, with its fields; once every role is filled, more are added.
         * @summary Add a signatory
         * @param {CreateSignatoryRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createSignatory(data: CreateSignatoryRequest, options?: RawAxiosRequestConfig): AxiosPromise<Signatory> {
            return localVarFp.createSignatory(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Removes a signatory, and the fields assigned to them, from the document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). The document\'s ID goes in the JSON body.
         * @summary Remove a signatory
         * @param {string} id The signatory\&#39;s ID.
         * @param {DeleteFieldRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteSignatory(id: string, data: DeleteFieldRequest, options?: RawAxiosRequestConfig): AxiosPromise<SendDocument200Response> {
            return localVarFp.deleteSignatory(id, data, options).then((request) => request(axios, basePath));
        },
        /**
         * The document\'s signatories with their signing status: 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.
         * @summary List a document\'s signatories
         * @param {string} documentId The document\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listSignatories(documentId: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<Signatory>> {
            return localVarFp.listSignatories(documentId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * SignatoriesApi - object-oriented interface
 * @export
 * @class SignatoriesApi
 * @extends {BaseAPI}
 */
export class SignatoriesApi extends BaseAPI {
    /**
     * Adds several signatories at once, in the order given. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). All or nothing: if one is refused (a repeated email, say), none is added. On a document made from a template, they fill its open roles in signing order, each with that role\'s fields.
     * @summary Add several signatories
     * @param {CreateSignatoriesRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SignatoriesApi
     */
    public createSignatories(data: CreateSignatoriesRequest, options?: RawAxiosRequestConfig) {
        return SignatoriesApiFp(this.configuration).createSignatories(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Adds a person who signs the document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). On a document made from a template, each signatory takes the next open template role, in signing order, with its fields; once every role is filled, more are added.
     * @summary Add a signatory
     * @param {CreateSignatoryRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SignatoriesApi
     */
    public createSignatory(data: CreateSignatoryRequest, options?: RawAxiosRequestConfig) {
        return SignatoriesApiFp(this.configuration).createSignatory(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Removes a signatory, and the fields assigned to them, from the document. Only while the document isn\'t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). The document\'s ID goes in the JSON body.
     * @summary Remove a signatory
     * @param {string} id The signatory\&#39;s ID.
     * @param {DeleteFieldRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SignatoriesApi
     */
    public deleteSignatory(id: string, data: DeleteFieldRequest, options?: RawAxiosRequestConfig) {
        return SignatoriesApiFp(this.configuration).deleteSignatory(id, data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * The document\'s signatories with their signing status: 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.
     * @summary List a document\'s signatories
     * @param {string} documentId The document\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof SignatoriesApi
     */
    public listSignatories(documentId: string, options?: RawAxiosRequestConfig) {
        return SignatoriesApiFp(this.configuration).listSignatories(documentId, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * TemplatesApi - axios parameter creator
 * @export
 */
export const TemplatesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).
         * @summary Add fields to a template
         * @param {Array<CreateTemplateFieldsRequestInner>} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTemplateFields: async (data: Array<CreateTemplateFieldsRequestInner>, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('createTemplateFields', 'data', data)
            const localVarPath = `/ap1/templates/fields/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can\'t be deleted.
         * @summary Delete a template or an unsent document
         * @param {string} id The document\&#39;s or template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteDocument: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteDocument', 'id', id)
            const localVarPath = `/ap1/documents-status/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * The fields of a template (or of any of your documents).
         * @summary List a template\'s fields
         * @param {string} documentId The template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listTemplateFields: async (documentId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'documentId' is not null or undefined
            assertParamExists('listTemplateFields', 'documentId', documentId)
            const localVarPath = `/ap1/templates/fields/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (documentId !== undefined) {
                localVarQueryParameter['document_id'] = documentId;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * The templates of your organisation\'s admin account, newest first, with their pages and fields. Bulk-send templates aren\'t listed. Paged: see `limit` and `offset`.
         * @summary List your organisation\'s templates
         * @param {string} [name] Only templates whose title contains this (any case).
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listTemplates: async (name?: string, limit?: number, offset?: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/ap1/templates/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (name !== undefined) {
                localVarQueryParameter['name'] = name;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Changes a template\'s field; send all of its values, as when adding it. Its page can\'t change: delete the field and add it again.
         * @summary Change a template\'s field
         * @param {string} id The field\&#39;s ID.
         * @param {CreateTemplateFieldsRequestInner} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateTemplateField: async (id: string, data: CreateTemplateFieldsRequestInner, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('updateTemplateField', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('updateTemplateField', 'data', data)
            const localVarPath = `/ap1/templates/fields/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * TemplatesApi - functional programming interface
 * @export
 */
export const TemplatesApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = TemplatesApiAxiosParamCreator(configuration)
    return {
        /**
         * Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).
         * @summary Add fields to a template
         * @param {Array<CreateTemplateFieldsRequestInner>} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createTemplateFields(data: Array<CreateTemplateFieldsRequestInner>, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TemplateField>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createTemplateFields(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TemplatesApi.createTemplateFields']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can\'t be deleted.
         * @summary Delete a template or an unsent document
         * @param {string} id The document\&#39;s or template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteDocument(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<SendDocument200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteDocument(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TemplatesApi.deleteDocument']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * The fields of a template (or of any of your documents).
         * @summary List a template\'s fields
         * @param {string} documentId The template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listTemplateFields(documentId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<TemplateField>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listTemplateFields(documentId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TemplatesApi.listTemplateFields']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * The templates of your organisation\'s admin account, newest first, with their pages and fields. Bulk-send templates aren\'t listed. Paged: see `limit` and `offset`.
         * @summary List your organisation\'s templates
         * @param {string} [name] Only templates whose title contains this (any case).
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listTemplates(name?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TemplatePage>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listTemplates(name, limit, offset, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TemplatesApi.listTemplates']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Changes a template\'s field; send all of its values, as when adding it. Its page can\'t change: delete the field and add it again.
         * @summary Change a template\'s field
         * @param {string} id The field\&#39;s ID.
         * @param {CreateTemplateFieldsRequestInner} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateTemplateField(id: string, data: CreateTemplateFieldsRequestInner, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TemplateField>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateTemplateField(id, data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['TemplatesApi.updateTemplateField']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * TemplatesApi - factory interface
 * @export
 */
export const TemplatesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = TemplatesApiFp(configuration)
    return {
        /**
         * Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).
         * @summary Add fields to a template
         * @param {Array<CreateTemplateFieldsRequestInner>} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTemplateFields(data: Array<CreateTemplateFieldsRequestInner>, options?: RawAxiosRequestConfig): AxiosPromise<Array<TemplateField>> {
            return localVarFp.createTemplateFields(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can\'t be deleted.
         * @summary Delete a template or an unsent document
         * @param {string} id The document\&#39;s or template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteDocument(id: string, options?: RawAxiosRequestConfig): AxiosPromise<SendDocument200Response> {
            return localVarFp.deleteDocument(id, options).then((request) => request(axios, basePath));
        },
        /**
         * The fields of a template (or of any of your documents).
         * @summary List a template\'s fields
         * @param {string} documentId The template\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listTemplateFields(documentId: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<TemplateField>> {
            return localVarFp.listTemplateFields(documentId, options).then((request) => request(axios, basePath));
        },
        /**
         * The templates of your organisation\'s admin account, newest first, with their pages and fields. Bulk-send templates aren\'t listed. Paged: see `limit` and `offset`.
         * @summary List your organisation\'s templates
         * @param {string} [name] Only templates whose title contains this (any case).
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listTemplates(name?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig): AxiosPromise<TemplatePage> {
            return localVarFp.listTemplates(name, limit, offset, options).then((request) => request(axios, basePath));
        },
        /**
         * Changes a template\'s field; send all of its values, as when adding it. Its page can\'t change: delete the field and add it again.
         * @summary Change a template\'s field
         * @param {string} id The field\&#39;s ID.
         * @param {CreateTemplateFieldsRequestInner} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateTemplateField(id: string, data: CreateTemplateFieldsRequestInner, options?: RawAxiosRequestConfig): AxiosPromise<TemplateField> {
            return localVarFp.updateTemplateField(id, data, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * TemplatesApi - object-oriented interface
 * @export
 * @class TemplatesApi
 * @extends {BaseAPI}
 */
export class TemplatesApi extends BaseAPI {
    /**
     * Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).
     * @summary Add fields to a template
     * @param {Array<CreateTemplateFieldsRequestInner>} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TemplatesApi
     */
    public createTemplateFields(data: Array<CreateTemplateFieldsRequestInner>, options?: RawAxiosRequestConfig) {
        return TemplatesApiFp(this.configuration).createTemplateFields(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can\'t be deleted.
     * @summary Delete a template or an unsent document
     * @param {string} id The document\&#39;s or template\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TemplatesApi
     */
    public deleteDocument(id: string, options?: RawAxiosRequestConfig) {
        return TemplatesApiFp(this.configuration).deleteDocument(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * The fields of a template (or of any of your documents).
     * @summary List a template\'s fields
     * @param {string} documentId The template\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TemplatesApi
     */
    public listTemplateFields(documentId: string, options?: RawAxiosRequestConfig) {
        return TemplatesApiFp(this.configuration).listTemplateFields(documentId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * The templates of your organisation\'s admin account, newest first, with their pages and fields. Bulk-send templates aren\'t listed. Paged: see `limit` and `offset`.
     * @summary List your organisation\'s templates
     * @param {string} [name] Only templates whose title contains this (any case).
     * @param {number} [limit] How many results to return (default 10).
     * @param {number} [offset] How many results to skip.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TemplatesApi
     */
    public listTemplates(name?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig) {
        return TemplatesApiFp(this.configuration).listTemplates(name, limit, offset, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Changes a template\'s field; send all of its values, as when adding it. Its page can\'t change: delete the field and add it again.
     * @summary Change a template\'s field
     * @param {string} id The field\&#39;s ID.
     * @param {CreateTemplateFieldsRequestInner} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TemplatesApi
     */
    public updateTemplateField(id: string, data: CreateTemplateFieldsRequestInner, options?: RawAxiosRequestConfig) {
        return TemplatesApiFp(this.configuration).updateTemplateField(id, data, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * WebhooksApi - axios parameter creator
 * @export
 */
export const WebhooksApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Signedly posts each document event your organisation\'s documents have to this URL (see Webhooks in the introduction). The answer includes the endpoint\'s `secret`, shown only now: keep it to check each event\'s `Signedly-Signature`. Up to 10 endpoints per API client.
         * @summary Add a webhook endpoint
         * @param {CreateWebhookEndpointRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createWebhookEndpoint: async (data: CreateWebhookEndpointRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('createWebhookEndpoint', 'data', data)
            const localVarPath = `/ap1/webhooks/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Deletes the endpoint and its delivery history.
         * @summary Delete a webhook endpoint
         * @param {string} id The endpoint\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteWebhookEndpoint: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('deleteWebhookEndpoint', 'id', id)
            const localVarPath = `/ap1/webhooks/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * One of this API client\'s endpoints, without its secret.
         * @summary Get a webhook endpoint
         * @param {string} id The endpoint\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getWebhookEndpoint: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('getWebhookEndpoint', 'id', id)
            const localVarPath = `/ap1/webhooks/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * The events sent (or being sent) to the endpoint, newest first, with how the last try went. Paged: see `limit` and `offset`.
         * @summary List an endpoint\'s deliveries
         * @param {string} id The endpoint\&#39;s ID.
         * @param {string} [status] Only &#x60;pending&#x60;, &#x60;succeeded&#x60; or &#x60;failed&#x60; deliveries.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listWebhookDeliveries: async (id: string, status?: string, limit?: number, offset?: number, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('listWebhookDeliveries', 'id', id)
            const localVarPath = `/ap1/webhooks/{id}/deliveries/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)

            if (status !== undefined) {
                localVarQueryParameter['status'] = status;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (offset !== undefined) {
                localVarQueryParameter['offset'] = offset;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * This API client\'s webhook endpoints, oldest first. Their secrets aren\'t shown: rotate one to see a new secret.
         * @summary List your webhook endpoints
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listWebhookEndpoints: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/ap1/webhooks/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Sends the same event (same `id`) again now, with fresh retries: for one that failed, or one your system lost.
         * @summary Send a delivery again
         * @param {string} id The delivery\&#39;s ID.
         * @param {object} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        redeliverWebhook: async (id: string, data: object, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('redeliverWebhook', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('redeliverWebhook', 'data', data)
            const localVarPath = `/ap1/webhooks/deliveries/{id}/redeliver/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Makes a new secret and answers with it; events from now on are signed with it, and the old one stops working at once.
         * @summary Replace a webhook endpoint\'s secret
         * @param {string} id The endpoint\&#39;s ID.
         * @param {object} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        rotateWebhookSecret: async (id: string, data: object, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('rotateWebhookSecret', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('rotateWebhookSecret', 'data', data)
            const localVarPath = `/ap1/webhooks/{id}/rotate-secret/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Posts a `webhook.test` event (no document) to the endpoint, signed like any other, to check that you receive and verify events. Its outcome shows in the endpoint\'s deliveries.
         * @summary Send a test event
         * @param {string} id The endpoint\&#39;s ID.
         * @param {object} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sendTestWebhook: async (id: string, data: object, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('sendTestWebhook', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('sendTestWebhook', 'data', data)
            const localVarPath = `/ap1/webhooks/{id}/test/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Changes what you send: `url`, `events`, `description`, `is_active`. `is_active: true` switches an endpoint on again after Signedly switched it off (20 events in a row failed), and resets its failure count.
         * @summary Change or switch a webhook endpoint on or off
         * @param {string} id The endpoint\&#39;s ID.
         * @param {UpdateWebhookEndpointRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateWebhookEndpoint: async (id: string, data: UpdateWebhookEndpointRequest, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('updateWebhookEndpoint', 'id', id)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('updateWebhookEndpoint', 'data', data)
            const localVarPath = `/ap1/webhooks/{id}/`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            await setApiKeyToObject(localVarHeaderParameter, "Authorization", configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * WebhooksApi - functional programming interface
 * @export
 */
export const WebhooksApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = WebhooksApiAxiosParamCreator(configuration)
    return {
        /**
         * Signedly posts each document event your organisation\'s documents have to this URL (see Webhooks in the introduction). The answer includes the endpoint\'s `secret`, shown only now: keep it to check each event\'s `Signedly-Signature`. Up to 10 endpoints per API client.
         * @summary Add a webhook endpoint
         * @param {CreateWebhookEndpointRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createWebhookEndpoint(data: CreateWebhookEndpointRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<WebhookEndpointWithSecret>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createWebhookEndpoint(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['WebhooksApi.createWebhookEndpoint']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Deletes the endpoint and its delivery history.
         * @summary Delete a webhook endpoint
         * @param {string} id The endpoint\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteWebhookEndpoint(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteWebhookEndpoint(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['WebhooksApi.deleteWebhookEndpoint']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * One of this API client\'s endpoints, without its secret.
         * @summary Get a webhook endpoint
         * @param {string} id The endpoint\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getWebhookEndpoint(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<WebhookEndpoint>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getWebhookEndpoint(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['WebhooksApi.getWebhookEndpoint']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * The events sent (or being sent) to the endpoint, newest first, with how the last try went. Paged: see `limit` and `offset`.
         * @summary List an endpoint\'s deliveries
         * @param {string} id The endpoint\&#39;s ID.
         * @param {string} [status] Only &#x60;pending&#x60;, &#x60;succeeded&#x60; or &#x60;failed&#x60; deliveries.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listWebhookDeliveries(id: string, status?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<WebhookDeliveryPage>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listWebhookDeliveries(id, status, limit, offset, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['WebhooksApi.listWebhookDeliveries']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * This API client\'s webhook endpoints, oldest first. Their secrets aren\'t shown: rotate one to see a new secret.
         * @summary List your webhook endpoints
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async listWebhookEndpoints(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<WebhookEndpoint>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.listWebhookEndpoints(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['WebhooksApi.listWebhookEndpoints']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Sends the same event (same `id`) again now, with fresh retries: for one that failed, or one your system lost.
         * @summary Send a delivery again
         * @param {string} id The delivery\&#39;s ID.
         * @param {object} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async redeliverWebhook(id: string, data: object, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<WebhookDelivery>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.redeliverWebhook(id, data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['WebhooksApi.redeliverWebhook']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Makes a new secret and answers with it; events from now on are signed with it, and the old one stops working at once.
         * @summary Replace a webhook endpoint\'s secret
         * @param {string} id The endpoint\&#39;s ID.
         * @param {object} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async rotateWebhookSecret(id: string, data: object, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<WebhookEndpointWithSecret>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.rotateWebhookSecret(id, data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['WebhooksApi.rotateWebhookSecret']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Posts a `webhook.test` event (no document) to the endpoint, signed like any other, to check that you receive and verify events. Its outcome shows in the endpoint\'s deliveries.
         * @summary Send a test event
         * @param {string} id The endpoint\&#39;s ID.
         * @param {object} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async sendTestWebhook(id: string, data: object, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<WebhookDelivery>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.sendTestWebhook(id, data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['WebhooksApi.sendTestWebhook']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Changes what you send: `url`, `events`, `description`, `is_active`. `is_active: true` switches an endpoint on again after Signedly switched it off (20 events in a row failed), and resets its failure count.
         * @summary Change or switch a webhook endpoint on or off
         * @param {string} id The endpoint\&#39;s ID.
         * @param {UpdateWebhookEndpointRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateWebhookEndpoint(id: string, data: UpdateWebhookEndpointRequest, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<WebhookEndpoint>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.updateWebhookEndpoint(id, data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['WebhooksApi.updateWebhookEndpoint']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * WebhooksApi - factory interface
 * @export
 */
export const WebhooksApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = WebhooksApiFp(configuration)
    return {
        /**
         * Signedly posts each document event your organisation\'s documents have to this URL (see Webhooks in the introduction). The answer includes the endpoint\'s `secret`, shown only now: keep it to check each event\'s `Signedly-Signature`. Up to 10 endpoints per API client.
         * @summary Add a webhook endpoint
         * @param {CreateWebhookEndpointRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createWebhookEndpoint(data: CreateWebhookEndpointRequest, options?: RawAxiosRequestConfig): AxiosPromise<WebhookEndpointWithSecret> {
            return localVarFp.createWebhookEndpoint(data, options).then((request) => request(axios, basePath));
        },
        /**
         * Deletes the endpoint and its delivery history.
         * @summary Delete a webhook endpoint
         * @param {string} id The endpoint\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteWebhookEndpoint(id: string, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.deleteWebhookEndpoint(id, options).then((request) => request(axios, basePath));
        },
        /**
         * One of this API client\'s endpoints, without its secret.
         * @summary Get a webhook endpoint
         * @param {string} id The endpoint\&#39;s ID.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getWebhookEndpoint(id: string, options?: RawAxiosRequestConfig): AxiosPromise<WebhookEndpoint> {
            return localVarFp.getWebhookEndpoint(id, options).then((request) => request(axios, basePath));
        },
        /**
         * The events sent (or being sent) to the endpoint, newest first, with how the last try went. Paged: see `limit` and `offset`.
         * @summary List an endpoint\'s deliveries
         * @param {string} id The endpoint\&#39;s ID.
         * @param {string} [status] Only &#x60;pending&#x60;, &#x60;succeeded&#x60; or &#x60;failed&#x60; deliveries.
         * @param {number} [limit] How many results to return (default 10).
         * @param {number} [offset] How many results to skip.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listWebhookDeliveries(id: string, status?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig): AxiosPromise<WebhookDeliveryPage> {
            return localVarFp.listWebhookDeliveries(id, status, limit, offset, options).then((request) => request(axios, basePath));
        },
        /**
         * This API client\'s webhook endpoints, oldest first. Their secrets aren\'t shown: rotate one to see a new secret.
         * @summary List your webhook endpoints
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        listWebhookEndpoints(options?: RawAxiosRequestConfig): AxiosPromise<Array<WebhookEndpoint>> {
            return localVarFp.listWebhookEndpoints(options).then((request) => request(axios, basePath));
        },
        /**
         * Sends the same event (same `id`) again now, with fresh retries: for one that failed, or one your system lost.
         * @summary Send a delivery again
         * @param {string} id The delivery\&#39;s ID.
         * @param {object} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        redeliverWebhook(id: string, data: object, options?: RawAxiosRequestConfig): AxiosPromise<WebhookDelivery> {
            return localVarFp.redeliverWebhook(id, data, options).then((request) => request(axios, basePath));
        },
        /**
         * Makes a new secret and answers with it; events from now on are signed with it, and the old one stops working at once.
         * @summary Replace a webhook endpoint\'s secret
         * @param {string} id The endpoint\&#39;s ID.
         * @param {object} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        rotateWebhookSecret(id: string, data: object, options?: RawAxiosRequestConfig): AxiosPromise<WebhookEndpointWithSecret> {
            return localVarFp.rotateWebhookSecret(id, data, options).then((request) => request(axios, basePath));
        },
        /**
         * Posts a `webhook.test` event (no document) to the endpoint, signed like any other, to check that you receive and verify events. Its outcome shows in the endpoint\'s deliveries.
         * @summary Send a test event
         * @param {string} id The endpoint\&#39;s ID.
         * @param {object} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sendTestWebhook(id: string, data: object, options?: RawAxiosRequestConfig): AxiosPromise<WebhookDelivery> {
            return localVarFp.sendTestWebhook(id, data, options).then((request) => request(axios, basePath));
        },
        /**
         * Changes what you send: `url`, `events`, `description`, `is_active`. `is_active: true` switches an endpoint on again after Signedly switched it off (20 events in a row failed), and resets its failure count.
         * @summary Change or switch a webhook endpoint on or off
         * @param {string} id The endpoint\&#39;s ID.
         * @param {UpdateWebhookEndpointRequest} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateWebhookEndpoint(id: string, data: UpdateWebhookEndpointRequest, options?: RawAxiosRequestConfig): AxiosPromise<WebhookEndpoint> {
            return localVarFp.updateWebhookEndpoint(id, data, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * WebhooksApi - object-oriented interface
 * @export
 * @class WebhooksApi
 * @extends {BaseAPI}
 */
export class WebhooksApi extends BaseAPI {
    /**
     * Signedly posts each document event your organisation\'s documents have to this URL (see Webhooks in the introduction). The answer includes the endpoint\'s `secret`, shown only now: keep it to check each event\'s `Signedly-Signature`. Up to 10 endpoints per API client.
     * @summary Add a webhook endpoint
     * @param {CreateWebhookEndpointRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksApi
     */
    public createWebhookEndpoint(data: CreateWebhookEndpointRequest, options?: RawAxiosRequestConfig) {
        return WebhooksApiFp(this.configuration).createWebhookEndpoint(data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Deletes the endpoint and its delivery history.
     * @summary Delete a webhook endpoint
     * @param {string} id The endpoint\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksApi
     */
    public deleteWebhookEndpoint(id: string, options?: RawAxiosRequestConfig) {
        return WebhooksApiFp(this.configuration).deleteWebhookEndpoint(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * One of this API client\'s endpoints, without its secret.
     * @summary Get a webhook endpoint
     * @param {string} id The endpoint\&#39;s ID.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksApi
     */
    public getWebhookEndpoint(id: string, options?: RawAxiosRequestConfig) {
        return WebhooksApiFp(this.configuration).getWebhookEndpoint(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * The events sent (or being sent) to the endpoint, newest first, with how the last try went. Paged: see `limit` and `offset`.
     * @summary List an endpoint\'s deliveries
     * @param {string} id The endpoint\&#39;s ID.
     * @param {string} [status] Only &#x60;pending&#x60;, &#x60;succeeded&#x60; or &#x60;failed&#x60; deliveries.
     * @param {number} [limit] How many results to return (default 10).
     * @param {number} [offset] How many results to skip.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksApi
     */
    public listWebhookDeliveries(id: string, status?: string, limit?: number, offset?: number, options?: RawAxiosRequestConfig) {
        return WebhooksApiFp(this.configuration).listWebhookDeliveries(id, status, limit, offset, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * This API client\'s webhook endpoints, oldest first. Their secrets aren\'t shown: rotate one to see a new secret.
     * @summary List your webhook endpoints
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksApi
     */
    public listWebhookEndpoints(options?: RawAxiosRequestConfig) {
        return WebhooksApiFp(this.configuration).listWebhookEndpoints(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Sends the same event (same `id`) again now, with fresh retries: for one that failed, or one your system lost.
     * @summary Send a delivery again
     * @param {string} id The delivery\&#39;s ID.
     * @param {object} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksApi
     */
    public redeliverWebhook(id: string, data: object, options?: RawAxiosRequestConfig) {
        return WebhooksApiFp(this.configuration).redeliverWebhook(id, data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Makes a new secret and answers with it; events from now on are signed with it, and the old one stops working at once.
     * @summary Replace a webhook endpoint\'s secret
     * @param {string} id The endpoint\&#39;s ID.
     * @param {object} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksApi
     */
    public rotateWebhookSecret(id: string, data: object, options?: RawAxiosRequestConfig) {
        return WebhooksApiFp(this.configuration).rotateWebhookSecret(id, data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Posts a `webhook.test` event (no document) to the endpoint, signed like any other, to check that you receive and verify events. Its outcome shows in the endpoint\'s deliveries.
     * @summary Send a test event
     * @param {string} id The endpoint\&#39;s ID.
     * @param {object} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksApi
     */
    public sendTestWebhook(id: string, data: object, options?: RawAxiosRequestConfig) {
        return WebhooksApiFp(this.configuration).sendTestWebhook(id, data, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Changes what you send: `url`, `events`, `description`, `is_active`. `is_active: true` switches an endpoint on again after Signedly switched it off (20 events in a row failed), and resets its failure count.
     * @summary Change or switch a webhook endpoint on or off
     * @param {string} id The endpoint\&#39;s ID.
     * @param {UpdateWebhookEndpointRequest} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WebhooksApi
     */
    public updateWebhookEndpoint(id: string, data: UpdateWebhookEndpointRequest, options?: RawAxiosRequestConfig) {
        return WebhooksApiFp(this.configuration).updateWebhookEndpoint(id, data, options).then((request) => request(this.axios, this.basePath));
    }
}



