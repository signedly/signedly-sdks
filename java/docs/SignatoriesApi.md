# SignatoriesApi

All URIs are relative to *https://l0ads.signedly.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSignatories**](SignatoriesApi.md#createSignatories) | **POST** /ap1/signatories/bulk/ | Add several signatories |
| [**createSignatoriesWithHttpInfo**](SignatoriesApi.md#createSignatoriesWithHttpInfo) | **POST** /ap1/signatories/bulk/ | Add several signatories |
| [**createSignatory**](SignatoriesApi.md#createSignatory) | **POST** /ap1/signatories/ | Add a signatory |
| [**createSignatoryWithHttpInfo**](SignatoriesApi.md#createSignatoryWithHttpInfo) | **POST** /ap1/signatories/ | Add a signatory |
| [**deleteSignatory**](SignatoriesApi.md#deleteSignatory) | **DELETE** /ap1/signatories/{id}/ | Remove a signatory |
| [**deleteSignatoryWithHttpInfo**](SignatoriesApi.md#deleteSignatoryWithHttpInfo) | **DELETE** /ap1/signatories/{id}/ | Remove a signatory |
| [**listSignatories**](SignatoriesApi.md#listSignatories) | **GET** /ap1/signatories/ | List a document&#39;s signatories |
| [**listSignatoriesWithHttpInfo**](SignatoriesApi.md#listSignatoriesWithHttpInfo) | **GET** /ap1/signatories/ | List a document&#39;s signatories |



## createSignatories

> List<Signatory> createSignatories(data)

Add several signatories

Adds several signatories at once, in the order given. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). All or nothing: if one is refused (a repeated email, say), none is added. On a document made from a template, they fill its open roles in signing order, each with that role&#39;s fields.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SignatoriesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SignatoriesApi apiInstance = new SignatoriesApi(defaultClient);
        CreateSignatoriesRequest data = new CreateSignatoriesRequest(); // CreateSignatoriesRequest | 
        try {
            List<Signatory> result = apiInstance.createSignatories(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SignatoriesApi#createSignatories");
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
| **data** | [**CreateSignatoriesRequest**](CreateSignatoriesRequest.md)|  | |

### Return type

[**List&lt;Signatory&gt;**](Signatory.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The signatories. |  -  |
| **400** | The document has been sent, the list is missing or empty, or a signatory was refused. None was added. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

## createSignatoriesWithHttpInfo

> ApiResponse<List<Signatory>> createSignatories createSignatoriesWithHttpInfo(data)

Add several signatories

Adds several signatories at once, in the order given. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). All or nothing: if one is refused (a repeated email, say), none is added. On a document made from a template, they fill its open roles in signing order, each with that role&#39;s fields.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SignatoriesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SignatoriesApi apiInstance = new SignatoriesApi(defaultClient);
        CreateSignatoriesRequest data = new CreateSignatoriesRequest(); // CreateSignatoriesRequest | 
        try {
            ApiResponse<List<Signatory>> response = apiInstance.createSignatoriesWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SignatoriesApi#createSignatories");
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
| **data** | [**CreateSignatoriesRequest**](CreateSignatoriesRequest.md)|  | |

### Return type

ApiResponse<[**List&lt;Signatory&gt;**](Signatory.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The signatories. |  -  |
| **400** | The document has been sent, the list is missing or empty, or a signatory was refused. None was added. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |


## createSignatory

> Signatory createSignatory(data)

Add a signatory

Adds a person who signs the document. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). On a document made from a template, each signatory takes the next open template role, in signing order, with its fields; once every role is filled, more are added.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SignatoriesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SignatoriesApi apiInstance = new SignatoriesApi(defaultClient);
        CreateSignatoryRequest data = new CreateSignatoryRequest(); // CreateSignatoryRequest | 
        try {
            Signatory result = apiInstance.createSignatory(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SignatoriesApi#createSignatory");
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
| **data** | [**CreateSignatoryRequest**](CreateSignatoryRequest.md)|  | |

### Return type

[**Signatory**](Signatory.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The signatory. |  -  |
| **400** | The document has been sent, is a template, or already has this signatory, or a value isn&#39;t valid. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

## createSignatoryWithHttpInfo

> ApiResponse<Signatory> createSignatory createSignatoryWithHttpInfo(data)

Add a signatory

Adds a person who signs the document. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). On a document made from a template, each signatory takes the next open template role, in signing order, with its fields; once every role is filled, more are added.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SignatoriesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SignatoriesApi apiInstance = new SignatoriesApi(defaultClient);
        CreateSignatoryRequest data = new CreateSignatoryRequest(); // CreateSignatoryRequest | 
        try {
            ApiResponse<Signatory> response = apiInstance.createSignatoryWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SignatoriesApi#createSignatory");
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
| **data** | [**CreateSignatoryRequest**](CreateSignatoryRequest.md)|  | |

### Return type

ApiResponse<[**Signatory**](Signatory.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The signatory. |  -  |
| **400** | The document has been sent, is a template, or already has this signatory, or a value isn&#39;t valid. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |


## deleteSignatory

> SendDocument200Response deleteSignatory(id, data)

Remove a signatory

Removes a signatory, and the fields assigned to them, from the document. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). The document&#39;s ID goes in the JSON body.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SignatoriesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SignatoriesApi apiInstance = new SignatoriesApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The signatory's ID.
        DeleteFieldRequest data = new DeleteFieldRequest(); // DeleteFieldRequest | 
        try {
            SendDocument200Response result = apiInstance.deleteSignatory(id, data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SignatoriesApi#deleteSignatory");
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
| **id** | **UUID**| The signatory&#39;s ID. | |
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
| **204** | Removed. |  -  |
| **400** | The document has already been sent; nothing was changed. |  -  |
| **404** | The document or signatory doesn&#39;t exist or isn&#39;t yours. |  -  |

## deleteSignatoryWithHttpInfo

> ApiResponse<SendDocument200Response> deleteSignatory deleteSignatoryWithHttpInfo(id, data)

Remove a signatory

Removes a signatory, and the fields assigned to them, from the document. Only while the document isn&#39;t sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). The document&#39;s ID goes in the JSON body.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SignatoriesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SignatoriesApi apiInstance = new SignatoriesApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The signatory's ID.
        DeleteFieldRequest data = new DeleteFieldRequest(); // DeleteFieldRequest | 
        try {
            ApiResponse<SendDocument200Response> response = apiInstance.deleteSignatoryWithHttpInfo(id, data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SignatoriesApi#deleteSignatory");
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
| **id** | **UUID**| The signatory&#39;s ID. | |
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
| **204** | Removed. |  -  |
| **400** | The document has already been sent; nothing was changed. |  -  |
| **404** | The document or signatory doesn&#39;t exist or isn&#39;t yours. |  -  |


## listSignatories

> List<Signatory> listSignatories(documentId)

List a document&#39;s signatories

The document&#39;s signatories with their signing status: 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SignatoriesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SignatoriesApi apiInstance = new SignatoriesApi(defaultClient);
        UUID documentId = UUID.randomUUID(); // UUID | The document's ID.
        try {
            List<Signatory> result = apiInstance.listSignatories(documentId);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SignatoriesApi#listSignatories");
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

[**List&lt;Signatory&gt;**](Signatory.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The signatories. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |

## listSignatoriesWithHttpInfo

> ApiResponse<List<Signatory>> listSignatories listSignatoriesWithHttpInfo(documentId)

List a document&#39;s signatories

The document&#39;s signatories with their signing status: 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SignatoriesApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SignatoriesApi apiInstance = new SignatoriesApi(defaultClient);
        UUID documentId = UUID.randomUUID(); // UUID | The document's ID.
        try {
            ApiResponse<List<Signatory>> response = apiInstance.listSignatoriesWithHttpInfo(documentId);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SignatoriesApi#listSignatories");
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

ApiResponse<[**List&lt;Signatory&gt;**](Signatory.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The signatories. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |

