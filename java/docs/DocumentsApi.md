# DocumentsApi

All URIs are relative to *https://l0ads.signedly.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createDocumentFromTemplate**](DocumentsApi.md#createDocumentFromTemplate) | **POST** /ap1/documents/fromtemplate/ | Make a document from a template |
| [**createDocumentFromTemplateWithHttpInfo**](DocumentsApi.md#createDocumentFromTemplateWithHttpInfo) | **POST** /ap1/documents/fromtemplate/ | Make a document from a template |
| [**deleteDocument**](DocumentsApi.md#deleteDocument) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document |
| [**deleteDocumentWithHttpInfo**](DocumentsApi.md#deleteDocumentWithHttpInfo) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document |
| [**getDownloadStatus**](DocumentsApi.md#getDownloadStatus) | **GET** /ap1/documents-status/{id}/ | Check whether the signed PDF is ready |
| [**getDownloadStatusWithHttpInfo**](DocumentsApi.md#getDownloadStatusWithHttpInfo) | **GET** /ap1/documents-status/{id}/ | Check whether the signed PDF is ready |
| [**listDocumentPages**](DocumentsApi.md#listDocumentPages) | **GET** /ap1/documents/{id}/pages/ | List a document&#39;s pages and their fields |
| [**listDocumentPagesWithHttpInfo**](DocumentsApi.md#listDocumentPagesWithHttpInfo) | **GET** /ap1/documents/{id}/pages/ | List a document&#39;s pages and their fields |
| [**listDocumentStatuses**](DocumentsApi.md#listDocumentStatuses) | **GET** /ap1/documents-status-list/ | List the status of your organisation&#39;s documents |
| [**listDocumentStatusesWithHttpInfo**](DocumentsApi.md#listDocumentStatusesWithHttpInfo) | **GET** /ap1/documents-status-list/ | List the status of your organisation&#39;s documents |
| [**listDocuments**](DocumentsApi.md#listDocuments) | **GET** /ap1/documents/ | List the documents this API client created |
| [**listDocumentsWithHttpInfo**](DocumentsApi.md#listDocumentsWithHttpInfo) | **GET** /ap1/documents/ | List the documents this API client created |
| [**uploadDocument**](DocumentsApi.md#uploadDocument) | **POST** /ap1/upload/ | Upload a document or template |
| [**uploadDocumentWithHttpInfo**](DocumentsApi.md#uploadDocumentWithHttpInfo) | **POST** /ap1/upload/ | Upload a document or template |
| [**uploadDocumentForOneSigner**](DocumentsApi.md#uploadDocumentForOneSigner) | **POST** /ap1/upload_app/ | Upload a document for one signer and get their signing link |
| [**uploadDocumentForOneSignerWithHttpInfo**](DocumentsApi.md#uploadDocumentForOneSignerWithHttpInfo) | **POST** /ap1/upload_app/ | Upload a document for one signer and get their signing link |



## createDocumentFromTemplate

> CreateDocumentFromTemplate200Response createDocumentFromTemplate(data)

Make a document from a template

Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template&#39;s signing order. Fill the open roles here with &#x60;recipients&#x60;, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can&#39;t be sent. To prefill a field, add a key with the field&#39;s label and the value, e.g. &#x60;\&quot;Company\&quot;: \&quot;Acme Ltd\&quot;&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        CreateDocumentFromTemplateRequest data = new CreateDocumentFromTemplateRequest(); // CreateDocumentFromTemplateRequest | 
        try {
            CreateDocumentFromTemplate200Response result = apiInstance.createDocumentFromTemplate(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#createDocumentFromTemplate");
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
| **data** | [**CreateDocumentFromTemplateRequest**](CreateDocumentFromTemplateRequest.md)|  | |

### Return type

[**CreateDocumentFromTemplate200Response**](CreateDocumentFromTemplate200Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The new document. |  -  |
| **400** | The ID isn&#39;t a template, the name is taken, or &#x60;recipients&#x60; don&#39;t fill the template&#39;s open roles exactly once. |  -  |
| **404** | The template doesn&#39;t exist or isn&#39;t yours. |  -  |

## createDocumentFromTemplateWithHttpInfo

> ApiResponse<CreateDocumentFromTemplate200Response> createDocumentFromTemplate createDocumentFromTemplateWithHttpInfo(data)

Make a document from a template

Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template&#39;s signing order. Fill the open roles here with &#x60;recipients&#x60;, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can&#39;t be sent. To prefill a field, add a key with the field&#39;s label and the value, e.g. &#x60;\&quot;Company\&quot;: \&quot;Acme Ltd\&quot;&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        CreateDocumentFromTemplateRequest data = new CreateDocumentFromTemplateRequest(); // CreateDocumentFromTemplateRequest | 
        try {
            ApiResponse<CreateDocumentFromTemplate200Response> response = apiInstance.createDocumentFromTemplateWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#createDocumentFromTemplate");
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
| **data** | [**CreateDocumentFromTemplateRequest**](CreateDocumentFromTemplateRequest.md)|  | |

### Return type

ApiResponse<[**CreateDocumentFromTemplate200Response**](CreateDocumentFromTemplate200Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The new document. |  -  |
| **400** | The ID isn&#39;t a template, the name is taken, or &#x60;recipients&#x60; don&#39;t fill the template&#39;s open roles exactly once. |  -  |
| **404** | The template doesn&#39;t exist or isn&#39;t yours. |  -  |


## deleteDocument

> SendDocument200Response deleteDocument(id)

Delete a template or an unsent document

Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can&#39;t be deleted.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's or template's ID.
        try {
            SendDocument200Response result = apiInstance.deleteDocument(id);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#deleteDocument");
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
| **id** | **UUID**| The document&#39;s or template&#39;s ID. | |

### Return type

[**SendDocument200Response**](SendDocument200Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Deleted. |  -  |
| **400** | The document has been sent, so it is kept. |  -  |
| **403** | The document isn&#39;t your organisation&#39;s. |  -  |
| **404** | No document has this ID. |  -  |

## deleteDocumentWithHttpInfo

> ApiResponse<SendDocument200Response> deleteDocument deleteDocumentWithHttpInfo(id)

Delete a template or an unsent document

Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can&#39;t be deleted.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's or template's ID.
        try {
            ApiResponse<SendDocument200Response> response = apiInstance.deleteDocumentWithHttpInfo(id);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#deleteDocument");
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
| **id** | **UUID**| The document&#39;s or template&#39;s ID. | |

### Return type

ApiResponse<[**SendDocument200Response**](SendDocument200Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Deleted. |  -  |
| **400** | The document has been sent, so it is kept. |  -  |
| **403** | The document isn&#39;t your organisation&#39;s. |  -  |
| **404** | No document has this ID. |  -  |


## getDownloadStatus

> GetDownloadStatus200Response getDownloadStatus(id)

Check whether the signed PDF is ready

Says whether the document&#39;s signed PDF can be downloaded yet (&#x60;download_status&#x60;). For the document&#39;s signing status, use &#x60;GET /ap1/documents-status-list/?document_ids&#x3D;&lt;id&gt;&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's ID.
        try {
            GetDownloadStatus200Response result = apiInstance.getDownloadStatus(id);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#getDownloadStatus");
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
| **id** | **UUID**| The document&#39;s ID. | |

### Return type

[**GetDownloadStatus200Response**](GetDownloadStatus200Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Whether the signed PDF is ready. |  -  |
| **403** | The document isn&#39;t your organisation&#39;s. |  -  |
| **404** | No document has this ID. |  -  |

## getDownloadStatusWithHttpInfo

> ApiResponse<GetDownloadStatus200Response> getDownloadStatus getDownloadStatusWithHttpInfo(id)

Check whether the signed PDF is ready

Says whether the document&#39;s signed PDF can be downloaded yet (&#x60;download_status&#x60;). For the document&#39;s signing status, use &#x60;GET /ap1/documents-status-list/?document_ids&#x3D;&lt;id&gt;&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's ID.
        try {
            ApiResponse<GetDownloadStatus200Response> response = apiInstance.getDownloadStatusWithHttpInfo(id);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#getDownloadStatus");
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
| **id** | **UUID**| The document&#39;s ID. | |

### Return type

ApiResponse<[**GetDownloadStatus200Response**](GetDownloadStatus200Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Whether the signed PDF is ready. |  -  |
| **403** | The document isn&#39;t your organisation&#39;s. |  -  |
| **404** | No document has this ID. |  -  |


## listDocumentPages

> List<Page> listDocumentPages(id)

List a document&#39;s pages and their fields

The document&#39;s (or template&#39;s) pages, in order, each with its fields. Use a page&#39;s &#x60;id&#x60; and &#x60;page_number&#x60; when placing a field on it. A new upload has no pages until it has been processed.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's or template's ID.
        try {
            List<Page> result = apiInstance.listDocumentPages(id);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#listDocumentPages");
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
| **id** | **UUID**| The document&#39;s or template&#39;s ID. | |

### Return type

[**List&lt;Page&gt;**](Page.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The pages. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

## listDocumentPagesWithHttpInfo

> ApiResponse<List<Page>> listDocumentPages listDocumentPagesWithHttpInfo(id)

List a document&#39;s pages and their fields

The document&#39;s (or template&#39;s) pages, in order, each with its fields. Use a page&#39;s &#x60;id&#x60; and &#x60;page_number&#x60; when placing a field on it. A new upload has no pages until it has been processed.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's or template's ID.
        try {
            ApiResponse<List<Page>> response = apiInstance.listDocumentPagesWithHttpInfo(id);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#listDocumentPages");
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
| **id** | **UUID**| The document&#39;s or template&#39;s ID. | |

### Return type

ApiResponse<[**List&lt;Page&gt;**](Page.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The pages. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |


## listDocumentStatuses

> DocumentStatusPage listDocumentStatuses(name, status, documentIds, limit, offset)

List the status of your organisation&#39;s documents

The ID and status of every document of your organisation&#39;s admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren&#39;t listed. A light way to poll for completed documents. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        String name = "name_example"; // String | Only documents whose name contains this (any case).
        List<Integer> status = Arrays.asList(); // List<Integer> | Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (`status=4&status=6`) or separate values with commas (`status=4,6`).
        List<UUID> documentIds = Arrays.asList(); // List<UUID> | Only these documents. Repeat it or separate IDs with commas.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            DocumentStatusPage result = apiInstance.listDocumentStatuses(name, status, documentIds, limit, offset);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#listDocumentStatuses");
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
| **name** | **String**| Only documents whose name contains this (any case). | [optional] |
| **status** | [**List&lt;Integer&gt;**](Integer.md)| Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). | [optional] |
| **documentIds** | [**List&lt;UUID&gt;**](UUID.md)| Only these documents. Repeat it or separate IDs with commas. | [optional] |
| **limit** | **Integer**| How many results to return (default 10). | [optional] |
| **offset** | **Integer**| How many results to skip. | [optional] |

### Return type

[**DocumentStatusPage**](DocumentStatusPage.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A page of document statuses. |  -  |
| **400** | A &#x60;status&#x60; isn&#39;t one of the values above, or an ID isn&#39;t a UUID. |  -  |

## listDocumentStatusesWithHttpInfo

> ApiResponse<DocumentStatusPage> listDocumentStatuses listDocumentStatusesWithHttpInfo(name, status, documentIds, limit, offset)

List the status of your organisation&#39;s documents

The ID and status of every document of your organisation&#39;s admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren&#39;t listed. A light way to poll for completed documents. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        String name = "name_example"; // String | Only documents whose name contains this (any case).
        List<Integer> status = Arrays.asList(); // List<Integer> | Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (`status=4&status=6`) or separate values with commas (`status=4,6`).
        List<UUID> documentIds = Arrays.asList(); // List<UUID> | Only these documents. Repeat it or separate IDs with commas.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            ApiResponse<DocumentStatusPage> response = apiInstance.listDocumentStatusesWithHttpInfo(name, status, documentIds, limit, offset);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#listDocumentStatuses");
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
| **name** | **String**| Only documents whose name contains this (any case). | [optional] |
| **status** | [**List&lt;Integer&gt;**](Integer.md)| Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). | [optional] |
| **documentIds** | [**List&lt;UUID&gt;**](UUID.md)| Only these documents. Repeat it or separate IDs with commas. | [optional] |
| **limit** | **Integer**| How many results to return (default 10). | [optional] |
| **offset** | **Integer**| How many results to skip. | [optional] |

### Return type

ApiResponse<[**DocumentStatusPage**](DocumentStatusPage.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A page of document statuses. |  -  |
| **400** | A &#x60;status&#x60; isn&#39;t one of the values above, or an ID isn&#39;t a UUID. |  -  |


## listDocuments

> DocumentPage listDocuments(name, status, documentIds, limit, offset)

List the documents this API client created

The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren&#39;t listed. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        String name = "name_example"; // String | Only documents whose name contains this (any case).
        List<Integer> status = Arrays.asList(); // List<Integer> | Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (`status=4&status=6`) or separate values with commas (`status=4,6`).
        List<UUID> documentIds = Arrays.asList(); // List<UUID> | Only these documents. Repeat it or separate IDs with commas.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            DocumentPage result = apiInstance.listDocuments(name, status, documentIds, limit, offset);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#listDocuments");
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
| **name** | **String**| Only documents whose name contains this (any case). | [optional] |
| **status** | [**List&lt;Integer&gt;**](Integer.md)| Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). | [optional] |
| **documentIds** | [**List&lt;UUID&gt;**](UUID.md)| Only these documents. Repeat it or separate IDs with commas. | [optional] |
| **limit** | **Integer**| How many results to return (default 10). | [optional] |
| **offset** | **Integer**| How many results to skip. | [optional] |

### Return type

[**DocumentPage**](DocumentPage.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A page of documents. |  -  |
| **400** | A &#x60;status&#x60; isn&#39;t one of the values above, or an ID isn&#39;t a UUID. |  -  |

## listDocumentsWithHttpInfo

> ApiResponse<DocumentPage> listDocuments listDocumentsWithHttpInfo(name, status, documentIds, limit, offset)

List the documents this API client created

The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren&#39;t listed. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        String name = "name_example"; // String | Only documents whose name contains this (any case).
        List<Integer> status = Arrays.asList(); // List<Integer> | Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (`status=4&status=6`) or separate values with commas (`status=4,6`).
        List<UUID> documentIds = Arrays.asList(); // List<UUID> | Only these documents. Repeat it or separate IDs with commas.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            ApiResponse<DocumentPage> response = apiInstance.listDocumentsWithHttpInfo(name, status, documentIds, limit, offset);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#listDocuments");
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
| **name** | **String**| Only documents whose name contains this (any case). | [optional] |
| **status** | [**List&lt;Integer&gt;**](Integer.md)| Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). | [optional] |
| **documentIds** | [**List&lt;UUID&gt;**](UUID.md)| Only these documents. Repeat it or separate IDs with commas. | [optional] |
| **limit** | **Integer**| How many results to return (default 10). | [optional] |
| **offset** | **Integer**| How many results to skip. | [optional] |

### Return type

ApiResponse<[**DocumentPage**](DocumentPage.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A page of documents. |  -  |
| **400** | A &#x60;status&#x60; isn&#39;t one of the values above, or an ID isn&#39;t a UUID. |  -  |


## uploadDocument

> Upload uploadDocument(_file, name, type, templateName)

Upload a document or template

Uploads a PDF or DOCX file of up to 2 MB as a document (&#x60;type&#x60; 2) or a template (&#x60;type&#x60; 4). The answer is the upload; the document itself is made in the background. Find it in &#x60;GET /ap1/documents/?name&#x3D;&lt;name&gt;&#x60; (its &#x60;upload.id&#x60; is this upload&#39;s &#x60;id&#x60;), or a template in &#x60;GET /ap1/templates/&#x60;, and wait until &#x60;GET /ap1/documents/{id}/pages/&#x60; lists its pages before placing fields.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        File _file = new File("/path/to/file"); // File | A PDF or DOCX file. A PDF that can't be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB.
        String name = "name_example"; // String | The document's name. It must differ from every other upload of this API client.
        Integer type = 2; // Integer | 2 Document · 4 Template
        String templateName = "templateName_example"; // String | The template's title. Required with `type` 4; it must differ from this API client's other templates.
        try {
            Upload result = apiInstance.uploadDocument(_file, name, type, templateName);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#uploadDocument");
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
| **_file** | **File**| A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB. | |
| **name** | **String**| The document&#39;s name. It must differ from every other upload of this API client. | |
| **type** | **Integer**| 2 Document · 4 Template | [enum: 2, 4] |
| **templateName** | **String**| The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. | [optional] |

### Return type

[**Upload**](Upload.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The upload. Its &#x60;status&#x60; is 2 Uploaded; the document is made next. |  -  |
| **400** | The file is missing, not a PDF or DOCX, or over 2 MB; the name is taken; or &#x60;type&#x60; or &#x60;template_name&#x60; is missing or wrong. |  -  |

## uploadDocumentWithHttpInfo

> ApiResponse<Upload> uploadDocument uploadDocumentWithHttpInfo(_file, name, type, templateName)

Upload a document or template

Uploads a PDF or DOCX file of up to 2 MB as a document (&#x60;type&#x60; 2) or a template (&#x60;type&#x60; 4). The answer is the upload; the document itself is made in the background. Find it in &#x60;GET /ap1/documents/?name&#x3D;&lt;name&gt;&#x60; (its &#x60;upload.id&#x60; is this upload&#39;s &#x60;id&#x60;), or a template in &#x60;GET /ap1/templates/&#x60;, and wait until &#x60;GET /ap1/documents/{id}/pages/&#x60; lists its pages before placing fields.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        File _file = new File("/path/to/file"); // File | A PDF or DOCX file. A PDF that can't be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB.
        String name = "name_example"; // String | The document's name. It must differ from every other upload of this API client.
        Integer type = 2; // Integer | 2 Document · 4 Template
        String templateName = "templateName_example"; // String | The template's title. Required with `type` 4; it must differ from this API client's other templates.
        try {
            ApiResponse<Upload> response = apiInstance.uploadDocumentWithHttpInfo(_file, name, type, templateName);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#uploadDocument");
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
| **_file** | **File**| A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB. | |
| **name** | **String**| The document&#39;s name. It must differ from every other upload of this API client. | |
| **type** | **Integer**| 2 Document · 4 Template | [enum: 2, 4] |
| **templateName** | **String**| The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. | [optional] |

### Return type

ApiResponse<[**Upload**](Upload.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The upload. Its &#x60;status&#x60; is 2 Uploaded; the document is made next. |  -  |
| **400** | The file is missing, not a PDF or DOCX, or over 2 MB; the name is taken; or &#x60;type&#x60; or &#x60;template_name&#x60; is missing or wrong. |  -  |


## uploadDocumentForOneSigner

> UploadDocumentForOneSigner200Response uploadDocumentForOneSigner(_file, signeeName, signeeEmail, redirectUrl, finalEmail)

Upload a document for one signer and get their signing link

Uploads a PDF or DOCX for one signer and returns their signing link in &#x60;redirect_url&#x60;; give it to the signer. They place their own signature on the signing page and are then sent to the &#x60;redirect_url&#x60; you gave. The signed PDF and its audit trail are emailed to &#x60;final_email&#x60;, or to your organisation&#39;s admin without one.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        File _file = new File("/path/to/file"); // File | A PDF or DOCX file. A PDF that can't be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that.
        String signeeName = "signeeName_example"; // String | The signer's name.
        String signeeEmail = "signeeEmail_example"; // String | The signer's email address.
        URI redirectUrl = new URI(); // URI | Where the signer is sent after signing.
        String finalEmail = "finalEmail_example"; // String | Who gets the signed PDF and audit trail by email. Without it, your organisation's admin does.
        try {
            UploadDocumentForOneSigner200Response result = apiInstance.uploadDocumentForOneSigner(_file, signeeName, signeeEmail, redirectUrl, finalEmail);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#uploadDocumentForOneSigner");
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
| **_file** | **File**| A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. | |
| **signeeName** | **String**| The signer&#39;s name. | |
| **signeeEmail** | **String**| The signer&#39;s email address. | |
| **redirectUrl** | **URI**| Where the signer is sent after signing. | |
| **finalEmail** | **String**| Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. | [optional] |

### Return type

[**UploadDocumentForOneSigner200Response**](UploadDocumentForOneSigner200Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The new document. |  -  |
| **400** | A value is missing or not valid (the file isn&#39;t a PDF or DOCX, an email or the URL isn&#39;t valid). Nothing was kept. |  -  |
| **502** | The file couldn&#39;t be stored. Nothing was kept; try again. |  -  |

## uploadDocumentForOneSignerWithHttpInfo

> ApiResponse<UploadDocumentForOneSigner200Response> uploadDocumentForOneSigner uploadDocumentForOneSignerWithHttpInfo(_file, signeeName, signeeEmail, redirectUrl, finalEmail)

Upload a document for one signer and get their signing link

Uploads a PDF or DOCX for one signer and returns their signing link in &#x60;redirect_url&#x60;; give it to the signer. They place their own signature on the signing page and are then sent to the &#x60;redirect_url&#x60; you gave. The signed PDF and its audit trail are emailed to &#x60;final_email&#x60;, or to your organisation&#39;s admin without one.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DocumentsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DocumentsApi apiInstance = new DocumentsApi(defaultClient);
        File _file = new File("/path/to/file"); // File | A PDF or DOCX file. A PDF that can't be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that.
        String signeeName = "signeeName_example"; // String | The signer's name.
        String signeeEmail = "signeeEmail_example"; // String | The signer's email address.
        URI redirectUrl = new URI(); // URI | Where the signer is sent after signing.
        String finalEmail = "finalEmail_example"; // String | Who gets the signed PDF and audit trail by email. Without it, your organisation's admin does.
        try {
            ApiResponse<UploadDocumentForOneSigner200Response> response = apiInstance.uploadDocumentForOneSignerWithHttpInfo(_file, signeeName, signeeEmail, redirectUrl, finalEmail);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DocumentsApi#uploadDocumentForOneSigner");
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
| **_file** | **File**| A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. | |
| **signeeName** | **String**| The signer&#39;s name. | |
| **signeeEmail** | **String**| The signer&#39;s email address. | |
| **redirectUrl** | **URI**| Where the signer is sent after signing. | |
| **finalEmail** | **String**| Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. | [optional] |

### Return type

ApiResponse<[**UploadDocumentForOneSigner200Response**](UploadDocumentForOneSigner200Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/x-www-form-urlencoded, multipart/form-data
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The new document. |  -  |
| **400** | A value is missing or not valid (the file isn&#39;t a PDF or DOCX, an email or the URL isn&#39;t valid). Nothing was kept. |  -  |
| **502** | The file couldn&#39;t be stored. Nothing was kept; try again. |  -  |

