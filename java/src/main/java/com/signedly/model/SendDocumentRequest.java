/*
 * Signedly API
 *  The Signedly REST API lets your system upload documents, add signatories and fields, send them for signing and download the signed result. Every path starts with `/ap1/`, and every request and response body is JSON unless an endpoint says otherwise (the uploads are `multipart/form-data`).  ## Authentication  1. In the Signedly web app, open **Account & Settings → API** and generate a    **client ID** and **client secret** for your organisation. 2. `POST /ap1/token/` with them. You get an `access_token` (valid **2 hours**) and    a `refresh_token` (valid **7 days**). While both are still valid, calling    `/ap1/token/` again returns the same pair. 3. Send the access token on every other call:    `Authorization: Bearer <access_token>`. 4. When the access token expires, `POST /ap1/refreshtoken/` with the refresh token    for a new access token. When the refresh token has expired too, call    `/ap1/token/` again.  `/ap1/token/` and `/ap1/refreshtoken/` allow 60 calls a minute per IP address; more answer 429. A missing, unknown or expired access token answers 403 (`\"Client not found\"` or `\"Access token expired\"`).  The API acts for your **organisation's admin account**: documents you upload belong to it and appear in its Signedly web app, and you can reach only that account's documents, templates, signatories and fields. Another organisation's IDs answer 404, as if they didn't exist.  ## Sending a document for signing  1. `POST /ap1/upload/` a PDF or DOCX (`type` 2). The document is prepared in the    background: find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is    the upload's `id`), and wait until `GET /ap1/documents/{id}/pages/` lists its    pages. 2. `POST /ap1/signatories/` (one) or `POST /ap1/signatories/bulk/` (several) to    add the people who sign. 3. `POST /ap1/documents/fields/` to place the fields each signatory fills in. 4. Send it:    - `POST /ap1/document/send/` emails every signatory a signing link (with      ordered signing, only the first; each next one is emailed in      turn), or    - `POST /ap1/document/send_url/` sends no email and returns the first      signatory's signing link, for you to show or send yourself. 5. Poll `GET /ap1/documents-status-list/` (or `GET /ap1/documents/`) until the    status is 6 (Completed), then `GET /ap1/document/download-link/` for the    signed PDF and `GET /ap1/document/download-audit-link/` for its audit trail.  **From a template:** upload with `type` 4 and a `template_name` (or make the template in the web app), place its fields with `POST /ap1/templates/fields/`, then for each signing make a document with `POST /ap1/documents/fromtemplate/`, add its signatory, and send it.  **One signer, one call:** `POST /ap1/upload_app/` uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; the signer places their own signature. After signing they go to the `redirect_url` you sent, and the signed PDF and its audit trail are emailed to `final_email` (otherwise to your organisation's admin).  ## Quick start with curl  Each step uses an ID from the step before. `$API` is this server, e.g. `https://l0ads.signedly.com`.  ```bash # 1. Token curl -X POST $API/ap1/token/ -H 'Content-Type: application/json' \\   -d '{\"client_id\": \"<client id>\", \"client_secret\": \"<client secret>\"}' TOKEN=<access_token from the answer>  # 2. Upload a PDF (answers with the upload's id) curl -X POST $API/ap1/upload/ -H \"Authorization: Bearer $TOKEN\" \\   -F file=@nda.pdf -F name=nda-ann-lee -F type=2  # 3. Find the document, then wait until it has pages curl \"$API/ap1/documents/?name=nda-ann-lee\" -H \"Authorization: Bearer $TOKEN\" DOC=<results[0].id> curl $API/ap1/documents/$DOC/pages/ -H \"Authorization: Bearer $TOKEN\" PAGE=<[0].id>  # 4. Add the signatory curl -X POST $API/ap1/signatories/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"name\": \"Ann Lee\", \"email\": \"ann@example.com\"}' SIGNER=<id from the answer>  # 5. Place her signature: 150 × 40 points, 72 points from the left, 640 from the top curl -X POST $API/ap1/documents/fields/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '[{\"document_id\": \"'$DOC'\", \"signatory_id\": \"'$SIGNER'\", \"kind\": 2,         \"label\": \"Signature\", \"placeholder\": \"Sign here\", \"page\": \"'$PAGE'\",         \"page_number\": 0, \"x\": 72, \"y\": 640, \"width\": 150, \"height\": 40}]'  # 6. Send it (Ann gets the signing email) curl -X POST $API/ap1/document/send/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"subject\": \"Please sign the NDA\",        \"message\": \"Hi Ann, please sign by Friday.\", \"expiry_date\": \"2026-12-31\"}'  # 7. Poll until status is 6 (Completed), then get the signed PDF curl \"$API/ap1/documents-status-list/?document_ids=$DOC\" -H \"Authorization: Bearer $TOKEN\" curl \"$API/ap1/document/download-link/?id=$DOC\" -H \"Authorization: Bearer $TOKEN\" ```  ## Postman  Import the whole API into Postman with **Import → Link** and `<this server>/swaggerap1/postman.json`. Set `client_id` and `client_secret` in the collection's **Variables**, run **Get an access token** (it saves the token for every other request), and set `document_id` when a request needs one.  ## Webhooks  Instead of polling, add an endpoint with `POST /ap1/webhooks/` (or in **Account & Settings → API**) and Signedly posts your organisation's document events to it: `document.sent`, `document.viewed`, `document.signed`, `document.approved`, `document.completed`, `document.rejected` and `document.expired` (all of them, or the `events` you choose). Each is a JSON `POST`:  ```json {\"id\": \"5b7f…\", \"type\": \"document.signed\", \"created_at\": \"2026-10-27T09:12:00+00:00\",  \"test\": false,  \"data\": {\"document\": {\"id\": \"6f0c…\", \"name\": \"nda.pdf\", \"status\": 5},           \"recipient\": {\"id\": \"0b6e…\", \"email\": \"ann@example.com\", \"name\": \"Ann Lee\",                         \"role\": \"signer\"}}} ```  `recipient` is null for events no recipient caused (sent, completed, expired); `test` is true for documents made with your test keys. Fetch anything else, such as download links, with your access token: events never carry links.  **Check every event is from Signedly.** The `Signedly-Signature` header is `t=<unix seconds>,v1=<signature>`, where the signature is the hex HMAC-SHA256 of `<t>.<raw body>` with the endpoint's secret. Refuse an event whose signature doesn't match or whose `t` is more than 5 minutes off:  ```python import hashlib, hmac, time  def is_from_signedly(secret, header, raw_body):     parts = dict(item.split(\"=\", 1) for item in header.split(\",\"))     signed = f\"{parts['t']}.{raw_body.decode()}\".encode()     expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()     fresh = abs(time.time() - int(parts[\"t\"])) <= 300     return fresh and hmac.compare_digest(parts[\"v1\"], expected) ```  **Answer 2xx within 10 seconds**, then do the work. Anything else is retried after 1 and 5 minutes, then 30 minutes and 2, 5 and 10 hours (7 tries in about 18 hours). `Signedly-Event-Id` is the same on every try of an event: use it to ignore repeats. After 20 events in a row fail for good, Signedly switches the endpoint off and emails your organisation's admin; switch it on again with `PUT /ap1/webhooks/{id}/` and `\"is_active\": true`. Each endpoint's deliveries and their last answers are at `GET /ap1/webhooks/{id}/deliveries/`, and any can be sent again.  ## Sandbox  Build and test against the API without paying for documents: in **Account & Settings → API**, generate your **test keys**, and get a token with them at `/ap1/token/` as usual. Everything works the same, except that what you upload or make from a template with a test token is a **test document** (`is_test` on its upload):  - every page of its PDF and of its audit trail says **TEST – NOT LEGALLY BINDING**; - its emails are real, with `[TEST]` at the start of the subject; - it isn't billed or counted toward your plan; - your organisation can make 50 a calendar month (templates don't count); the next   upload answers 429.  ## Fields  Positions and sizes are in **PDF points** (1/72 inch), measured from the **top-left corner** of the page as it is displayed (rotation applied). `page_number` counts pages from 0. A field must sit wholly on its page (1 point of tolerance); otherwise it is refused with 400. A field's page and signatory can't be changed later: delete the field and add it again.  ## Status values  **Document `status`:** 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Signatories, fields and sends are only accepted while a document is 1–3 (not yet sent).  **Signatory `status`:** 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.  ## Lists  `GET /ap1/documents/`, `/ap1/documents-status-list/`, `/ap1/templates/`, `/ap1/logs/` and `/ap1/logs/hits/` are paged: pass `limit` (default 10) and `offset`, and read `count`, `next`, `previous` and `results` from the response.  ## Errors  | Status | Meaning | |---|---| | 400 | The request was refused; the body says why (`{\"error\": \"...\"}`, or the name of each bad field with its messages). Nothing was changed. | | 403 | The access token is missing, unknown or expired; the client ID and secret or the refresh token were refused; or an `expiry_date` isn't in the future (`\"Invalid Date Entered\"`). | | 404 | The document, template, signatory or field doesn't exist or isn't yours. | | 429 | Too many token requests (wait a minute), or this month's 50 test documents are used. | | 5xx | Our side failed; retry later. |  A send that times out may still have worked: check the document's status before sending again (a second send of a sent document answers 400).  Download, view and audit links are valid for about 7 days; ask for a new one whenever you need it. 
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
import java.time.LocalDate;
import java.util.Arrays;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


import com.signedly.client.ApiClient;
/**
 * SendDocumentRequest
 */
