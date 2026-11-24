/*
 * Signedly API
 *  The Signedly REST API lets your system upload documents, add signatories and fields, send them for signing and download the signed result. Every path starts with `/ap1/`, and every request and response body is JSON unless an endpoint says otherwise (the uploads are `multipart/form-data`).  ## Authentication  1. In the Signedly web app, your organisation's **super admin** opens **Account &    Settings → API** and generates a **client ID** and **client secret**. Only the    super admin can see, regenerate or replace the keys and manage webhooks there,    because a key acts for the organisation admin. 2. `POST /ap1/token/` with them. You get an `access_token` (valid **2 hours**) and    a `refresh_token` (valid **7 days**). While both are still valid, calling    `/ap1/token/` again returns the same pair. 3. Send the access token on every other call:    `Authorization: Bearer <access_token>`. 4. When the access token expires, `POST /ap1/refreshtoken/` with the refresh token    for a new access token. The refresh token stays the same and each refresh keeps    it valid for 7 more days, up to 30 days after `/ap1/token/` made it. When it has    expired, call `/ap1/token/` again. Your key pair has one token, shared by all your    processes: after a refresh, the access token it replaced keeps working for 60    seconds (never past its own expiry), so another process using it isn't refused    mid-call; switch every process to the new one.  `/ap1/token/` and `/ap1/refreshtoken/` allow 60 calls a minute per IP address; more answer 429. Every other call counts against your API client, separately for the live and the test keys: **600 calls a minute** in all, of which **120 a minute** may upload or send documents (`upload/`, `upload_app/`, `document/send/`, `document/send_url/`, `document/update_and_send/`, `documents/fromtemplate/`, `bulk-sends/`; a bulk send counts once, however many rows it has). Over a limit the call answers 429 with `Retry-After` (seconds until the next minute) and `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` (Unix time); wait that long and retry. Contact support@signedly.com if your integration needs more. A missing, unknown or expired access token answers 403 (`\"Client not found\"` or `\"Access token expired\"`).  The API acts for your **organisation's admin account**: documents you upload belong to it and appear in its Signedly web app, and you can reach only that account's documents, templates, signatories and fields, plus every document your API client made. When your super admin hands the organisation over, the API acts for the new super admin and still reaches what it made before. Another organisation's IDs answer 404, as if they didn't exist.  ## Plans  What the API allows depends on the Signedly plan of your **organisation's admin account** (Account & Settings → Account & Plan). The same rules apply to live and test keys.  | What | Free | Personal Pro | Business Pro | Teams | |---|---|---|---|---| | Generate live and test keys (Account & Settings → API) | – | ✓ | ✓ | ✓ | | Every endpoint, `/ap1/token/` and `/ap1/refreshtoken/` included | – | ✓ | ✓ | ✓ | | `require_email_otp` on `POST /ap1/signatories/` and `POST /ap1/signatories/bulk/` | – | ✓ | ✓ | ✓ | | Bulk send: `GET /ap1/bulk-sends/columns/` and `POST /ap1/bulk-sends/` | – | – | – | ✓ |  The API is part of the paid plans. On Free (or with no plan) every call answers 403 `\"... Your plan doesn't include API access.\"`, with live or test keys, also with a token or keys made earlier; they work again once the plan is paid. On a paid plan, a feature it doesn't include answers 400 with `\"Your plan doesn't include ...\"` and changes nothing, and `GET /ap1/bulk-sends/{id}/` still reports bulk sends already made.  Live documents also need an API contract with Signedly. Without one, or with an unpaid API invoice, `POST /ap1/upload/` (except templates), `/ap1/upload_app/`, `/ap1/documents/fromtemplate/`, `/ap1/bulk-sends/` and sending a draft already uploaded (`/ap1/document/send/`, `/ap1/document/send_url/`, `/ap1/document/update_and_send/`) answer 402 with live keys. Test keys work without a contract (see Sandbox).  ## API billing  Live API documents are billed per document under your organisation's API contract, on top of its Signedly plan. List prices (a contract can differ; prices exclude tax):  | Tier | Per document | Monthly minimum | |---|---|---| | Basic | $0.80 / ₹60 | 100 documents | | Standard | $0.50 / ₹40 | 250 documents | | Premium | $0.25 / ₹20 | 1,000 documents |  - **What counts:** a live document your API client sends, once, when it's sent.   `/ap1/upload_app/` documents count when they're made, because that route returns   a signing link straight away. Every document of an API bulk send counts. Drafts   never sent, templates, test-key documents and documents sent from the web app   don't count. Sending again or archiving doesn't count twice. Months are calendar   months in UTC; the API page in Account & Settings shows this month's count. - **Rejected, voided and expired documents** are still billed: a document is   billed when it's sent, whatever happens to it afterwards. A send refused before it   goes out (a 4xx answer) isn't billed. - **Minimum and overage:** on the 1st of each month your invoice charges that   month's minimum upfront, plus last month's documents above its minimum at last   month's price. Unused documents of the minimum don't roll over. The first month   is charged in full, whatever day the contract starts. - **Changing or ending a contract:** new terms apply from the next invoice. When a   contract ends, live documents keep working to the end of its last month; the next   invoice charges only that month's overage, and live documents are then refused   (402) until a contract is in place again. - **Paying:** an invoice is due 7 days after it's issued. Reminders go out 1, 7 and   13 days after the due date; 14 days after it, live documents are paused (402)   until every overdue invoice is paid, and work again as soon as it is. Test keys,   your data and documents already sent are never affected. - **Tax:** prices exclude tax; INR invoices show GST as its own line when it   applies. - **Refunds** are handled by hand: email support@signedly.com.  ## Sending a document for signing  1. `POST /ap1/upload/` a PDF or DOCX (`type` 2). The document is prepared in the    background: find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is    the upload's `id`), and wait until `GET /ap1/documents/{id}/pages/` lists its    pages. 2. `POST /ap1/signatories/` (one) or `POST /ap1/signatories/bulk/` (several) to    add the people who sign. 3. `POST /ap1/documents/fields/` to place the fields each signatory fills in. 4. Send it:    - `POST /ap1/document/send/` emails every signatory a signing link (with      ordered signing, only the first; each next one is emailed in      turn), or    - `POST /ap1/document/send_url/` returns the first signatory's signing      link, for you to show or send yourself, and emails them nothing; any other      signatories are emailed as by `send/` (all at once, or with ordered signing      each in turn after the one before signs). 5. Poll `GET /ap1/documents-status-list/` (or `GET /ap1/documents/`) until the    status is 6 (Completed), then `GET /ap1/document/download-link/` for the    signed PDF and `GET /ap1/document/download-audit-link/` for its audit trail.  **The two document lists differ on purpose.** `GET /ap1/documents/` lists only the documents this API client made through the API. `GET /ap1/documents-status-list/` lists every document of the organisation's admin, including ones made in the web app. Use the first to see your integration's own documents, and the second for everything the admin account owns.  **From a template:** upload with `type` 4 and a `template_name` (or make the template in the web app), place its fields with `POST /ap1/templates/fields/` (each on the role named by its `signatory_id`, a role's `id` from `GET /ap1/signatories/?document_id=<template ID>`; without one, on the first role), then for each signing make a document with `POST /ap1/documents/fromtemplate/`, add its signatory, and send it.  **One signer, one call:** `POST /ap1/upload_app/` uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; the signer places their own signature. After signing they go to the `redirect_url` you sent, and the signed PDF and its audit trail are emailed to `final_email` (otherwise to your organisation's admin).  **A PDF that is already digitally signed** (Adobe, DocuSign, a DSC or Aadhaar eSign) is accepted, but signing it on Signedly invalidates those signatures. The upload and send answers (`upload/`, `upload_app/`, `send/`, `send_url/`, `update_and_send/`) say so: `existing_signatures` has the `count` (null when the file couldn't be checked) and the signers' `names`, and `warnings` holds the text to show your user, e.g. \"This PDF already has 1 digital signature (by Asha Rao). Signing it on Signedly will invalidate it.\" `warnings` is empty when there is nothing to warn about. Nothing is refused because of it.  ## Quick start with curl  Each step uses an ID from the step before. `$API` is this server, e.g. `https://l0ads.signedly.com`.  ```bash # 1. Token curl -X POST $API/ap1/token/ -H 'Content-Type: application/json' \\   -d '{\"client_id\": \"<client id>\", \"client_secret\": \"<client secret>\"}' TOKEN=<access_token from the answer>  # 2. Upload a PDF (answers with the upload's id) curl -X POST $API/ap1/upload/ -H \"Authorization: Bearer $TOKEN\" \\   -F file=@nda.pdf -F name=nda-ann-lee -F type=2  # 3. Find the document, then wait until it has pages curl \"$API/ap1/documents/?name=nda-ann-lee\" -H \"Authorization: Bearer $TOKEN\" DOC=<results[0].id> curl $API/ap1/documents/$DOC/pages/ -H \"Authorization: Bearer $TOKEN\" PAGE=<[0].id>  # 4. Add the signatory curl -X POST $API/ap1/signatories/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"name\": \"Ann Lee\", \"email\": \"ann@example.com\"}' SIGNER=<id from the answer>  # 5. Place her signature: 150 × 40 points, 72 points from the left, 640 from the top curl -X POST $API/ap1/documents/fields/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '[{\"document_id\": \"'$DOC'\", \"signatory_id\": \"'$SIGNER'\", \"kind\": 2,         \"label\": \"Signature\", \"placeholder\": \"Sign here\", \"page\": \"'$PAGE'\",         \"page_number\": 0, \"x\": 72, \"y\": 640, \"width\": 150, \"height\": 40}]'  # 6. Send it (Ann gets the signing email) curl -X POST $API/ap1/document/send/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"subject\": \"Please sign the NDA\",        \"message\": \"Hi Ann, please sign by Friday.\", \"expiry_date\": \"2026-12-31\"}'  # 7. Poll until status is 6 (Completed), then get the signed PDF curl \"$API/ap1/documents-status-list/?document_ids=$DOC\" -H \"Authorization: Bearer $TOKEN\" curl \"$API/ap1/document/download-link/?id=$DOC\" -H \"Authorization: Bearer $TOKEN\" ```  ## Postman  Import the whole API into Postman with **Import → Link** and `<this server>/swaggerap1/postman.json`. Set `client_id` and `client_secret` in the collection's **Variables**, run **Get an access token** (it saves the token for every other request), and set `document_id` when a request needs one.  ## SDKs  Official client libraries, generated from this API's spec. Each also gets and renews the access token for you and checks webhook signatures:  | Language | Install | |---|---| | Python 3.8+ | `pip install signedly` | | Node / TypeScript | `npm install @signedly/sdk` | | PHP 7.4+ | `composer require signedly/sdk` | | Java 11+ | Maven or Gradle `com.signedly:signedly-sdk` |  Source and a quick start for each language: https://github.com/signedly/signedly-sdks  ## Webhooks  Instead of polling, add an endpoint with `POST /ap1/webhooks/` (or in **Account & Settings → API**) and Signedly posts your organisation's document events to it: `document.sent`, `document.viewed`, `document.signed`, `document.approved`, `document.completed`, `document.rejected`, `document.expired` and `document.voided` (all of them, or the `events` you choose). Each is a JSON `POST`:  ```json {\"id\": \"5b7f…\", \"type\": \"document.signed\", \"created_at\": \"2026-10-27T09:12:00+00:00\",  \"test\": false,  \"data\": {\"document\": {\"id\": \"6f0c…\", \"name\": \"nda.pdf\", \"status\": 5},           \"recipient\": {\"id\": \"0b6e…\", \"email\": \"ann@example.com\", \"name\": \"Ann Lee\",                         \"role\": \"signer\"}}} ```  `recipient` is null for events no recipient caused (sent, completed, expired); `test` is true for documents made with your test keys. Fetch anything else, such as download links, with your access token: events never carry links.  **Check every event is from Signedly.** The `Signedly-Signature` header is `t=<unix seconds>,v1=<signature>`, where the signature is the hex HMAC-SHA256 of `<t>.<raw body>` with the endpoint's secret. Refuse an event whose signature doesn't match or whose `t` is more than 5 minutes off. The header can carry more than one `v1` (after you rotate the secret, see below): accept the event if any of them matches. The signature with the old secret is always the last `v1`, so a check that reads only the last one keeps working until you switch secrets.  ```python import hashlib, hmac, time  def is_from_signedly(secret, header, raw_body):     items = [item.split(\"=\", 1) for item in header.split(\",\")]     t = next(value for name, value in items if name == \"t\")     signed = f\"{t}.{raw_body.decode()}\".encode()     expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()     fresh = abs(time.time() - int(t)) <= 300     return fresh and any(         hmac.compare_digest(value, expected) for name, value in items if name == \"v1\"     ) ```  **Rotating the secret** (`POST /ap1/webhooks/{id}/rotate-secret/`, or in Account & Settings → API) gives a new secret. For the next 24 hours every event is signed with both the new and the old one, so you can deploy the new secret without refusing events; `previous_secret_expires_at` says when the old one stops. If the old secret leaked, send `{\"expire_previous\": true}` and it stops at once.  **Answer 2xx within 10 seconds**, then do the work. Anything else is retried after 1 and 5 minutes, then 30 minutes and 2, 5 and 10 hours (7 tries in about 18 hours). `Signedly-Event-Id` is the same on every try of an event: use it to ignore repeats. After 20 events in a row fail for good, Signedly switches the endpoint off and emails your organisation's admin; switch it on again with `PUT /ap1/webhooks/{id}/` and `\"is_active\": true`. Each endpoint's deliveries and their last answers are at `GET /ap1/webhooks/{id}/deliveries/`, and any can be sent again. Webhook history is kept for **30 days**: a delivery that succeeded or failed more than 30 days ago is deleted and can't be sent again.  **Delivery is at least once and in no set order.** Build your endpoint for both:  - *The same event can arrive more than once:* an answer that came after the 10   seconds, a lost connection after your server got the event, or a delivery you   send again from the deliveries list. Every copy has the same `Signedly-Event-Id`   and the same body (`id`, `created_at`, `data`); only `t` and the signature in   `Signedly-Signature` are new. Keep the event ids you've handled and skip repeats. - *Events can arrive out of order:* each is sent on its own and retries mix in, so   `document.signed` can come after `document.completed`. `created_at` is when the   event happened, not when it was sent: order by it, or fetch the document   (`GET /ap1/documents-status/{id}/`) for its current status. - *What counts as a failure:* any answer that isn't 2xx within 10 seconds,   redirects (3xx) included, since they aren't followed; timeouts; connection and   TLS errors; and a URL that no longer points to a public address. Each is retried   on the schedule above. An endpoint that is switched off, or an organisation   whose plan has no API access, gets nothing, and those deliveries fail at once   without counting toward switching the endpoint off. - *Where events go:* only `https://` URLs on public internet addresses, checked   when you save the endpoint and before every try.  ## Sandbox  Build and test against the API without paying for documents: in **Account & Settings → API**, generate your **test keys**, and get a token with them at `/ap1/token/` as usual. Everything works the same, except that what you upload or make from a template with a test token is a **test document** (`is_test` on its upload):  - every page of its PDF and of its audit trail says **TEST – NOT LEGALLY BINDING**; - its emails are real, with `[TEST]` at the start of the subject; - it isn't billed or counted toward your plan; - your organisation can make 50 a calendar month (templates don't count); the next   upload answers 429; - a test token sees and acts only on test documents: a live document answers 404   and isn't listed. It can use your templates (list them, read their fields, make   documents and bulk sends from them) but not change or delete a live one. - `/ap1/logs/` and `/ap1/logs/hits/` show a test token only calls made with your   test keys, and a live token only live calls (add `is_test=true` to see the   test calls). Webhook deliveries listed or resent with a test token are only   those of test documents' events (`\"test\": true`).  ## Fields  Positions and sizes are in **PDF points** (1/72 inch), measured from the **top-left corner** of the page as it is displayed (rotation applied). `page_number` counts pages from 0: send the `id` and `page_number` that `GET /ap1/documents/{id}/pages/` lists for the same page. A field needs a known `kind` and a `width` and `height` above 0, and must sit wholly on its page (1 point of tolerance); otherwise it is refused with 400. A field's page and signatory can't be changed later: delete the field and add it again.  ## Status values  **Document `status`:** 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired · 10 Voided (stopped by its sender in the web app; its links no longer sign). Signatories, fields and sends are only accepted while a document is 1–3 (not yet sent).  **Signatory `status`:** 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.  ## Lists  `GET /ap1/documents/`, `/ap1/documents-status-list/`, `/ap1/templates/`, `/ap1/logs/` and `/ap1/logs/hits/` are paged: pass `limit` (default 10, at most 100; a larger value gets 100) and `offset`, and read `count`, `next`, `previous` and `results` from the response. Follow `next` until it is null to read every result.  ## Errors  | Status | Meaning | |---|---| | 400 | The request was refused, also when your plan doesn't include it (see Plans); the body says why (`{\"error\": \"...\"}`, or the name of each bad field with its messages). Nothing was changed. | | 403 | The access token is missing, unknown or expired; the client ID and secret or the refresh token were refused; the organisation's plan has no API access (Free, see Plans); or an `expiry_date` isn't in the future (`\"Invalid Date Entered\"`). | | 402 | No API contract, or an unpaid API invoice: live documents are refused (test keys keep working). | | 404 | The document, template, signatory or field doesn't exist or isn't yours. | | 429 | Too many requests this minute (see the limits under Authentication; wait `Retry-After` seconds), or this month's 50 test documents are used. | | 5xx | Our side failed; retry later. |  A send that times out may still have worked: check the document's status before sending again (a second send of a sent document answers 400).  Download, view and audit links are valid for about 7 days; ask for a new one whenever you need it.  ## Versioning and changes  The API has one version today, `/ap1/`. A **breaking change** is only ever made in a new version path (for example `/ap1/v2/`): the current one keeps working, and its end (sunset) date is announced at least **6 months** ahead, by email to every API client's organisation admin and here in these docs.  Breaking means: removing or renaming a route, a field or an enum value; a new required input; a changed status code or error shape; a changed meaning of an existing field.  Not breaking, and made without notice: new routes; new optional inputs; new fields in responses and webhook payloads; new webhook event types; new enum values in responses; clearer error messages. **Ignore fields and event types you don't know**, so these changes never break your integration.  The SDKs follow the API: a breaking change comes with a new major SDK version (see SDKs). 
 *
 * The version of the OpenAPI document: v1
 * Contact: support@signedly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

package com.signedly.api;

import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Pair;

import com.signedly.model.CreateSignatoriesRequest;
import com.signedly.model.CreateSignatoryRequest;
import com.signedly.model.DeleteDocument204Response;
import com.signedly.model.DeleteFieldRequest;
import com.signedly.model.Signatory;
import java.util.UUID;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;

import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.net.http.HttpRequest;
import java.nio.channels.Channels;
import java.nio.channels.Pipe;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import java.util.ArrayList;
import java.util.StringJoiner;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;

@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", comments = "Generator version: 7.10.0")
public class SignatoriesApi {
  private final HttpClient memberVarHttpClient;
  private final ObjectMapper memberVarObjectMapper;
  private final String memberVarBaseUri;
  private final Consumer<HttpRequest.Builder> memberVarInterceptor;
  private final Duration memberVarReadTimeout;
  private final Consumer<HttpResponse<InputStream>> memberVarResponseInterceptor;
  private final Consumer<HttpResponse<String>> memberVarAsyncResponseInterceptor;

  public SignatoriesApi() {
    this(new ApiClient());
  }

  public SignatoriesApi(ApiClient apiClient) {
    memberVarHttpClient = apiClient.getHttpClient();
    memberVarObjectMapper = apiClient.getObjectMapper();
    memberVarBaseUri = apiClient.getBaseUri();
    memberVarInterceptor = apiClient.getRequestInterceptor();
    memberVarReadTimeout = apiClient.getReadTimeout();
    memberVarResponseInterceptor = apiClient.getResponseInterceptor();
    memberVarAsyncResponseInterceptor = apiClient.getAsyncResponseInterceptor();
  }

  protected ApiException getApiException(String operationId, HttpResponse<InputStream> response) throws IOException {
    String body = response.body() == null ? null : new String(response.body().readAllBytes());
    String message = formatExceptionMessage(operationId, response.statusCode(), body);
    return new ApiException(response.statusCode(), message, response.headers(), body);
  }

  private String formatExceptionMessage(String operationId, int statusCode, String body) {
    if (body == null || body.isEmpty()) {
      body = "[no body]";
    }
    return operationId + " call failed with: " + statusCode + " - " + body;
  }

  /**
   * Add several signatories
   * Adds several signatories at once, in the order given. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). All or nothing: if one is refused (a repeated email, say), none is added. On a document made from a template, they fill its open roles in signing order, each with that role&#39;s fields.
   * @param data  (required)
   * @return List&lt;Signatory&gt;
   * @throws ApiException if fails to make API call
   */
  public List<Signatory> createSignatories(CreateSignatoriesRequest data) throws ApiException {
    ApiResponse<List<Signatory>> localVarResponse = createSignatoriesWithHttpInfo(data);
    return localVarResponse.getData();
  }

  /**
   * Add several signatories
   * Adds several signatories at once, in the order given. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). All or nothing: if one is refused (a repeated email, say), none is added. On a document made from a template, they fill its open roles in signing order, each with that role&#39;s fields.
   * @param data  (required)
   * @return ApiResponse&lt;List&lt;Signatory&gt;&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<List<Signatory>> createSignatoriesWithHttpInfo(CreateSignatoriesRequest data) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = createSignatoriesRequestBuilder(data);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("createSignatories", localVarResponse);
        }
        return new ApiResponse<List<Signatory>>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<List<Signatory>>() {}) // closes the InputStream
        );
      } finally {
      }
    } catch (IOException e) {
      throw new ApiException(e);
    }
    catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new ApiException(e);
    }
  }

  private HttpRequest.Builder createSignatoriesRequestBuilder(CreateSignatoriesRequest data) throws ApiException {
    // verify the required parameter 'data' is set
    if (data == null) {
      throw new ApiException(400, "Missing the required parameter 'data' when calling createSignatories");
    }

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/signatories/bulk/";

    localVarRequestBuilder.uri(URI.create(memberVarBaseUri + localVarPath));

    localVarRequestBuilder.header("Content-Type", "application/json");
    localVarRequestBuilder.header("Accept", "application/json");

    try {
      byte[] localVarPostBody = memberVarObjectMapper.writeValueAsBytes(data);
      localVarRequestBuilder.method("POST", HttpRequest.BodyPublishers.ofByteArray(localVarPostBody));
    } catch (IOException e) {
      throw new ApiException(e);
    }
    if (memberVarReadTimeout != null) {
      localVarRequestBuilder.timeout(memberVarReadTimeout);
    }
    if (memberVarInterceptor != null) {
      memberVarInterceptor.accept(localVarRequestBuilder);
    }
    return localVarRequestBuilder;
  }

  /**
   * Add a signatory
   * Adds a person who signs the document. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). On a document made from a template, each signatory takes the next open template role, in signing order, with its fields; once every role is filled, more are added.
   * @param data  (required)
   * @return Signatory
   * @throws ApiException if fails to make API call
   */
  public Signatory createSignatory(CreateSignatoryRequest data) throws ApiException {
    ApiResponse<Signatory> localVarResponse = createSignatoryWithHttpInfo(data);
    return localVarResponse.getData();
  }

  /**
   * Add a signatory
   * Adds a person who signs the document. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). On a document made from a template, each signatory takes the next open template role, in signing order, with its fields; once every role is filled, more are added.
   * @param data  (required)
   * @return ApiResponse&lt;Signatory&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<Signatory> createSignatoryWithHttpInfo(CreateSignatoryRequest data) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = createSignatoryRequestBuilder(data);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("createSignatory", localVarResponse);
        }
        return new ApiResponse<Signatory>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<Signatory>() {}) // closes the InputStream
        );
      } finally {
      }
    } catch (IOException e) {
      throw new ApiException(e);
    }
    catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new ApiException(e);
    }
  }

  private HttpRequest.Builder createSignatoryRequestBuilder(CreateSignatoryRequest data) throws ApiException {
    // verify the required parameter 'data' is set
    if (data == null) {
      throw new ApiException(400, "Missing the required parameter 'data' when calling createSignatory");
    }

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/signatories/";

    localVarRequestBuilder.uri(URI.create(memberVarBaseUri + localVarPath));

    localVarRequestBuilder.header("Content-Type", "application/json");
    localVarRequestBuilder.header("Accept", "application/json");

    try {
      byte[] localVarPostBody = memberVarObjectMapper.writeValueAsBytes(data);
      localVarRequestBuilder.method("POST", HttpRequest.BodyPublishers.ofByteArray(localVarPostBody));
    } catch (IOException e) {
      throw new ApiException(e);
    }
    if (memberVarReadTimeout != null) {
      localVarRequestBuilder.timeout(memberVarReadTimeout);
    }
    if (memberVarInterceptor != null) {
      memberVarInterceptor.accept(localVarRequestBuilder);
    }
    return localVarRequestBuilder;
  }

  /**
   * Remove a signatory
   * Removes a signatory, and the fields assigned to them, from the document. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). The document&#39;s ID goes in the JSON body.
   * @param id The signatory&#39;s ID. (required)
   * @param data  (required)
   * @return DeleteDocument204Response
   * @throws ApiException if fails to make API call
   */
  public DeleteDocument204Response deleteSignatory(UUID id, DeleteFieldRequest data) throws ApiException {
    ApiResponse<DeleteDocument204Response> localVarResponse = deleteSignatoryWithHttpInfo(id, data);
    return localVarResponse.getData();
  }

  /**
   * Remove a signatory
   * Removes a signatory, and the fields assigned to them, from the document. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). The document&#39;s ID goes in the JSON body.
   * @param id The signatory&#39;s ID. (required)
   * @param data  (required)
   * @return ApiResponse&lt;DeleteDocument204Response&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<DeleteDocument204Response> deleteSignatoryWithHttpInfo(UUID id, DeleteFieldRequest data) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = deleteSignatoryRequestBuilder(id, data);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("deleteSignatory", localVarResponse);
        }
        return new ApiResponse<DeleteDocument204Response>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<DeleteDocument204Response>() {}) // closes the InputStream
        );
      } finally {
      }
    } catch (IOException e) {
      throw new ApiException(e);
    }
    catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new ApiException(e);
    }
  }

  private HttpRequest.Builder deleteSignatoryRequestBuilder(UUID id, DeleteFieldRequest data) throws ApiException {
    // verify the required parameter 'id' is set
    if (id == null) {
      throw new ApiException(400, "Missing the required parameter 'id' when calling deleteSignatory");
    }
    // verify the required parameter 'data' is set
    if (data == null) {
      throw new ApiException(400, "Missing the required parameter 'data' when calling deleteSignatory");
    }

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/signatories/{id}/"
        .replace("{id}", ApiClient.urlEncode(id.toString()));

    localVarRequestBuilder.uri(URI.create(memberVarBaseUri + localVarPath));

    localVarRequestBuilder.header("Content-Type", "application/json");
    localVarRequestBuilder.header("Accept", "application/json");

    try {
      byte[] localVarPostBody = memberVarObjectMapper.writeValueAsBytes(data);
      localVarRequestBuilder.method("DELETE", HttpRequest.BodyPublishers.ofByteArray(localVarPostBody));
    } catch (IOException e) {
      throw new ApiException(e);
    }
    if (memberVarReadTimeout != null) {
      localVarRequestBuilder.timeout(memberVarReadTimeout);
    }
    if (memberVarInterceptor != null) {
      memberVarInterceptor.accept(localVarRequestBuilder);
    }
    return localVarRequestBuilder;
  }

  /**
   * List a document&#39;s signatories
   * The document&#39;s signatories with their signing status: 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.
   * @param documentId The document&#39;s ID. (required)
   * @return List&lt;Signatory&gt;
   * @throws ApiException if fails to make API call
   */
  public List<Signatory> listSignatories(UUID documentId) throws ApiException {
    ApiResponse<List<Signatory>> localVarResponse = listSignatoriesWithHttpInfo(documentId);
    return localVarResponse.getData();
  }

  /**
   * List a document&#39;s signatories
   * The document&#39;s signatories with their signing status: 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.
   * @param documentId The document&#39;s ID. (required)
   * @return ApiResponse&lt;List&lt;Signatory&gt;&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<List<Signatory>> listSignatoriesWithHttpInfo(UUID documentId) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = listSignatoriesRequestBuilder(documentId);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("listSignatories", localVarResponse);
        }
        return new ApiResponse<List<Signatory>>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<List<Signatory>>() {}) // closes the InputStream
        );
      } finally {
      }
    } catch (IOException e) {
      throw new ApiException(e);
    }
    catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new ApiException(e);
    }
  }

  private HttpRequest.Builder listSignatoriesRequestBuilder(UUID documentId) throws ApiException {
    // verify the required parameter 'documentId' is set
    if (documentId == null) {
      throw new ApiException(400, "Missing the required parameter 'documentId' when calling listSignatories");
    }

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/signatories/";

    List<Pair> localVarQueryParams = new ArrayList<>();
    StringJoiner localVarQueryStringJoiner = new StringJoiner("&");
    String localVarQueryParameterBaseName;
    localVarQueryParameterBaseName = "document_id";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("document_id", documentId));

    if (!localVarQueryParams.isEmpty() || localVarQueryStringJoiner.length() != 0) {
      StringJoiner queryJoiner = new StringJoiner("&");
      localVarQueryParams.forEach(p -> queryJoiner.add(p.getName() + '=' + p.getValue()));
      if (localVarQueryStringJoiner.length() != 0) {
        queryJoiner.add(localVarQueryStringJoiner.toString());
      }
      localVarRequestBuilder.uri(URI.create(memberVarBaseUri + localVarPath + '?' + queryJoiner.toString()));
    } else {
      localVarRequestBuilder.uri(URI.create(memberVarBaseUri + localVarPath));
    }

    localVarRequestBuilder.header("Accept", "application/json");

    localVarRequestBuilder.method("GET", HttpRequest.BodyPublishers.noBody());
    if (memberVarReadTimeout != null) {
      localVarRequestBuilder.timeout(memberVarReadTimeout);
    }
    if (memberVarInterceptor != null) {
      memberVarInterceptor.accept(localVarRequestBuilder);
    }
    return localVarRequestBuilder;
  }

}
