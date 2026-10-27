# AuthenticationApi

All URIs are relative to *https://l0ads.signedly.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getAccessToken**](AuthenticationApi.md#getAccessToken) | **POST** /ap1/token/ | Get an access token |
| [**getAccessTokenWithHttpInfo**](AuthenticationApi.md#getAccessTokenWithHttpInfo) | **POST** /ap1/token/ | Get an access token |
| [**refreshAccessToken**](AuthenticationApi.md#refreshAccessToken) | **POST** /ap1/refreshtoken/ | Refresh the access token |
| [**refreshAccessTokenWithHttpInfo**](AuthenticationApi.md#refreshAccessTokenWithHttpInfo) | **POST** /ap1/refreshtoken/ | Refresh the access token |



## getAccessToken

> RefreshAccessToken200Response getAccessToken(data)

Get an access token

Exchanges your client ID and secret (Account &amp; Settings → API in the web app) for an access token, valid 2 hours, and a refresh token, valid 7 days. While both are still valid, the same pair is returned again; once either has expired, a new pair is made. Your test keys get a test token of their own (see Sandbox).

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.models.*;
import com.signedly.api.AuthenticationApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");

        AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
        GetAccessTokenRequest data = new GetAccessTokenRequest(); // GetAccessTokenRequest | 
        try {
            RefreshAccessToken200Response result = apiInstance.getAccessToken(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling AuthenticationApi#getAccessToken");
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
| **data** | [**GetAccessTokenRequest**](GetAccessTokenRequest.md)|  | |

### Return type

[**RefreshAccessToken200Response**](RefreshAccessToken200Response.md)


### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The tokens. |  -  |
| **400** | &#x60;client_id&#x60; or &#x60;client_secret&#x60; is missing. |  -  |
| **403** | No client has this ID and secret. |  -  |
| **429** | More than 60 calls a minute from this IP address. |  -  |

## getAccessTokenWithHttpInfo

> ApiResponse<RefreshAccessToken200Response> getAccessToken getAccessTokenWithHttpInfo(data)

Get an access token

Exchanges your client ID and secret (Account &amp; Settings → API in the web app) for an access token, valid 2 hours, and a refresh token, valid 7 days. While both are still valid, the same pair is returned again; once either has expired, a new pair is made. Your test keys get a test token of their own (see Sandbox).

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.models.*;
import com.signedly.api.AuthenticationApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");

        AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
        GetAccessTokenRequest data = new GetAccessTokenRequest(); // GetAccessTokenRequest | 
        try {
            ApiResponse<RefreshAccessToken200Response> response = apiInstance.getAccessTokenWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling AuthenticationApi#getAccessToken");
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
| **data** | [**GetAccessTokenRequest**](GetAccessTokenRequest.md)|  | |

### Return type

ApiResponse<[**RefreshAccessToken200Response**](RefreshAccessToken200Response.md)>


### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The tokens. |  -  |
| **400** | &#x60;client_id&#x60; or &#x60;client_secret&#x60; is missing. |  -  |
| **403** | No client has this ID and secret. |  -  |
| **429** | More than 60 calls a minute from this IP address. |  -  |


## refreshAccessToken

> RefreshAccessToken200Response refreshAccessToken(data)

Refresh the access token

Makes a new access token, valid 2 hours, with the refresh token. The refresh token itself isn&#39;t renewed: when it expires (7 days after /ap1/token/ made it), call /ap1/token/ again.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.models.*;
import com.signedly.api.AuthenticationApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");

        AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
        RefreshAccessTokenRequest data = new RefreshAccessTokenRequest(); // RefreshAccessTokenRequest | 
        try {
            RefreshAccessToken200Response result = apiInstance.refreshAccessToken(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling AuthenticationApi#refreshAccessToken");
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
| **data** | [**RefreshAccessTokenRequest**](RefreshAccessTokenRequest.md)|  | |

### Return type

[**RefreshAccessToken200Response**](RefreshAccessToken200Response.md)


### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The new access token, with the same refresh token. |  -  |
| **400** | &#x60;refresh_token&#x60; is missing. |  -  |
| **403** | The refresh token is unknown (&#x60;Token not found&#x60;) or has expired (&#x60;Refresh Token expired&#x60;). |  -  |
| **429** | More than 60 calls a minute from this IP address. |  -  |

## refreshAccessTokenWithHttpInfo

> ApiResponse<RefreshAccessToken200Response> refreshAccessToken refreshAccessTokenWithHttpInfo(data)

Refresh the access token

Makes a new access token, valid 2 hours, with the refresh token. The refresh token itself isn&#39;t renewed: when it expires (7 days after /ap1/token/ made it), call /ap1/token/ again.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.models.*;
import com.signedly.api.AuthenticationApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");

        AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
        RefreshAccessTokenRequest data = new RefreshAccessTokenRequest(); // RefreshAccessTokenRequest | 
        try {
            ApiResponse<RefreshAccessToken200Response> response = apiInstance.refreshAccessTokenWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling AuthenticationApi#refreshAccessToken");
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
| **data** | [**RefreshAccessTokenRequest**](RefreshAccessTokenRequest.md)|  | |

### Return type

ApiResponse<[**RefreshAccessToken200Response**](RefreshAccessToken200Response.md)>


### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The new access token, with the same refresh token. |  -  |
| **400** | &#x60;refresh_token&#x60; is missing. |  -  |
| **403** | The refresh token is unknown (&#x60;Token not found&#x60;) or has expired (&#x60;Refresh Token expired&#x60;). |  -  |
| **429** | More than 60 calls a minute from this IP address. |  -  |

