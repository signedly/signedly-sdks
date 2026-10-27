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

package com.signedly.api;

import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Pair;

import com.signedly.model.CreateDocumentFromTemplate200Response;
import com.signedly.model.CreateDocumentFromTemplateRequest;
import com.signedly.model.DocumentPage;
import com.signedly.model.DocumentStatusPage;
import java.io.File;
import com.signedly.model.GetDownloadStatus200Response;
import com.signedly.model.Page;
import com.signedly.model.SendDocument200Response;
import java.net.URI;
import java.util.UUID;
import com.signedly.model.Upload;
import com.signedly.model.UploadDocumentForOneSigner200Response;

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
public class DocumentsApi {
  private final HttpClient memberVarHttpClient;
  private final ObjectMapper memberVarObjectMapper;
  private final String memberVarBaseUri;
  private final Consumer<HttpRequest.Builder> memberVarInterceptor;
  private final Duration memberVarReadTimeout;
  private final Consumer<HttpResponse<InputStream>> memberVarResponseInterceptor;
  private final Consumer<HttpResponse<String>> memberVarAsyncResponseInterceptor;

  public DocumentsApi() {
    this(new ApiClient());
  }

  public DocumentsApi(ApiClient apiClient) {
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
   * Make a document from a template
   * Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template&#39;s signing order. Fill the open roles here with &#x60;recipients&#x60;, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can&#39;t be sent. To prefill a field, add a key with the field&#39;s label and the value, e.g. &#x60;\&quot;Company\&quot;: \&quot;Acme Ltd\&quot;&#x60;.
   * @param data  (required)
   * @return CreateDocumentFromTemplate200Response
   * @throws ApiException if fails to make API call
   */
  public CreateDocumentFromTemplate200Response createDocumentFromTemplate(CreateDocumentFromTemplateRequest data) throws ApiException {
    ApiResponse<CreateDocumentFromTemplate200Response> localVarResponse = createDocumentFromTemplateWithHttpInfo(data);
    return localVarResponse.getData();
  }

  /**
   * Make a document from a template
   * Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template&#39;s signing order. Fill the open roles here with &#x60;recipients&#x60;, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can&#39;t be sent. To prefill a field, add a key with the field&#39;s label and the value, e.g. &#x60;\&quot;Company\&quot;: \&quot;Acme Ltd\&quot;&#x60;.
   * @param data  (required)
   * @return ApiResponse&lt;CreateDocumentFromTemplate200Response&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<CreateDocumentFromTemplate200Response> createDocumentFromTemplateWithHttpInfo(CreateDocumentFromTemplateRequest data) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = createDocumentFromTemplateRequestBuilder(data);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("createDocumentFromTemplate", localVarResponse);
        }
        return new ApiResponse<CreateDocumentFromTemplate200Response>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<CreateDocumentFromTemplate200Response>() {}) // closes the InputStream
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

  private HttpRequest.Builder createDocumentFromTemplateRequestBuilder(CreateDocumentFromTemplateRequest data) throws ApiException {
    // verify the required parameter 'data' is set
    if (data == null) {
      throw new ApiException(400, "Missing the required parameter 'data' when calling createDocumentFromTemplate");
    }

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/documents/fromtemplate/";

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
   * Delete a template or an unsent document
   * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can&#39;t be deleted.
   * @param id The document&#39;s or template&#39;s ID. (required)
   * @return SendDocument200Response
   * @throws ApiException if fails to make API call
   */
  public SendDocument200Response deleteDocument(UUID id) throws ApiException {
    ApiResponse<SendDocument200Response> localVarResponse = deleteDocumentWithHttpInfo(id);
    return localVarResponse.getData();
  }

  /**
   * Delete a template or an unsent document
   * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can&#39;t be deleted.
   * @param id The document&#39;s or template&#39;s ID. (required)
   * @return ApiResponse&lt;SendDocument200Response&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<SendDocument200Response> deleteDocumentWithHttpInfo(UUID id) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = deleteDocumentRequestBuilder(id);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("deleteDocument", localVarResponse);
        }
        return new ApiResponse<SendDocument200Response>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<SendDocument200Response>() {}) // closes the InputStream
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

  private HttpRequest.Builder deleteDocumentRequestBuilder(UUID id) throws ApiException {
    // verify the required parameter 'id' is set
    if (id == null) {
      throw new ApiException(400, "Missing the required parameter 'id' when calling deleteDocument");
    }

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/documents-status/{id}/"
        .replace("{id}", ApiClient.urlEncode(id.toString()));

    localVarRequestBuilder.uri(URI.create(memberVarBaseUri + localVarPath));

    localVarRequestBuilder.header("Accept", "application/json");

    localVarRequestBuilder.method("DELETE", HttpRequest.BodyPublishers.noBody());
    if (memberVarReadTimeout != null) {
      localVarRequestBuilder.timeout(memberVarReadTimeout);
    }
    if (memberVarInterceptor != null) {
      memberVarInterceptor.accept(localVarRequestBuilder);
    }
    return localVarRequestBuilder;
  }

  /**
   * Check whether the signed PDF is ready
   * Says whether the document&#39;s signed PDF can be downloaded yet (&#x60;download_status&#x60;). For the document&#39;s signing status, use &#x60;GET /ap1/documents-status-list/?document_ids&#x3D;&lt;id&gt;&#x60;.
   * @param id The document&#39;s ID. (required)
   * @return GetDownloadStatus200Response
   * @throws ApiException if fails to make API call
   */
  public GetDownloadStatus200Response getDownloadStatus(UUID id) throws ApiException {
    ApiResponse<GetDownloadStatus200Response> localVarResponse = getDownloadStatusWithHttpInfo(id);
    return localVarResponse.getData();
  }

  /**
   * Check whether the signed PDF is ready
   * Says whether the document&#39;s signed PDF can be downloaded yet (&#x60;download_status&#x60;). For the document&#39;s signing status, use &#x60;GET /ap1/documents-status-list/?document_ids&#x3D;&lt;id&gt;&#x60;.
   * @param id The document&#39;s ID. (required)
   * @return ApiResponse&lt;GetDownloadStatus200Response&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<GetDownloadStatus200Response> getDownloadStatusWithHttpInfo(UUID id) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = getDownloadStatusRequestBuilder(id);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("getDownloadStatus", localVarResponse);
        }
        return new ApiResponse<GetDownloadStatus200Response>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<GetDownloadStatus200Response>() {}) // closes the InputStream
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

  private HttpRequest.Builder getDownloadStatusRequestBuilder(UUID id) throws ApiException {
    // verify the required parameter 'id' is set
    if (id == null) {
      throw new ApiException(400, "Missing the required parameter 'id' when calling getDownloadStatus");
    }

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/documents-status/{id}/"
        .replace("{id}", ApiClient.urlEncode(id.toString()));

    localVarRequestBuilder.uri(URI.create(memberVarBaseUri + localVarPath));

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

  /**
   * List a document&#39;s pages and their fields
   * The document&#39;s (or template&#39;s) pages, in order, each with its fields. Use a page&#39;s &#x60;id&#x60; and &#x60;page_number&#x60; when placing a field on it. A new upload has no pages until it has been processed.
   * @param id The document&#39;s or template&#39;s ID. (required)
   * @return List&lt;Page&gt;
   * @throws ApiException if fails to make API call
   */
  public List<Page> listDocumentPages(UUID id) throws ApiException {
    ApiResponse<List<Page>> localVarResponse = listDocumentPagesWithHttpInfo(id);
    return localVarResponse.getData();
  }

  /**
   * List a document&#39;s pages and their fields
   * The document&#39;s (or template&#39;s) pages, in order, each with its fields. Use a page&#39;s &#x60;id&#x60; and &#x60;page_number&#x60; when placing a field on it. A new upload has no pages until it has been processed.
   * @param id The document&#39;s or template&#39;s ID. (required)
   * @return ApiResponse&lt;List&lt;Page&gt;&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<List<Page>> listDocumentPagesWithHttpInfo(UUID id) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = listDocumentPagesRequestBuilder(id);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("listDocumentPages", localVarResponse);
        }
        return new ApiResponse<List<Page>>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<List<Page>>() {}) // closes the InputStream
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

  private HttpRequest.Builder listDocumentPagesRequestBuilder(UUID id) throws ApiException {
    // verify the required parameter 'id' is set
    if (id == null) {
      throw new ApiException(400, "Missing the required parameter 'id' when calling listDocumentPages");
    }

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/documents/{id}/pages/"
        .replace("{id}", ApiClient.urlEncode(id.toString()));

    localVarRequestBuilder.uri(URI.create(memberVarBaseUri + localVarPath));

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

  /**
   * List the status of your organisation&#39;s documents
   * The ID and status of every document of your organisation&#39;s admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren&#39;t listed. A light way to poll for completed documents. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.
   * @param name Only documents whose name contains this (any case). (optional)
   * @param status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
   * @param documentIds Only these documents. Repeat it or separate IDs with commas. (optional)
   * @param limit How many results to return (default 10). (optional)
   * @param offset How many results to skip. (optional)
   * @return DocumentStatusPage
   * @throws ApiException if fails to make API call
   */
  public DocumentStatusPage listDocumentStatuses(String name, List<Integer> status, List<UUID> documentIds, Integer limit, Integer offset) throws ApiException {
    ApiResponse<DocumentStatusPage> localVarResponse = listDocumentStatusesWithHttpInfo(name, status, documentIds, limit, offset);
    return localVarResponse.getData();
  }

  /**
   * List the status of your organisation&#39;s documents
   * The ID and status of every document of your organisation&#39;s admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren&#39;t listed. A light way to poll for completed documents. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.
   * @param name Only documents whose name contains this (any case). (optional)
   * @param status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
   * @param documentIds Only these documents. Repeat it or separate IDs with commas. (optional)
   * @param limit How many results to return (default 10). (optional)
   * @param offset How many results to skip. (optional)
   * @return ApiResponse&lt;DocumentStatusPage&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<DocumentStatusPage> listDocumentStatusesWithHttpInfo(String name, List<Integer> status, List<UUID> documentIds, Integer limit, Integer offset) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = listDocumentStatusesRequestBuilder(name, status, documentIds, limit, offset);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("listDocumentStatuses", localVarResponse);
        }
        return new ApiResponse<DocumentStatusPage>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<DocumentStatusPage>() {}) // closes the InputStream
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

  private HttpRequest.Builder listDocumentStatusesRequestBuilder(String name, List<Integer> status, List<UUID> documentIds, Integer limit, Integer offset) throws ApiException {

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/documents-status-list/";

    List<Pair> localVarQueryParams = new ArrayList<>();
    StringJoiner localVarQueryStringJoiner = new StringJoiner("&");
    String localVarQueryParameterBaseName;
    localVarQueryParameterBaseName = "name";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("name", name));
    localVarQueryParameterBaseName = "status";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("multi", "status", status));
    localVarQueryParameterBaseName = "document_ids";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("multi", "document_ids", documentIds));
    localVarQueryParameterBaseName = "limit";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("limit", limit));
    localVarQueryParameterBaseName = "offset";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("offset", offset));

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

  /**
   * List the documents this API client created
   * The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren&#39;t listed. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.
   * @param name Only documents whose name contains this (any case). (optional)
   * @param status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
   * @param documentIds Only these documents. Repeat it or separate IDs with commas. (optional)
   * @param limit How many results to return (default 10). (optional)
   * @param offset How many results to skip. (optional)
   * @return DocumentPage
   * @throws ApiException if fails to make API call
   */
  public DocumentPage listDocuments(String name, List<Integer> status, List<UUID> documentIds, Integer limit, Integer offset) throws ApiException {
    ApiResponse<DocumentPage> localVarResponse = listDocumentsWithHttpInfo(name, status, documentIds, limit, offset);
    return localVarResponse.getData();
  }

  /**
   * List the documents this API client created
   * The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren&#39;t listed. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.
   * @param name Only documents whose name contains this (any case). (optional)
   * @param status Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). (optional)
   * @param documentIds Only these documents. Repeat it or separate IDs with commas. (optional)
   * @param limit How many results to return (default 10). (optional)
   * @param offset How many results to skip. (optional)
   * @return ApiResponse&lt;DocumentPage&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<DocumentPage> listDocumentsWithHttpInfo(String name, List<Integer> status, List<UUID> documentIds, Integer limit, Integer offset) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = listDocumentsRequestBuilder(name, status, documentIds, limit, offset);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("listDocuments", localVarResponse);
        }
        return new ApiResponse<DocumentPage>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<DocumentPage>() {}) // closes the InputStream
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

  private HttpRequest.Builder listDocumentsRequestBuilder(String name, List<Integer> status, List<UUID> documentIds, Integer limit, Integer offset) throws ApiException {

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/documents/";

    List<Pair> localVarQueryParams = new ArrayList<>();
    StringJoiner localVarQueryStringJoiner = new StringJoiner("&");
    String localVarQueryParameterBaseName;
    localVarQueryParameterBaseName = "name";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("name", name));
    localVarQueryParameterBaseName = "status";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("multi", "status", status));
    localVarQueryParameterBaseName = "document_ids";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("multi", "document_ids", documentIds));
    localVarQueryParameterBaseName = "limit";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("limit", limit));
    localVarQueryParameterBaseName = "offset";
    localVarQueryParams.addAll(ApiClient.parameterToPairs("offset", offset));

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

  /**
   * Upload a document or template
   * Uploads a PDF or DOCX file of up to 2 MB as a document (&#x60;type&#x60; 2) or a template (&#x60;type&#x60; 4). The answer is the upload; the document itself is made in the background. Find it in &#x60;GET /ap1/documents/?name&#x3D;&lt;name&gt;&#x60; (its &#x60;upload.id&#x60; is this upload&#39;s &#x60;id&#x60;), or a template in &#x60;GET /ap1/templates/&#x60;, and wait until &#x60;GET /ap1/documents/{id}/pages/&#x60; lists its pages before placing fields.
   * @param _file A PDF or DOCX file. At most 2 MB. (required)
   * @param name The document&#39;s name. It must differ from every other upload of this API client. (required)
   * @param type 2 Document · 4 Template (required)
   * @param templateName The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. (optional)
   * @return Upload
   * @throws ApiException if fails to make API call
   */
  public Upload uploadDocument(File _file, String name, Integer type, String templateName) throws ApiException {
    ApiResponse<Upload> localVarResponse = uploadDocumentWithHttpInfo(_file, name, type, templateName);
    return localVarResponse.getData();
  }

  /**
   * Upload a document or template
   * Uploads a PDF or DOCX file of up to 2 MB as a document (&#x60;type&#x60; 2) or a template (&#x60;type&#x60; 4). The answer is the upload; the document itself is made in the background. Find it in &#x60;GET /ap1/documents/?name&#x3D;&lt;name&gt;&#x60; (its &#x60;upload.id&#x60; is this upload&#39;s &#x60;id&#x60;), or a template in &#x60;GET /ap1/templates/&#x60;, and wait until &#x60;GET /ap1/documents/{id}/pages/&#x60; lists its pages before placing fields.
   * @param _file A PDF or DOCX file. At most 2 MB. (required)
   * @param name The document&#39;s name. It must differ from every other upload of this API client. (required)
   * @param type 2 Document · 4 Template (required)
   * @param templateName The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. (optional)
   * @return ApiResponse&lt;Upload&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<Upload> uploadDocumentWithHttpInfo(File _file, String name, Integer type, String templateName) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = uploadDocumentRequestBuilder(_file, name, type, templateName);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("uploadDocument", localVarResponse);
        }
        return new ApiResponse<Upload>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<Upload>() {}) // closes the InputStream
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

  private HttpRequest.Builder uploadDocumentRequestBuilder(File _file, String name, Integer type, String templateName) throws ApiException {
    // verify the required parameter '_file' is set
    if (_file == null) {
      throw new ApiException(400, "Missing the required parameter '_file' when calling uploadDocument");
    }
    // verify the required parameter 'name' is set
    if (name == null) {
      throw new ApiException(400, "Missing the required parameter 'name' when calling uploadDocument");
    }
    // verify the required parameter 'type' is set
    if (type == null) {
      throw new ApiException(400, "Missing the required parameter 'type' when calling uploadDocument");
    }

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/upload/";

    localVarRequestBuilder.uri(URI.create(memberVarBaseUri + localVarPath));

    localVarRequestBuilder.header("Accept", "application/json");

    List<NameValuePair> formValues = new ArrayList<>();
    if (_file != null) {
        formValues.add(new BasicNameValuePair("file", _file.toString()));
    }
    if (name != null) {
        formValues.add(new BasicNameValuePair("name", name.toString()));
    }
    if (type != null) {
        formValues.add(new BasicNameValuePair("type", type.toString()));
    }
    if (templateName != null) {
        formValues.add(new BasicNameValuePair("template_name", templateName.toString()));
    }
    HttpEntity entity = new UrlEncodedFormEntity(formValues, java.nio.charset.StandardCharsets.UTF_8);
    ByteArrayOutputStream formOutputStream = new ByteArrayOutputStream();
    try {
        entity.writeTo(formOutputStream);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
    localVarRequestBuilder
        .header("Content-Type", entity.getContentType().getValue())
        .method("POST", HttpRequest.BodyPublishers
            .ofInputStream(() -> new ByteArrayInputStream(formOutputStream.toByteArray())));
    if (memberVarReadTimeout != null) {
      localVarRequestBuilder.timeout(memberVarReadTimeout);
    }
    if (memberVarInterceptor != null) {
      memberVarInterceptor.accept(localVarRequestBuilder);
    }
    return localVarRequestBuilder;
  }

  /**
   * Upload a document for one signer and get their signing link
   * Uploads a PDF or DOCX for one signer and returns their signing link in &#x60;redirect_url&#x60;; give it to the signer. They place their own signature on the signing page and are then sent to the &#x60;redirect_url&#x60; you gave. The signed PDF and its audit trail are emailed to &#x60;final_email&#x60;, or to your organisation&#39;s admin without one.
   * @param _file A PDF or DOCX file. (required)
   * @param signeeName The signer&#39;s name. (required)
   * @param signeeEmail The signer&#39;s email address. (required)
   * @param redirectUrl Where the signer is sent after signing. (required)
   * @param finalEmail Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. (optional)
   * @return UploadDocumentForOneSigner200Response
   * @throws ApiException if fails to make API call
   */
  public UploadDocumentForOneSigner200Response uploadDocumentForOneSigner(File _file, String signeeName, String signeeEmail, URI redirectUrl, String finalEmail) throws ApiException {
    ApiResponse<UploadDocumentForOneSigner200Response> localVarResponse = uploadDocumentForOneSignerWithHttpInfo(_file, signeeName, signeeEmail, redirectUrl, finalEmail);
    return localVarResponse.getData();
  }

  /**
   * Upload a document for one signer and get their signing link
   * Uploads a PDF or DOCX for one signer and returns their signing link in &#x60;redirect_url&#x60;; give it to the signer. They place their own signature on the signing page and are then sent to the &#x60;redirect_url&#x60; you gave. The signed PDF and its audit trail are emailed to &#x60;final_email&#x60;, or to your organisation&#39;s admin without one.
   * @param _file A PDF or DOCX file. (required)
   * @param signeeName The signer&#39;s name. (required)
   * @param signeeEmail The signer&#39;s email address. (required)
   * @param redirectUrl Where the signer is sent after signing. (required)
   * @param finalEmail Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. (optional)
   * @return ApiResponse&lt;UploadDocumentForOneSigner200Response&gt;
   * @throws ApiException if fails to make API call
   */
  public ApiResponse<UploadDocumentForOneSigner200Response> uploadDocumentForOneSignerWithHttpInfo(File _file, String signeeName, String signeeEmail, URI redirectUrl, String finalEmail) throws ApiException {
    HttpRequest.Builder localVarRequestBuilder = uploadDocumentForOneSignerRequestBuilder(_file, signeeName, signeeEmail, redirectUrl, finalEmail);
    try {
      HttpResponse<InputStream> localVarResponse = memberVarHttpClient.send(
          localVarRequestBuilder.build(),
          HttpResponse.BodyHandlers.ofInputStream());
      if (memberVarResponseInterceptor != null) {
        memberVarResponseInterceptor.accept(localVarResponse);
      }
      try {
        if (localVarResponse.statusCode()/ 100 != 2) {
          throw getApiException("uploadDocumentForOneSigner", localVarResponse);
        }
        return new ApiResponse<UploadDocumentForOneSigner200Response>(
          localVarResponse.statusCode(),
          localVarResponse.headers().map(),
          localVarResponse.body() == null ? null : memberVarObjectMapper.readValue(localVarResponse.body(), new TypeReference<UploadDocumentForOneSigner200Response>() {}) // closes the InputStream
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

  private HttpRequest.Builder uploadDocumentForOneSignerRequestBuilder(File _file, String signeeName, String signeeEmail, URI redirectUrl, String finalEmail) throws ApiException {
    // verify the required parameter '_file' is set
    if (_file == null) {
      throw new ApiException(400, "Missing the required parameter '_file' when calling uploadDocumentForOneSigner");
    }
    // verify the required parameter 'signeeName' is set
    if (signeeName == null) {
      throw new ApiException(400, "Missing the required parameter 'signeeName' when calling uploadDocumentForOneSigner");
    }
    // verify the required parameter 'signeeEmail' is set
    if (signeeEmail == null) {
      throw new ApiException(400, "Missing the required parameter 'signeeEmail' when calling uploadDocumentForOneSigner");
    }
    // verify the required parameter 'redirectUrl' is set
    if (redirectUrl == null) {
      throw new ApiException(400, "Missing the required parameter 'redirectUrl' when calling uploadDocumentForOneSigner");
    }

    HttpRequest.Builder localVarRequestBuilder = HttpRequest.newBuilder();

    String localVarPath = "/ap1/upload_app/";

    localVarRequestBuilder.uri(URI.create(memberVarBaseUri + localVarPath));

    localVarRequestBuilder.header("Accept", "application/json");

    List<NameValuePair> formValues = new ArrayList<>();
    if (_file != null) {
        formValues.add(new BasicNameValuePair("file", _file.toString()));
    }
    if (signeeName != null) {
        formValues.add(new BasicNameValuePair("signee_name", signeeName.toString()));
    }
    if (signeeEmail != null) {
        formValues.add(new BasicNameValuePair("signee_email", signeeEmail.toString()));
    }
    if (redirectUrl != null) {
        formValues.add(new BasicNameValuePair("redirect_url", redirectUrl.toString()));
    }
    if (finalEmail != null) {
        formValues.add(new BasicNameValuePair("final_email", finalEmail.toString()));
    }
    HttpEntity entity = new UrlEncodedFormEntity(formValues, java.nio.charset.StandardCharsets.UTF_8);
    ByteArrayOutputStream formOutputStream = new ByteArrayOutputStream();
    try {
        entity.writeTo(formOutputStream);
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
    localVarRequestBuilder
        .header("Content-Type", entity.getContentType().getValue())
        .method("POST", HttpRequest.BodyPublishers
            .ofInputStream(() -> new ByteArrayInputStream(formOutputStream.toByteArray())));
    if (memberVarReadTimeout != null) {
      localVarRequestBuilder.timeout(memberVarReadTimeout);
    }
    if (memberVarInterceptor != null) {
      memberVarInterceptor.accept(localVarRequestBuilder);
    }
    return localVarRequestBuilder;
  }

}
