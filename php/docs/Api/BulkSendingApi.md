# Signedly\BulkSendingApi

All URIs are relative to https://l0ads.signedly.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createBulkSend()**](BulkSendingApi.md#createBulkSend) | **POST** /ap1/bulk-sends/ | Send a template to many people |
| [**getBulkSend()**](BulkSendingApi.md#getBulkSend) | **GET** /ap1/bulk-sends/{id}/ | Follow a bulk send |
| [**listBulkSendColumns()**](BulkSendingApi.md#listBulkSendColumns) | **GET** /ap1/bulk-sends/columns/ | List the columns a template&#39;s bulk send needs |


## `createBulkSend()`

```php
createBulkSend($data): \Signedly\Model\CreateBulkSend202Response
```

Send a template to many people

Makes and sends one document per row from one of your templates, as the web app's Bulk Sending does: each row fills the template's roles and fields. Give the rows as a CSV or Excel `file` (multipart) or as JSON `rows`, with the columns from GET /ap1/bulk-sends/columns/. The whole file is checked first: if any row has a problem nothing is sent and the answer lists every one. Up to 1,000 rows; each document is billed like a single send. `subject` and `message` may use {{column}} tags. Needs the Teams plan, with live or test keys. The documents are made in the background: follow them with GET /ap1/bulk-sends/{id}/ (or webhooks).

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\BulkSendingApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \Signedly\Model\CreateBulkSendRequest(); // \Signedly\Model\CreateBulkSendRequest

try {
    $result = $apiInstance->createBulkSend($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling BulkSendingApi->createBulkSend: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\CreateBulkSendRequest**](../Model/CreateBulkSendRequest.md)|  | |

### Return type

[**\Signedly\Model\CreateBulkSend202Response**](../Model/CreateBulkSend202Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getBulkSend()`

```php
getBulkSend($id): \Signedly\Model\CreateBulkSend202Response
```

Follow a bulk send

How far the bulk send is: documents made so far, rows that failed, and each document's status and signatories.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\BulkSendingApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The bulk send's ID.

try {
    $result = $apiInstance->getBulkSend($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling BulkSendingApi->getBulkSend: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The bulk send&#39;s ID. | |

### Return type

[**\Signedly\Model\CreateBulkSend202Response**](../Model/CreateBulkSend202Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listBulkSendColumns()`

```php
listBulkSendColumns($template_id): \Signedly\Model\ListBulkSendColumns200ResponseInner[]
```

List the columns a template's bulk send needs

The columns of a bulk send file (or `rows`) for this template, in order: the recipient's name and email, each other open role's name and email, and one per field the sender fills in, each with what to put in it. Needs the Teams plan, like the bulk send itself.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\BulkSendingApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$template_id = 'template_id_example'; // string | The template's ID.

try {
    $result = $apiInstance->listBulkSendColumns($template_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling BulkSendingApi->listBulkSendColumns: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **template_id** | **string**| The template&#39;s ID. | |

### Return type

[**\Signedly\Model\ListBulkSendColumns200ResponseInner[]**](../Model/ListBulkSendColumns200ResponseInner.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
