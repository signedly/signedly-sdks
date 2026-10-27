# FieldsApi

All URIs are relative to *https://l0ads.signedly.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createDocumentFields**](FieldsApi.md#createDocumentFields) | **POST** /ap1/documents/fields/ | Add fields to a document |
| [**createDocumentFieldsWithHttpInfo**](FieldsApi.md#createDocumentFieldsWithHttpInfo) | **POST** /ap1/documents/fields/ | Add fields to a document |
| [**createTemplateFields**](FieldsApi.md#createTemplateFields) | **POST** /ap1/templates/fields/ | Add fields to a template |
| [**createTemplateFieldsWithHttpInfo**](FieldsApi.md#createTemplateFieldsWithHttpInfo) | **POST** /ap1/templates/fields/ | Add fields to a template |
| [**deleteField**](FieldsApi.md#deleteField) | **DELETE** /ap1/documents/fields/{id}/ | Delete a field |
| [**deleteFieldWithHttpInfo**](FieldsApi.md#deleteFieldWithHttpInfo) | **DELETE** /ap1/documents/fields/{id}/ | Delete a field |
| [**listDocumentFields**](FieldsApi.md#listDocumentFields) | **GET** /ap1/documents/fields/ | List a document&#39;s fields |
| [**listDocumentFieldsWithHttpInfo**](FieldsApi.md#listDocumentFieldsWithHttpInfo) | **GET** /ap1/documents/fields/ | List a document&#39;s fields |
| [**listTemplateFields**](FieldsApi.md#listTemplateFields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields |
| [**listTemplateFieldsWithHttpInfo**](FieldsApi.md#listTemplateFieldsWithHttpInfo) | **GET** /ap1/templates/fields/ | List a template&#39;s fields |
| [**updateDocumentField**](FieldsApi.md#updateDocumentField) | **PUT** /ap1/documents/fields/{id}/ | Change a document&#39;s field |
| [**updateDocumentFieldWithHttpInfo**](FieldsApi.md#updateDocumentFieldWithHttpInfo) | **PUT** /ap1/documents/fields/{id}/ | Change a document&#39;s field |
| [**updateDocumentFieldByBody**](FieldsApi.md#updateDocumentFieldByBody) | **PUT** /ap1/documents/fields/ | Change a document&#39;s field (ID in the body) |
| [**updateDocumentFieldByBodyWithHttpInfo**](FieldsApi.md#updateDocumentFieldByBodyWithHttpInfo) | **PUT** /ap1/documents/fields/ | Change a document&#39;s field (ID in the body) |
| [**updateTemplateField**](FieldsApi.md#updateTemplateField) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field |
| [**updateTemplateFieldWithHttpInfo**](FieldsApi.md#updateTemplateFieldWithHttpInfo) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field |



## createDocumentFields

> List<Field> createDocumentFields(data)

Add fields to a document

Places fields on a document, each assigned to a signatory. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). A field must sit wholly on its page (1 point of tolerance). For a template, use POST /ap1/templates/fields/.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        List<CreateDocumentFieldsRequestInner> data = Arrays.asList(); // List<CreateDocumentFieldsRequestInner> | 
        try {
            List<Field> result = apiInstance.createDocumentFields(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#createDocumentFields");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **data** | [**List&lt;CreateDocumentFieldsRequestInner&gt;**](CreateDocumentFieldsRequestInner.md)|  | |

### Return type

[**List&lt;Field&gt;**](Field.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The fields; the document is now 3 Prepared. |  -  |
| **400** | A value is missing or not valid, or a field doesn&#39;t fit on its page; the list has one entry per field. Nothing was saved. |  -  |
| **404** | The document doesn&#39;t exist, isn&#39;t yours, or has already been sent. |  -  |

## createDocumentFieldsWithHttpInfo

> ApiResponse<List<Field>> createDocumentFields createDocumentFieldsWithHttpInfo(data)

Add fields to a document

Places fields on a document, each assigned to a signatory. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). A field must sit wholly on its page (1 point of tolerance). For a template, use POST /ap1/templates/fields/.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        List<CreateDocumentFieldsRequestInner> data = Arrays.asList(); // List<CreateDocumentFieldsRequestInner> | 
        try {
            ApiResponse<List<Field>> response = apiInstance.createDocumentFieldsWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#createDocumentFields");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **data** | [**List&lt;CreateDocumentFieldsRequestInner&gt;**](CreateDocumentFieldsRequestInner.md)|  | |

### Return type

ApiResponse<[**List&lt;Field&gt;**](Field.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The fields; the document is now 3 Prepared. |  -  |
| **400** | A value is missing or not valid, or a field doesn&#39;t fit on its page; the list has one entry per field. Nothing was saved. |  -  |
| **404** | The document doesn&#39;t exist, isn&#39;t yours, or has already been sent. |  -  |


## createTemplateFields

> List<TemplateField> createTemplateFields(data)

Add fields to a template

Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        List<CreateTemplateFieldsRequestInner> data = Arrays.asList(); // List<CreateTemplateFieldsRequestInner> | 
        try {
            List<TemplateField> result = apiInstance.createTemplateFields(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#createTemplateFields");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **data** | [**List&lt;CreateTemplateFieldsRequestInner&gt;**](CreateTemplateFieldsRequestInner.md)|  | |

### Return type

[**List&lt;TemplateField&gt;**](TemplateField.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The fields. |  -  |
| **400** | The ID isn&#39;t a template, or a value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

## createTemplateFieldsWithHttpInfo

> ApiResponse<List<TemplateField>> createTemplateFields createTemplateFieldsWithHttpInfo(data)

Add fields to a template

Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        List<CreateTemplateFieldsRequestInner> data = Arrays.asList(); // List<CreateTemplateFieldsRequestInner> | 
        try {
            ApiResponse<List<TemplateField>> response = apiInstance.createTemplateFieldsWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#createTemplateFields");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **data** | [**List&lt;CreateTemplateFieldsRequestInner&gt;**](CreateTemplateFieldsRequestInner.md)|  | |

### Return type

ApiResponse<[**List&lt;TemplateField&gt;**](TemplateField.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The fields. |  -  |
| **400** | The ID isn&#39;t a template, or a value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |


## deleteField

> SendDocument200Response deleteField(id, data)

Delete a field

Deletes a field of a template, or of a document that isn&#39;t sent yet. The document&#39;s or template&#39;s ID goes in the JSON body.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The field's ID.
        DeleteFieldRequest data = new DeleteFieldRequest(); // DeleteFieldRequest | 
        try {
            SendDocument200Response result = apiInstance.deleteField(id, data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#deleteField");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The field&#39;s ID. | |
| **data** | [**DeleteFieldRequest**](DeleteFieldRequest.md)|  | |

### Return type

[**SendDocument200Response**](SendDocument200Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Deleted. |  -  |
| **400** | The document has already been sent; nothing was changed. |  -  |
| **404** | The document or field doesn&#39;t exist or isn&#39;t yours. |  -  |

## deleteFieldWithHttpInfo

> ApiResponse<SendDocument200Response> deleteField deleteFieldWithHttpInfo(id, data)

Delete a field

Deletes a field of a template, or of a document that isn&#39;t sent yet. The document&#39;s or template&#39;s ID goes in the JSON body.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The field's ID.
        DeleteFieldRequest data = new DeleteFieldRequest(); // DeleteFieldRequest | 
        try {
            ApiResponse<SendDocument200Response> response = apiInstance.deleteFieldWithHttpInfo(id, data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#deleteField");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The field&#39;s ID. | |
| **data** | [**DeleteFieldRequest**](DeleteFieldRequest.md)|  | |

### Return type

ApiResponse<[**SendDocument200Response**](SendDocument200Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Deleted. |  -  |
| **400** | The document has already been sent; nothing was changed. |  -  |
| **404** | The document or field doesn&#39;t exist or isn&#39;t yours. |  -  |


## listDocumentFields

> List<Field> listDocumentFields(documentId)

List a document&#39;s fields

The fields of a document. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared).

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UUID documentId = UUID.randomUUID(); // UUID | The document's ID.
        try {
            List<Field> result = apiInstance.listDocumentFields(documentId);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#listDocumentFields");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **documentId** | **UUID**| The document&#39;s ID. | |

### Return type

[**List&lt;Field&gt;**](Field.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The fields. |  -  |
| **400** | The document has already been sent; nothing was changed. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

## listDocumentFieldsWithHttpInfo

> ApiResponse<List<Field>> listDocumentFields listDocumentFieldsWithHttpInfo(documentId)

List a document&#39;s fields

The fields of a document. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared).

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UUID documentId = UUID.randomUUID(); // UUID | The document's ID.
        try {
            ApiResponse<List<Field>> response = apiInstance.listDocumentFieldsWithHttpInfo(documentId);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#listDocumentFields");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **documentId** | **UUID**| The document&#39;s ID. | |

### Return type

ApiResponse<[**List&lt;Field&gt;**](Field.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The fields. |  -  |
| **400** | The document has already been sent; nothing was changed. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |


## listTemplateFields

> List<TemplateField> listTemplateFields(documentId)

List a template&#39;s fields

The fields of a template (or of any of your documents).

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UUID documentId = UUID.randomUUID(); // UUID | The template's ID.
        try {
            List<TemplateField> result = apiInstance.listTemplateFields(documentId);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#listTemplateFields");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **documentId** | **UUID**| The template&#39;s ID. | |

### Return type

[**List&lt;TemplateField&gt;**](TemplateField.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The fields. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

## listTemplateFieldsWithHttpInfo

> ApiResponse<List<TemplateField>> listTemplateFields listTemplateFieldsWithHttpInfo(documentId)

List a template&#39;s fields

The fields of a template (or of any of your documents).

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UUID documentId = UUID.randomUUID(); // UUID | The template's ID.
        try {
            ApiResponse<List<TemplateField>> response = apiInstance.listTemplateFieldsWithHttpInfo(documentId);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#listTemplateFields");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **documentId** | **UUID**| The template&#39;s ID. | |

### Return type

ApiResponse<[**List&lt;TemplateField&gt;**](TemplateField.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The fields. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |


## updateDocumentField

> Field updateDocumentField(id, data)

Change a document&#39;s field

Changes a document&#39;s field; send all of its values, as when adding it. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can&#39;t change: delete the field and add it again. For a template&#39;s field, use PUT /ap1/templates/fields/{id}/.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The field's ID.
        CreateDocumentFieldsRequestInner data = new CreateDocumentFieldsRequestInner(); // CreateDocumentFieldsRequestInner | 
        try {
            Field result = apiInstance.updateDocumentField(id, data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#updateDocumentField");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The field&#39;s ID. | |
| **data** | [**CreateDocumentFieldsRequestInner**](CreateDocumentFieldsRequestInner.md)|  | |

### Return type

[**Field**](Field.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The field. |  -  |
| **400** | A value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
| **404** | The document or field doesn&#39;t exist or isn&#39;t yours. |  -  |

## updateDocumentFieldWithHttpInfo

> ApiResponse<Field> updateDocumentField updateDocumentFieldWithHttpInfo(id, data)

Change a document&#39;s field

Changes a document&#39;s field; send all of its values, as when adding it. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can&#39;t change: delete the field and add it again. For a template&#39;s field, use PUT /ap1/templates/fields/{id}/.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The field's ID.
        CreateDocumentFieldsRequestInner data = new CreateDocumentFieldsRequestInner(); // CreateDocumentFieldsRequestInner | 
        try {
            ApiResponse<Field> response = apiInstance.updateDocumentFieldWithHttpInfo(id, data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#updateDocumentField");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The field&#39;s ID. | |
| **data** | [**CreateDocumentFieldsRequestInner**](CreateDocumentFieldsRequestInner.md)|  | |

### Return type

ApiResponse<[**Field**](Field.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The field. |  -  |
| **400** | A value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
| **404** | The document or field doesn&#39;t exist or isn&#39;t yours. |  -  |


## updateDocumentFieldByBody

> Field updateDocumentFieldByBody(data)

Change a document&#39;s field (ID in the body)

Changes a document&#39;s field, named by &#x60;element_id&#x60; in the body; the same as PUT /ap1/documents/fields/{id}/. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can&#39;t change: delete the field and add it again.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UpdateDocumentFieldByBodyRequest data = new UpdateDocumentFieldByBodyRequest(); // UpdateDocumentFieldByBodyRequest | 
        try {
            Field result = apiInstance.updateDocumentFieldByBody(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#updateDocumentFieldByBody");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **data** | [**UpdateDocumentFieldByBodyRequest**](UpdateDocumentFieldByBodyRequest.md)|  | |

### Return type

[**Field**](Field.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The field. |  -  |
| **400** | A value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
| **404** | The document or field doesn&#39;t exist or isn&#39;t yours. |  -  |

## updateDocumentFieldByBodyWithHttpInfo

> ApiResponse<Field> updateDocumentFieldByBody updateDocumentFieldByBodyWithHttpInfo(data)

Change a document&#39;s field (ID in the body)

Changes a document&#39;s field, named by &#x60;element_id&#x60; in the body; the same as PUT /ap1/documents/fields/{id}/. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can&#39;t change: delete the field and add it again.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UpdateDocumentFieldByBodyRequest data = new UpdateDocumentFieldByBodyRequest(); // UpdateDocumentFieldByBodyRequest | 
        try {
            ApiResponse<Field> response = apiInstance.updateDocumentFieldByBodyWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#updateDocumentFieldByBody");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **data** | [**UpdateDocumentFieldByBodyRequest**](UpdateDocumentFieldByBodyRequest.md)|  | |

### Return type

ApiResponse<[**Field**](Field.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The field. |  -  |
| **400** | A value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
| **404** | The document or field doesn&#39;t exist or isn&#39;t yours. |  -  |


## updateTemplateField

> TemplateField updateTemplateField(id, data)

Change a template&#39;s field

Changes a template&#39;s field; send all of its values, as when adding it. Its page can&#39;t change: delete the field and add it again.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The field's ID.
        CreateTemplateFieldsRequestInner data = new CreateTemplateFieldsRequestInner(); // CreateTemplateFieldsRequestInner | 
        try {
            TemplateField result = apiInstance.updateTemplateField(id, data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#updateTemplateField");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The field&#39;s ID. | |
| **data** | [**CreateTemplateFieldsRequestInner**](CreateTemplateFieldsRequestInner.md)|  | |

### Return type

[**TemplateField**](TemplateField.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The field. |  -  |
| **400** | A value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
| **404** | The template or field doesn&#39;t exist or isn&#39;t yours. |  -  |

## updateTemplateFieldWithHttpInfo

> ApiResponse<TemplateField> updateTemplateField updateTemplateFieldWithHttpInfo(id, data)

Change a template&#39;s field

Changes a template&#39;s field; send all of its values, as when adding it. Its page can&#39;t change: delete the field and add it again.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.FieldsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        FieldsApi apiInstance = new FieldsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The field's ID.
        CreateTemplateFieldsRequestInner data = new CreateTemplateFieldsRequestInner(); // CreateTemplateFieldsRequestInner | 
        try {
            ApiResponse<TemplateField> response = apiInstance.updateTemplateFieldWithHttpInfo(id, data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling FieldsApi#updateTemplateField");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The field&#39;s ID. | |
| **data** | [**CreateTemplateFieldsRequestInner**](CreateTemplateFieldsRequestInner.md)|  | |

### Return type

ApiResponse<[**TemplateField**](TemplateField.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The field. |  -  |
| **400** | A value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
| **404** | The template or field doesn&#39;t exist or isn&#39;t yours. |  -  |

