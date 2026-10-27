# ApiRequestLogsApi

All URIs are relative to *https://l0ads.signedly.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**listRequestCounts**](ApiRequestLogsApi.md#listRequestCounts) | **GET** /ap1/logs/hits/ | Count your API calls per path |
| [**listRequestCountsWithHttpInfo**](ApiRequestLogsApi.md#listRequestCountsWithHttpInfo) | **GET** /ap1/logs/hits/ | Count your API calls per path |
| [**listRequestLogs**](ApiRequestLogsApi.md#listRequestLogs) | **GET** /ap1/logs/ | List your API calls |
| [**listRequestLogsWithHttpInfo**](ApiRequestLogsApi.md#listRequestLogsWithHttpInfo) | **GET** /ap1/logs/ | List your API calls |



## listRequestCounts

> RequestCountPage listRequestCounts(method, path, limit, offset)

Count your API calls per path

How many calls this API client has made to each path and method, most recently used first. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.ApiRequestLogsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        ApiRequestLogsApi apiInstance = new ApiRequestLogsApi(defaultClient);
        String method = "GET"; // String | Only this HTTP method.
        String path = "path_example"; // String | Only paths that contain this, e.g. `/ap1/document/`.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            RequestCountPage result = apiInstance.listRequestCounts(method, path, limit, offset);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling ApiRequestLogsApi#listRequestCounts");
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
| **method** | **String**| Only this HTTP method. | [optional] [enum: GET, POST, PUT, DELETE] |
| **path** | **String**| Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;. | [optional] |
| **limit** | **Integer**| How many results to return (default 10). | [optional] |
| **offset** | **Integer**| How many results to skip. | [optional] |

### Return type

[**RequestCountPage**](RequestCountPage.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A page of counts. |  -  |

## listRequestCountsWithHttpInfo

> ApiResponse<RequestCountPage> listRequestCounts listRequestCountsWithHttpInfo(method, path, limit, offset)

Count your API calls per path

How many calls this API client has made to each path and method, most recently used first. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.ApiRequestLogsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        ApiRequestLogsApi apiInstance = new ApiRequestLogsApi(defaultClient);
        String method = "GET"; // String | Only this HTTP method.
        String path = "path_example"; // String | Only paths that contain this, e.g. `/ap1/document/`.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            ApiResponse<RequestCountPage> response = apiInstance.listRequestCountsWithHttpInfo(method, path, limit, offset);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling ApiRequestLogsApi#listRequestCounts");
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
| **method** | **String**| Only this HTTP method. | [optional] [enum: GET, POST, PUT, DELETE] |
| **path** | **String**| Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;. | [optional] |
| **limit** | **Integer**| How many results to return (default 10). | [optional] |
| **offset** | **Integer**| How many results to skip. | [optional] |

### Return type

ApiResponse<[**RequestCountPage**](RequestCountPage.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A page of counts. |  -  |


## listRequestLogs

> RequestLogPage listRequestLogs(method, path, ipAddress, limit, offset)

List your API calls

This API client&#39;s calls, newest first, with their headers and bodies (credentials and tokens are redacted). Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.ApiRequestLogsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        ApiRequestLogsApi apiInstance = new ApiRequestLogsApi(defaultClient);
        String method = "GET"; // String | Only this HTTP method.
        String path = "path_example"; // String | Only paths that contain this, e.g. `/ap1/document/`.
        String ipAddress = "ipAddress_example"; // String | Only calls from this IP address.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            RequestLogPage result = apiInstance.listRequestLogs(method, path, ipAddress, limit, offset);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling ApiRequestLogsApi#listRequestLogs");
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
| **method** | **String**| Only this HTTP method. | [optional] [enum: GET, POST, PUT, DELETE] |
| **path** | **String**| Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;. | [optional] |
| **ipAddress** | **String**| Only calls from this IP address. | [optional] |
| **limit** | **Integer**| How many results to return (default 10). | [optional] |
| **offset** | **Integer**| How many results to skip. | [optional] |

### Return type

[**RequestLogPage**](RequestLogPage.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A page of calls. |  -  |

## listRequestLogsWithHttpInfo

> ApiResponse<RequestLogPage> listRequestLogs listRequestLogsWithHttpInfo(method, path, ipAddress, limit, offset)

List your API calls

This API client&#39;s calls, newest first, with their headers and bodies (credentials and tokens are redacted). Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.ApiRequestLogsApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        ApiRequestLogsApi apiInstance = new ApiRequestLogsApi(defaultClient);
        String method = "GET"; // String | Only this HTTP method.
        String path = "path_example"; // String | Only paths that contain this, e.g. `/ap1/document/`.
        String ipAddress = "ipAddress_example"; // String | Only calls from this IP address.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            ApiResponse<RequestLogPage> response = apiInstance.listRequestLogsWithHttpInfo(method, path, ipAddress, limit, offset);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling ApiRequestLogsApi#listRequestLogs");
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
| **method** | **String**| Only this HTTP method. | [optional] [enum: GET, POST, PUT, DELETE] |
| **path** | **String**| Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;. | [optional] |
| **ipAddress** | **String**| Only calls from this IP address. | [optional] |
| **limit** | **Integer**| How many results to return (default 10). | [optional] |
| **offset** | **Integer**| How many results to skip. | [optional] |

### Return type

ApiResponse<[**RequestLogPage**](RequestLogPage.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A page of calls. |  -  |

