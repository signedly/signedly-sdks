/*
 * Signedly API
 *  The Signedly REST API lets your system upload documents, add signatories and fields, send them for signing and download the signed result. Every path starts with `/ap1/`, and every request and response body is JSON unless an endpoint says otherwise (the uploads are `multipart/form-data`).  ## Authentication  1. In the Signedly web app, open **Account & Settings → API** and generate a    **client ID** and **client secret** for your organisation. 2. `POST /ap1/token/` with them. You get an `access_token` (valid **2 hours**) and    a `refresh_token` (valid **7 days**). While both are still valid, calling    `/ap1/token/` again returns the same pair. 3. Send the access token on every other call:    `Authorization: Bearer <access_token>`. 4. When the access token expires, `POST /ap1/refreshtoken/` with the refresh token    for a new access token. When the refresh token has expired too, call    `/ap1/token/` again.  `/ap1/token/` and `/ap1/refreshtoken/` allow 60 calls a minute per IP address; more answer 429. A missing, unknown or expired access token answers 403 (`\"Client not found\"` or `\"Access token expired\"`).  The API acts for your **organisation's admin account**: documents you upload belong to it and appear in its Signedly web app, and you can reach only that account's documents, templates, signatories and fields. Another organisation's IDs answer 404, as if they didn't exist.  ## Plans  What the API allows depends on the Signedly plan of your **organisation's admin account** (Account & Settings → Account & Plan). The same rules apply to live and test keys.  | What | Free | Personal Pro | Business Pro | Teams | |---|---|---|---|---| | Generate live and test keys (Account & Settings → API) | – | ✓ | ✓ | ✓ | | Every endpoint, `/ap1/token/` and `/ap1/refreshtoken/` included | – | ✓ | ✓ | ✓ | | `require_email_otp` on `POST /ap1/signatories/` and `POST /ap1/signatories/bulk/` | – | ✓ | ✓ | ✓ | | Bulk send: `GET /ap1/bulk-sends/columns/` and `POST /ap1/bulk-sends/` | – | – | – | ✓ |  The API is part of the paid plans. On Free (or with no plan) every call answers 403 `\"... Your plan doesn't include API access.\"`, with live or test keys, also with a token or keys made earlier; they work again once the plan is paid. On a paid plan, a feature it doesn't include answers 400 with `\"Your plan doesn't include ...\"` and changes nothing, and `GET /ap1/bulk-sends/{id}/` still reports bulk sends already made.  Live documents also need an API contract with Signedly. Without one, or with an unpaid API invoice, `POST /ap1/upload/` (except templates), `/ap1/upload_app/`, `/ap1/documents/fromtemplate/` and `/ap1/bulk-sends/` answer 402 with live keys. Test keys work without a contract (see Sandbox).  ## Sending a document for signing  1. `POST /ap1/upload/` a PDF or DOCX (`type` 2). The document is prepared in the    background: find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is    the upload's `id`), and wait until `GET /ap1/documents/{id}/pages/` lists its    pages. 2. `POST /ap1/signatories/` (one) or `POST /ap1/signatories/bulk/` (several) to    add the people who sign. 3. `POST /ap1/documents/fields/` to place the fields each signatory fills in. 4. Send it:    - `POST /ap1/document/send/` emails every signatory a signing link (with      ordered signing, only the first; each next one is emailed in      turn), or    - `POST /ap1/document/send_url/` sends no email and returns the first      signatory's signing link, for you to show or send yourself. 5. Poll `GET /ap1/documents-status-list/` (or `GET /ap1/documents/`) until the    status is 6 (Completed), then `GET /ap1/document/download-link/` for the    signed PDF and `GET /ap1/document/download-audit-link/` for its audit trail.  **From a template:** upload with `type` 4 and a `template_name` (or make the template in the web app), place its fields with `POST /ap1/templates/fields/`, then for each signing make a document with `POST /ap1/documents/fromtemplate/`, add its signatory, and send it.  **One signer, one call:** `POST /ap1/upload_app/` uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; the signer places their own signature. After signing they go to the `redirect_url` you sent, and the signed PDF and its audit trail are emailed to `final_email` (otherwise to your organisation's admin).  ## Quick start with curl  Each step uses an ID from the step before. `$API` is this server, e.g. `https://l0ads.signedly.com`.  ```bash # 1. Token curl -X POST $API/ap1/token/ -H 'Content-Type: application/json' \\   -d '{\"client_id\": \"<client id>\", \"client_secret\": \"<client secret>\"}' TOKEN=<access_token from the answer>  # 2. Upload a PDF (answers with the upload's id) curl -X POST $API/ap1/upload/ -H \"Authorization: Bearer $TOKEN\" \\   -F file=@nda.pdf -F name=nda-ann-lee -F type=2  # 3. Find the document, then wait until it has pages curl \"$API/ap1/documents/?name=nda-ann-lee\" -H \"Authorization: Bearer $TOKEN\" DOC=<results[0].id> curl $API/ap1/documents/$DOC/pages/ -H \"Authorization: Bearer $TOKEN\" PAGE=<[0].id>  # 4. Add the signatory curl -X POST $API/ap1/signatories/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"name\": \"Ann Lee\", \"email\": \"ann@example.com\"}' SIGNER=<id from the answer>  # 5. Place her signature: 150 × 40 points, 72 points from the left, 640 from the top curl -X POST $API/ap1/documents/fields/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '[{\"document_id\": \"'$DOC'\", \"signatory_id\": \"'$SIGNER'\", \"kind\": 2,         \"label\": \"Signature\", \"placeholder\": \"Sign here\", \"page\": \"'$PAGE'\",         \"page_number\": 0, \"x\": 72, \"y\": 640, \"width\": 150, \"height\": 40}]'  # 6. Send it (Ann gets the signing email) curl -X POST $API/ap1/document/send/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"subject\": \"Please sign the NDA\",        \"message\": \"Hi Ann, please sign by Friday.\", \"expiry_date\": \"2026-12-31\"}'  # 7. Poll until status is 6 (Completed), then get the signed PDF curl \"$API/ap1/documents-status-list/?document_ids=$DOC\" -H \"Authorization: Bearer $TOKEN\" curl \"$API/ap1/document/download-link/?id=$DOC\" -H \"Authorization: Bearer $TOKEN\" ```  ## Postman  Import the whole API into Postman with **Import → Link** and `<this server>/swaggerap1/postman.json`. Set `client_id` and `client_secret` in the collection's **Variables**, run **Get an access token** (it saves the token for every other request), and set `document_id` when a request needs one.  ## Webhooks  Instead of polling, add an endpoint with `POST /ap1/webhooks/` (or in **Account & Settings → API**) and Signedly posts your organisation's document events to it: `document.sent`, `document.viewed`, `document.signed`, `document.approved`, `document.completed`, `document.rejected` and `document.expired` (all of them, or the `events` you choose). Each is a JSON `POST`:  ```json {\"id\": \"5b7f…\", \"type\": \"document.signed\", \"created_at\": \"2026-10-27T09:12:00+00:00\",  \"test\": false,  \"data\": {\"document\": {\"id\": \"6f0c…\", \"name\": \"nda.pdf\", \"status\": 5},           \"recipient\": {\"id\": \"0b6e…\", \"email\": \"ann@example.com\", \"name\": \"Ann Lee\",                         \"role\": \"signer\"}}} ```  `recipient` is null for events no recipient caused (sent, completed, expired); `test` is true for documents made with your test keys. Fetch anything else, such as download links, with your access token: events never carry links.  **Check every event is from Signedly.** The `Signedly-Signature` header is `t=<unix seconds>,v1=<signature>`, where the signature is the hex HMAC-SHA256 of `<t>.<raw body>` with the endpoint's secret. Refuse an event whose signature doesn't match or whose `t` is more than 5 minutes off:  ```python import hashlib, hmac, time  def is_from_signedly(secret, header, raw_body):     parts = dict(item.split(\"=\", 1) for item in header.split(\",\"))     signed = f\"{parts['t']}.{raw_body.decode()}\".encode()     expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()     fresh = abs(time.time() - int(parts[\"t\"])) <= 300     return fresh and hmac.compare_digest(parts[\"v1\"], expected) ```  **Answer 2xx within 10 seconds**, then do the work. Anything else is retried after 1 and 5 minutes, then 30 minutes and 2, 5 and 10 hours (7 tries in about 18 hours). `Signedly-Event-Id` is the same on every try of an event: use it to ignore repeats. After 20 events in a row fail for good, Signedly switches the endpoint off and emails your organisation's admin; switch it on again with `PUT /ap1/webhooks/{id}/` and `\"is_active\": true`. Each endpoint's deliveries and their last answers are at `GET /ap1/webhooks/{id}/deliveries/`, and any can be sent again.  ## Sandbox  Build and test against the API without paying for documents: in **Account & Settings → API**, generate your **test keys**, and get a token with them at `/ap1/token/` as usual. Everything works the same, except that what you upload or make from a template with a test token is a **test document** (`is_test` on its upload):  - every page of its PDF and of its audit trail says **TEST – NOT LEGALLY BINDING**; - its emails are real, with `[TEST]` at the start of the subject; - it isn't billed or counted toward your plan; - your organisation can make 50 a calendar month (templates don't count); the next   upload answers 429.  ## Fields  Positions and sizes are in **PDF points** (1/72 inch), measured from the **top-left corner** of the page as it is displayed (rotation applied). `page_number` counts pages from 0. A field must sit wholly on its page (1 point of tolerance); otherwise it is refused with 400. A field's page and signatory can't be changed later: delete the field and add it again.  ## Status values  **Document `status`:** 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Signatories, fields and sends are only accepted while a document is 1–3 (not yet sent).  **Signatory `status`:** 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.  ## Lists  `GET /ap1/documents/`, `/ap1/documents-status-list/`, `/ap1/templates/`, `/ap1/logs/` and `/ap1/logs/hits/` are paged: pass `limit` (default 10) and `offset`, and read `count`, `next`, `previous` and `results` from the response.  ## Errors  | Status | Meaning | |---|---| | 400 | The request was refused, also when your plan doesn't include it (see Plans); the body says why (`{\"error\": \"...\"}`, or the name of each bad field with its messages). Nothing was changed. | | 403 | The access token is missing, unknown or expired; the client ID and secret or the refresh token were refused; the organisation's plan has no API access (Free, see Plans); or an `expiry_date` isn't in the future (`\"Invalid Date Entered\"`). | | 402 | No API contract, or an unpaid API invoice: live documents are refused (test keys keep working). | | 404 | The document, template, signatory or field doesn't exist or isn't yours. | | 429 | Too many token requests (wait a minute), or this month's 50 test documents are used. | | 5xx | Our side failed; retry later. |  A send that times out may still have worked: check the document's status before sending again (a second send of a sent document answers 400).  Download, view and audit links are valid for about 7 days; ask for a new one whenever you need it. 
 *
 * The version of the OpenAPI document: v1
 * Contact: support@signedly.com
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
import java.math.BigDecimal;
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
 * TemplateField
 */
