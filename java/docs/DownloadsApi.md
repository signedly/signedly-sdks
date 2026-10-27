# DownloadsApi

All URIs are relative to *https://l0ads.signedly.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getAuditTrailLink**](DownloadsApi.md#getAuditTrailLink) | **GET** /ap1/document/download-audit-link/ | Get a link to the audit trail |
| [**getAuditTrailLinkWithHttpInfo**](DownloadsApi.md#getAuditTrailLinkWithHttpInfo) | **GET** /ap1/document/download-audit-link/ | Get a link to the audit trail |
| [**getDownloadLink**](DownloadsApi.md#getDownloadLink) | **GET** /ap1/document/download-link/ | Get a link to the signed PDF |
| [**getDownloadLinkWithHttpInfo**](DownloadsApi.md#getDownloadLinkWithHttpInfo) | **GET** /ap1/document/download-link/ | Get a link to the signed PDF |
| [**getViewLink**](DownloadsApi.md#getViewLink) | **GET** /ap1/document/view-link/ | Get a link to view the document |
| [**getViewLinkWithHttpInfo**](DownloadsApi.md#getViewLinkWithHttpInfo) | **GET** /ap1/document/view-link/ | Get a link to view the document |



## getAuditTrailLink

> GetAuditTrailLink200Response getAuditTrailLink(id)

Get a link to the audit trail

A link to the document&#39;s audit trail PDF: who did what, when and from where. It is made when the document is completed; ask for it after GET /ap1/document/download-link/ gives the signed PDF.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DownloadsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DownloadsApi apiInstance = new DownloadsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's ID.
        try {
            GetAuditTrailLink200Response result = apiInstance.getAuditTrailLink(id);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DownloadsApi#getAuditTrailLink");
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

[**GetAuditTrailLink200Response**](GetAuditTrailLink200Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The link. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |

## getAuditTrailLinkWithHttpInfo

> ApiResponse<GetAuditTrailLink200Response> getAuditTrailLink getAuditTrailLinkWithHttpInfo(id)

Get a link to the audit trail

A link to the document&#39;s audit trail PDF: who did what, when and from where. It is made when the document is completed; ask for it after GET /ap1/document/download-link/ gives the signed PDF.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DownloadsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DownloadsApi apiInstance = new DownloadsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's ID.
        try {
            ApiResponse<GetAuditTrailLink200Response> response = apiInstance.getAuditTrailLinkWithHttpInfo(id);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DownloadsApi#getAuditTrailLink");
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

ApiResponse<[**GetAuditTrailLink200Response**](GetAuditTrailLink200Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The link. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |


## getDownloadLink

> GetAuditTrailLink200Response getDownloadLink(id)

Get a link to the signed PDF

A link to the final signed PDF, once every signatory has signed and it has been sealed. Until then the answer is 202: try again later.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DownloadsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DownloadsApi apiInstance = new DownloadsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's ID.
        try {
            GetAuditTrailLink200Response result = apiInstance.getDownloadLink(id);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DownloadsApi#getDownloadLink");
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

[**GetAuditTrailLink200Response**](GetAuditTrailLink200Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The link. |  -  |
| **202** | The signed PDF isn&#39;t ready yet. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |

## getDownloadLinkWithHttpInfo

> ApiResponse<GetAuditTrailLink200Response> getDownloadLink getDownloadLinkWithHttpInfo(id)

Get a link to the signed PDF

A link to the final signed PDF, once every signatory has signed and it has been sealed. Until then the answer is 202: try again later.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DownloadsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DownloadsApi apiInstance = new DownloadsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's ID.
        try {
            ApiResponse<GetAuditTrailLink200Response> response = apiInstance.getDownloadLinkWithHttpInfo(id);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DownloadsApi#getDownloadLink");
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

ApiResponse<[**GetAuditTrailLink200Response**](GetAuditTrailLink200Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The link. |  -  |
| **202** | The signed PDF isn&#39;t ready yet. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |


## getViewLink

> GetAuditTrailLink200Response getViewLink(id)

Get a link to view the document

A link to the document&#39;s PDF as it stands now, with the values and signatures applied so far. For the final signed PDF, use GET /ap1/document/download-link/.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DownloadsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DownloadsApi apiInstance = new DownloadsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's ID.
        try {
            GetAuditTrailLink200Response result = apiInstance.getViewLink(id);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling DownloadsApi#getViewLink");
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

[**GetAuditTrailLink200Response**](GetAuditTrailLink200Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The link. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |

## getViewLinkWithHttpInfo

> ApiResponse<GetAuditTrailLink200Response> getViewLink getViewLinkWithHttpInfo(id)

Get a link to view the document

A link to the document&#39;s PDF as it stands now, with the values and signatures applied so far. For the final signed PDF, use GET /ap1/document/download-link/.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.DownloadsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        DownloadsApi apiInstance = new DownloadsApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The document's ID.
        try {
            ApiResponse<GetAuditTrailLink200Response> response = apiInstance.getViewLinkWithHttpInfo(id);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling DownloadsApi#getViewLink");
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

ApiResponse<[**GetAuditTrailLink200Response**](GetAuditTrailLink200Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The link. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |

