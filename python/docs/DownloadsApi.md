# signedly.DownloadsApi

All URIs are relative to *https://l0ads.signedly.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_audit_trail_link**](DownloadsApi.md#get_audit_trail_link) | **GET** /ap1/document/download-audit-link/ | Get a link to the audit trail
[**get_download_link**](DownloadsApi.md#get_download_link) | **GET** /ap1/document/download-link/ | Get a link to the signed PDF
[**get_view_link**](DownloadsApi.md#get_view_link) | **GET** /ap1/document/view-link/ | Get a link to view the document


# **get_audit_trail_link**
> GetAuditTrailLink200Response get_audit_trail_link(id)

Get a link to the audit trail

A link to the document's audit trail PDF: who did what, when and from where. It is made when the document is completed; ask for it after GET /ap1/document/download-link/ gives the signed PDF.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.get_audit_trail_link200_response import GetAuditTrailLink200Response
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
    api_instance = signedly.DownloadsApi(api_client)
    id = 'id_example' # str | The document's ID.

    try:
        # Get a link to the audit trail
        api_response = api_instance.get_audit_trail_link(id)
        print("The response of DownloadsApi->get_audit_trail_link:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DownloadsApi->get_audit_trail_link: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The document&#39;s ID. | 

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
**200** | The link. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_download_link**
> GetAuditTrailLink200Response get_download_link(id)

Get a link to the signed PDF

A link to the final signed PDF, once every signatory has signed and it has been sealed. Until then the answer is 202: try again later.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.get_audit_trail_link200_response import GetAuditTrailLink200Response
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
    api_instance = signedly.DownloadsApi(api_client)
    id = 'id_example' # str | The document's ID.

    try:
        # Get a link to the signed PDF
        api_response = api_instance.get_download_link(id)
        print("The response of DownloadsApi->get_download_link:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DownloadsApi->get_download_link: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The document&#39;s ID. | 

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
**200** | The link. |  -  |
**202** | The signed PDF isn&#39;t ready yet. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_view_link**
> GetAuditTrailLink200Response get_view_link(id)

Get a link to view the document

A link to the document's PDF as it stands now, with the values and signatures applied so far. For the final signed PDF, use GET /ap1/document/download-link/.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.get_audit_trail_link200_response import GetAuditTrailLink200Response
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
    api_instance = signedly.DownloadsApi(api_client)
    id = 'id_example' # str | The document's ID.

    try:
        # Get a link to view the document
        api_response = api_instance.get_view_link(id)
        print("The response of DownloadsApi->get_view_link:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DownloadsApi->get_view_link: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The document&#39;s ID. | 

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
**200** | The link. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

