# signedly.APIRequestLogsApi

All URIs are relative to *https://l0ads.signedly.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**list_request_counts**](APIRequestLogsApi.md#list_request_counts) | **GET** /ap1/logs/hits/ | Count your API calls per path
[**list_request_logs**](APIRequestLogsApi.md#list_request_logs) | **GET** /ap1/logs/ | List your API calls


# **list_request_counts**
> RequestCountPage list_request_counts(method=method, path=path, limit=limit, offset=offset)

Count your API calls per path

How many calls this API client has made to each path and method, most recently used first. Paged: see `limit` and `offset`.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.request_count_page import RequestCountPage
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
    api_instance = signedly.APIRequestLogsApi(api_client)
    method = 'method_example' # str | Only this HTTP method. (optional)
    path = 'path_example' # str | Only paths that contain this, e.g. `/ap1/document/`. (optional)
    limit = 56 # int | How many results to return (default 10). (optional)
    offset = 56 # int | How many results to skip. (optional)

    try:
        # Count your API calls per path
        api_response = api_instance.list_request_counts(method=method, path=path, limit=limit, offset=offset)
        print("The response of APIRequestLogsApi->list_request_counts:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling APIRequestLogsApi->list_request_counts: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **method** | **str**| Only this HTTP method. | [optional] 
 **path** | **str**| Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;. | [optional] 
 **limit** | **int**| How many results to return (default 10). | [optional] 
 **offset** | **int**| How many results to skip. | [optional] 

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
**200** | A page of counts. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_request_logs**
> RequestLogPage list_request_logs(method=method, path=path, ip_address=ip_address, limit=limit, offset=offset)

List your API calls

This API client's calls, newest first, with their headers and bodies (credentials and tokens are redacted). Paged: see `limit` and `offset`.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.request_log_page import RequestLogPage
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
    api_instance = signedly.APIRequestLogsApi(api_client)
    method = 'method_example' # str | Only this HTTP method. (optional)
    path = 'path_example' # str | Only paths that contain this, e.g. `/ap1/document/`. (optional)
    ip_address = 'ip_address_example' # str | Only calls from this IP address. (optional)
    limit = 56 # int | How many results to return (default 10). (optional)
    offset = 56 # int | How many results to skip. (optional)

    try:
        # List your API calls
        api_response = api_instance.list_request_logs(method=method, path=path, ip_address=ip_address, limit=limit, offset=offset)
        print("The response of APIRequestLogsApi->list_request_logs:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling APIRequestLogsApi->list_request_logs: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **method** | **str**| Only this HTTP method. | [optional] 
 **path** | **str**| Only paths that contain this, e.g. &#x60;/ap1/document/&#x60;. | [optional] 
 **ip_address** | **str**| Only calls from this IP address. | [optional] 
 **limit** | **int**| How many results to return (default 10). | [optional] 
 **offset** | **int**| How many results to skip. | [optional] 

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
**200** | A page of calls. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

