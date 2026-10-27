# Signedly\AuthenticationApi

All URIs are relative to https://l0ads.signedly.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**getAccessToken()**](AuthenticationApi.md#getAccessToken) | **POST** /ap1/token/ | Get an access token |
| [**refreshAccessToken()**](AuthenticationApi.md#refreshAccessToken) | **POST** /ap1/refreshtoken/ | Refresh the access token |


## `getAccessToken()`

```php
getAccessToken($data): \Signedly\Model\RefreshAccessToken200Response
```

Get an access token

Exchanges your client ID and secret (Account & Settings → API in the web app) for an access token, valid 2 hours, and a refresh token, valid 7 days. While both are still valid, the same pair is returned again; once either has expired, a new pair is made. Your test keys get a test token of their own (see Sandbox).

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new Signedly\Api\AuthenticationApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$data = new \Signedly\Model\GetAccessTokenRequest(); // \Signedly\Model\GetAccessTokenRequest

try {
    $result = $apiInstance->getAccessToken($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthenticationApi->getAccessToken: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\GetAccessTokenRequest**](../Model/GetAccessTokenRequest.md)|  | |

### Return type

[**\Signedly\Model\RefreshAccessToken200Response**](../Model/RefreshAccessToken200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `refreshAccessToken()`

```php
refreshAccessToken($data): \Signedly\Model\RefreshAccessToken200Response
```

Refresh the access token

Makes a new access token, valid 2 hours, with the refresh token. The refresh token itself isn't renewed: when it expires (7 days after /ap1/token/ made it), call /ap1/token/ again.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



$apiInstance = new Signedly\Api\AuthenticationApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client()
);
$data = new \Signedly\Model\RefreshAccessTokenRequest(); // \Signedly\Model\RefreshAccessTokenRequest

try {
    $result = $apiInstance->refreshAccessToken($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AuthenticationApi->refreshAccessToken: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\RefreshAccessTokenRequest**](../Model/RefreshAccessTokenRequest.md)|  | |

### Return type

[**\Signedly\Model\RefreshAccessToken200Response**](../Model/RefreshAccessToken200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
