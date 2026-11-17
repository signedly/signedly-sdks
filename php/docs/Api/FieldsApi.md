# Signedly\FieldsApi

All URIs are relative to https://l0ads.signedly.com, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createDocumentFields()**](FieldsApi.md#createDocumentFields) | **POST** /ap1/documents/fields/ | Add fields to a document |
| [**createTemplateFields()**](FieldsApi.md#createTemplateFields) | **POST** /ap1/templates/fields/ | Add fields to a template |
| [**deleteField()**](FieldsApi.md#deleteField) | **DELETE** /ap1/documents/fields/{id}/ | Delete a field |
| [**listDocumentFields()**](FieldsApi.md#listDocumentFields) | **GET** /ap1/documents/fields/ | List a document&#39;s fields |
| [**listTemplateFields()**](FieldsApi.md#listTemplateFields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields |
| [**updateDocumentField()**](FieldsApi.md#updateDocumentField) | **PUT** /ap1/documents/fields/{id}/ | Change a document&#39;s field |
| [**updateDocumentFieldByBody()**](FieldsApi.md#updateDocumentFieldByBody) | **PUT** /ap1/documents/fields/ | Change a document&#39;s field (ID in the body) |
| [**updateTemplateField()**](FieldsApi.md#updateTemplateField) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field |


## `createDocumentFields()`

```php
createDocumentFields($data): \Signedly\Model\Field[]
```

Add fields to a document

Places fields on a document, each assigned to a signatory. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). A field must be one of the listed kinds, have a width and height above 0, and sit wholly on its page (1 point of tolerance); a new field's `page_number` must be the one GET /ap1/documents/{id}/pages/ lists for its `page`. For a template, use POST /ap1/templates/fields/.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\FieldsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = array(new \Signedly\Model\CreateDocumentFieldsRequestInner()); // \Signedly\Model\CreateDocumentFieldsRequestInner[]

try {
    $result = $apiInstance->createDocumentFields($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling FieldsApi->createDocumentFields: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\CreateDocumentFieldsRequestInner[]**](../Model/CreateDocumentFieldsRequestInner.md)|  | |

### Return type

[**\Signedly\Model\Field[]**](../Model/Field.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

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


$apiInstance = new Signedly\Api\FieldsApi(
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
    echo 'Exception when calling FieldsApi->createTemplateFields: ', $e->getMessage(), PHP_EOL;
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

## `deleteField()`

```php
deleteField($id, $data): \Signedly\Model\DeleteDocument204Response
```

Delete a field

Deletes a field of a template, or of a document that isn't sent yet. The document's or template's ID goes in the JSON body.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\FieldsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The field's ID.
$data = new \Signedly\Model\DeleteFieldRequest(); // \Signedly\Model\DeleteFieldRequest

try {
    $result = $apiInstance->deleteField($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling FieldsApi->deleteField: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The field&#39;s ID. | |
| **data** | [**\Signedly\Model\DeleteFieldRequest**](../Model/DeleteFieldRequest.md)|  | |

### Return type

[**\Signedly\Model\DeleteDocument204Response**](../Model/DeleteDocument204Response.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `listDocumentFields()`

```php
listDocumentFields($document_id): \Signedly\Model\Field[]
```

List a document's fields

The fields of a document. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared).

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\FieldsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_id = 'document_id_example'; // string | The document's ID.

try {
    $result = $apiInstance->listDocumentFields($document_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling FieldsApi->listDocumentFields: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **document_id** | **string**| The document&#39;s ID. | |

### Return type

[**\Signedly\Model\Field[]**](../Model/Field.md)

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


$apiInstance = new Signedly\Api\FieldsApi(
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
    echo 'Exception when calling FieldsApi->listTemplateFields: ', $e->getMessage(), PHP_EOL;
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

## `updateDocumentField()`

```php
updateDocumentField($id, $data): \Signedly\Model\Field
```

Change a document's field

Changes a document's field; send all of its values, as when adding it. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can't change: delete the field and add it again. For a template's field, use PUT /ap1/templates/fields/{id}/.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\FieldsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The field's ID.
$data = new \Signedly\Model\CreateDocumentFieldsRequestInner(); // \Signedly\Model\CreateDocumentFieldsRequestInner

try {
    $result = $apiInstance->updateDocumentField($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling FieldsApi->updateDocumentField: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The field&#39;s ID. | |
| **data** | [**\Signedly\Model\CreateDocumentFieldsRequestInner**](../Model/CreateDocumentFieldsRequestInner.md)|  | |

### Return type

[**\Signedly\Model\Field**](../Model/Field.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `updateDocumentFieldByBody()`

```php
updateDocumentFieldByBody($data): \Signedly\Model\Field
```

Change a document's field (ID in the body)

Changes a document's field, named by `element_id` in the body; the same as PUT /ap1/documents/fields/{id}/. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can't change: delete the field and add it again.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure API key authorization: Bearer
$config = Signedly\Configuration::getDefaultConfiguration()->setApiKey('Authorization', 'YOUR_API_KEY');
// Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
// $config = Signedly\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');


$apiInstance = new Signedly\Api\FieldsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \Signedly\Model\UpdateDocumentFieldByBodyRequest(); // \Signedly\Model\UpdateDocumentFieldByBodyRequest

try {
    $result = $apiInstance->updateDocumentFieldByBody($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling FieldsApi->updateDocumentFieldByBody: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **data** | [**\Signedly\Model\UpdateDocumentFieldByBodyRequest**](../Model/UpdateDocumentFieldByBodyRequest.md)|  | |

### Return type

[**\Signedly\Model\Field**](../Model/Field.md)

### Authorization

[Bearer](../../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`
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


$apiInstance = new Signedly\Api\FieldsApi(
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
    echo 'Exception when calling FieldsApi->updateTemplateField: ', $e->getMessage(), PHP_EOL;
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
