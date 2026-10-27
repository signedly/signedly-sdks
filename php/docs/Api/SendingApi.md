# Signedly\SendingApi

All URIs are relative to https://l0ads.signedly.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**fillAndSendDocument()**](SendingApi.md#fillAndSendDocument) | **POST** /ap1/document/update_and_send/ | Fill in fields, add a signatory and send, in one call |
| [**sendDocument()**](SendingApi.md#sendDocument) | **POST** /ap1/document/send/ | Send a document for signing by email |
| [**sendDocumentByLink()**](SendingApi.md#sendDocumentByLink) | **POST** /ap1/document/send_url/ | Send a document and get the signing link |


## `fillAndSendDocument()`

```php
fillAndSendDocument($data): \Signedly\Model\SendDocument200Response
```

Fill in fields, add a signatory and send, in one call

Sets the values of the document's fields, adds one signatory (`name`, `email`), and emails the signatories their signing links, like POST /ap1/document/send/. All or nothing: if anything is refused, nothing changes. A retry after a timed-out call that worked answers 400 (already sent); treat that as success. A template can't be sent, nor a document that has been sent already, and every field must sit on its page.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\SendingApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \Signedly\Model\FillAndSendDocumentRequest(); // \Signedly\Model\FillAndSendDocumentRequest

try {
    $result = $apiInstance->fillAndSendDocument($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SendingApi->fillAndSendDocument: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\FillAndSendDocumentRequest**](../Model/FillAndSendDocumentRequest.md)|  | |

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

## `sendDocument()`

```php
sendDocument($data): \Signedly\Model\SendDocument200Response
```

Send a document for signing by email

Emails each signatory a signing link with your subject and message (with ordered signing, only the first; each next one is emailed in turn). The document needs at least one field, and every signatory at least one field. A template can't be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document's status before sending again.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\SendingApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \Signedly\Model\SendDocumentRequest(); // \Signedly\Model\SendDocumentRequest

try {
    $result = $apiInstance->sendDocument($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SendingApi->sendDocument: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\SendDocumentRequest**](../Model/SendDocumentRequest.md)|  | |

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

## `sendDocumentByLink()`

```php
sendDocumentByLink($data): \Signedly\Model\SendDocumentByLink200Response
```

Send a document and get the signing link

Marks the document sent without emailing anyone, and returns its signatory's signing link to show or send yourself. Meant for a document with one signatory. A template can't be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document's status before sending again.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\SendingApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \Signedly\Model\SendDocumentByLinkRequest(); // \Signedly\Model\SendDocumentByLinkRequest

try {
    $result = $apiInstance->sendDocumentByLink($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SendingApi->sendDocumentByLink: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\SendDocumentByLinkRequest**](../Model/SendDocumentByLinkRequest.md)|  | |

### Return type

[**\Signedly\Model\SendDocumentByLink200Response**](../Model/SendDocumentByLink200Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
