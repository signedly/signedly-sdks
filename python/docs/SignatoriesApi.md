# signedly.SignatoriesApi

All URIs are relative to *https://l0ads.signedly.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_signatories**](SignatoriesApi.md#create_signatories) | **POST** /ap1/signatories/bulk/ | Add several signatories
[**create_signatory**](SignatoriesApi.md#create_signatory) | **POST** /ap1/signatories/ | Add a signatory
[**delete_signatory**](SignatoriesApi.md#delete_signatory) | **DELETE** /ap1/signatories/{id}/ | Remove a signatory
[**list_signatories**](SignatoriesApi.md#list_signatories) | **GET** /ap1/signatories/ | List a document&#39;s signatories


# **create_signatories**
> List[Signatory] create_signatories(data)

Add several signatories

Adds several signatories at once, in the order given. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). All or nothing: if one is refused (a repeated email, say), none is added. On a document made from a template, they fill its open roles in signing order, each with that role's fields.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.create_signatories_request import CreateSignatoriesRequest
from signedly.models.signatory import Signatory
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
    api_instance = signedly.SignatoriesApi(api_client)
    data = signedly.CreateSignatoriesRequest() # CreateSignatoriesRequest | 

    try:
        # Add several signatories
        api_response = api_instance.create_signatories(data)
        print("The response of SignatoriesApi->create_signatories:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SignatoriesApi->create_signatories: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**CreateSignatoriesRequest**](CreateSignatoriesRequest.md)|  | 

### Return type

[**List[Signatory]**](Signatory.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | The signatories. |  -  |
**400** | The document has been sent, the list is missing or empty, or a signatory was refused. None was added. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **create_signatory**
> Signatory create_signatory(data)

Add a signatory

Adds a person who signs the document. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). On a document made from a template, each signatory takes the next open template role, in signing order, with its fields; once every role is filled, more are added.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.create_signatory_request import CreateSignatoryRequest
from signedly.models.signatory import Signatory
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
    api_instance = signedly.SignatoriesApi(api_client)
    data = signedly.CreateSignatoryRequest() # CreateSignatoryRequest | 

    try:
        # Add a signatory
        api_response = api_instance.create_signatory(data)
        print("The response of SignatoriesApi->create_signatory:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SignatoriesApi->create_signatory: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**CreateSignatoryRequest**](CreateSignatoryRequest.md)|  | 

### Return type

[**Signatory**](Signatory.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | The signatory. |  -  |
**400** | The document has been sent, is a template, or already has this signatory, or a value isn&#39;t valid. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_signatory**
> SendDocument200Response delete_signatory(id, data)

Remove a signatory

Removes a signatory, and the fields assigned to them, from the document. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). The document's ID goes in the JSON body.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.delete_field_request import DeleteFieldRequest
from signedly.models.send_document200_response import SendDocument200Response
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
    api_instance = signedly.SignatoriesApi(api_client)
    id = 'id_example' # str | The signatory's ID.
    data = signedly.DeleteFieldRequest() # DeleteFieldRequest | 

    try:
        # Remove a signatory
        api_response = api_instance.delete_signatory(id, data)
        print("The response of SignatoriesApi->delete_signatory:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SignatoriesApi->delete_signatory: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The signatory&#39;s ID. | 
 **data** | [**DeleteFieldRequest**](DeleteFieldRequest.md)|  | 

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
**204** | Removed. |  -  |
**400** | The document has already been sent; nothing was changed. |  -  |
**404** | The document or signatory doesn&#39;t exist or isn&#39;t yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_signatories**
> List[Signatory] list_signatories(document_id)

List a document's signatories

The document's signatories with their signing status: 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.signatory import Signatory
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
    api_instance = signedly.SignatoriesApi(api_client)
    document_id = 'document_id_example' # str | The document's ID.

    try:
        # List a document's signatories
        api_response = api_instance.list_signatories(document_id)
        print("The response of SignatoriesApi->list_signatories:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SignatoriesApi->list_signatories: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_id** | **str**| The document&#39;s ID. | 

### Return type

[**List[Signatory]**](Signatory.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The signatories. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

