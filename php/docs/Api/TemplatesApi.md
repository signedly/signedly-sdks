# Signedly\TemplatesApi

All URIs are relative to https://l0ads.signedly.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createTemplateFields()**](TemplatesApi.md#createTemplateFields) | **POST** /ap1/templates/fields/ | Add fields to a template |
| [**deleteDocument()**](TemplatesApi.md#deleteDocument) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document |
| [**listTemplateFields()**](TemplatesApi.md#listTemplateFields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields |
| [**listTemplates()**](TemplatesApi.md#listTemplates) | **GET** /ap1/templates/ | List your organisation&#39;s templates |
| [**updateTemplateField()**](TemplatesApi.md#updateTemplateField) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field |


## `createTemplateFields()`

```php
createTemplateFields($data): \Signedly\Model\TemplateField[]
```

Add fields to a template

Places fields on a template. Each field belongs to one of the template's roles (GET /ap1/signatories/?document_id=<the template's ID> lists them; a template made in the web app can have several): the role whose `id` is its `signatory_id`, or without one the first role in signing order. On a document made from the template, a role's fields go to the signatory who takes that role. A `signatory_id` that isn't one of this template's roles is refused with 400 and nothing is saved. A field must be one of the listed kinds, have a width and height above 0, and sit wholly on its page (1 point of tolerance); a new field's `page_number` must be the one GET /ap1/documents/{id}/pages/ lists for its `page`.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\TemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = array(new \Signedly\Model\CreateTemplateFieldsRequestInner()); // \Signedly\Model\CreateTemplateFieldsRequestInner[]

try {
    $result = $apiInstance->createTemplateFields($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TemplatesApi->createTemplateFields: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\CreateTemplateFieldsRequestInner[]**](../Model/CreateTemplateFieldsRequestInner.md)|  | |

### Return type

[**\Signedly\Model\TemplateField[]**](../Model/TemplateField.md)

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
deleteDocument($id): \Signedly\Model\DeleteDocument204Response
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


$apiInstance = new Signedly\Api\TemplatesApi(
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
    echo 'Exception when calling TemplatesApi->deleteDocument: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The document&#39;s or template&#39;s ID. | |

### Return type

[**\Signedly\Model\DeleteDocument204Response**](../Model/DeleteDocument204Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listTemplateFields()`

```php
listTemplateFields($document_id): \Signedly\Model\TemplateField[]
```

List a template's fields

The fields of a template (or of any of your documents).

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\TemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_id = 'document_id_example'; // string | The template's ID.

try {
    $result = $apiInstance->listTemplateFields($document_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TemplatesApi->listTemplateFields: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **document_id** | **string**| The template&#39;s ID. | |

### Return type

[**\Signedly\Model\TemplateField[]**](../Model/TemplateField.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listTemplates()`

```php
listTemplates($name, $limit, $offset): \Signedly\Model\TemplatePage
```

List your organisation's templates

The templates of your organisation's admin account, newest first, with their pages and fields. Bulk-send templates aren't listed. Paged: see `limit` and `offset`.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\TemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$name = 'name_example'; // string | Only templates whose title contains this (any case).
$limit = 56; // int | How many results to return (default 10, at most 100).
$offset = 56; // int | How many results to skip.

try {
    $result = $apiInstance->listTemplates($name, $limit, $offset);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TemplatesApi->listTemplates: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **name** | **string**| Only templates whose title contains this (any case). | [optional] |
| **limit** | **int**| How many results to return (default 10, at most 100). | [optional] |
| **offset** | **int**| How many results to skip. | [optional] |

### Return type

[**\Signedly\Model\TemplatePage**](../Model/TemplatePage.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `updateTemplateField()`

```php
updateTemplateField($id, $data): \Signedly\Model\TemplateField
```

Change a template's field

Changes a template's field; send all of its values, as when adding it. A `signatory_id` naming another of the template's roles moves the field to that role; without one it keeps its role. Its page can't change: delete the field and add it again.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\TemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The field's ID.
$data = new \Signedly\Model\CreateTemplateFieldsRequestInner(); // \Signedly\Model\CreateTemplateFieldsRequestInner

try {
    $result = $apiInstance->updateTemplateField($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TemplatesApi->updateTemplateField: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The field&#39;s ID. | |
| **data** | [**\Signedly\Model\CreateTemplateFieldsRequestInner**](../Model/CreateTemplateFieldsRequestInner.md)|  | |

### Return type

[**\Signedly\Model\TemplateField**](../Model/TemplateField.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
