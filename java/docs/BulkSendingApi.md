# BulkSendingApi

All URIs are relative to *https://l0ads.signedly.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createBulkSend**](BulkSendingApi.md#createBulkSend) | **POST** /ap1/bulk-sends/ | Send a template to many people |
| [**createBulkSendWithHttpInfo**](BulkSendingApi.md#createBulkSendWithHttpInfo) | **POST** /ap1/bulk-sends/ | Send a template to many people |
| [**getBulkSend**](BulkSendingApi.md#getBulkSend) | **GET** /ap1/bulk-sends/{id}/ | Follow a bulk send |
| [**getBulkSendWithHttpInfo**](BulkSendingApi.md#getBulkSendWithHttpInfo) | **GET** /ap1/bulk-sends/{id}/ | Follow a bulk send |
| [**listBulkSendColumns**](BulkSendingApi.md#listBulkSendColumns) | **GET** /ap1/bulk-sends/columns/ | List the columns a template&#39;s bulk send needs |
| [**listBulkSendColumnsWithHttpInfo**](BulkSendingApi.md#listBulkSendColumnsWithHttpInfo) | **GET** /ap1/bulk-sends/columns/ | List the columns a template&#39;s bulk send needs |



## createBulkSend

> CreateBulkSend202Response createBulkSend(data)

Send a template to many people

Makes and sends one document per row from one of your templates, as the web app&#39;s Bulk Sending does: each row fills the template&#39;s roles and fields. Give the rows as a CSV or Excel &#x60;file&#x60; (multipart) or as JSON &#x60;rows&#x60;, with the columns from GET /ap1/bulk-sends/columns/. The whole file is checked first: if any row has a problem nothing is sent and the answer lists every one. Up to 1,000 rows; each document is billed like a single send. &#x60;subject&#x60; and &#x60;message&#x60; may use {{column}} tags. Needs a plan with bulk sending. The documents are made in the background: follow them with GET /ap1/bulk-sends/{id}/ (or webhooks).

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.BulkSendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        BulkSendingApi apiInstance = new BulkSendingApi(defaultClient);
        CreateBulkSendRequest data = new CreateBulkSendRequest(); // CreateBulkSendRequest | 
        try {
            CreateBulkSend202Response result = apiInstance.createBulkSend(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling BulkSendingApi#createBulkSend");
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
| **data** | [**CreateBulkSendRequest**](CreateBulkSendRequest.md)|  | |

### Return type

[**CreateBulkSend202Response**](CreateBulkSend202Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Accepted; the documents are being made. |  -  |
| **400** | A row has a problem (every one is listed), a tag isn&#39;t a column, the date isn&#39;t in the future, or the plan has no bulk sending. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |
| **429** | With test keys: more rows than this month&#39;s test documents left. |  -  |

## createBulkSendWithHttpInfo

> ApiResponse<CreateBulkSend202Response> createBulkSend createBulkSendWithHttpInfo(data)

Send a template to many people

Makes and sends one document per row from one of your templates, as the web app&#39;s Bulk Sending does: each row fills the template&#39;s roles and fields. Give the rows as a CSV or Excel &#x60;file&#x60; (multipart) or as JSON &#x60;rows&#x60;, with the columns from GET /ap1/bulk-sends/columns/. The whole file is checked first: if any row has a problem nothing is sent and the answer lists every one. Up to 1,000 rows; each document is billed like a single send. &#x60;subject&#x60; and &#x60;message&#x60; may use {{column}} tags. Needs a plan with bulk sending. The documents are made in the background: follow them with GET /ap1/bulk-sends/{id}/ (or webhooks).

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.BulkSendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        BulkSendingApi apiInstance = new BulkSendingApi(defaultClient);
        CreateBulkSendRequest data = new CreateBulkSendRequest(); // CreateBulkSendRequest | 
        try {
            ApiResponse<CreateBulkSend202Response> response = apiInstance.createBulkSendWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling BulkSendingApi#createBulkSend");
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
| **data** | [**CreateBulkSendRequest**](CreateBulkSendRequest.md)|  | |

### Return type

ApiResponse<[**CreateBulkSend202Response**](CreateBulkSend202Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Accepted; the documents are being made. |  -  |
| **400** | A row has a problem (every one is listed), a tag isn&#39;t a column, the date isn&#39;t in the future, or the plan has no bulk sending. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |
| **429** | With test keys: more rows than this month&#39;s test documents left. |  -  |


## getBulkSend

> CreateBulkSend202Response getBulkSend(id)

Follow a bulk send

How far the bulk send is: documents made so far, rows that failed, and each document&#39;s status and signatories.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.BulkSendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        BulkSendingApi apiInstance = new BulkSendingApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The bulk send's ID.
        try {
            CreateBulkSend202Response result = apiInstance.getBulkSend(id);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling BulkSendingApi#getBulkSend");
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
| **id** | **UUID**| The bulk send&#39;s ID. | |

### Return type

[**CreateBulkSend202Response**](CreateBulkSend202Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The bulk send. |  -  |
| **404** | No bulk send of this API client has this ID. |  -  |

## getBulkSendWithHttpInfo

> ApiResponse<CreateBulkSend202Response> getBulkSend getBulkSendWithHttpInfo(id)

Follow a bulk send

How far the bulk send is: documents made so far, rows that failed, and each document&#39;s status and signatories.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.BulkSendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        BulkSendingApi apiInstance = new BulkSendingApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The bulk send's ID.
        try {
            ApiResponse<CreateBulkSend202Response> response = apiInstance.getBulkSendWithHttpInfo(id);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling BulkSendingApi#getBulkSend");
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
| **id** | **UUID**| The bulk send&#39;s ID. | |

### Return type

ApiResponse<[**CreateBulkSend202Response**](CreateBulkSend202Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The bulk send. |  -  |
| **404** | No bulk send of this API client has this ID. |  -  |


## listBulkSendColumns

> List<ListBulkSendColumns200ResponseInner> listBulkSendColumns(templateId)

List the columns a template&#39;s bulk send needs

The columns of a bulk send file (or &#x60;rows&#x60;) for this template, in order: the recipient&#39;s name and email, each other open role&#39;s name and email, and one per field the sender fills in, each with what to put in it.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.BulkSendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        BulkSendingApi apiInstance = new BulkSendingApi(defaultClient);
        String templateId = "templateId_example"; // String | The template's ID.
        try {
            List<ListBulkSendColumns200ResponseInner> result = apiInstance.listBulkSendColumns(templateId);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling BulkSendingApi#listBulkSendColumns");
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
| **templateId** | **String**| The template&#39;s ID. | |

### Return type

[**List&lt;ListBulkSendColumns200ResponseInner&gt;**](ListBulkSendColumns200ResponseInner.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The columns. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

## listBulkSendColumnsWithHttpInfo

> ApiResponse<List<ListBulkSendColumns200ResponseInner>> listBulkSendColumns listBulkSendColumnsWithHttpInfo(templateId)

List the columns a template&#39;s bulk send needs

The columns of a bulk send file (or &#x60;rows&#x60;) for this template, in order: the recipient&#39;s name and email, each other open role&#39;s name and email, and one per field the sender fills in, each with what to put in it.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.BulkSendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        BulkSendingApi apiInstance = new BulkSendingApi(defaultClient);
        String templateId = "templateId_example"; // String | The template's ID.
        try {
            ApiResponse<List<ListBulkSendColumns200ResponseInner>> response = apiInstance.listBulkSendColumnsWithHttpInfo(templateId);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling BulkSendingApi#listBulkSendColumns");
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
| **templateId** | **String**| The template&#39;s ID. | |

### Return type

ApiResponse<[**List&lt;ListBulkSendColumns200ResponseInner&gt;**](ListBulkSendColumns200ResponseInner.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The columns. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

