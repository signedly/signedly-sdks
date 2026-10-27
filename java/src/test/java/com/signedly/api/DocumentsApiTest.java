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

import com.signedly.client.ApiException;
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
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;


/**
 * API tests for DocumentsApi
 */
@Disabled
public class DocumentsApiTest {

    private final DocumentsApi api = new DocumentsApi();

    
    /**
     * Make a document from a template
     *
     * Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template&#39;s signing order. Fill the open roles here with &#x60;recipients&#x60;, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can&#39;t be sent. To prefill a field, add a key with the field&#39;s label and the value, e.g. &#x60;\&quot;Company\&quot;: \&quot;Acme Ltd\&quot;&#x60;.
     *
     * @throws ApiException
     *          if the Api call fails
     */
    @Test
    public void createDocumentFromTemplateTest() throws ApiException {
        CreateDocumentFromTemplateRequest data = null;
        CreateDocumentFromTemplate200Response response = 
        api.createDocumentFromTemplate(data);
        
        // TODO: test validations
    }
    
    /**
     * Delete a template or an unsent document
     *
     * Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can&#39;t be deleted.
     *
     * @throws ApiException
     *          if the Api call fails
     */
    @Test
    public void deleteDocumentTest() throws ApiException {
        UUID id = null;
        SendDocument200Response response = 
        api.deleteDocument(id);
        
        // TODO: test validations
    }
    
    /**
     * Check whether the signed PDF is ready
     *
     * Says whether the document&#39;s signed PDF can be downloaded yet (&#x60;download_status&#x60;). For the document&#39;s signing status, use &#x60;GET /ap1/documents-status-list/?document_ids&#x3D;&lt;id&gt;&#x60;.
     *
     * @throws ApiException
     *          if the Api call fails
     */
    @Test
    public void getDownloadStatusTest() throws ApiException {
        UUID id = null;
        GetDownloadStatus200Response response = 
        api.getDownloadStatus(id);
        
        // TODO: test validations
    }
    
    /**
     * List a document&#39;s pages and their fields
     *
     * The document&#39;s (or template&#39;s) pages, in order, each with its fields. Use a page&#39;s &#x60;id&#x60; and &#x60;page_number&#x60; when placing a field on it. A new upload has no pages until it has been processed.
     *
     * @throws ApiException
     *          if the Api call fails
     */
    @Test
    public void listDocumentPagesTest() throws ApiException {
        UUID id = null;
        List<Page> response = 
        api.listDocumentPages(id);
        
        // TODO: test validations
    }
    
    /**
     * List the status of your organisation&#39;s documents
     *
     * The ID and status of every document of your organisation&#39;s admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren&#39;t listed. A light way to poll for completed documents. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.
     *
     * @throws ApiException
     *          if the Api call fails
     */
    @Test
    public void listDocumentStatusesTest() throws ApiException {
        String name = null;
        List<Integer> status = null;
        List<UUID> documentIds = null;
        Integer limit = null;
        Integer offset = null;
        DocumentStatusPage response = 
        api.listDocumentStatuses(name, status, documentIds, limit, offset);
        
        // TODO: test validations
    }
    
    /**
     * List the documents this API client created
     *
     * The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren&#39;t listed. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.
     *
     * @throws ApiException
     *          if the Api call fails
     */
    @Test
    public void listDocumentsTest() throws ApiException {
        String name = null;
        List<Integer> status = null;
        List<UUID> documentIds = null;
        Integer limit = null;
        Integer offset = null;
        DocumentPage response = 
        api.listDocuments(name, status, documentIds, limit, offset);
        
        // TODO: test validations
    }
    
    /**
     * Upload a document or template
     *
     * Uploads a PDF or DOCX file of up to 2 MB as a document (&#x60;type&#x60; 2) or a template (&#x60;type&#x60; 4). The answer is the upload; the document itself is made in the background. Find it in &#x60;GET /ap1/documents/?name&#x3D;&lt;name&gt;&#x60; (its &#x60;upload.id&#x60; is this upload&#39;s &#x60;id&#x60;), or a template in &#x60;GET /ap1/templates/&#x60;, and wait until &#x60;GET /ap1/documents/{id}/pages/&#x60; lists its pages before placing fields.
     *
     * @throws ApiException
     *          if the Api call fails
     */
    @Test
    public void uploadDocumentTest() throws ApiException {
        File _file = null;
        String name = null;
        Integer type = null;
        String templateName = null;
        Upload response = 
        api.uploadDocument(_file, name, type, templateName);
        
        // TODO: test validations
    }
    
    /**
     * Upload a document for one signer and get their signing link
     *
     * Uploads a PDF or DOCX for one signer and returns their signing link in &#x60;redirect_url&#x60;; give it to the signer. They place their own signature on the signing page and are then sent to the &#x60;redirect_url&#x60; you gave. The signed PDF and its audit trail are emailed to &#x60;final_email&#x60;, or to your organisation&#39;s admin without one.
     *
     * @throws ApiException
     *          if the Api call fails
     */
    @Test
    public void uploadDocumentForOneSignerTest() throws ApiException {
        File _file = null;
        String signeeName = null;
        String signeeEmail = null;
        URI redirectUrl = null;
        String finalEmail = null;
        UploadDocumentForOneSigner200Response response = 
        api.uploadDocumentForOneSigner(_file, signeeName, signeeEmail, redirectUrl, finalEmail);
        
        // TODO: test validations
    }
    
}
