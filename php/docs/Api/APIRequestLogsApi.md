# Signedly\APIRequestLogsApi

All URIs are relative to https://l0ads.signedly.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**listRequestCounts()**](APIRequestLogsApi.md#listRequestCounts) | **GET** /ap1/logs/hits/ | Count your API calls per path |
| [**listRequestLogs()**](APIRequestLogsApi.md#listRequestLogs) | **GET** /ap1/logs/ | List your API calls |


## `listRequestCounts()`

```php
listRequestCounts($method, $path, $limit, $offset): \Signedly\Model\RequestCountPage
```

Count your API calls per path

How many calls this API client has made to each path and method, most recently used first. Paged: see `limit` and `offset`.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\APIRequestLogsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$method = 'method_example'; // string | Only this HTTP method.
$path = 'path_example'; // string | Only paths that contain this, e.g. `/ap1/document/`.
$limit = 56; // int | How many results to return (default 10).
$offset = 56; // int | How many results to skip.

try {
    $result = $apiInstance->listRequestCounts($method, $path, $limit, $offset);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling APIRequestLogsApi->listRequestCounts: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **method** | **string**| Only this HTTP method. | [optional] |
| **path** | **string**| Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;. | [optional] |
| **limit** | **int**| How many results to return (default 10). | [optional] |
| **offset** | **int**| How many results to skip. | [optional] |

### Return type

[**\Signedly\Model\RequestCountPage**](../Model/RequestCountPage.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listRequestLogs()`

```php
listRequestLogs($method, $path, $ip_address, $limit, $offset): \Signedly\Model\RequestLogPage
```

List your API calls

This API client's calls, newest first, with their headers and bodies (credentials and tokens are redacted). Paged: see `limit` and `offset`.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\APIRequestLogsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$method = 'method_example'; // string | Only this HTTP method.
$path = 'path_example'; // string | Only paths that contain this, e.g. `/ap1/document/`.
$ip_address = 'ip_address_example'; // string | Only calls from this IP address.
$limit = 56; // int | How many results to return (default 10).
$offset = 56; // int | How many results to skip.

try {
    $result = $apiInstance->listRequestLogs($method, $path, $ip_address, $limit, $offset);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling APIRequestLogsApi->listRequestLogs: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **method** | **string**| Only this HTTP method. | [optional] |
| **path** | **string**| Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;. | [optional] |
| **ip_address** | **string**| Only calls from this IP address. | [optional] |
| **limit** | **int**| How many results to return (default 10). | [optional] |
| **offset** | **int**| How many results to skip. | [optional] |

### Return type

[**\Signedly\Model\RequestLogPage**](../Model/RequestLogPage.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
