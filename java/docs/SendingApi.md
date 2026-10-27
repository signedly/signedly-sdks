# SendingApi

All URIs are relative to *https://l0ads.signedly.com*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**fillAndSendDocument**](SendingApi.md#fillAndSendDocument) | **POST** /ap1/document/update_and_send/ | Fill in fields, add a signatory and send, in one call |
| [**fillAndSendDocumentWithHttpInfo**](SendingApi.md#fillAndSendDocumentWithHttpInfo) | **POST** /ap1/document/update_and_send/ | Fill in fields, add a signatory and send, in one call |
| [**sendDocument**](SendingApi.md#sendDocument) | **POST** /ap1/document/send/ | Send a document for signing by email |
| [**sendDocumentWithHttpInfo**](SendingApi.md#sendDocumentWithHttpInfo) | **POST** /ap1/document/send/ | Send a document for signing by email |
| [**sendDocumentByLink**](SendingApi.md#sendDocumentByLink) | **POST** /ap1/document/send_url/ | Send a document and get the signing link |
| [**sendDocumentByLinkWithHttpInfo**](SendingApi.md#sendDocumentByLinkWithHttpInfo) | **POST** /ap1/document/send_url/ | Send a document and get the signing link |



## fillAndSendDocument

> SendDocument200Response fillAndSendDocument(data)

Fill in fields, add a signatory and send, in one call

Sets the values of the document&#39;s fields, adds one signatory (&#x60;name&#x60;, &#x60;email&#x60;), and emails the signatories their signing links, like POST /ap1/document/send/. All or nothing: if anything is refused, nothing changes. A retry after a timed-out call that worked answers 400 (already sent); treat that as success. A template can&#39;t be sent, nor a document that has been sent already, and every field must sit on its page.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SendingApi apiInstance = new SendingApi(defaultClient);
        FillAndSendDocumentRequest data = new FillAndSendDocumentRequest(); // FillAndSendDocumentRequest | 
        try {
            SendDocument200Response result = apiInstance.fillAndSendDocument(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SendingApi#fillAndSendDocument");
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
| **data** | [**FillAndSendDocumentRequest**](FillAndSendDocumentRequest.md)|  | |

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
| **200** | Sent; the document is now 4 Sent. |  -  |
| **400** | Nothing was changed: the document is already sent (&#x60;Document has already been sent&#x60;), a field was refused (&#x60;errors&#x60;, one entry per field), or a value isn&#39;t valid. |  -  |
| **403** | &#x60;expiry_date&#x60; isn&#39;t in the future. Nothing was sent. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

## fillAndSendDocumentWithHttpInfo

> ApiResponse<SendDocument200Response> fillAndSendDocument fillAndSendDocumentWithHttpInfo(data)

Fill in fields, add a signatory and send, in one call

Sets the values of the document&#39;s fields, adds one signatory (&#x60;name&#x60;, &#x60;email&#x60;), and emails the signatories their signing links, like POST /ap1/document/send/. All or nothing: if anything is refused, nothing changes. A retry after a timed-out call that worked answers 400 (already sent); treat that as success. A template can&#39;t be sent, nor a document that has been sent already, and every field must sit on its page.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SendingApi apiInstance = new SendingApi(defaultClient);
        FillAndSendDocumentRequest data = new FillAndSendDocumentRequest(); // FillAndSendDocumentRequest | 
        try {
            ApiResponse<SendDocument200Response> response = apiInstance.fillAndSendDocumentWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SendingApi#fillAndSendDocument");
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
| **data** | [**FillAndSendDocumentRequest**](FillAndSendDocumentRequest.md)|  | |

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
| **200** | Sent; the document is now 4 Sent. |  -  |
| **400** | Nothing was changed: the document is already sent (&#x60;Document has already been sent&#x60;), a field was refused (&#x60;errors&#x60;, one entry per field), or a value isn&#39;t valid. |  -  |
| **403** | &#x60;expiry_date&#x60; isn&#39;t in the future. Nothing was sent. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |


## sendDocument

> SendDocument200Response sendDocument(data)

Send a document for signing by email

Emails each signatory a signing link with your subject and message (with ordered signing, only the first; each next one is emailed in turn). The document needs at least one field, and every signatory at least one field. A template can&#39;t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document&#39;s status before sending again.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SendingApi apiInstance = new SendingApi(defaultClient);
        SendDocumentRequest data = new SendDocumentRequest(); // SendDocumentRequest | 
        try {
            SendDocument200Response result = apiInstance.sendDocument(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SendingApi#sendDocument");
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
| **data** | [**SendDocumentRequest**](SendDocumentRequest.md)|  | |

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
| **200** | Sent; the document is now 4 Sent. |  -  |
| **400** | The document can&#39;t be sent (see above). Nothing was sent. |  -  |
| **403** | &#x60;expiry_date&#x60; isn&#39;t in the future. Nothing was sent. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

## sendDocumentWithHttpInfo

> ApiResponse<SendDocument200Response> sendDocument sendDocumentWithHttpInfo(data)

Send a document for signing by email

Emails each signatory a signing link with your subject and message (with ordered signing, only the first; each next one is emailed in turn). The document needs at least one field, and every signatory at least one field. A template can&#39;t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document&#39;s status before sending again.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SendingApi apiInstance = new SendingApi(defaultClient);
        SendDocumentRequest data = new SendDocumentRequest(); // SendDocumentRequest | 
        try {
            ApiResponse<SendDocument200Response> response = apiInstance.sendDocumentWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SendingApi#sendDocument");
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
| **data** | [**SendDocumentRequest**](SendDocumentRequest.md)|  | |

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
| **200** | Sent; the document is now 4 Sent. |  -  |
| **400** | The document can&#39;t be sent (see above). Nothing was sent. |  -  |
| **403** | &#x60;expiry_date&#x60; isn&#39;t in the future. Nothing was sent. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |


## sendDocumentByLink

> SendDocumentByLink200Response sendDocumentByLink(data)

Send a document and get the signing link

Marks the document sent without emailing anyone, and returns its signatory&#39;s signing link to show or send yourself. Meant for a document with one signatory. A template can&#39;t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document&#39;s status before sending again.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SendingApi apiInstance = new SendingApi(defaultClient);
        SendDocumentByLinkRequest data = new SendDocumentByLinkRequest(); // SendDocumentByLinkRequest | 
        try {
            SendDocumentByLink200Response result = apiInstance.sendDocumentByLink(data);
            System.out.println(result);
        } catch (ApiException e) {
            System.err.println("Exception when calling SendingApi#sendDocumentByLink");
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
| **data** | [**SendDocumentByLinkRequest**](SendDocumentByLinkRequest.md)|  | |

### Return type

[**SendDocumentByLink200Response**](SendDocumentByLink200Response.md)


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Sent; the document is now 4 Sent. |  -  |
| **400** | The document can&#39;t be sent (see above). Nothing was sent. |  -  |
| **403** | &#x60;expiry_date&#x60; isn&#39;t in the future. Nothing was sent. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

## sendDocumentByLinkWithHttpInfo

> ApiResponse<SendDocumentByLink200Response> sendDocumentByLink sendDocumentByLinkWithHttpInfo(data)

Send a document and get the signing link

Marks the document sent without emailing anyone, and returns its signatory&#39;s signing link to show or send yourself. Meant for a document with one signatory. A template can&#39;t be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document&#39;s status before sending again.

### Example

```java
// Import classes:
import com.signedly.client.ApiClient;
import com.signedly.client.ApiException;
import com.signedly.client.ApiResponse;
import com.signedly.client.Configuration;
import com.signedly.client.auth.*;
import com.signedly.client.models.*;
import com.signedly.api.SendingApi;

public class Example {
    public static void main(String[] args) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();
        defaultClient.setBasePath("https://l0ads.signedly.com");
        
        // Configure API key authorization: Bearer
        ApiKeyAuth Bearer = (ApiKeyAuth) defaultClient.getAuthentication("Bearer");
        Bearer.setApiKey("YOUR API KEY");
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //Bearer.setApiKeyPrefix("Token");

        SendingApi apiInstance = new SendingApi(defaultClient);
        SendDocumentByLinkRequest data = new SendDocumentByLinkRequest(); // SendDocumentByLinkRequest | 
        try {
            ApiResponse<SendDocumentByLink200Response> response = apiInstance.sendDocumentByLinkWithHttpInfo(data);
            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Response headers: " + response.getHeaders());
            System.out.println("Response body: " + response.getData());
        } catch (ApiException e) {
            System.err.println("Exception when calling SendingApi#sendDocumentByLink");
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
| **data** | [**SendDocumentByLinkRequest**](SendDocumentByLinkRequest.md)|  | |

### Return type

ApiResponse<[**SendDocumentByLink200Response**](SendDocumentByLink200Response.md)>


### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Sent; the document is now 4 Sent. |  -  |
| **400** | The document can&#39;t be sent (see above). Nothing was sent. |  -  |
| **403** | &#x60;expiry_date&#x60; isn&#39;t in the future. Nothing was sent. |  -  |
| **404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

