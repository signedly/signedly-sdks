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
import com.signedly.model.Page;
import com.signedly.model.Signatory;
import com.signedly.model.Upload;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.openapitools.jackson.nullable.JsonNullable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.openapitools.jackson.nullable.JsonNullable;
import java.util.NoSuchElementException;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


import com.signedly.client.ApiClient;
/**
 * Document
 */
@JsonPropertyOrder({
  Document.JSON_PROPERTY_CREATED_AT,
  Document.JSON_PROPERTY_DOCUMENT_NAME,
  Document.JSON_PROPERTY_EXPIRED_AT,
  Document.JSON_PROPERTY_ID,
  Document.JSON_PROPERTY_IS_BULK_SIGNING,
  Document.JSON_PROPERTY_IS_TEMPLATE,
  Document.JSON_PROPERTY_MESSAGE,
  Document.JSON_PROPERTY_PAGES,
  Document.JSON_PROPERTY_SENT_AT,
  Document.JSON_PROPERTY_SIGNATORIES,
  Document.JSON_PROPERTY_STATUS,
  Document.JSON_PROPERTY_SUBJECT,
  Document.JSON_PROPERTY_UPDATED_AT,
  Document.JSON_PROPERTY_UPLOAD
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", comments = "Generator version: 7.10.0")
public class Document {
  public static final String JSON_PROPERTY_CREATED_AT = "created_at";
  @javax.annotation.Nullable
  private OffsetDateTime createdAt;

  public static final String JSON_PROPERTY_DOCUMENT_NAME = "document_name";
  @javax.annotation.Nullable
  private String documentName;

  public static final String JSON_PROPERTY_EXPIRED_AT = "expired_at";
  private JsonNullable<OffsetDateTime> expiredAt = JsonNullable.<OffsetDateTime>undefined();

  public static final String JSON_PROPERTY_ID = "id";
  @javax.annotation.Nullable
  private UUID id;

  public static final String JSON_PROPERTY_IS_BULK_SIGNING = "is_bulk_signing";
  @javax.annotation.Nullable
  private Boolean isBulkSigning;

  public static final String JSON_PROPERTY_IS_TEMPLATE = "is_template";
  @javax.annotation.Nullable
  private Boolean isTemplate;

  public static final String JSON_PROPERTY_MESSAGE = "message";
  private JsonNullable<String> message = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_PAGES = "pages";
  @javax.annotation.Nullable
  private List<Page> pages = new ArrayList<>();

  public static final String JSON_PROPERTY_SENT_AT = "sent_at";
  private JsonNullable<OffsetDateTime> sentAt = JsonNullable.<OffsetDateTime>undefined();

  public static final String JSON_PROPERTY_SIGNATORIES = "signatories";
  @javax.annotation.Nullable
  private List<Signatory> signatories = new ArrayList<>();

  public static final String JSON_PROPERTY_STATUS = "status";
  @javax.annotation.Nullable
  private Integer status;

  public static final String JSON_PROPERTY_SUBJECT = "subject";
  @javax.annotation.Nullable
  private String subject;

  public static final String JSON_PROPERTY_UPDATED_AT = "updated_at";
  @javax.annotation.Nullable
  private OffsetDateTime updatedAt;

  public static final String JSON_PROPERTY_UPLOAD = "upload";
  @javax.annotation.Nullable
  private Upload upload;

  public Document() { 
  }

  @JsonCreator
  public Document(
    @JsonProperty(JSON_PROPERTY_CREATED_AT) OffsetDateTime createdAt, 
    @JsonProperty(JSON_PROPERTY_DOCUMENT_NAME) String documentName, 
    @JsonProperty(JSON_PROPERTY_ID) UUID id, 
    @JsonProperty(JSON_PROPERTY_UPDATED_AT) OffsetDateTime updatedAt
  ) {
  this();
    this.createdAt = createdAt;
    this.documentName = documentName;
    this.id = id;
    this.updatedAt = updatedAt;
  }

  /**
   * When it was made.
   * @return createdAt
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_CREATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }




  /**
   * The document&#39;s name.
   * @return documentName
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_DOCUMENT_NAME)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getDocumentName() {
    return documentName;
  }




  public Document expiredAt(@javax.annotation.Nullable OffsetDateTime expiredAt) {
    this.expiredAt = JsonNullable.<OffsetDateTime>of(expiredAt);
    return this;
  }

  /**
   * The last day it can be signed, or null.
   * @return expiredAt
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public OffsetDateTime getExpiredAt() {
        return expiredAt.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_EXPIRED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<OffsetDateTime> getExpiredAt_JsonNullable() {
    return expiredAt;
  }
  
  @JsonProperty(JSON_PROPERTY_EXPIRED_AT)
  public void setExpiredAt_JsonNullable(JsonNullable<OffsetDateTime> expiredAt) {
    this.expiredAt = expiredAt;
  }

  public void setExpiredAt(@javax.annotation.Nullable OffsetDateTime expiredAt) {
    this.expiredAt = JsonNullable.<OffsetDateTime>of(expiredAt);
  }


  /**
   * The document&#39;s ID.
   * @return id
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public UUID getId() {
    return id;
  }




  public Document isBulkSigning(@javax.annotation.Nullable Boolean isBulkSigning) {
    this.isBulkSigning = isBulkSigning;
    return this;
  }

  /**
   * True for a copy made by a bulk send.
   * @return isBulkSigning
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_BULK_SIGNING)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Boolean getIsBulkSigning() {
    return isBulkSigning;
  }


  @JsonProperty(JSON_PROPERTY_IS_BULK_SIGNING)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsBulkSigning(@javax.annotation.Nullable Boolean isBulkSigning) {
    this.isBulkSigning = isBulkSigning;
  }


  public Document isTemplate(@javax.annotation.Nullable Boolean isTemplate) {
    this.isTemplate = isTemplate;
    return this;
  }

  /**
   * Always false here.
   * @return isTemplate
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_TEMPLATE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Boolean getIsTemplate() {
    return isTemplate;
  }


  @JsonProperty(JSON_PROPERTY_IS_TEMPLATE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsTemplate(@javax.annotation.Nullable Boolean isTemplate) {
    this.isTemplate = isTemplate;
  }


  public Document message(@javax.annotation.Nullable String message) {
    this.message = JsonNullable.<String>of(message);
    return this;
  }

  /**
   * The signing email&#39;s message, once sent.
   * @return message
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public String getMessage() {
        return message.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_MESSAGE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getMessage_JsonNullable() {
    return message;
  }
  
  @JsonProperty(JSON_PROPERTY_MESSAGE)
  public void setMessage_JsonNullable(JsonNullable<String> message) {
    this.message = message;
  }

  public void setMessage(@javax.annotation.Nullable String message) {
    this.message = JsonNullable.<String>of(message);
  }


  public Document pages(@javax.annotation.Nullable List<Page> pages) {
    this.pages = pages;
    return this;
  }

  public Document addPagesItem(Page pagesItem) {
    if (this.pages == null) {
      this.pages = new ArrayList<>();
    }
    this.pages.add(pagesItem);
    return this;
  }

  /**
   * Its pages, each with its fields.
   * @return pages
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_PAGES)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public List<Page> getPages() {
    return pages;
  }


  @JsonProperty(JSON_PROPERTY_PAGES)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setPages(@javax.annotation.Nullable List<Page> pages) {
    this.pages = pages;
  }


  public Document sentAt(@javax.annotation.Nullable OffsetDateTime sentAt) {
    this.sentAt = JsonNullable.<OffsetDateTime>of(sentAt);
    return this;
  }

  /**
   * When it was sent, or null.
   * @return sentAt
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public OffsetDateTime getSentAt() {
        return sentAt.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_SENT_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<OffsetDateTime> getSentAt_JsonNullable() {
    return sentAt;
  }
  
  @JsonProperty(JSON_PROPERTY_SENT_AT)
  public void setSentAt_JsonNullable(JsonNullable<OffsetDateTime> sentAt) {
    this.sentAt = sentAt;
  }

  public void setSentAt(@javax.annotation.Nullable OffsetDateTime sentAt) {
    this.sentAt = JsonNullable.<OffsetDateTime>of(sentAt);
  }


  public Document signatories(@javax.annotation.Nullable List<Signatory> signatories) {
    this.signatories = signatories;
    return this;
  }

  public Document addSignatoriesItem(Signatory signatoriesItem) {
    if (this.signatories == null) {
      this.signatories = new ArrayList<>();
    }
    this.signatories.add(signatoriesItem);
    return this;
  }

  /**
   * Who signs it.
   * @return signatories
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_SIGNATORIES)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public List<Signatory> getSignatories() {
    return signatories;
  }


  @JsonProperty(JSON_PROPERTY_SIGNATORIES)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setSignatories(@javax.annotation.Nullable List<Signatory> signatories) {
    this.signatories = signatories;
  }


  public Document status(@javax.annotation.Nullable Integer status) {
    this.status = status;
    return this;
  }

  /**
   * 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired
   * @return status
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_STATUS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getStatus() {
    return status;
  }


  @JsonProperty(JSON_PROPERTY_STATUS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setStatus(@javax.annotation.Nullable Integer status) {
    this.status = status;
  }


  public Document subject(@javax.annotation.Nullable String subject) {
    this.subject = subject;
    return this;
  }

  /**
   * The signing email&#39;s subject, once sent.
   * @return subject
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_SUBJECT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getSubject() {
    return subject;
  }


  @JsonProperty(JSON_PROPERTY_SUBJECT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setSubject(@javax.annotation.Nullable String subject) {
    this.subject = subject;
  }


  /**
   * When it last changed.
   * @return updatedAt
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_UPDATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public OffsetDateTime getUpdatedAt() {
    return updatedAt;
  }




  public Document upload(@javax.annotation.Nullable Upload upload) {
    this.upload = upload;
    return this;
  }

  /**
   * Get upload
   * @return upload
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_UPLOAD)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Upload getUpload() {
    return upload;
  }


  @JsonProperty(JSON_PROPERTY_UPLOAD)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setUpload(@javax.annotation.Nullable Upload upload) {
    this.upload = upload;
  }


  /**
   * Return true if this Document object is equal to o.
   */
  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Document document = (Document) o;
    return Objects.equals(this.createdAt, document.createdAt) &&
        Objects.equals(this.documentName, document.documentName) &&
        equalsNullable(this.expiredAt, document.expiredAt) &&
        Objects.equals(this.id, document.id) &&
        Objects.equals(this.isBulkSigning, document.isBulkSigning) &&
        Objects.equals(this.isTemplate, document.isTemplate) &&
        equalsNullable(this.message, document.message) &&
        Objects.equals(this.pages, document.pages) &&
        equalsNullable(this.sentAt, document.sentAt) &&
        Objects.equals(this.signatories, document.signatories) &&
        Objects.equals(this.status, document.status) &&
        Objects.equals(this.subject, document.subject) &&
        Objects.equals(this.updatedAt, document.updatedAt) &&
        Objects.equals(this.upload, document.upload);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(createdAt, documentName, hashCodeNullable(expiredAt), id, isBulkSigning, isTemplate, hashCodeNullable(message), pages, hashCodeNullable(sentAt), signatories, status, subject, updatedAt, upload);
  }

  private static <T> int hashCodeNullable(JsonNullable<T> a) {
    if (a == null) {
      return 1;
    }
    return a.isPresent() ? Arrays.deepHashCode(new Object[]{a.get()}) : 31;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Document {\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    documentName: ").append(toIndentedString(documentName)).append("\n");
    sb.append("    expiredAt: ").append(toIndentedString(expiredAt)).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    isBulkSigning: ").append(toIndentedString(isBulkSigning)).append("\n");
    sb.append("    isTemplate: ").append(toIndentedString(isTemplate)).append("\n");
    sb.append("    message: ").append(toIndentedString(message)).append("\n");
    sb.append("    pages: ").append(toIndentedString(pages)).append("\n");
    sb.append("    sentAt: ").append(toIndentedString(sentAt)).append("\n");
    sb.append("    signatories: ").append(toIndentedString(signatories)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    subject: ").append(toIndentedString(subject)).append("\n");
    sb.append("    updatedAt: ").append(toIndentedString(updatedAt)).append("\n");
    sb.append("    upload: ").append(toIndentedString(upload)).append("\n");
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

    // add `created_at` to the URL query string
    if (getCreatedAt() != null) {
      joiner.add(String.format("%screated_at%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getCreatedAt()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `document_name` to the URL query string
    if (getDocumentName() != null) {
      joiner.add(String.format("%sdocument_name%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getDocumentName()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `expired_at` to the URL query string
    if (getExpiredAt() != null) {
      joiner.add(String.format("%sexpired_at%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getExpiredAt()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `id` to the URL query string
    if (getId() != null) {
      joiner.add(String.format("%sid%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getId()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `is_bulk_signing` to the URL query string
    if (getIsBulkSigning() != null) {
      joiner.add(String.format("%sis_bulk_signing%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getIsBulkSigning()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `is_template` to the URL query string
    if (getIsTemplate() != null) {
      joiner.add(String.format("%sis_template%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getIsTemplate()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `message` to the URL query string
    if (getMessage() != null) {
      joiner.add(String.format("%smessage%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getMessage()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `pages` to the URL query string
    if (getPages() != null) {
      for (int i = 0; i < getPages().size(); i++) {
        if (getPages().get(i) != null) {
          joiner.add(getPages().get(i).toUrlQueryString(String.format("%spages%s%s", prefix, suffix,
          "".equals(suffix) ? "" : String.format("%s%d%s", containerPrefix, i, containerSuffix))));
        }
      }
    }

    // add `sent_at` to the URL query string
    if (getSentAt() != null) {
      joiner.add(String.format("%ssent_at%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getSentAt()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `signatories` to the URL query string
    if (getSignatories() != null) {
      for (int i = 0; i < getSignatories().size(); i++) {
        if (getSignatories().get(i) != null) {
          joiner.add(getSignatories().get(i).toUrlQueryString(String.format("%ssignatories%s%s", prefix, suffix,
          "".equals(suffix) ? "" : String.format("%s%d%s", containerPrefix, i, containerSuffix))));
        }
      }
    }

    // add `status` to the URL query string
    if (getStatus() != null) {
      joiner.add(String.format("%sstatus%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getStatus()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `subject` to the URL query string
    if (getSubject() != null) {
      joiner.add(String.format("%ssubject%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getSubject()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `updated_at` to the URL query string
    if (getUpdatedAt() != null) {
      joiner.add(String.format("%supdated_at%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getUpdatedAt()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `upload` to the URL query string
    if (getUpload() != null) {
      joiner.add(getUpload().toUrlQueryString(prefix + "upload" + suffix));
    }

    return joiner.toString();
  }
}

