# signedly.BulkSendingApi

All URIs are relative to *https://l0ads.signedly.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_bulk_send**](BulkSendingApi.md#create_bulk_send) | **POST** /ap1/bulk-sends/ | Send a template to many people
[**get_bulk_send**](BulkSendingApi.md#get_bulk_send) | **GET** /ap1/bulk-sends/{id}/ | Follow a bulk send
[**list_bulk_send_columns**](BulkSendingApi.md#list_bulk_send_columns) | **GET** /ap1/bulk-sends/columns/ | List the columns a template&#39;s bulk send needs


# **create_bulk_send**
> CreateBulkSend202Response create_bulk_send(data)

Send a template to many people

Makes and sends one document per row from one of your templates, as the web app's Bulk Sending does: each row fills the template's roles and fields. Give the rows as a CSV or Excel `file` (multipart) or as JSON `rows`, with the columns from GET /ap1/bulk-sends/columns/. The whole file is checked first: if any row has a problem nothing is sent and the answer lists every one. Up to 1,000 rows; each document is billed like a single send. `subject` and `message` may use {{column}} tags. Needs the Teams plan, with live or test keys. The documents are made in the background: follow them with GET /ap1/bulk-sends/{id}/ (or webhooks).

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.create_bulk_send202_response import CreateBulkSend202Response
from signedly.models.create_bulk_send_request import CreateBulkSendRequest
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
    api_instance = signedly.BulkSendingApi(api_client)
    data = signedly.CreateBulkSendRequest() # CreateBulkSendRequest | 

    try:
        # Send a template to many people
        api_response = api_instance.create_bulk_send(data)
        print("The response of BulkSendingApi->create_bulk_send:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BulkSendingApi->create_bulk_send: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**CreateBulkSendRequest**](CreateBulkSendRequest.md)|  | 

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
**202** | Accepted; the documents are being made. |  -  |
**400** | A row has a problem (every one is listed), a tag isn&#39;t a column, the date isn&#39;t in the future, or the plan isn&#39;t Teams. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |
**429** | With test keys: more rows than this month&#39;s test documents left. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_bulk_send**
> CreateBulkSend202Response get_bulk_send(id)

Follow a bulk send

How far the bulk send is: documents made so far, rows that failed, and each document's status and signatories.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.create_bulk_send202_response import CreateBulkSend202Response
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
    api_instance = signedly.BulkSendingApi(api_client)
    id = 'id_example' # str | The bulk send's ID.

    try:
        # Follow a bulk send
        api_response = api_instance.get_bulk_send(id)
        print("The response of BulkSendingApi->get_bulk_send:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BulkSendingApi->get_bulk_send: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The bulk send&#39;s ID. | 

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
**200** | The bulk send. |  -  |
**404** | No bulk send of this API client has this ID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_bulk_send_columns**
> List[ListBulkSendColumns200ResponseInner] list_bulk_send_columns(template_id)

List the columns a template's bulk send needs

The columns of a bulk send file (or `rows`) for this template, in order: the recipient's name and email, each other open role's name and email, and one per field the sender fills in, each with what to put in it. Needs the Teams plan, like the bulk send itself.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.list_bulk_send_columns200_response_inner import ListBulkSendColumns200ResponseInner
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
    api_instance = signedly.BulkSendingApi(api_client)
    template_id = 'template_id_example' # str | The template's ID.

    try:
        # List the columns a template's bulk send needs
        api_response = api_instance.list_bulk_send_columns(template_id)
        print("The response of BulkSendingApi->list_bulk_send_columns:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling BulkSendingApi->list_bulk_send_columns: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **template_id** | **str**| The template&#39;s ID. | 

### Return type

[**List[ListBulkSendColumns200ResponseInner]**](ListBulkSendColumns200ResponseInner.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The columns. |  -  |
**400** | The organisation admin&#39;s plan has no bulk sending (Teams only). |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

