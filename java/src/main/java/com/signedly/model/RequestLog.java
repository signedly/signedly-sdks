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
 * RequestLog
 */
@JsonPropertyOrder({
  RequestLog.JSON_PROPERTY_BODY,
  RequestLog.JSON_PROPERTY_CREATED_AT,
  RequestLog.JSON_PROPERTY_HEADERS,
  RequestLog.JSON_PROPERTY_ID,
  RequestLog.JSON_PROPERTY_IP_ADDRESS,
  RequestLog.JSON_PROPERTY_METHOD,
  RequestLog.JSON_PROPERTY_PATH,
  RequestLog.JSON_PROPERTY_QUERY_PARAMS
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", comments = "Generator version: 7.10.0")
public class RequestLog {
  public static final String JSON_PROPERTY_BODY = "body";
  @javax.annotation.Nullable
  private String body;

  public static final String JSON_PROPERTY_CREATED_AT = "created_at";
  @javax.annotation.Nullable
  private OffsetDateTime createdAt;

  public static final String JSON_PROPERTY_HEADERS = "headers";
  @javax.annotation.Nullable
  private String headers;

  public static final String JSON_PROPERTY_ID = "id";
  @javax.annotation.Nullable
  private UUID id;

  public static final String JSON_PROPERTY_IP_ADDRESS = "ip_address";
  @javax.annotation.Nullable
  private String ipAddress;

  public static final String JSON_PROPERTY_METHOD = "method";
  @javax.annotation.Nullable
  private String method;

  public static final String JSON_PROPERTY_PATH = "path";
  @javax.annotation.Nullable
  private String path;

  public static final String JSON_PROPERTY_QUERY_PARAMS = "query_params";
  @javax.annotation.Nullable
  private String queryParams;

  public RequestLog() { 
  }

  @JsonCreator
  public RequestLog(
    @JsonProperty(JSON_PROPERTY_CREATED_AT) OffsetDateTime createdAt, 
    @JsonProperty(JSON_PROPERTY_ID) UUID id
  ) {
  this();
    this.createdAt = createdAt;
    this.id = id;
  }

  public RequestLog body(@javax.annotation.Nullable String body) {
    this.body = body;
    return this;
  }

  /**
   * The request&#39;s body, credentials redacted.
   * @return body
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_BODY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getBody() {
    return body;
  }


  @JsonProperty(JSON_PROPERTY_BODY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setBody(@javax.annotation.Nullable String body) {
    this.body = body;
  }


  /**
   * When the call was made.
   * @return createdAt
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_CREATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }




  public RequestLog headers(@javax.annotation.Nullable String headers) {
    this.headers = headers;
    return this;
  }

  /**
   * The request&#39;s headers, credentials redacted.
   * @return headers
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_HEADERS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getHeaders() {
    return headers;
  }


  @JsonProperty(JSON_PROPERTY_HEADERS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setHeaders(@javax.annotation.Nullable String headers) {
    this.headers = headers;
  }


  /**
   * The call&#39;s ID.
   * @return id
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public UUID getId() {
    return id;
  }




  public RequestLog ipAddress(@javax.annotation.Nullable String ipAddress) {
    this.ipAddress = ipAddress;
    return this;
  }

  /**
   * The caller&#39;s IP address.
   * @return ipAddress
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IP_ADDRESS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getIpAddress() {
    return ipAddress;
  }


  @JsonProperty(JSON_PROPERTY_IP_ADDRESS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIpAddress(@javax.annotation.Nullable String ipAddress) {
    this.ipAddress = ipAddress;
  }


  public RequestLog method(@javax.annotation.Nullable String method) {
    this.method = method;
    return this;
  }

  /**
   * The HTTP method.
   * @return method
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_METHOD)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getMethod() {
    return method;
  }


  @JsonProperty(JSON_PROPERTY_METHOD)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setMethod(@javax.annotation.Nullable String method) {
    this.method = method;
  }


  public RequestLog path(@javax.annotation.Nullable String path) {
    this.path = path;
    return this;
  }

  /**
   * The path called.
   * @return path
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_PATH)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getPath() {
    return path;
  }


  @JsonProperty(JSON_PROPERTY_PATH)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setPath(@javax.annotation.Nullable String path) {
    this.path = path;
  }


  public RequestLog queryParams(@javax.annotation.Nullable String queryParams) {
    this.queryParams = queryParams;
    return this;
  }

  /**
   * The query parameters.
   * @return queryParams
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_QUERY_PARAMS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getQueryParams() {
    return queryParams;
  }


  @JsonProperty(JSON_PROPERTY_QUERY_PARAMS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setQueryParams(@javax.annotation.Nullable String queryParams) {
    this.queryParams = queryParams;
  }


  /**
   * Return true if this RequestLog object is equal to o.
   */
  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    RequestLog requestLog = (RequestLog) o;
    return Objects.equals(this.body, requestLog.body) &&
        Objects.equals(this.createdAt, requestLog.createdAt) &&
        Objects.equals(this.headers, requestLog.headers) &&
        Objects.equals(this.id, requestLog.id) &&
        Objects.equals(this.ipAddress, requestLog.ipAddress) &&
        Objects.equals(this.method, requestLog.method) &&
        Objects.equals(this.path, requestLog.path) &&
        Objects.equals(this.queryParams, requestLog.queryParams);
  }

  @Override
  public int hashCode() {
    return Objects.hash(body, createdAt, headers, id, ipAddress, method, path, queryParams);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class RequestLog {\n");
    sb.append("    body: ").append(toIndentedString(body)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    headers: ").append(toIndentedString(headers)).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    ipAddress: ").append(toIndentedString(ipAddress)).append("\n");
    sb.append("    method: ").append(toIndentedString(method)).append("\n");
    sb.append("    path: ").append(toIndentedString(path)).append("\n");
    sb.append("    queryParams: ").append(toIndentedString(queryParams)).append("\n");
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

    // add `body` to the URL query string
    if (getBody() != null) {
      joiner.add(String.format("%sbody%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getBody()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `created_at` to the URL query string
    if (getCreatedAt() != null) {
      joiner.add(String.format("%screated_at%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getCreatedAt()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `headers` to the URL query string
    if (getHeaders() != null) {
      joiner.add(String.format("%sheaders%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getHeaders()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `id` to the URL query string
    if (getId() != null) {
      joiner.add(String.format("%sid%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getId()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `ip_address` to the URL query string
    if (getIpAddress() != null) {
      joiner.add(String.format("%sip_address%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getIpAddress()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `method` to the URL query string
    if (getMethod() != null) {
      joiner.add(String.format("%smethod%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getMethod()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `path` to the URL query string
    if (getPath() != null) {
      joiner.add(String.format("%spath%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getPath()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `query_params` to the URL query string
    if (getQueryParams() != null) {
      joiner.add(String.format("%squery_params%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getQueryParams()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    return joiner.toString();
  }
}

