# WebhooksApi

All URIs are relative to *https://l0ads.signedly.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createWebhookEndpoint**](WebhooksApi.md#createWebhookEndpoint) | **POST** /ap1/webhooks/ | Add a webhook endpoint |
| [**createWebhookEndpointWithHttpInfo**](WebhooksApi.md#createWebhookEndpointWithHttpInfo) | **POST** /ap1/webhooks/ | Add a webhook endpoint |
| [**deleteWebhookEndpoint**](WebhooksApi.md#deleteWebhookEndpoint) | **DELETE** /ap1/webhooks/{id}/ | Delete a webhook endpoint |
| [**deleteWebhookEndpointWithHttpInfo**](WebhooksApi.md#deleteWebhookEndpointWithHttpInfo) | **DELETE** /ap1/webhooks/{id}/ | Delete a webhook endpoint |
| [**getWebhookEndpoint**](WebhooksApi.md#getWebhookEndpoint) | **GET** /ap1/webhooks/{id}/ | Get a webhook endpoint |
| [**getWebhookEndpointWithHttpInfo**](WebhooksApi.md#getWebhookEndpointWithHttpInfo) | **GET** /ap1/webhooks/{id}/ | Get a webhook endpoint |
| [**listWebhookDeliveries**](WebhooksApi.md#listWebhookDeliveries) | **GET** /ap1/webhooks/{id}/deliveries/ | List an endpoint&#39;s deliveries |
| [**listWebhookDeliveriesWithHttpInfo**](WebhooksApi.md#listWebhookDeliveriesWithHttpInfo) | **GET** /ap1/webhooks/{id}/deliveries/ | List an endpoint&#39;s deliveries |
| [**listWebhookEndpoints**](WebhooksApi.md#listWebhookEndpoints) | **GET** /ap1/webhooks/ | List your webhook endpoints |
| [**listWebhookEndpointsWithHttpInfo**](WebhooksApi.md#listWebhookEndpointsWithHttpInfo) | **GET** /ap1/webhooks/ | List your webhook endpoints |
| [**redeliverWebhook**](WebhooksApi.md#redeliverWebhook) | **POST** /ap1/webhooks/deliveries/{id}/redeliver/ | Send a delivery again |
| [**redeliverWebhookWithHttpInfo**](WebhooksApi.md#redeliverWebhookWithHttpInfo) | **POST** /ap1/webhooks/deliveries/{id}/redeliver/ | Send a delivery again |
| [**rotateWebhookSecret**](WebhooksApi.md#rotateWebhookSecret) | **POST** /ap1/webhooks/{id}/rotate-secret/ | Replace a webhook endpoint&#39;s secret |
| [**rotateWebhookSecretWithHttpInfo**](WebhooksApi.md#rotateWebhookSecretWithHttpInfo) | **POST** /ap1/webhooks/{id}/rotate-secret/ | Replace a webhook endpoint&#39;s secret |
| [**sendTestWebhook**](WebhooksApi.md#sendTestWebhook) | **POST** /ap1/webhooks/{id}/test/ | Send a test event |
| [**sendTestWebhookWithHttpInfo**](WebhooksApi.md#sendTestWebhookWithHttpInfo) | **POST** /ap1/webhooks/{id}/test/ | Send a test event |
| [**updateWebhookEndpoint**](WebhooksApi.md#updateWebhookEndpoint) | **PUT** /ap1/webhooks/{id}/ | Change or switch a webhook endpoint on or off |
| [**updateWebhookEndpointWithHttpInfo**](WebhooksApi.md#updateWebhookEndpointWithHttpInfo) | **PUT** /ap1/webhooks/{id}/ | Change or switch a webhook endpoint on or off |



## createWebhookEndpoint

> WebhookEndpointWithSecret createWebhookEndpoint(data)

Add a webhook endpoint

Signedly posts each document event your organisation&#39;s documents have to this URL (see Webhooks in the introduction). The answer includes the endpoint&#39;s &#x60;secret&#x60;, shown only now: keep it to check each event&#39;s &#x60;Signedly-Signature&#x60;. Up to 10 endpoints per API client.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        CreateWebhookEndpointRequest data = new CreateWebhookEndpointRequest(); // CreateWebhookEndpointRequest | 
        try {
            WebhookEndpointWithSecret result = apiInstance.createWebhookEndpoint(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#createWebhookEndpoint");
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
| **data** | [**CreateWebhookEndpointRequest**](CreateWebhookEndpointRequest.md)|  | |

### Return type

[**WebhookEndpointWithSecret**](WebhookEndpointWithSecret.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The endpoint, with its secret. |  -  |
| **400** | The URL isn&#39;t https:// or isn&#39;t a public internet address, an event type is unknown, or the client already has 10 endpoints. |  -  |

## createWebhookEndpointWithHttpInfo

> ApiResponse<WebhookEndpointWithSecret> createWebhookEndpoint createWebhookEndpointWithHttpInfo(data)

Add a webhook endpoint

Signedly posts each document event your organisation&#39;s documents have to this URL (see Webhooks in the introduction). The answer includes the endpoint&#39;s &#x60;secret&#x60;, shown only now: keep it to check each event&#39;s &#x60;Signedly-Signature&#x60;. Up to 10 endpoints per API client.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        CreateWebhookEndpointRequest data = new CreateWebhookEndpointRequest(); // CreateWebhookEndpointRequest | 
        try {
            ApiResponse<WebhookEndpointWithSecret> response = apiInstance.createWebhookEndpointWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#createWebhookEndpoint");
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
| **data** | [**CreateWebhookEndpointRequest**](CreateWebhookEndpointRequest.md)|  | |

### Return type

ApiResponse<[**WebhookEndpointWithSecret**](WebhookEndpointWithSecret.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The endpoint, with its secret. |  -  |
| **400** | The URL isn&#39;t https:// or isn&#39;t a public internet address, an event type is unknown, or the client already has 10 endpoints. |  -  |


## deleteWebhookEndpoint

> void deleteWebhookEndpoint(id)

Delete a webhook endpoint

Deletes the endpoint and its delivery history.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        try {
            apiInstance.deleteWebhookEndpoint(id);
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#deleteWebhookEndpoint");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |

### Return type


null (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Deleted. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |

## deleteWebhookEndpointWithHttpInfo

> ApiResponse<Void> deleteWebhookEndpoint deleteWebhookEndpointWithHttpInfo(id)

Delete a webhook endpoint

Deletes the endpoint and its delivery history.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        try {
            ApiResponse<Void> response = apiInstance.deleteWebhookEndpointWithHttpInfo(id);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#deleteWebhookEndpoint");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |

### Return type


ApiResponse<Void>

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Deleted. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |


## getWebhookEndpoint

> WebhookEndpoint getWebhookEndpoint(id)

Get a webhook endpoint

One of this API client&#39;s endpoints, without its secret.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        try {
            WebhookEndpoint result = apiInstance.getWebhookEndpoint(id);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#getWebhookEndpoint");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |

### Return type

[**WebhookEndpoint**](WebhookEndpoint.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The endpoint. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |

## getWebhookEndpointWithHttpInfo

> ApiResponse<WebhookEndpoint> getWebhookEndpoint getWebhookEndpointWithHttpInfo(id)

Get a webhook endpoint

One of this API client&#39;s endpoints, without its secret.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        try {
            ApiResponse<WebhookEndpoint> response = apiInstance.getWebhookEndpointWithHttpInfo(id);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#getWebhookEndpoint");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |

### Return type

ApiResponse<[**WebhookEndpoint**](WebhookEndpoint.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The endpoint. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |


## listWebhookDeliveries

> WebhookDeliveryPage listWebhookDeliveries(id, status, limit, offset)

List an endpoint&#39;s deliveries

The events sent (or being sent) to the endpoint, newest first, with how the last try went. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        String status = "status_example"; // String | Only `pending`, `succeeded` or `failed` deliveries.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            WebhookDeliveryPage result = apiInstance.listWebhookDeliveries(id, status, limit, offset);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#listWebhookDeliveries");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |
| **status** | **String**| Only &#x60;pending&#x60;, &#x60;succeeded&#x60; or &#x60;failed&#x60; deliveries. | [optional] |
| **limit** | **Integer**| How many results to return (default 10). | [optional] |
| **offset** | **Integer**| How many results to skip. | [optional] |

### Return type

[**WebhookDeliveryPage**](WebhookDeliveryPage.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A page of deliveries. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |

## listWebhookDeliveriesWithHttpInfo

> ApiResponse<WebhookDeliveryPage> listWebhookDeliveries listWebhookDeliveriesWithHttpInfo(id, status, limit, offset)

List an endpoint&#39;s deliveries

The events sent (or being sent) to the endpoint, newest first, with how the last try went. Paged: see &#x60;limit&#x60; and &#x60;offset&#x60;.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        String status = "status_example"; // String | Only `pending`, `succeeded` or `failed` deliveries.
        Integer limit = 56; // Integer | How many results to return (default 10).
        Integer offset = 56; // Integer | How many results to skip.
        try {
            ApiResponse<WebhookDeliveryPage> response = apiInstance.listWebhookDeliveriesWithHttpInfo(id, status, limit, offset);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#listWebhookDeliveries");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |
| **status** | **String**| Only &#x60;pending&#x60;, &#x60;succeeded&#x60; or &#x60;failed&#x60; deliveries. | [optional] |
| **limit** | **Integer**| How many results to return (default 10). | [optional] |
| **offset** | **Integer**| How many results to skip. | [optional] |

### Return type

ApiResponse<[**WebhookDeliveryPage**](WebhookDeliveryPage.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A page of deliveries. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |


## listWebhookEndpoints

> List<WebhookEndpoint> listWebhookEndpoints()

List your webhook endpoints

This API client&#39;s webhook endpoints, oldest first. Their secrets aren&#39;t shown: rotate one to see a new secret.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        try {
            List<WebhookEndpoint> result = apiInstance.listWebhookEndpoints();
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#listWebhookEndpoints");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Reason: " + e.getResponseBody());
            System.err.println("Response headers: " + e.getResponseHeaders());
            e.printStackTrace();
        }
    }
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**List&lt;WebhookEndpoint&gt;**](WebhookEndpoint.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The endpoints. |  -  |

## listWebhookEndpointsWithHttpInfo

> ApiResponse<List<WebhookEndpoint>> listWebhookEndpoints listWebhookEndpointsWithHttpInfo()

List your webhook endpoints

This API client&#39;s webhook endpoints, oldest first. Their secrets aren&#39;t shown: rotate one to see a new secret.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        try {
            ApiResponse<List<WebhookEndpoint>> response = apiInstance.listWebhookEndpointsWithHttpInfo();
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#listWebhookEndpoints");
            System.err.println("Status code: " + e.getCode());
            System.err.println("Response headers: " + e.getResponseHeaders());
            System.err.println("Reason: " + e.getResponseBody());
            e.printStackTrace();
        }
    }
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

ApiResponse<[**List&lt;WebhookEndpoint&gt;**](WebhookEndpoint.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The endpoints. |  -  |


## redeliverWebhook

> WebhookDelivery redeliverWebhook(id, data)

Send a delivery again

Sends the same event (same &#x60;id&#x60;) again now, with fresh retries: for one that failed, or one your system lost.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The delivery's ID.
        Object data = null; // Object | 
        try {
            WebhookDelivery result = apiInstance.redeliverWebhook(id, data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#redeliverWebhook");
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
| **id** | **UUID**| The delivery&#39;s ID. | |
| **data** | **Object**|  | |

### Return type

[**WebhookDelivery**](WebhookDelivery.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Queued. |  -  |
| **404** | No delivery of this API client has this ID. |  -  |

## redeliverWebhookWithHttpInfo

> ApiResponse<WebhookDelivery> redeliverWebhook redeliverWebhookWithHttpInfo(id, data)

Send a delivery again

Sends the same event (same &#x60;id&#x60;) again now, with fresh retries: for one that failed, or one your system lost.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The delivery's ID.
        Object data = null; // Object | 
        try {
            ApiResponse<WebhookDelivery> response = apiInstance.redeliverWebhookWithHttpInfo(id, data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#redeliverWebhook");
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
| **id** | **UUID**| The delivery&#39;s ID. | |
| **data** | **Object**|  | |

### Return type

ApiResponse<[**WebhookDelivery**](WebhookDelivery.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Queued. |  -  |
| **404** | No delivery of this API client has this ID. |  -  |


## rotateWebhookSecret

> WebhookEndpointWithSecret rotateWebhookSecret(id, data)

Replace a webhook endpoint&#39;s secret

Makes a new secret and answers with it; events from now on are signed with it, and the old one stops working at once.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        Object data = null; // Object | 
        try {
            WebhookEndpointWithSecret result = apiInstance.rotateWebhookSecret(id, data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#rotateWebhookSecret");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |
| **data** | **Object**|  | |

### Return type

[**WebhookEndpointWithSecret**](WebhookEndpointWithSecret.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The endpoint, with its new secret. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |

## rotateWebhookSecretWithHttpInfo

> ApiResponse<WebhookEndpointWithSecret> rotateWebhookSecret rotateWebhookSecretWithHttpInfo(id, data)

Replace a webhook endpoint&#39;s secret

Makes a new secret and answers with it; events from now on are signed with it, and the old one stops working at once.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        Object data = null; // Object | 
        try {
            ApiResponse<WebhookEndpointWithSecret> response = apiInstance.rotateWebhookSecretWithHttpInfo(id, data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#rotateWebhookSecret");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |
| **data** | **Object**|  | |

### Return type

ApiResponse<[**WebhookEndpointWithSecret**](WebhookEndpointWithSecret.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The endpoint, with its new secret. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |


## sendTestWebhook

> WebhookDelivery sendTestWebhook(id, data)

Send a test event

Posts a &#x60;webhook.test&#x60; event (no document) to the endpoint, signed like any other, to check that you receive and verify events. Its outcome shows in the endpoint&#39;s deliveries.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        Object data = null; // Object | 
        try {
            WebhookDelivery result = apiInstance.sendTestWebhook(id, data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#sendTestWebhook");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |
| **data** | **Object**|  | |

### Return type

[**WebhookDelivery**](WebhookDelivery.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Queued. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |

## sendTestWebhookWithHttpInfo

> ApiResponse<WebhookDelivery> sendTestWebhook sendTestWebhookWithHttpInfo(id, data)

Send a test event

Posts a &#x60;webhook.test&#x60; event (no document) to the endpoint, signed like any other, to check that you receive and verify events. Its outcome shows in the endpoint&#39;s deliveries.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        Object data = null; // Object | 
        try {
            ApiResponse<WebhookDelivery> response = apiInstance.sendTestWebhookWithHttpInfo(id, data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#sendTestWebhook");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |
| **data** | **Object**|  | |

### Return type

ApiResponse<[**WebhookDelivery**](WebhookDelivery.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** | Queued. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |


## updateWebhookEndpoint

> WebhookEndpoint updateWebhookEndpoint(id, data)

Change or switch a webhook endpoint on or off

Changes what you send: &#x60;url&#x60;, &#x60;events&#x60;, &#x60;description&#x60;, &#x60;is_active&#x60;. &#x60;is_active: true&#x60; switches an endpoint on again after Signedly switched it off (20 events in a row failed), and resets its failure count.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        UpdateWebhookEndpointRequest data = new UpdateWebhookEndpointRequest(); // UpdateWebhookEndpointRequest | 
        try {
            WebhookEndpoint result = apiInstance.updateWebhookEndpoint(id, data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#updateWebhookEndpoint");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |
| **data** | [**UpdateWebhookEndpointRequest**](UpdateWebhookEndpointRequest.md)|  | |

### Return type

[**WebhookEndpoint**](WebhookEndpoint.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The endpoint. |  -  |
| **400** | The URL isn&#39;t https:// or isn&#39;t a public internet address, an event type is unknown, or the client already has 10 endpoints. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |

## updateWebhookEndpointWithHttpInfo

> ApiResponse<WebhookEndpoint> updateWebhookEndpoint updateWebhookEndpointWithHttpInfo(id, data)

Change or switch a webhook endpoint on or off

Changes what you send: &#x60;url&#x60;, &#x60;events&#x60;, &#x60;description&#x60;, &#x60;is_active&#x60;. &#x60;is_active: true&#x60; switches an endpoint on again after Signedly switched it off (20 events in a row failed), and resets its failure count.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.WebhooksApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        WebhooksApi apiInstance = new WebhooksApi(defaultClient);
        UUID id = UUID.randomUUID(); // UUID | The endpoint's ID.
        UpdateWebhookEndpointRequest data = new UpdateWebhookEndpointRequest(); // UpdateWebhookEndpointRequest | 
        try {
            ApiResponse<WebhookEndpoint> response = apiInstance.updateWebhookEndpointWithHttpInfo(id, data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling WebhooksApi#updateWebhookEndpoint");
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
| **id** | **UUID**| The endpoint&#39;s ID. | |
| **data** | [**UpdateWebhookEndpointRequest**](UpdateWebhookEndpointRequest.md)|  | |

### Return type

ApiResponse<[**WebhookEndpoint**](WebhookEndpoint.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The endpoint. |  -  |
| **400** | The URL isn&#39;t https:// or isn&#39;t a public internet address, an event type is unknown, or the client already has 10 endpoints. |  -  |
| **404** | No endpoint of this API client has this ID. |  -  |