@JsonPropertyOrder({
  TemplateField.JSON_PROPERTY_ALIGN,
  TemplateField.JSON_PROPERTY_CHECKED,
  TemplateField.JSON_PROPERTY_CREATED_AT,
  TemplateField.JSON_PROPERTY_DATE_FORMAT,
  TemplateField.JSON_PROPERTY_FONT,
  TemplateField.JSON_PROPERTY_FONT_SIZE,
  TemplateField.JSON_PROPERTY_FORMULA,
  TemplateField.JSON_PROPERTY_GROUP_NAME,
  TemplateField.JSON_PROPERTY_HEIGHT,
  TemplateField.JSON_PROPERTY_ID,
  TemplateField.JSON_PROPERTY_IS_MULTI_LINE,
  TemplateField.JSON_PROPERTY_IS_REQUIRED,
  TemplateField.JSON_PROPERTY_ITEMS,
  TemplateField.JSON_PROPERTY_KIND,
  TemplateField.JSON_PROPERTY_LABEL,
  TemplateField.JSON_PROPERTY_MAX_LENGTH,
  TemplateField.JSON_PROPERTY_NUMBER_FORMAT,
  TemplateField.JSON_PROPERTY_PAGE,
  TemplateField.JSON_PROPERTY_PAGE_NUMBER,
  TemplateField.JSON_PROPERTY_PLACEHOLDER,
  TemplateField.JSON_PROPERTY_READONLY,
  TemplateField.JSON_PROPERTY_SELECT_OPTIONS,
  TemplateField.JSON_PROPERTY_SIZE,
  TemplateField.JSON_PROPERTY_TOOL_TIP,
  TemplateField.JSON_PROPERTY_UPDATED_AT,
  TemplateField.JSON_PROPERTY_VALUE,
  TemplateField.JSON_PROPERTY_WIDTH,
  TemplateField.JSON_PROPERTY_X,
  TemplateField.JSON_PROPERTY_Y
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", comments = "Generator version: 7.10.0")
public class TemplateField {
  public static final String JSON_PROPERTY_ALIGN = "align";
  @javax.annotation.Nullable
  private Integer align;

  public static final String JSON_PROPERTY_CHECKED = "checked";
  @javax.annotation.Nullable
  private Boolean checked = false;

  public static final String JSON_PROPERTY_CREATED_AT = "created_at";
  @javax.annotation.Nullable
  private OffsetDateTime createdAt;

  public static final String JSON_PROPERTY_DATE_FORMAT = "date_format";
  @javax.annotation.Nullable
  private Integer dateFormat;

  public static final String JSON_PROPERTY_FONT = "font";
  @javax.annotation.Nullable
  private String font = "Roboto";

  public static final String JSON_PROPERTY_FONT_SIZE = "font_size";
  @javax.annotation.Nullable
  private Integer fontSize;

  public static final String JSON_PROPERTY_FORMULA = "formula";
  private JsonNullable<String> formula = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_GROUP_NAME = "group_name";
  private JsonNullable<String> groupName = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_HEIGHT = "height";
  @javax.annotation.Nullable
  private Integer height;

  public static final String JSON_PROPERTY_ID = "id";
  @javax.annotation.Nullable
  private UUID id;

  public static final String JSON_PROPERTY_IS_MULTI_LINE = "is_multi_line";
  @javax.annotation.Nullable
  private Boolean isMultiLine;

  public static final String JSON_PROPERTY_IS_REQUIRED = "is_required";
  @javax.annotation.Nullable
  private Boolean isRequired;

  public static final String JSON_PROPERTY_ITEMS = "items";
  @javax.annotation.Nullable
  private List<Object> items = new ArrayList<>();

  public static final String JSON_PROPERTY_KIND = "kind";
  @javax.annotation.Nullable
  private Integer kind;

  public static final String JSON_PROPERTY_LABEL = "label";
  private JsonNullable<String> label = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_MAX_LENGTH = "max_length";
  private JsonNullable<Integer> maxLength = JsonNullable.<Integer>undefined();

  public static final String JSON_PROPERTY_NUMBER_FORMAT = "number_format";
  private JsonNullable<Object> numberFormat = JsonNullable.<Object>undefined();

  public static final String JSON_PROPERTY_PAGE = "page";
  @javax.annotation.Nullable
  private UUID page;

  public static final String JSON_PROPERTY_PAGE_NUMBER = "page_number";
  @javax.annotation.Nullable
  private Integer pageNumber;

  public static final String JSON_PROPERTY_PLACEHOLDER = "placeholder";
  private JsonNullable<String> placeholder = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_READONLY = "readonly";
  @javax.annotation.Nullable
  private Boolean readonly;

  public static final String JSON_PROPERTY_SELECT_OPTIONS = "select_options";
  @javax.annotation.Nullable
  private List<String> selectOptions = new ArrayList<>();

  public static final String JSON_PROPERTY_SIZE = "size";
  @javax.annotation.Nullable
  private Integer size;

  public static final String JSON_PROPERTY_TOOL_TIP = "tool_tip";
  private JsonNullable<String> toolTip = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_UPDATED_AT = "updated_at";
  @javax.annotation.Nullable
  private OffsetDateTime updatedAt;

  public static final String JSON_PROPERTY_VALUE = "value";
  private JsonNullable<String> value = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_WIDTH = "width";
  @javax.annotation.Nullable
  private BigDecimal width;

  public static final String JSON_PROPERTY_X = "x";
  private JsonNullable<BigDecimal> x = JsonNullable.<BigDecimal>undefined();

  public static final String JSON_PROPERTY_Y = "y";
  private JsonNullable<BigDecimal> y = JsonNullable.<BigDecimal>undefined();

  public TemplateField() { 
  }

  @JsonCreator
  public TemplateField(
    @JsonProperty(JSON_PROPERTY_CREATED_AT) OffsetDateTime createdAt, 
    @JsonProperty(JSON_PROPERTY_ID) UUID id, 
    @JsonProperty(JSON_PROPERTY_UPDATED_AT) OffsetDateTime updatedAt
  ) {
  this();
    this.createdAt = createdAt;
    this.id = id;
    this.updatedAt = updatedAt;
  }

  public TemplateField align(@javax.annotation.Nullable Integer align) {
    this.align = align;
    return this;
  }

  /**
   * Text: 0 Left · 1 Center · 2 Right.
   * @return align
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_ALIGN)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getAlign() {
    return align;
  }


  @JsonProperty(JSON_PROPERTY_ALIGN)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setAlign(@javax.annotation.Nullable Integer align) {
    this.align = align;
  }


  public TemplateField checked(@javax.annotation.Nullable Boolean checked) {
    this.checked = checked;
    return this;
  }

  /**
   * Checkbox: ticked or not.
   * @return checked
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_CHECKED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Boolean getChecked() {
    return checked;
  }


  @JsonProperty(JSON_PROPERTY_CHECKED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setChecked(@javax.annotation.Nullable Boolean checked) {
    this.checked = checked;
  }


  /**
   * When the field was added.
   * @return createdAt
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_CREATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }




  public TemplateField dateFormat(@javax.annotation.Nullable Integer dateFormat) {
    this.dateFormat = dateFormat;
    return this;
  }

  /**
   * Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy.
   * @return dateFormat
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_DATE_FORMAT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getDateFormat() {
    return dateFormat;
  }


  @JsonProperty(JSON_PROPERTY_DATE_FORMAT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setDateFormat(@javax.annotation.Nullable Integer dateFormat) {
    this.dateFormat = dateFormat;
  }


  public TemplateField font(@javax.annotation.Nullable String font) {
    this.font = font;
    return this;
  }

  /**
   * Text, Date and Dropdown: the font.
   * @return font
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_FONT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public String getFont() {
    return font;
  }


  @JsonProperty(JSON_PROPERTY_FONT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setFont(@javax.annotation.Nullable String font) {
    this.font = font;
  }


  public TemplateField fontSize(@javax.annotation.Nullable Integer fontSize) {
    this.fontSize = fontSize;
    return this;
  }

  /**
   * Text and Dropdown: the font size in points (Date: 10).
   * @return fontSize
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_FONT_SIZE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getFontSize() {
    return fontSize;
  }


  @JsonProperty(JSON_PROPERTY_FONT_SIZE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setFontSize(@javax.annotation.Nullable Integer fontSize) {
    this.fontSize = fontSize;
  }


  public TemplateField formula(@javax.annotation.Nullable String formula) {
    this.formula = JsonNullable.<String>of(formula);
    return this;
  }

  /**
   * A calculated field&#39;s formula, or null.
   * @return formula
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public String getFormula() {
        return formula.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_FORMULA)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getFormula_JsonNullable() {
    return formula;
  }
  
  @JsonProperty(JSON_PROPERTY_FORMULA)
  public void setFormula_JsonNullable(JsonNullable<String> formula) {
    this.formula = formula;
  }

  public void setFormula(@javax.annotation.Nullable String formula) {
    this.formula = JsonNullable.<String>of(formula);
  }


  public TemplateField groupName(@javax.annotation.Nullable String groupName) {
    this.groupName = JsonNullable.<String>of(groupName);
    return this;
  }

  /**
   * Radio: the option group&#39;s name.
   * @return groupName
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public String getGroupName() {
        return groupName.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_GROUP_NAME)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getGroupName_JsonNullable() {
    return groupName;
  }
  
  @JsonProperty(JSON_PROPERTY_GROUP_NAME)
  public void setGroupName_JsonNullable(JsonNullable<String> groupName) {
    this.groupName = groupName;
  }

  public void setGroupName(@javax.annotation.Nullable String groupName) {
    this.groupName = JsonNullable.<String>of(groupName);
  }


  public TemplateField height(@javax.annotation.Nullable Integer height) {
    this.height = height;
    return this;
  }

  /**
   * In PDF points (1/72 inch): the field&#39;s height.
   * @return height
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_HEIGHT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getHeight() {
    return height;
  }


  @JsonProperty(JSON_PROPERTY_HEIGHT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setHeight(@javax.annotation.Nullable Integer height) {
    this.height = height;
  }


  /**
   * The field&#39;s ID.
   * @return id
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public UUID getId() {
    return id;
  }




  public TemplateField isMultiLine(@javax.annotation.Nullable Boolean isMultiLine) {
    this.isMultiLine = isMultiLine;
    return this;
  }

  /**
   * Text: the signer may type several lines.
   * @return isMultiLine
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_MULTI_LINE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Boolean getIsMultiLine() {
    return isMultiLine;
  }


  @JsonProperty(JSON_PROPERTY_IS_MULTI_LINE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsMultiLine(@javax.annotation.Nullable Boolean isMultiLine) {
    this.isMultiLine = isMultiLine;
  }


  public TemplateField isRequired(@javax.annotation.Nullable Boolean isRequired) {
    this.isRequired = isRequired;
    return this;
  }

  /**
   * False: the signer may leave it empty.
   * @return isRequired
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_REQUIRED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Boolean getIsRequired() {
    return isRequired;
  }


  @JsonProperty(JSON_PROPERTY_IS_REQUIRED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsRequired(@javax.annotation.Nullable Boolean isRequired) {
    this.isRequired = isRequired;
  }


  public TemplateField items(@javax.annotation.Nullable List<Object> items) {
    this.items = items;
    return this;
  }

  public TemplateField addItemsItem(Object itemsItem) {
    if (this.items == null) {
      this.items = new ArrayList<>();
    }
    this.items.add(itemsItem);
    return this;
  }

  /**
   * Radio: the options, each &#x60;{x, y, selected}&#x60;.
   * @return items
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_ITEMS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public List<Object> getItems() {
    return items;
  }


  @JsonProperty(JSON_PROPERTY_ITEMS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setItems(@javax.annotation.Nullable List<Object> items) {
    this.items = items;
  }


  public TemplateField kind(@javax.annotation.Nullable Integer kind) {
    this.kind = kind;
    return this;
  }

  /**
   * The field&#39;s type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp.
   * @return kind
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_KIND)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getKind() {
    return kind;
  }


  @JsonProperty(JSON_PROPERTY_KIND)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setKind(@javax.annotation.Nullable Integer kind) {
    this.kind = kind;
  }


  public TemplateField label(@javax.annotation.Nullable String label) {
    this.label = JsonNullable.<String>of(label);
    return this;
  }

  /**
   * The field&#39;s name, shown to the signer.
   * @return label
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public String getLabel() {
        return label.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_LABEL)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getLabel_JsonNullable() {
    return label;
  }
  
  @JsonProperty(JSON_PROPERTY_LABEL)
  public void setLabel_JsonNullable(JsonNullable<String> label) {
    this.label = label;
  }

  public void setLabel(@javax.annotation.Nullable String label) {
    this.label = JsonNullable.<String>of(label);
  }


  public TemplateField maxLength(@javax.annotation.Nullable Integer maxLength) {
    this.maxLength = JsonNullable.<Integer>of(maxLength);
    return this;
  }

  /**
   * Text: the most characters the signer may type.
   * minimum: 1
   * maximum: 550
   * @return maxLength
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public Integer getMaxLength() {
        return maxLength.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_MAX_LENGTH)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Integer> getMaxLength_JsonNullable() {
    return maxLength;
  }
  
  @JsonProperty(JSON_PROPERTY_MAX_LENGTH)
  public void setMaxLength_JsonNullable(JsonNullable<Integer> maxLength) {
    this.maxLength = maxLength;
  }

  public void setMaxLength(@javax.annotation.Nullable Integer maxLength) {
    this.maxLength = JsonNullable.<Integer>of(maxLength);
  }


  public TemplateField numberFormat(@javax.annotation.Nullable Object numberFormat) {
    this.numberFormat = JsonNullable.<Object>of(numberFormat);
    return this;
  }

  /**
   * How a calculated number is shown, or null.
   * @return numberFormat
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public Object getNumberFormat() {
        return numberFormat.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_NUMBER_FORMAT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Object> getNumberFormat_JsonNullable() {
    return numberFormat;
  }
  
  @JsonProperty(JSON_PROPERTY_NUMBER_FORMAT)
  public void setNumberFormat_JsonNullable(JsonNullable<Object> numberFormat) {
    this.numberFormat = numberFormat;
  }

  public void setNumberFormat(@javax.annotation.Nullable Object numberFormat) {
    this.numberFormat = JsonNullable.<Object>of(numberFormat);
  }


  public TemplateField page(@javax.annotation.Nullable UUID page) {
    this.page = page;
    return this;
  }

  /**
   * The ID of the page the field is on.
   * @return page
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_PAGE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public UUID getPage() {
    return page;
  }


  @JsonProperty(JSON_PROPERTY_PAGE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setPage(@javax.annotation.Nullable UUID page) {
    this.page = page;
  }


  public TemplateField pageNumber(@javax.annotation.Nullable Integer pageNumber) {
    this.pageNumber = pageNumber;
    return this;
  }

  /**
   * That page&#39;s number, counting from 0.
   * @return pageNumber
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_PAGE_NUMBER)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getPageNumber() {
    return pageNumber;
  }


  @JsonProperty(JSON_PROPERTY_PAGE_NUMBER)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setPageNumber(@javax.annotation.Nullable Integer pageNumber) {
    this.pageNumber = pageNumber;
  }


  public TemplateField placeholder(@javax.annotation.Nullable String placeholder) {
    this.placeholder = JsonNullable.<String>of(placeholder);
    return this;
  }

  /**
   * Hint text shown while the field is empty.
   * @return placeholder
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public String getPlaceholder() {
        return placeholder.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_PLACEHOLDER)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getPlaceholder_JsonNullable() {
    return placeholder;
  }
  
  @JsonProperty(JSON_PROPERTY_PLACEHOLDER)
  public void setPlaceholder_JsonNullable(JsonNullable<String> placeholder) {
    this.placeholder = placeholder;
  }

  public void setPlaceholder(@javax.annotation.Nullable String placeholder) {
    this.placeholder = JsonNullable.<String>of(placeholder);
  }


  public TemplateField readonly(@javax.annotation.Nullable Boolean readonly) {
    this.readonly = readonly;
    return this;
  }

  /**
   * True: the signer can&#39;t change the value.
   * @return readonly
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_READONLY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Boolean getReadonly() {
    return readonly;
  }


  @JsonProperty(JSON_PROPERTY_READONLY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setReadonly(@javax.annotation.Nullable Boolean readonly) {
    this.readonly = readonly;
  }


  public TemplateField selectOptions(@javax.annotation.Nullable List<String> selectOptions) {
    this.selectOptions = selectOptions;
    return this;
  }

  public TemplateField addSelectOptionsItem(String selectOptionsItem) {
    if (this.selectOptions == null) {
      this.selectOptions = new ArrayList<>();
    }
    this.selectOptions.add(selectOptionsItem);
    return this;
  }

  /**
   * Dropdown: the choices the signer picks from.
   * @return selectOptions
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_SELECT_OPTIONS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public List<String> getSelectOptions() {
    return selectOptions;
  }


  @JsonProperty(JSON_PROPERTY_SELECT_OPTIONS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setSelectOptions(@javax.annotation.Nullable List<String> selectOptions) {
    this.selectOptions = selectOptions;
  }


  public TemplateField size(@javax.annotation.Nullable Integer size) {
    this.size = size;
    return this;
  }

  /**
   * Checkbox and Radio: the side of the tick or dot in points.
   * @return size
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_SIZE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public Integer getSize() {
    return size;
  }


  @JsonProperty(JSON_PROPERTY_SIZE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setSize(@javax.annotation.Nullable Integer size) {
    this.size = size;
  }


  public TemplateField toolTip(@javax.annotation.Nullable String toolTip) {
    this.toolTip = JsonNullable.<String>of(toolTip);
    return this;
  }

  /**
   * Shown when the signer points at the field.
   * @return toolTip
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public String getToolTip() {
        return toolTip.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_TOOL_TIP)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getToolTip_JsonNullable() {
    return toolTip;
  }
  
  @JsonProperty(JSON_PROPERTY_TOOL_TIP)
  public void setToolTip_JsonNullable(JsonNullable<String> toolTip) {
    this.toolTip = toolTip;
  }

  public void setToolTip(@javax.annotation.Nullable String toolTip) {
    this.toolTip = JsonNullable.<String>of(toolTip);
  }


  /**
   * When the field last changed.
   * @return updatedAt
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_UPDATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public OffsetDateTime getUpdatedAt() {
    return updatedAt;
  }




  public TemplateField value(@javax.annotation.Nullable String value) {
    this.value = JsonNullable.<String>of(value);
    return this;
  }

  /**
   * The field&#39;s current value.
   * @return value
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public String getValue() {
        return value.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_VALUE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getValue_JsonNullable() {
    return value;
  }
  
  @JsonProperty(JSON_PROPERTY_VALUE)
  public void setValue_JsonNullable(JsonNullable<String> value) {
    this.value = value;
  }

  public void setValue(@javax.annotation.Nullable String value) {
    this.value = JsonNullable.<String>of(value);
  }


  public TemplateField width(@javax.annotation.Nullable BigDecimal width) {
    this.width = width;
    return this;
  }

  /**
   * In PDF points (1/72 inch): the field&#39;s width.
   * @return width
   */
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_WIDTH)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public BigDecimal getWidth() {
    return width;
  }


  @JsonProperty(JSON_PROPERTY_WIDTH)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setWidth(@javax.annotation.Nullable BigDecimal width) {
    this.width = width;
  }


  public TemplateField x(@javax.annotation.Nullable BigDecimal x) {
    this.x = JsonNullable.<BigDecimal>of(x);
    return this;
  }

  /**
   * In PDF points (1/72 inch): from the page&#39;s left edge to the field&#39;s left edge.
   * @return x
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public BigDecimal getX() {
        return x.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_X)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<BigDecimal> getX_JsonNullable() {
    return x;
  }
  
  @JsonProperty(JSON_PROPERTY_X)
  public void setX_JsonNullable(JsonNullable<BigDecimal> x) {
    this.x = x;
  }

  public void setX(@javax.annotation.Nullable BigDecimal x) {
    this.x = JsonNullable.<BigDecimal>of(x);
  }


  public TemplateField y(@javax.annotation.Nullable BigDecimal y) {
    this.y = JsonNullable.<BigDecimal>of(y);
    return this;
  }

  /**
   * In PDF points (1/72 inch): from the page&#39;s top edge to the field&#39;s top edge.
   * @return y
   */
  @javax.annotation.Nullable
  @JsonIgnore
  public BigDecimal getY() {
        return y.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_Y)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<BigDecimal> getY_JsonNullable() {
    return y;
  }
  
  @JsonProperty(JSON_PROPERTY_Y)
  public void setY_JsonNullable(JsonNullable<BigDecimal> y) {
    this.y = y;
  }

  public void setY(@javax.annotation.Nullable BigDecimal y) {
    this.y = JsonNullable.<BigDecimal>of(y);
  }


  /**
   * Return true if this TemplateField object is equal to o.
   */
  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    TemplateField templateField = (TemplateField) o;
    return Objects.equals(this.align, templateField.align) &&
        Objects.equals(this.checked, templateField.checked) &&
        Objects.equals(this.createdAt, templateField.createdAt) &&
        Objects.equals(this.dateFormat, templateField.dateFormat) &&
        Objects.equals(this.font, templateField.font) &&
        Objects.equals(this.fontSize, templateField.fontSize) &&
        equalsNullable(this.formula, templateField.formula) &&
        equalsNullable(this.groupName, templateField.groupName) &&
        Objects.equals(this.height, templateField.height) &&
        Objects.equals(this.id, templateField.id) &&
        Objects.equals(this.isMultiLine, templateField.isMultiLine) &&
        Objects.equals(this.isRequired, templateField.isRequired) &&
        Objects.equals(this.items, templateField.items) &&
        Objects.equals(this.kind, templateField.kind) &&
        equalsNullable(this.label, templateField.label) &&
        equalsNullable(this.maxLength, templateField.maxLength) &&
        equalsNullable(this.numberFormat, templateField.numberFormat) &&
        Objects.equals(this.page, templateField.page) &&
        Objects.equals(this.pageNumber, templateField.pageNumber) &&
        equalsNullable(this.placeholder, templateField.placeholder) &&
        Objects.equals(this.readonly, templateField.readonly) &&
        Objects.equals(this.selectOptions, templateField.selectOptions) &&
        Objects.equals(this.size, templateField.size) &&
        equalsNullable(this.toolTip, templateField.toolTip) &&
        Objects.equals(this.updatedAt, templateField.updatedAt) &&
        equalsNullable(this.value, templateField.value) &&
        Objects.equals(this.width, templateField.width) &&
        equalsNullable(this.x, templateField.x) &&
        equalsNullable(this.y, templateField.y);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(align, checked, createdAt, dateFormat, font, fontSize, hashCodeNullable(formula), hashCodeNullable(groupName), height, id, isMultiLine, isRequired, items, kind, hashCodeNullable(label), hashCodeNullable(maxLength), hashCodeNullable(numberFormat), page, pageNumber, hashCodeNullable(placeholder), readonly, selectOptions, size, hashCodeNullable(toolTip), updatedAt, hashCodeNullable(value), width, hashCodeNullable(x), hashCodeNullable(y));
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
    sb.append("class TemplateField {\n");
    sb.append("    align: ").append(toIndentedString(align)).append("\n");
    sb.append("    checked: ").append(toIndentedString(checked)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    dateFormat: ").append(toIndentedString(dateFormat)).append("\n");
    sb.append("    font: ").append(toIndentedString(font)).append("\n");
    sb.append("    fontSize: ").append(toIndentedString(fontSize)).append("\n");
    sb.append("    formula: ").append(toIndentedString(formula)).append("\n");
    sb.append("    groupName: ").append(toIndentedString(groupName)).append("\n");
    sb.append("    height: ").append(toIndentedString(height)).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    isMultiLine: ").append(toIndentedString(isMultiLine)).append("\n");
    sb.append("    isRequired: ").append(toIndentedString(isRequired)).append("\n");
    sb.append("    items: ").append(toIndentedString(items)).append("\n");
    sb.append("    kind: ").append(toIndentedString(kind)).append("\n");
    sb.append("    label: ").append(toIndentedString(label)).append("\n");
    sb.append("    maxLength: ").append(toIndentedString(maxLength)).append("\n");
    sb.append("    numberFormat: ").append(toIndentedString(numberFormat)).append("\n");
    sb.append("    page: ").append(toIndentedString(page)).append("\n");
    sb.append("    pageNumber: ").append(toIndentedString(pageNumber)).append("\n");
    sb.append("    placeholder: ").append(toIndentedString(placeholder)).append("\n");
    sb.append("    readonly: ").append(toIndentedString(readonly)).append("\n");
    sb.append("    selectOptions: ").append(toIndentedString(selectOptions)).append("\n");
    sb.append("    size: ").append(toIndentedString(size)).append("\n");
    sb.append("    toolTip: ").append(toIndentedString(toolTip)).append("\n");
    sb.append("    updatedAt: ").append(toIndentedString(updatedAt)).append("\n");
    sb.append("    value: ").append(toIndentedString(value)).append("\n");
    sb.append("    width: ").append(toIndentedString(width)).append("\n");
    sb.append("    x: ").append(toIndentedString(x)).append("\n");
    sb.append("    y: ").append(toIndentedString(y)).append("\n");
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

    // add `align` to the URL query string
    if (getAlign() != null) {
      joiner.add(String.format("%salign%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getAlign()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `checked` to the URL query string
    if (getChecked() != null) {
      joiner.add(String.format("%schecked%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getChecked()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `created_at` to the URL query string
    if (getCreatedAt() != null) {
      joiner.add(String.format("%screated_at%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getCreatedAt()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `date_format` to the URL query string
    if (getDateFormat() != null) {
      joiner.add(String.format("%sdate_format%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getDateFormat()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `font` to the URL query string
    if (getFont() != null) {
      joiner.add(String.format("%sfont%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getFont()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `font_size` to the URL query string
    if (getFontSize() != null) {
      joiner.add(String.format("%sfont_size%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getFontSize()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `formula` to the URL query string
    if (getFormula() != null) {
      joiner.add(String.format("%sformula%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getFormula()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `group_name` to the URL query string
    if (getGroupName() != null) {
      joiner.add(String.format("%sgroup_name%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getGroupName()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `height` to the URL query string
    if (getHeight() != null) {
      joiner.add(String.format("%sheight%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getHeight()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `id` to the URL query string
    if (getId() != null) {
      joiner.add(String.format("%sid%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getId()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `is_multi_line` to the URL query string
    if (getIsMultiLine() != null) {
      joiner.add(String.format("%sis_multi_line%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getIsMultiLine()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `is_required` to the URL query string
    if (getIsRequired() != null) {
      joiner.add(String.format("%sis_required%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getIsRequired()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `items` to the URL query string
    if (getItems() != null) {
      for (int i = 0; i < getItems().size(); i++) {
        joiner.add(String.format("%sitems%s%s=%s", prefix, suffix,
            "".equals(suffix) ? "" : String.format("%s%d%s", containerPrefix, i, containerSuffix),
            URLEncoder.encode(ApiClient.valueToString(getItems().get(i)), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
      }
    }

    // add `kind` to the URL query string
    if (getKind() != null) {
      joiner.add(String.format("%skind%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getKind()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `label` to the URL query string
    if (getLabel() != null) {
      joiner.add(String.format("%slabel%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getLabel()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `max_length` to the URL query string
    if (getMaxLength() != null) {
      joiner.add(String.format("%smax_length%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getMaxLength()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `number_format` to the URL query string
    if (getNumberFormat() != null) {
      joiner.add(String.format("%snumber_format%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getNumberFormat()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `page` to the URL query string
    if (getPage() != null) {
      joiner.add(String.format("%spage%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getPage()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `page_number` to the URL query string
    if (getPageNumber() != null) {
      joiner.add(String.format("%spage_number%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getPageNumber()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `placeholder` to the URL query string
    if (getPlaceholder() != null) {
      joiner.add(String.format("%splaceholder%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getPlaceholder()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `readonly` to the URL query string
    if (getReadonly() != null) {
      joiner.add(String.format("%sreadonly%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getReadonly()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `select_options` to the URL query string
    if (getSelectOptions() != null) {
      for (int i = 0; i < getSelectOptions().size(); i++) {
        joiner.add(String.format("%sselect_options%s%s=%s", prefix, suffix,
            "".equals(suffix) ? "" : String.format("%s%d%s", containerPrefix, i, containerSuffix),
            URLEncoder.encode(ApiClient.valueToString(getSelectOptions().get(i)), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
      }
    }

    // add `size` to the URL query string
    if (getSize() != null) {
      joiner.add(String.format("%ssize%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getSize()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `tool_tip` to the URL query string
    if (getToolTip() != null) {
      joiner.add(String.format("%stool_tip%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getToolTip()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `updated_at` to the URL query string
    if (getUpdatedAt() != null) {
      joiner.add(String.format("%supdated_at%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getUpdatedAt()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `value` to the URL query string
    if (getValue() != null) {
      joiner.add(String.format("%svalue%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getValue()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `width` to the URL query string
    if (getWidth() != null) {
      joiner.add(String.format("%swidth%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getWidth()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `x` to the URL query string
    if (getX() != null) {
      joiner.add(String.format("%sx%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getX()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    // add `y` to the URL query string
    if (getY() != null) {
      joiner.add(String.format("%sy%s=%s", prefix, suffix, URLEncoder.encode(ApiClient.valueToString(getY()), StandardCharsets.UTF_8).replaceAll("\\+", "%20")));
    }

    return joiner.toString();
  }
}

