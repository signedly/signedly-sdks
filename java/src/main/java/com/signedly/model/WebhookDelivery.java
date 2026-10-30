/*
 * Signedly API
 *  The Signedly REST API lets your system upload documents, add signatories and fields, send them for signing and download the signed result. Every path starts with `/ap1/`, and every request and response body is JSON unless an endpoint says otherwise (the uploads are `multipart/form-data`).  ## Authentication  1. In the Signedly web app, open **Account & Settings → API** and generate a    **client ID** and **client secret** for your organisation. 2. `POST /ap1/token/` with them. You get an `access_token` (valid **2 hours**) and    a `refresh_token` (valid **7 days**). While both are still valid, calling    `/ap1/token/` again returns the same pair. 3. Send the access token on every other call:    `Authorization: Bearer <access_token>`. 4. When the access token expires, `POST /ap1/refreshtoken/` with the refresh token    for a new access token. When the refresh token has expired too, call    `/ap1/token/` again.  `/ap1/token/` and `/ap1/refreshtoken/` allow 60 calls a minute per IP address; more answer 429. A missing, unknown or expired access token answers 403 (`\"Client not found\"` or `\"Access token expired\"`).  The API acts for your **organisation's admin account**: documents you upload belong to it and appear in its Signedly web app, and you can reach only that account's documents, templates, signatories and fields. Another organisation's IDs answer 404, as if they didn't exist.  ## Plans  What the API allows depends on the Signedly plan of your **organisation's admin account** (Account & Settings → Account & Plan). The same rules apply to live and test keys.  | What | Free | Personal Pro | Business Pro | Teams | |---|---|---|---|---| | Generate live and test keys (Account & Settings → API) | – | ✓ | ✓ | ✓ | | Every endpoint, `/ap1/token/` and `/ap1/refreshtoken/` included | – | ✓ | ✓ | ✓ | | `require_email_otp` on `POST /ap1/signatories/` and `POST /ap1/signatories/bulk/` | – | ✓ | ✓ | ✓ | | Bulk send: `GET /ap1/bulk-sends/columns/` and `POST /ap1/bulk-sends/` | – | – | – | ✓ |  The API is part of the paid plans. On Free (or with no plan) every call answers 403 `\"... Your plan doesn't include API access.\"`, with live or test keys, also with a token or keys made earlier; they work again once the plan is paid. On a paid plan, a feature it doesn't include answers 400 with `\"Your plan doesn't include ...\"` and changes nothing, and `GET /ap1/bulk-sends/{id}/` still reports bulk sends already made.  Live documents also need an API contract with Signedly. Without one, or with an unpaid API invoice, `POST /ap1/upload/` (except templates), `/ap1/upload_app/`, `/ap1/documents/fromtemplate/` and `/ap1/bulk-sends/` answer 402 with live keys. Test keys work without a contract (see Sandbox).  ## Sending a document for signing  1. `POST /ap1/upload/` a PDF or DOCX (`type` 2). The document is prepared in the    background: find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is    the upload's `id`), and wait until `GET /ap1/documents/{id}/pages/` lists its    pages. 2. `POST /ap1/signatories/` (one) or `POST /ap1/signatories/bulk/` (several) to    add the people who sign. 3. `POST /ap1/documents/fields/` to place the fields each signatory fills in. 4. Send it:    - `POST /ap1/document/send/` emails every signatory a signing link (with      ordered signing, only the first; each next one is emailed in      turn), or    - `POST /ap1/document/send_url/` sends no email and returns the first      signatory's signing link, for you to show or send yourself. 5. Poll `GET /ap1/documents-status-list/` (or `GET /ap1/documents/`) until the    status is 6 (Completed), then `GET /ap1/document/download-link/` for the    signed PDF and `GET /ap1/document/download-audit-link/` for its audit trail.  **From a template:** upload with `type` 4 and a `template_name` (or make the template in the web app), place its fields with `POST /ap1/templates/fields/`, then for each signing make a document with `POST /ap1/documents/fromtemplate/`, add its signatory, and send it.  **One signer, one call:** `POST /ap1/upload_app/` uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; the signer places their own signature. After signing they go to the `redirect_url` you sent, and the signed PDF and its audit trail are emailed to `final_email` (otherwise to your organisation's admin).  ## Quick start with curl  Each step uses an ID from the step before. `$API` is this server, e.g. `https://l0ads.signedly.com`.  ```bash # 1. Token curl -X POST $API/ap1/token/ -H 'Content-Type: application/json' \\   -d '{\"client_id\": \"<client id>\", \"client_secret\": \"<client secret>\"}' TOKEN=<access_token from the answer>  # 2. Upload a PDF (answers with the upload's id) curl -X POST $API/ap1/upload/ -H \"Authorization: Bearer $TOKEN\" \\   -F file=@nda.pdf -F name=nda-ann-lee -F type=2  # 3. Find the document, then wait until it has pages curl \"$API/ap1/documents/?name=nda-ann-lee\" -H \"Authorization: Bearer $TOKEN\" DOC=<results[0].id> curl $API/ap1/documents/$DOC/pages/ -H \"Authorization: Bearer $TOKEN\" PAGE=<[0].id>  # 4. Add the signatory curl -X POST $API/ap1/signatories/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"name\": \"Ann Lee\", \"email\": \"ann@example.com\"}' SIGNER=<id from the answer>  # 5. Place her signature: 150 × 40 points, 72 points from the left, 640 from the top curl -X POST $API/ap1/documents/fields/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '[{\"document_id\": \"'$DOC'\", \"signatory_id\": \"'$SIGNER'\", \"kind\": 2,         \"label\": \"Signature\", \"placeholder\": \"Sign here\", \"page\": \"'$PAGE'\",         \"page_number\": 0, \"x\": 72, \"y\": 640, \"width\": 150, \"height\": 40}]'  # 6. Send it (Ann gets the signing email) curl -X POST $API/ap1/document/send/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"subject\": \"Please sign the NDA\",        \"message\": \"Hi Ann, please sign by Friday.\", \"expiry_date\": \"2026-12-31\"}'  # 7. Poll until status is 6 (Completed), then get the signed PDF curl \"$API/ap1/documents-status-list/?document_ids=$DOC\" -H \"Authorization: Bearer $TOKEN\" curl \"$API/ap1/document/download-link/?id=$DOC\" -H \"Authorization: Bearer $TOKEN\" ```  ## Postman  Import the whole API into Postman with **Import → Link** and `<this server>/swaggerap1/postman.json`. Set `client_id` and `client_secret` in the collection's **Variables**, run **Get an access token** (it saves the token for every other request), and set `document_id` when a request needs one.  ## Webhooks  Instead of polling, add an endpoint with `POST /ap1/webhooks/` (or in **Account & Settings → API**) and Signedly posts your organisation's document events to it: `document.sent`, `document.viewed`, `document.signed`, `document.approved`, `document.completed`, `document.rejected` and `document.expired` (all of them, or the `events` you choose). Each is a JSON `POST`:  ```json {\"id\": \"5b7f…\", \"type\": \"document.signed\", \"created_at\": \"2026-10-27T09:12:00+00:00\",  \"test\": false,  \"data\": {\"document\": {\"id\": \"6f0c…\", \"name\": \"nda.pdf\", \"status\": 5},           \"recipient\": {\"id\": \"0b6e…\", \"email\": \"ann@example.com\", \"name\": \"Ann Lee\",                         \"role\": \"signer\"}}} ```  `recipient` is null for events no recipient caused (sent, completed, expired); `test` is true for documents made with your test keys. Fetch anything else, such as download links, with your access token: events never carry links.  **Check every event is from Signedly.** The `Signedly-Signature` header is `t=<unix seconds>,v1=<signature>`, where the signature is the hex HMAC-SHA256 of `<t>.<raw body>` with the endpoint's secret. Refuse an event whose signature doesn't match or whose `t` is more than 5 minutes off:  ```python import hashlib, hmac, time  def is_from_signedly(secret, header, raw_body):     parts = dict(item.split(\"=\", 1) for item in header.split(\",\"))     signed = f\"{parts['t']}.{raw_body.decode()}\".encode()     expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()     fresh = abs(time.time() - int(parts[\"t\"])) <= 300     return fresh and hmac.compare_digest(parts[\"v1\"], expected) ```  **Answer 2xx within 10 seconds**, then do the work. Anything else is retried after 1 and 5 minutes, then 30 minutes and 2, 5 and 10 hours (7 tries in about 18 hours). `Signedly-Event-Id` is the same on every try of an event: use it to ignore repeats. After 20 events in a row fail for good, Signedly switches the endpoint off and emails your organisation's admin; switch it on again with `PUT /ap1/webhooks/{id}/` and `\"is_active\": true`. Each endpoint's deliveries and their last answers are at `GET /ap1/webhooks/{id}/deliveries/`, and any can be sent again.  ## Sandbox  Build and test against the API without paying for documents: in **Account & Settings → API**, generate your **test keys**, and get a token with them at `/ap1/token/` as usual. Everything works the same, except that what you upload or make from a template with a test token is a **test document** (`is_test` on its upload):  - every page of its PDF and of its audit trail says **TEST – NOT LEGALLY BINDING**; - its emails are real, with `[TEST]` at the start of the subject; - it isn't billed or counted toward your plan; - your organisation can make 50 a calendar month (templates don't count); the next   upload answers 429.  ## Fields  Positions and sizes are in **PDF points** (1/72 inch), measured from the **top-left corner** of the page as it is displayed (rotation applied). `page_number` counts pages from 0. A field must sit wholly on its page (1 point of tolerance); otherwise it is refused with 400. A field's page and signatory can't be changed later: delete the field and add it again.  ## Status values  **Document `status`:** 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Signatories, fields and sends are only accepted while a document is 1–3 (not yet sent).  **Signatory `status`:** 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.  ## Lists  `GET /ap1/documents/`, `/ap1/documents-status-list/`, `/ap1/templates/`, `/ap1/logs/` and `/ap1/logs/hits/` are paged: pass `limit` (default 10) and `offset`, and read `count`, `next`, `previous` and `results` from the response.  ## Errors  | Status | Meaning | |---|---| | 400 | The request was refused, also when your plan doesn't include it (see Plans); the body says why (`{\"error\": \"...\"}`, or the name of each bad field with its messages). Nothing was changed. | | 403 | The access token is missing, unknown or expired; the client ID and secret or the refresh token were refused; the organisation's plan has no API access (Free, see Plans); or an `expiry_date` isn't in the future (`\"Invalid Date Entered\"`). | | 402 | No API contract, or an unpaid API invoice: live documents are refused (test keys keep working). | | 404 | The document, template, signatory or field doesn't exist or isn't yours. | | 429 | Too many token requests (wait a minute), or this month's 50 test documents are used. | | 5xx | Our side failed; retry later. |  A send that times out may still have worked: check the document's status before sending again (a second send of a sent document answers 400).  Download, view and audit links are valid for about 7 days; ask for a new one whenever you need it. 
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


package com.signedly.model;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.StringJoiner;
import java.util.Objects;
import java.util.Map;
import java.util.HashMap;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.annotation.JsonValue;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


import com.signedly.client.ApiClient;
/**
 * WebhookDelivery
 */
