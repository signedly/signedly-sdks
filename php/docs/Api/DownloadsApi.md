# Signedly\DownloadsApi

All URIs are relative to https://l0ads.signedly.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getAuditTrailLink()**](DownloadsApi.md#getAuditTrailLink) | **GET** /ap1/document/download-audit-link/ | Get a link to the audit trail |
| [**getDownloadLink()**](DownloadsApi.md#getDownloadLink) | **GET** /ap1/document/download-link/ | Get a link to the signed PDF |
| [**getViewLink()**](DownloadsApi.md#getViewLink) | **GET** /ap1/document/view-link/ | Get a link to view the document |


## `getAuditTrailLink()`

```php
getAuditTrailLink($id): \Signedly\Model\GetAuditTrailLink200Response
```

Get a link to the audit trail

A link to the document's audit trail PDF: who did what, when and from where. It is made when the document is completed; ask for it after GET /ap1/document/download-link/ gives the signed PDF.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DownloadsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The document's ID.

try {
    $result = $apiInstance->getAuditTrailLink($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DownloadsApi->getAuditTrailLink: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The document&#39;s ID. | |

### Return type

[**\Signedly\Model\GetAuditTrailLink200Response**](../Model/GetAuditTrailLink200Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getDownloadLink()`

```php
getDownloadLink($id): \Signedly\Model\GetAuditTrailLink200Response
```

Get a link to the signed PDF

A link to the final signed PDF, once every signatory has signed and it has been sealed. Until then the answer is 202: try again later.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DownloadsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The document's ID.

try {
    $result = $apiInstance->getDownloadLink($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DownloadsApi->getDownloadLink: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The document&#39;s ID. | |

### Return type

[**\Signedly\Model\GetAuditTrailLink200Response**](../Model/GetAuditTrailLink200Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getViewLink()`

```php
getViewLink($id): \Signedly\Model\GetAuditTrailLink200Response
```

Get a link to view the document

A link to the document's PDF as it stands now, with the values and signatures applied so far. For the final signed PDF, use GET /ap1/document/download-link/.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\DownloadsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The document's ID.

try {
    $result = $apiInstance->getViewLink($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DownloadsApi->getViewLink: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The document&#39;s ID. | |

### Return type

[**\Signedly\Model\GetAuditTrailLink200Response**](../Model/GetAuditTrailLink200Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
