# Signedly\SignatoriesApi

All URIs are relative to https://l0ads.signedly.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createSignatories()**](SignatoriesApi.md#createSignatories) | **POST** /ap1/signatories/bulk/ | Add several signatories |
| [**createSignatory()**](SignatoriesApi.md#createSignatory) | **POST** /ap1/signatories/ | Add a signatory |
| [**deleteSignatory()**](SignatoriesApi.md#deleteSignatory) | **DELETE** /ap1/signatories/{id}/ | Remove a signatory |
| [**listSignatories()**](SignatoriesApi.md#listSignatories) | **GET** /ap1/signatories/ | List a document&#39;s signatories |


## `createSignatories()`

```php
createSignatories($data): \Signedly\Model\Signatory[]
```

Add several signatories

Adds several signatories at once, in the order given. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). All or nothing: if one is refused (a repeated email, say), none is added. On a document made from a template, they fill its open roles in signing order, each with that role's fields.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\SignatoriesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \Signedly\Model\CreateSignatoriesRequest(); // \Signedly\Model\CreateSignatoriesRequest

try {
    $result = $apiInstance->createSignatories($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SignatoriesApi->createSignatories: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\CreateSignatoriesRequest**](../Model/CreateSignatoriesRequest.md)|  | |

### Return type

[**\Signedly\Model\Signatory[]**](../Model/Signatory.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `createSignatory()`

```php
createSignatory($data): \Signedly\Model\Signatory
```

Add a signatory

Adds a person who signs the document. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). On a document made from a template, each signatory takes the next open template role, in signing order, with its fields; once every role is filled, more are added.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\SignatoriesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \Signedly\Model\CreateSignatoryRequest(); // \Signedly\Model\CreateSignatoryRequest

try {
    $result = $apiInstance->createSignatory($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SignatoriesApi->createSignatory: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\CreateSignatoryRequest**](../Model/CreateSignatoryRequest.md)|  | |

### Return type

[**\Signedly\Model\Signatory**](../Model/Signatory.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `deleteSignatory()`

```php
deleteSignatory($id, $data): \Signedly\Model\SendDocument200Response
```

Remove a signatory

Removes a signatory, and the fields assigned to them, from the document. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). The document's ID goes in the JSON body.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\SignatoriesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The signatory's ID.
$data = new \Signedly\Model\DeleteFieldRequest(); // \Signedly\Model\DeleteFieldRequest

try {
    $result = $apiInstance->deleteSignatory($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SignatoriesApi->deleteSignatory: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The signatory&#39;s ID. | |
| **data** | [**\Signedly\Model\DeleteFieldRequest**](../Model/DeleteFieldRequest.md)|  | |

### Return type

[**\Signedly\Model\SendDocument200Response**](../Model/SendDocument200Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listSignatories()`

```php
listSignatories($document_id): \Signedly\Model\Signatory[]
```

List a document's signatories

The document's signatories with their signing status: 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\SignatoriesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_id = 'document_id_example'; // string | The document's ID.

try {
    $result = $apiInstance->listSignatories($document_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SignatoriesApi->listSignatories: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **document_id** | **string**| The document&#39;s ID. | |

### Return type

[**\Signedly\Model\Signatory[]**](../Model/Signatory.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
