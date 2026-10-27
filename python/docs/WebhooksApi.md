# signedly.WebhooksApi

All URIs are relative to *https://l0ads.signedly.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_webhook_endpoint**](WebhooksApi.md#create_webhook_endpoint) | **POST** /ap1/webhooks/ | Add a webhook endpoint
[**delete_webhook_endpoint**](WebhooksApi.md#delete_webhook_endpoint) | **DELETE** /ap1/webhooks/{id}/ | Delete a webhook endpoint
[**get_webhook_endpoint**](WebhooksApi.md#get_webhook_endpoint) | **GET** /ap1/webhooks/{id}/ | Get a webhook endpoint
[**list_webhook_deliveries**](WebhooksApi.md#list_webhook_deliveries) | **GET** /ap1/webhooks/{id}/deliveries/ | List an endpoint&#39;s deliveries
[**list_webhook_endpoints**](WebhooksApi.md#list_webhook_endpoints) | **GET** /ap1/webhooks/ | List your webhook endpoints
[**redeliver_webhook**](WebhooksApi.md#redeliver_webhook) | **POST** /ap1/webhooks/deliveries/{id}/redeliver/ | Send a delivery again
[**rotate_webhook_secret**](WebhooksApi.md#rotate_webhook_secret) | **POST** /ap1/webhooks/{id}/rotate-secret/ | Replace a webhook endpoint&#39;s secret
[**send_test_webhook**](WebhooksApi.md#send_test_webhook) | **POST** /ap1/webhooks/{id}/test/ | Send a test event
[**update_webhook_endpoint**](WebhooksApi.md#update_webhook_endpoint) | **PUT** /ap1/webhooks/{id}/ | Change or switch a webhook endpoint on or off


# **create_webhook_endpoint**
> WebhookEndpointWithSecret create_webhook_endpoint(data)

Add a webhook endpoint

Signedly posts each document event your organisation's documents have to this URL (see Webhooks in the introduction). The answer includes the endpoint's `secret`, shown only now: keep it to check each event's `Signedly-Signature`. Up to 10 endpoints per API client.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.create_webhook_endpoint_request import CreateWebhookEndpointRequest
from signedly.models.webhook_endpoint_with_secret import WebhookEndpointWithSecret
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: Bearer
configuration.api_key['Bearer'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Bearer'] = 'Bearer'

# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.WebhooksApi(api_client)
    data = signedly.CreateWebhookEndpointRequest() # CreateWebhookEndpointRequest | 

    try:
        # Add a webhook endpoint
        api_response = api_instance.create_webhook_endpoint(data)
        print("The response of WebhooksApi->create_webhook_endpoint:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksApi->create_webhook_endpoint: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**CreateWebhookEndpointRequest**](CreateWebhookEndpointRequest.md)|  | 

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
**201** | The endpoint, with its secret. |  -  |
**400** | The URL isn&#39;t https:// or isn&#39;t a public internet address, an event type is unknown, or the client already has 10 endpoints. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_webhook_endpoint**
> delete_webhook_endpoint(id)

Delete a webhook endpoint

Deletes the endpoint and its delivery history.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: Bearer
configuration.api_key['Bearer'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Bearer'] = 'Bearer'

# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.WebhooksApi(api_client)
    id = 'id_example' # str | The endpoint's ID.

    try:
        # Delete a webhook endpoint
        api_instance.delete_webhook_endpoint(id)
    except Exception as e:
        print("Exception when calling WebhooksApi->delete_webhook_endpoint: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The endpoint&#39;s ID. | 

### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Deleted. |  -  |
**404** | No endpoint of this API client has this ID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_webhook_endpoint**
> WebhookEndpoint get_webhook_endpoint(id)

Get a webhook endpoint

One of this API client's endpoints, without its secret.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.webhook_endpoint import WebhookEndpoint
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: Bearer
configuration.api_key['Bearer'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Bearer'] = 'Bearer'

# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.WebhooksApi(api_client)
    id = 'id_example' # str | The endpoint's ID.

    try:
        # Get a webhook endpoint
        api_response = api_instance.get_webhook_endpoint(id)
        print("The response of WebhooksApi->get_webhook_endpoint:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksApi->get_webhook_endpoint: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The endpoint&#39;s ID. | 

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
**200** | The endpoint. |  -  |
**404** | No endpoint of this API client has this ID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_webhook_deliveries**
> WebhookDeliveryPage list_webhook_deliveries(id, status=status, limit=limit, offset=offset)

List an endpoint's deliveries

The events sent (or being sent) to the endpoint, newest first, with how the last try went. Paged: see `limit` and `offset`.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.webhook_delivery_page import WebhookDeliveryPage
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: Bearer
configuration.api_key['Bearer'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Bearer'] = 'Bearer'

# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.WebhooksApi(api_client)
    id = 'id_example' # str | The endpoint's ID.
    status = 'status_example' # str | Only `pending`, `succeeded` or `failed` deliveries. (optional)
    limit = 56 # int | How many results to return (default 10). (optional)
    offset = 56 # int | How many results to skip. (optional)

    try:
        # List an endpoint's deliveries
        api_response = api_instance.list_webhook_deliveries(id, status=status, limit=limit, offset=offset)
        print("The response of WebhooksApi->list_webhook_deliveries:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksApi->list_webhook_deliveries: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The endpoint&#39;s ID. | 
 **status** | **str**| Only &#x60;pending&#x60;, &#x60;succeeded&#x60; or &#x60;failed&#x60; deliveries. | [optional] 
 **limit** | **int**| How many results to return (default 10). | [optional] 
 **offset** | **int**| How many results to skip. | [optional] 

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
**200** | A page of deliveries. |  -  |
**404** | No endpoint of this API client has this ID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_webhook_endpoints**
> List[WebhookEndpoint] list_webhook_endpoints()

List your webhook endpoints

This API client's webhook endpoints, oldest first. Their secrets aren't shown: rotate one to see a new secret.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.webhook_endpoint import WebhookEndpoint
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: Bearer
configuration.api_key['Bearer'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Bearer'] = 'Bearer'

# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.WebhooksApi(api_client)

    try:
        # List your webhook endpoints
        api_response = api_instance.list_webhook_endpoints()
        print("The response of WebhooksApi->list_webhook_endpoints:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksApi->list_webhook_endpoints: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[WebhookEndpoint]**](WebhookEndpoint.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The endpoints. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **redeliver_webhook**
> WebhookDelivery redeliver_webhook(id, data)

Send a delivery again

Sends the same event (same `id`) again now, with fresh retries: for one that failed, or one your system lost.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.webhook_delivery import WebhookDelivery
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: Bearer
configuration.api_key['Bearer'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Bearer'] = 'Bearer'

# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.WebhooksApi(api_client)
    id = 'id_example' # str | The delivery's ID.
    data = None # object | 

    try:
        # Send a delivery again
        api_response = api_instance.redeliver_webhook(id, data)
        print("The response of WebhooksApi->redeliver_webhook:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksApi->redeliver_webhook: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The delivery&#39;s ID. | 
 **data** | **object**|  | 

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
**202** | Queued. |  -  |
**404** | No delivery of this API client has this ID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rotate_webhook_secret**
> WebhookEndpointWithSecret rotate_webhook_secret(id, data)

Replace a webhook endpoint's secret

Makes a new secret and answers with it; events from now on are signed with it, and the old one stops working at once.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.webhook_endpoint_with_secret import WebhookEndpointWithSecret
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: Bearer
configuration.api_key['Bearer'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Bearer'] = 'Bearer'

# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.WebhooksApi(api_client)
    id = 'id_example' # str | The endpoint's ID.
    data = None # object | 

    try:
        # Replace a webhook endpoint's secret
        api_response = api_instance.rotate_webhook_secret(id, data)
        print("The response of WebhooksApi->rotate_webhook_secret:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksApi->rotate_webhook_secret: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The endpoint&#39;s ID. | 
 **data** | **object**|  | 

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
**200** | The endpoint, with its new secret. |  -  |
**404** | No endpoint of this API client has this ID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **send_test_webhook**
> WebhookDelivery send_test_webhook(id, data)

Send a test event

Posts a `webhook.test` event (no document) to the endpoint, signed like any other, to check that you receive and verify events. Its outcome shows in the endpoint's deliveries.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.webhook_delivery import WebhookDelivery
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: Bearer
configuration.api_key['Bearer'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Bearer'] = 'Bearer'

# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.WebhooksApi(api_client)
    id = 'id_example' # str | The endpoint's ID.
    data = None # object | 

    try:
        # Send a test event
        api_response = api_instance.send_test_webhook(id, data)
        print("The response of WebhooksApi->send_test_webhook:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksApi->send_test_webhook: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The endpoint&#39;s ID. | 
 **data** | **object**|  | 

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
**202** | Queued. |  -  |
**404** | No endpoint of this API client has this ID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_webhook_endpoint**
> WebhookEndpoint update_webhook_endpoint(id, data)

Change or switch a webhook endpoint on or off

Changes what you send: `url`, `events`, `description`, `is_active`. `is_active: true` switches an endpoint on again after Signedly switched it off (20 events in a row failed), and resets its failure count.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.update_webhook_endpoint_request import UpdateWebhookEndpointRequest
from signedly.models.webhook_endpoint import WebhookEndpoint
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: Bearer
configuration.api_key['Bearer'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['Bearer'] = 'Bearer'

# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.WebhooksApi(api_client)
    id = 'id_example' # str | The endpoint's ID.
    data = signedly.UpdateWebhookEndpointRequest() # UpdateWebhookEndpointRequest | 

    try:
        # Change or switch a webhook endpoint on or off
        api_response = api_instance.update_webhook_endpoint(id, data)
        print("The response of WebhooksApi->update_webhook_endpoint:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling WebhooksApi->update_webhook_endpoint: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The endpoint&#39;s ID. | 
 **data** | [**UpdateWebhookEndpointRequest**](UpdateWebhookEndpointRequest.md)|  | 

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
**200** | The endpoint. |  -  |
**400** | The URL isn&#39;t https:// or isn&#39;t a public internet address, an event type is unknown, or the client already has 10 endpoints. |  -  |
**404** | No endpoint of this API client has this ID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