@JsonPropertyOrder({
  SendDocumentRequest.JSON_PROPERTY_DOCUMENT_ID,
  SendDocumentRequest.JSON_PROPERTY_EXPIRY_DATE,
  SendDocumentRequest.JSON_PROPERTY_MESSAGE,
  SendDocumentRequest.JSON_PROPERTY_REMINDER_BEFORE_EXPIRY_DAYS,
  SendDocumentRequest.JSON_PROPERTY_REMINDER_EVERY_DAYS,
  SendDocumentRequest.JSON_PROPERTY_REMINDER_MAX,
  SendDocumentRequest.JSON_PROPERTY_SUBJECT
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", date = "2026-10-27T14:37:47.002303711+05:30[Asia/Kolkata]", comments = "Generator version: 7.10.0")
public class SendDocumentRequest {
  public static final String JSON_PROPERTY_DOCUMENT_ID = "document_id";
  @javax.annotation.Nonnull
  private UUID documentId;

  public static final String JSON_PROPERTY_EXPIRY_DATE = "expiry_date";
  @javax.annotation.Nonnull
  private LocalDate expiryDate;

  public static final String JSON_PROPERTY_MESSAGE = "message";
  @javax.annotation.Nonnull
  private String message;

  public static final String JSON_PROPERTY_REMINDER_BEFORE_EXPIRY_DAYS = "reminder_before_expiry_days";
  @javax.annotation.Nullable
  private Integer reminderBeforeExpiryDays;

  public static final String JSON_PROPERTY_REMINDER_EVERY_DAYS = "reminder_every_days";
  @javax.annotation.Nullable
  private Integer reminderEveryDays;

  public static final String JSON_PROPERTY_REMINDER_MAX = "reminder_max";
  @javax.annotation.Nullable
  private Integer reminderMax;

  public static final String JSON_PROPERTY_SUBJECT = "subject";
  @javax.annotation.Nonnull
  private String subject;

  public SendDocumentRequest() { 
  }

  public SendDocumentRequest documentId(@javax.annotation.Nonnull UUID documentId) {
    this.documentId = documentId;
    return this;
  }

  /**
   * The document&#39;s ID.
   * @return documentId
   */
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_DOCUMENT_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public UUID getDocumentId() {
    return documentId;
  }


  @JsonProperty(JSON_PROPERTY_DOCUMENT_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setDocumentId(@javax.annotation.Nonnull UUID documentId) {
    this.documentId = documentId;
  }


  public SendDocumentRequest expiryDate(@javax.annotation.Nonnull LocalDate expiryDate) {
    this.expiryDate = expiryDate;
    return this;
  }

  /**
   * The last day the document can be signed, YYYY-MM-DD; it must be in the future.
   * @return expiryDate
   */
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_EXPIRY_DATE)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public LocalDate getExpiryDate() {
    return expiryDate;
  }


  @JsonProperty(JSON_PROPERTY_EXPIRY_DATE)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setExpiryDate(@javax.annotation.Nonnull LocalDate expiryDate) {
    this.expiryDate = expiryDate;
  }


  public SendDocumentRequest message(@javax.annotation.Nonnull String message) {
    this.message = message;
    return this;
  }

  /**
   * The email&#39;s message.
   * @return message
   */
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_MESSAGE)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public String getMessage() {
    return message;
  }


  @JsonProperty(JSON_PROPERTY_MESSAGE)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setMessage(@javax.annotation.Nonnull String message) {
    this.message = message;
  }


  public SendDocumentRequest reminderBeforeExpiryDays(@javax.annotation.Nullable Integer reminderBeforeExpiryDays) {
    this.reminderBeforeExpiryDays = reminderBeforeExpiryDays;
    return this;
  }

  /**
   * One more reminder this many days before the deadline (2–30); 0 is off. Every signatory still waiting is also reminded the day before it.
   * minimum: 0
   * maximum: 30
   * @return reminderBeforeExpiryDays
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_REMINDER_BEFORE_EXPIRY_DAYS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getReminderBeforeExpiryDays() {
    return reminderBeforeExpiryDays;
  }


  @JsonProperty(JSON_PROPERTY_REMINDER_BEFORE_EXPIRY_DAYS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setReminderBeforeExpiryDays(@javax.annotation.Nullable Integer reminderBeforeExpiryDays) {
    this.reminderBeforeExpiryDays = reminderBeforeExpiryDays;
  }


  public SendDocumentRequest reminderEveryDays(@javax.annotation.Nullable Integer reminderEveryDays) {
    this.reminderEveryDays = reminderEveryDays;
    return this;
  }

  /**
   * Automatic reminders: email each signatory who hasn&#39;t signed yet every this many days (1–30) after they were asked; 0 is off. Left out, your organisation&#39;s default applies (off unless set in the web app).
   * minimum: 0
   * maximum: 30
   * @return reminderEveryDays
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_REMINDER_EVERY_DAYS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getReminderEveryDays() {
    return reminderEveryDays;
  }


  @JsonProperty(JSON_PROPERTY_REMINDER_EVERY_DAYS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setReminderEveryDays(@javax.annotation.Nullable Integer reminderEveryDays) {
    this.reminderEveryDays = reminderEveryDays;
  }


  public SendDocumentRequest reminderMax(@javax.annotation.Nullable Integer reminderMax) {
    this.reminderMax = reminderMax;
    return this;
  }

  /**
   * At most this many automatic reminders per signatory (1–10; 3 if left out while &#x60;reminder_every_days&#x60; is on).
   * minimum: 0
   * maximum: 10
   * @return reminderMax
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_REMINDER_MAX)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getReminderMax() {
    return reminderMax;
  }


  @JsonProperty(JSON_PROPERTY_REMINDER_MAX)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setReminderMax(@javax.annotation.Nullable Integer reminderMax) {
    this.reminderMax = reminderMax;
  }


  public SendDocumentRequest subject(@javax.annotation.Nonnull String subject) {
    this.subject = subject;
    return this;
  }

  /**
   * The email&#39;s subject.
   * @return subject
   */
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_SUBJECT)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public String getSubject() {
    return subject;
  }


  @JsonProperty(JSON_PROPERTY_SUBJECT)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setSubject(@javax.annotation.Nonnull String subject) {
    this.subject = subject;
  }


  /**
   * Return true if this send_document_request object is equal to o.
   */
  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    SendDocumentRequest sendDocumentRequest = (SendDocumentRequest) o;
    return Objects.equals(this.documentId, sendDocumentRequest.documentId) &&
        Objects.equals(this.expiryDate, sendDocumentRequest.expiryDate) &&
        Objects.equals(this.message, sendDocumentRequest.message) &&
        Objects.equals(this.reminderBeforeExpiryDays, sendDocumentRequest.reminderBeforeExpiryDays) &&
        Objects.equals(this.reminderEveryDays, sendDocumentRequest.reminderEveryDays) &&
        Objects.equals(this.reminderMax, sendDocumentRequest.reminderMax) &&
        Objects.equals(this.subject, sendDocumentRequest.subject);
  }

  @Override
  public int hashCode() {
    return Objects.hash(documentId, expiryDate, message, reminderBeforeExpiryDays, reminderEveryDays, reminderMax, subject);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class SendDocumentRequest {\n");
    sb.append("    documentId: ").append(toIndentedString(documentId)).append("\n");
    sb.append("    expiryDate: ").append(toIndentedString(expiryDate)).append("\n");
    sb.append("    message: ").append(toIndentedString(message)).append("\n");
    sb.append("    reminderBeforeExpiryDays: ").append(toIndentedString(reminderBeforeExpiryDays)).append("\n");
    sb.append("    reminderEveryDays: ").append(toIndentedString(reminderEveryDays)).append("\n");
    sb.append("    reminderMax: ").append(toIndentedString(reminderMax)).append("\n");
    sb.append("    subject: ").append(toIndentedString(subject)).append("\n");
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

    // add `document_id` to the URL query string
    if (getDocumentId() != null) {
      joiner.add(String.format("%sdocument_id%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getDocumentId()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `expiry_date` to the URL query string
    if (getExpiryDate() != null) {
      joiner.add(String.format("%sexpiry_date%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getExpiryDate()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `message` to the URL query string
    if (getMessage() != null) {
      joiner.add(String.format("%smessage%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getMessage()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `reminder_before_expiry_days` to the URL query string
    if (getReminderBeforeExpiryDays() != null) {
      joiner.add(String.format("%sreminder_before_expiry_days%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getReminderBeforeExpiryDays()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `reminder_every_days` to the URL query string
    if (getReminderEveryDays() != null) {
      joiner.add(String.format("%sreminder_every_days%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getReminderEveryDays()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `reminder_max` to the URL query string
    if (getReminderMax() != null) {
      joiner.add(String.format("%sreminder_max%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getReminderMax()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `subject` to the URL query string
    if (getSubject() != null) {
      joiner.add(String.format("%ssubject%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getSubject()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    return joiner.toString();
  }
}

