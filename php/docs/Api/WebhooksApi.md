# Signedly\WebhooksApi

All URIs are relative to https://l0ads.signedly.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createWebhookEndpoint()**](WebhooksApi.md#createWebhookEndpoint) | **POST** /ap1/webhooks/ | Add a webhook endpoint |
| [**deleteWebhookEndpoint()**](WebhooksApi.md#deleteWebhookEndpoint) | **DELETE** /ap1/webhooks/{id}/ | Delete a webhook endpoint |
| [**getWebhookEndpoint()**](WebhooksApi.md#getWebhookEndpoint) | **GET** /ap1/webhooks/{id}/ | Get a webhook endpoint |
| [**listWebhookDeliveries()**](WebhooksApi.md#listWebhookDeliveries) | **GET** /ap1/webhooks/{id}/deliveries/ | List an endpoint&#39;s deliveries |
| [**listWebhookEndpoints()**](WebhooksApi.md#listWebhookEndpoints) | **GET** /ap1/webhooks/ | List your webhook endpoints |
| [**redeliverWebhook()**](WebhooksApi.md#redeliverWebhook) | **POST** /ap1/webhooks/deliveries/{id}/redeliver/ | Send a delivery again |
| [**rotateWebhookSecret()**](WebhooksApi.md#rotateWebhookSecret) | **POST** /ap1/webhooks/{id}/rotate-secret/ | Replace a webhook endpoint&#39;s secret |
| [**sendTestWebhook()**](WebhooksApi.md#sendTestWebhook) | **POST** /ap1/webhooks/{id}/test/ | Send a test event |
| [**updateWebhookEndpoint()**](WebhooksApi.md#updateWebhookEndpoint) | **PUT** /ap1/webhooks/{id}/ | Change or switch a webhook endpoint on or off |


## `createWebhookEndpoint()`

```php
createWebhookEndpoint($data): \Signedly\Model\WebhookEndpointWithSecret
```

Add a webhook endpoint

Signedly posts each document event your organisation's documents have to this URL (see Webhooks in the introduction). The answer includes the endpoint's `secret`, shown only now: keep it to check each event's `Signedly-Signature`. Up to 10 endpoints per API client.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\WebhooksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \Signedly\Model\CreateWebhookEndpointRequest(); // \Signedly\Model\CreateWebhookEndpointRequest

try {
    $result = $apiInstance->createWebhookEndpoint($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebhooksApi->createWebhookEndpoint: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\CreateWebhookEndpointRequest**](../Model/CreateWebhookEndpointRequest.md)|  | |

### Return type

[**\Signedly\Model\WebhookEndpointWithSecret**](../Model/WebhookEndpointWithSecret.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `deleteWebhookEndpoint()`

```php
deleteWebhookEndpoint($id)
```

Delete a webhook endpoint

Deletes the endpoint and its delivery history.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\WebhooksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The endpoint's ID.

try {
    $apiInstance->deleteWebhookEndpoint($id);
} catch (Exception $e) {
    echo 'Exception when calling WebhooksApi->deleteWebhookEndpoint: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The endpoint&#39;s ID. | |

### Return type

void (empty response body)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `getWebhookEndpoint()`

```php
getWebhookEndpoint($id): \Signedly\Model\WebhookEndpoint
```

Get a webhook endpoint

One of this API client's endpoints, without its secret.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\WebhooksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The endpoint's ID.

try {
    $result = $apiInstance->getWebhookEndpoint($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebhooksApi->getWebhookEndpoint: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The endpoint&#39;s ID. | |

### Return type

[**\Signedly\Model\WebhookEndpoint**](../Model/WebhookEndpoint.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listWebhookDeliveries()`

```php
listWebhookDeliveries($id, $status, $limit, $offset): \Signedly\Model\WebhookDeliveryPage
```

List an endpoint's deliveries

The events sent (or being sent) to the endpoint, newest first, with how the last try went. Paged: see `limit` and `offset`.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\WebhooksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The endpoint's ID.
$status = 'status_example'; // string | Only `pending`, `succeeded` or `failed` deliveries.
$limit = 56; // int | How many results to return (default 10).
$offset = 56; // int | How many results to skip.

try {
    $result = $apiInstance->listWebhookDeliveries($id, $status, $limit, $offset);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebhooksApi->listWebhookDeliveries: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The endpoint&#39;s ID. | |
| **status** | **string**| Only &#x60;pending&#x60;, &#x60;succeeded&#x60; or &#x60;failed&#x60; deliveries. | [optional] |
| **limit** | **int**| How many results to return (default 10). | [optional] |
| **offset** | **int**| How many results to skip. | [optional] |

### Return type

[**\Signedly\Model\WebhookDeliveryPage**](../Model/WebhookDeliveryPage.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listWebhookEndpoints()`

```php
listWebhookEndpoints(): \Signedly\Model\WebhookEndpoint[]
```

List your webhook endpoints

This API client's webhook endpoints, oldest first. Their secrets aren't shown: rotate one to see a new secret.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\WebhooksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);

try {
    $result = $apiInstance->listWebhookEndpoints();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebhooksApi->listWebhookEndpoints: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\Signedly\Model\WebhookEndpoint[]**](../Model/WebhookEndpoint.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `redeliverWebhook()`

```php
redeliverWebhook($id, $data): \Signedly\Model\WebhookDelivery
```

Send a delivery again

Sends the same event (same `id`) again now, with fresh retries: for one that failed, or one your system lost.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\WebhooksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The delivery's ID.
$data = array('key' => new \stdClass); // object

try {
    $result = $apiInstance->redeliverWebhook($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebhooksApi->redeliverWebhook: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The delivery&#39;s ID. | |
| **data** | **object**|  | |

### Return type

[**\Signedly\Model\WebhookDelivery**](../Model/WebhookDelivery.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `rotateWebhookSecret()`

```php
rotateWebhookSecret($id, $data): \Signedly\Model\WebhookEndpointWithSecret
```

Replace a webhook endpoint's secret

Makes a new secret and answers with it; events from now on are signed with it, and the old one stops working at once.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\WebhooksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The endpoint's ID.
$data = array('key' => new \stdClass); // object

try {
    $result = $apiInstance->rotateWebhookSecret($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebhooksApi->rotateWebhookSecret: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The endpoint&#39;s ID. | |
| **data** | **object**|  | |

### Return type

[**\Signedly\Model\WebhookEndpointWithSecret**](../Model/WebhookEndpointWithSecret.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `sendTestWebhook()`

```php
sendTestWebhook($id, $data): \Signedly\Model\WebhookDelivery
```

Send a test event

Posts a `webhook.test` event (no document) to the endpoint, signed like any other, to check that you receive and verify events. Its outcome shows in the endpoint's deliveries.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\WebhooksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The endpoint's ID.
$data = array('key' => new \stdClass); // object

try {
    $result = $apiInstance->sendTestWebhook($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebhooksApi->sendTestWebhook: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The endpoint&#39;s ID. | |
| **data** | **object**|  | |

### Return type

[**\Signedly\Model\WebhookDelivery**](../Model/WebhookDelivery.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `updateWebhookEndpoint()`

```php
updateWebhookEndpoint($id, $data): \Signedly\Model\WebhookEndpoint
```

Change or switch a webhook endpoint on or off

Changes what you send: `url`, `events`, `description`, `is_active`. `is_active: true` switches an endpoint on again after Signedly switched it off (20 events in a row failed), and resets its failure count.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\WebhooksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The endpoint's ID.
$data = new \Signedly\Model\UpdateWebhookEndpointRequest(); // \Signedly\Model\UpdateWebhookEndpointRequest

try {
    $result = $apiInstance->updateWebhookEndpoint($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebhooksApi->updateWebhookEndpoint: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The endpoint&#39;s ID. | |
| **data** | [**\Signedly\Model\UpdateWebhookEndpointRequest**](../Model/UpdateWebhookEndpointRequest.md)|  | |

### Return type

[**\Signedly\Model\WebhookEndpoint**](../Model/WebhookEndpoint.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
