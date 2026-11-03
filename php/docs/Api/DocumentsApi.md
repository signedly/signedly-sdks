# Signedly\DocumentsApi

All URIs are relative to https://l0ads.signedly.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createDocumentFromTemplate()**](DocumentsApi.md#createDocumentFromTemplate) | **POST** /ap1/documents/fromtemplate/ | Make a document from a template |
| [**deleteDocument()**](DocumentsApi.md#deleteDocument) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document |
| [**getDownloadStatus()**](DocumentsApi.md#getDownloadStatus) | **GET** /ap1/documents-status/{id}/ | Check whether the signed PDF is ready |
| [**listDocumentPages()**](DocumentsApi.md#listDocumentPages) | **GET** /ap1/documents/{id}/pages/ | List a document&#39;s pages and their fields |
| [**listDocumentStatuses()**](DocumentsApi.md#listDocumentStatuses) | **GET** /ap1/documents-status-list/ | List the status of your organisation&#39;s documents |
| [**listDocuments()**](DocumentsApi.md#listDocuments) | **GET** /ap1/documents/ | List the documents this API client created |
| [**uploadDocument()**](DocumentsApi.md#uploadDocument) | **POST** /ap1/upload/ | Upload a document or template |
| [**uploadDocumentForOneSigner()**](DocumentsApi.md#uploadDocumentForOneSigner) | **POST** /ap1/upload_app/ | Upload a document for one signer and get their signing link |


## `createDocumentFromTemplate()`

```php
createDocumentFromTemplate($data): \Signedly\Model\CreateDocumentFromTemplate200Response
```

Make a document from a template

Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template's signing order. Fill the open roles here with `recipients`, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can't be sent. To prefill a field, add a key with the field's label and the value, e.g. `\"Company\": \"Acme Ltd\"`.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \Signedly\Model\CreateDocumentFromTemplateRequest(); // \Signedly\Model\CreateDocumentFromTemplateRequest

try {
    $result = $apiInstance->createDocumentFromTemplate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->createDocumentFromTemplate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\CreateDocumentFromTemplateRequest**](../Model/CreateDocumentFromTemplateRequest.md)|  | |

### Return type

[**\Signedly\Model\CreateDocumentFromTemplate200Response**](../Model/CreateDocumentFromTemplate200Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `deleteDocument()`

```php
deleteDocument($id): \Signedly\Model\SendDocument200Response
```

Delete a template or an unsent document

Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can't be deleted.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The document's or template's ID.

try {
    $result = $apiInstance->deleteDocument($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->deleteDocument: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The document&#39;s or template&#39;s ID. | |

### Return type

[**\Signedly\Model\SendDocument200Response**](../Model/SendDocument200Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getDownloadStatus()`

```php
getDownloadStatus($id): \Signedly\Model\GetDownloadStatus200Response
```

Check whether the signed PDF is ready

Says whether the document's signed PDF can be downloaded yet (`download_status`). For the document's signing status, use `GET /ap1/documents-status-list/?document_ids=<id>`.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The document's ID.

try {
    $result = $apiInstance->getDownloadStatus($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->getDownloadStatus: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The document&#39;s ID. | |

### Return type

[**\Signedly\Model\GetDownloadStatus200Response**](../Model/GetDownloadStatus200Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listDocumentPages()`

```php
listDocumentPages($id): \Signedly\Model\Page[]
```

List a document's pages and their fields

The document's (or template's) pages, in order, each with its fields. Use a page's `id` and `page_number` when placing a field on it. A new upload has no pages until it has been processed.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The document's or template's ID.

try {
    $result = $apiInstance->listDocumentPages($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->listDocumentPages: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The document&#39;s or template&#39;s ID. | |

### Return type

[**\Signedly\Model\Page[]**](../Model/Page.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listDocumentStatuses()`

```php
listDocumentStatuses($name, $status, $document_ids, $limit, $offset): \Signedly\Model\DocumentStatusPage
```

List the status of your organisation's documents

The ID and status of every document of your organisation's admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren't listed. A light way to poll for completed documents. Paged: see `limit` and `offset`.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$name = 'name_example'; // string | Only documents whose name contains this (any case).
$status = array(56); // int[] | Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (`status=4&status=6`) or separate values with commas (`status=4,6`).
$document_ids = array('document_ids_example'); // string[] | Only these documents. Repeat it or separate IDs with commas.
$limit = 56; // int | How many results to return (default 10).
$offset = 56; // int | How many results to skip.

try {
    $result = $apiInstance->listDocumentStatuses($name, $status, $document_ids, $limit, $offset);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->listDocumentStatuses: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **name** | **string**| Only documents whose name contains this (any case). | [optional] |
| **status** | [**int[]**](../Model/int.md)| Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). | [optional] |
| **document_ids** | [**string[]**](../Model/string.md)| Only these documents. Repeat it or separate IDs with commas. | [optional] |
| **limit** | **int**| How many results to return (default 10). | [optional] |
| **offset** | **int**| How many results to skip. | [optional] |

### Return type

[**\Signedly\Model\DocumentStatusPage**](../Model/DocumentStatusPage.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listDocuments()`

```php
listDocuments($name, $status, $document_ids, $limit, $offset): \Signedly\Model\DocumentPage
```

List the documents this API client created

The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren't listed. Paged: see `limit` and `offset`.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$name = 'name_example'; // string | Only documents whose name contains this (any case).
$status = array(56); // int[] | Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (`status=4&status=6`) or separate values with commas (`status=4,6`).
$document_ids = array('document_ids_example'); // string[] | Only these documents. Repeat it or separate IDs with commas.
$limit = 56; // int | How many results to return (default 10).
$offset = 56; // int | How many results to skip.

try {
    $result = $apiInstance->listDocuments($name, $status, $document_ids, $limit, $offset);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->listDocuments: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **name** | **string**| Only documents whose name contains this (any case). | [optional] |
| **status** | [**int[]**](../Model/int.md)| Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). | [optional] |
| **document_ids** | [**string[]**](../Model/string.md)| Only these documents. Repeat it or separate IDs with commas. | [optional] |
| **limit** | **int**| How many results to return (default 10). | [optional] |
| **offset** | **int**| How many results to skip. | [optional] |

### Return type

[**\Signedly\Model\DocumentPage**](../Model/DocumentPage.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `uploadDocument()`

```php
uploadDocument($file, $name, $type, $template_name): \Signedly\Model\Upload
```

Upload a document or template

Uploads a PDF or DOCX file of up to 2 MB as a document (`type` 2) or a template (`type` 4). The answer is the upload; the document itself is made in the background. Find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is this upload's `id`), or a template in `GET /ap1/templates/`, and wait until `GET /ap1/documents/{id}/pages/` lists its pages before placing fields.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$file = '/path/to/file.txt'; // \SplFileObject | A PDF or DOCX file. A PDF that can't be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB.
$name = 'name_example'; // string | The document's name. It must differ from every other upload of this API client.
$type = 56; // int | 2 Document · 4 Template
$template_name = 'template_name_example'; // string | The template's title. Required with `type` 4; it must differ from this API client's other templates.

try {
    $result = $apiInstance->uploadDocument($file, $name, $type, $template_name);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->uploadDocument: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **file** | **\SplFileObject****\SplFileObject**| A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB. | |
| **name** | **string**| The document&#39;s name. It must differ from every other upload of this API client. | |
| **type** | **int**| 2 Document · 4 Template | |
| **template_name** | **string**| The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. | [optional] |

### Return type

[**\Signedly\Model\Upload**](../Model/Upload.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `uploadDocumentForOneSigner()`

```php
uploadDocumentForOneSigner($file, $signee_name, $signee_email, $redirect_url, $final_email): \Signedly\Model\UploadDocumentForOneSigner200Response
```

Upload a document for one signer and get their signing link

Uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; give it to the signer. They place their own signature on the signing page and are then sent to the `redirect_url` you gave. The signed PDF and its audit trail are emailed to `final_email`, or to your organisation's admin without one.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$file = '/path/to/file.txt'; // \SplFileObject | A PDF or DOCX file. A PDF that can't be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that.
$signee_name = 'signee_name_example'; // string | The signer's name.
$signee_email = 'signee_email_example'; // string | The signer's email address.
$redirect_url = 'redirect_url_example'; // string | Where the signer is sent after signing.
$final_email = 'final_email_example'; // string | Who gets the signed PDF and audit trail by email. Without it, your organisation's admin does.

try {
    $result = $apiInstance->uploadDocumentForOneSigner($file, $signee_name, $signee_email, $redirect_url, $final_email);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->uploadDocumentForOneSigner: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **file** | **\SplFileObject****\SplFileObject**| A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. | |
| **signee_name** | **string**| The signer&#39;s name. | |
| **signee_email** | **string**| The signer&#39;s email address. | |
| **redirect_url** | **string**| Where the signer is sent after signing. | |
| **final_email** | **string**| Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. | [optional] |

### Return type

[**\Signedly\Model\UploadDocumentForOneSigner200Response**](../Model/UploadDocumentForOneSigner200Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