@JsonPropertyOrder({
  WebhookDelivery.JSON_PROPERTY_ATTEMPTS,
  WebhookDelivery.JSON_PROPERTY_CREATED_AT,
  WebhookDelivery.JSON_PROPERTY_DELIVERED_AT,
  WebhookDelivery.JSON_PROPERTY_DURATION_MS,
  WebhookDelivery.JSON_PROPERTY_EVENT_ID,
  WebhookDelivery.JSON_PROPERTY_EVENT_TYPE,
  WebhookDelivery.JSON_PROPERTY_ID,
  WebhookDelivery.JSON_PROPERTY_LAST_ERROR,
  WebhookDelivery.JSON_PROPERTY_LAST_STATUS_CODE,
  WebhookDelivery.JSON_PROPERTY_NEXT_ATTEMPT_AT,
  WebhookDelivery.JSON_PROPERTY_PAYLOAD,
  WebhookDelivery.JSON_PROPERTY_RESPONSE_SNIPPET,
  WebhookDelivery.JSON_PROPERTY_STATUS
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", comments = "Generator version: 7.10.0")
public class WebhookDelivery {
  public static final String JSON_PROPERTY_ATTEMPTS = "attempts";
  @javax.annotation.Nullable
  private Integer attempts;

  public static final String JSON_PROPERTY_CREATED_AT = "created_at";
  @javax.annotation.Nullable
  private OffsetDateTime createdAt;

  public static final String JSON_PROPERTY_DELIVERED_AT = "delivered_at";
  @javax.annotation.Nullable
  private OffsetDateTime deliveredAt;

  public static final String JSON_PROPERTY_DURATION_MS = "duration_ms";
  @javax.annotation.Nullable
  private Integer durationMs;

  public static final String JSON_PROPERTY_EVENT_ID = "event_id";
  @javax.annotation.Nullable
  private UUID eventId;

  public static final String JSON_PROPERTY_EVENT_TYPE = "event_type";
  @javax.annotation.Nullable
  private String eventType;

  public static final String JSON_PROPERTY_ID = "id";
  @javax.annotation.Nullable
  private UUID id;

  public static final String JSON_PROPERTY_LAST_ERROR = "last_error";
  @javax.annotation.Nullable
  private String lastError;

  public static final String JSON_PROPERTY_LAST_STATUS_CODE = "last_status_code";
  @javax.annotation.Nullable
  private Integer lastStatusCode;

  public static final String JSON_PROPERTY_NEXT_ATTEMPT_AT = "next_attempt_at";
  @javax.annotation.Nullable
  private OffsetDateTime nextAttemptAt;

  public static final String JSON_PROPERTY_PAYLOAD = "payload";
  @javax.annotation.Nullable
  private Object payload;

  public static final String JSON_PROPERTY_RESPONSE_SNIPPET = "response_snippet";
  @javax.annotation.Nullable
  private String responseSnippet;

  public static final String JSON_PROPERTY_STATUS = "status";
  @javax.annotation.Nullable
  private String status;

  public WebhookDelivery() { 
  }

  @JsonCreator
  public WebhookDelivery(
    @JsonProperty(JSON_PROPERTY_ATTEMPTS) Integer attempts, 
    @JsonProperty(JSON_PROPERTY_CREATED_AT) OffsetDateTime createdAt, 
    @JsonProperty(JSON_PROPERTY_DELIVERED_AT) OffsetDateTime deliveredAt, 
    @JsonProperty(JSON_PROPERTY_DURATION_MS) Integer durationMs, 
    @JsonProperty(JSON_PROPERTY_EVENT_ID) UUID eventId, 
    @JsonProperty(JSON_PROPERTY_EVENT_TYPE) String eventType, 
    @JsonProperty(JSON_PROPERTY_ID) UUID id, 
    @JsonProperty(JSON_PROPERTY_LAST_ERROR) String lastError, 
    @JsonProperty(JSON_PROPERTY_LAST_STATUS_CODE) Integer lastStatusCode, 
    @JsonProperty(JSON_PROPERTY_NEXT_ATTEMPT_AT) OffsetDateTime nextAttemptAt, 
    @JsonProperty(JSON_PROPERTY_PAYLOAD) Object payload, 
    @JsonProperty(JSON_PROPERTY_RESPONSE_SNIPPET) String responseSnippet, 
    @JsonProperty(JSON_PROPERTY_STATUS) String status
  ) {
  this();
    this.attempts = attempts;
    this.createdAt = createdAt;
    this.deliveredAt = deliveredAt;
    this.durationMs = durationMs;
    this.eventId = eventId;
    this.eventType = eventType;
    this.id = id;
    this.lastError = lastError;
    this.lastStatusCode = lastStatusCode;
    this.nextAttemptAt = nextAttemptAt;
    this.payload = payload;
    this.responseSnippet = responseSnippet;
    this.status = status;
  }

  /**
   * Tries so far.
   * @return attempts
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_ATTEMPTS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getAttempts() {
    return attempts;
  }




  /**
   * When the event was queued.
   * @return createdAt
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_CREATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }




  /**
   * When it succeeded, or null.
   * @return deliveredAt
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_DELIVERED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public OffsetDateTime getDeliveredAt() {
    return deliveredAt;
  }




  /**
   * How long the last try took.
   * @return durationMs
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_DURATION_MS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getDurationMs() {
    return durationMs;
  }




  /**
   * The event&#39;s ID (Signedly-Event-Id).
   * @return eventId
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_EVENT_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public UUID getEventId() {
    return eventId;
  }




  /**
   * e.g. document.signed
   * @return eventType
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_EVENT_TYPE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getEventType() {
    return eventType;
  }




  /**
   * The delivery&#39;s ID.
   * @return id
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public UUID getId() {
    return id;
  }




  /**
   * Why the last try failed, or empty.
   * @return lastError
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_LAST_ERROR)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getLastError() {
    return lastError;
  }




  /**
   * Your endpoint&#39;s last HTTP answer, or null.
   * @return lastStatusCode
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_LAST_STATUS_CODE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getLastStatusCode() {
    return lastStatusCode;
  }




  /**
   * When it is tried next, while pending.
   * @return nextAttemptAt
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_NEXT_ATTEMPT_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public OffsetDateTime getNextAttemptAt() {
    return nextAttemptAt;
  }




  /**
   * The body sent.
   * @return payload
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_PAYLOAD)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Object getPayload() {
    return payload;
  }




  /**
   * The start of your endpoint&#39;s last answer.
   * @return responseSnippet
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_RESPONSE_SNIPPET)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getResponseSnippet() {
    return responseSnippet;
  }




  /**
   * pending (being tried), succeeded or failed.
   * @return status
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_STATUS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getStatus() {
    return status;
  }




  /**
   * Return true if this WebhookDelivery object is equal to o.
   */
  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    WebhookDelivery webhookDelivery = (WebhookDelivery) o;
    return Objects.equals(this.attempts, webhookDelivery.attempts) &&
        Objects.equals(this.createdAt, webhookDelivery.createdAt) &&
        Objects.equals(this.deliveredAt, webhookDelivery.deliveredAt) &&
        Objects.equals(this.durationMs, webhookDelivery.durationMs) &&
        Objects.equals(this.eventId, webhookDelivery.eventId) &&
        Objects.equals(this.eventType, webhookDelivery.eventType) &&
        Objects.equals(this.id, webhookDelivery.id) &&
        Objects.equals(this.lastError, webhookDelivery.lastError) &&
        Objects.equals(this.lastStatusCode, webhookDelivery.lastStatusCode) &&
        Objects.equals(this.nextAttemptAt, webhookDelivery.nextAttemptAt) &&
        Objects.equals(this.payload, webhookDelivery.payload) &&
        Objects.equals(this.responseSnippet, webhookDelivery.responseSnippet) &&
        Objects.equals(this.status, webhookDelivery.status);
  }

  @Override
  public int hashCode() {
    return Objects.hash(attempts, createdAt, deliveredAt, durationMs, eventId, eventType, id, lastError, lastStatusCode, nextAttemptAt, payload, responseSnippet, status);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class WebhookDelivery {\n");
    sb.append("    attempts: ").append(toIndentedString(attempts)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    deliveredAt: ").append(toIndentedString(deliveredAt)).append("\n");
    sb.append("    durationMs: ").append(toIndentedString(durationMs)).append("\n");
    sb.append("    eventId: ").append(toIndentedString(eventId)).append("\n");
    sb.append("    eventType: ").append(toIndentedString(eventType)).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    lastError: ").append(toIndentedString(lastError)).append("\n");
    sb.append("    lastStatusCode: ").append(toIndentedString(lastStatusCode)).append("\n");
    sb.append("    nextAttemptAt: ").append(toIndentedString(nextAttemptAt)).append("\n");
    sb.append("    payload: ").append(toIndentedString(payload)).append("\n");
    sb.append("    responseSnippet: ").append(toIndentedString(responseSnippet)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }

  /**
   * Convert the instance into URL query string.
   *
   * @return URL query string
   */
  public String toUrlQueryString() {
    return toUrlQueryString(null);
  }

  /**
   * Convert the instance into URL query string.
   *
   * @param prefix prefix of the query string
   * @return URL query string
   */
  public String toUrlQueryString(String prefix) {
    String suffix = "";
    String containerSuffix = "";
    String containerPrefix = "";
    if (prefix == null) {
      // style=form, explode=true, e.g. /pet?name=cat&type=manx
      prefix = "";
    } else {
      // deepObject style e.g. /pet?id[name]=cat&id[type]=manx
      prefix = prefix + "[";
      suffix = "]";
      containerSuffix = "]";
      containerPrefix = "[";
    }

    StringJoiner joiner = new StringJoiner("&");

    // add `attempts` to the URL query string
    if (getAttempts() != null) {
      joiner.add(String.format("%sattempts%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getAttempts()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `created_at` to the URL query string
    if (getCreatedAt() != null) {
      joiner.add(String.format("%screated_at%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getCreatedAt()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `delivered_at` to the URL query string
    if (getDeliveredAt() != null) {
      joiner.add(String.format("%sdelivered_at%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getDeliveredAt()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `duration_ms` to the URL query string
    if (getDurationMs() != null) {
      joiner.add(String.format("%sduration_ms%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getDurationMs()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `event_id` to the URL query string
    if (getEventId() != null) {
      joiner.add(String.format("%sevent_id%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getEventId()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `event_type` to the URL query string
    if (getEventType() != null) {
      joiner.add(String.format("%sevent_type%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getEventType()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `id` to the URL query string
    if (getId() != null) {
      joiner.add(String.format("%sid%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getId()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `last_error` to the URL query string
    if (getLastError() != null) {
      joiner.add(String.format("%slast_error%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getLastError()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `last_status_code` to the URL query string
    if (getLastStatusCode() != null) {
      joiner.add(String.format("%slast_status_code%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getLastStatusCode()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `next_attempt_at` to the URL query string
    if (getNextAttemptAt() != null) {
      joiner.add(String.format("%snext_attempt_at%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getNextAttemptAt()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `payload` to the URL query string
    if (getPayload() != null) {
      joiner.add(String.format("%spayload%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getPayload()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `response_snippet` to the URL query string
    if (getResponseSnippet() != null) {
      joiner.add(String.format("%sresponse_snippet%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getResponseSnippet()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `status` to the URL query string
    if (getStatus() != null) {
      joiner.add(String.format("%sstatus%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getStatus()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    return joiner.toString();
  }
}

