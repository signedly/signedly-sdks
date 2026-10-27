# signedly.SendingApi

All URIs are relative to *https://l0ads.signedly.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**fill_and_send_document**](SendingApi.md#fill_and_send_document) | **POST** /ap1/document/update_and_send/ | Fill in fields, add a signatory and send, in one call
[**send_document**](SendingApi.md#send_document) | **POST** /ap1/document/send/ | Send a document for signing by email
[**send_document_by_link**](SendingApi.md#send_document_by_link) | **POST** /ap1/document/send_url/ | Send a document and get the signing link


# **fill_and_send_document**
> SendDocument200Response fill_and_send_document(data)

Fill in fields, add a signatory and send, in one call

Sets the values of the document's fields, adds one signatory (`name`, `email`), and emails the signatories their signing links, like POST /ap1/document/send/. All or nothing: if anything is refused, nothing changes. A retry after a timed-out call that worked answers 400 (already sent); treat that as success. A template can't be sent, nor a document that has been sent already, and every field must sit on its page.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.fill_and_send_document_request import FillAndSendDocumentRequest
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
    api_instance = signedly.SendingApi(api_client)
    data = signedly.FillAndSendDocumentRequest() # FillAndSendDocumentRequest | 

    try:
        # Fill in fields, add a signatory and send, in one call
        api_response = api_instance.fill_and_send_document(data)
        print("The response of SendingApi->fill_and_send_document:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SendingApi->fill_and_send_document: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**FillAndSendDocumentRequest**](FillAndSendDocumentRequest.md)|  | 

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
**200** | Sent; the document is now 4 Sent. |  -  |
**400** | Nothing was changed: the document is already sent (&#x60;Document has already been sent&#x60;), a field was refused (&#x60;errors&#x60;, one entry per field), or a value isn&#39;t valid. |  -  |
**403** | &#x60;expiry_date&#x60; isn&#39;t in the future. Nothing was sent. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **send_document**
> SendDocument200Response send_document(data)

Send a document for signing by email

Emails each signatory a signing link with your subject and message (with ordered signing, only the first; each next one is emailed in turn). The document needs at least one field, and every signatory at least one field. A template can't be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document's status before sending again.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.send_document200_response import SendDocument200Response
from signedly.models.send_document_request import SendDocumentRequest
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
    api_instance = signedly.SendingApi(api_client)
    data = signedly.SendDocumentRequest() # SendDocumentRequest | 

    try:
        # Send a document for signing by email
        api_response = api_instance.send_document(data)
        print("The response of SendingApi->send_document:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SendingApi->send_document: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**SendDocumentRequest**](SendDocumentRequest.md)|  | 

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
**200** | Sent; the document is now 4 Sent. |  -  |
**400** | The document can&#39;t be sent (see above). Nothing was sent. |  -  |
**403** | &#x60;expiry_date&#x60; isn&#39;t in the future. Nothing was sent. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **send_document_by_link**
> SendDocumentByLink200Response send_document_by_link(data)

Send a document and get the signing link

Marks the document sent without emailing anyone, and returns its signatory's signing link to show or send yourself. Meant for a document with one signatory. A template can't be sent, nor a document that has been sent already, and every field must sit on its page. A send that timed out may have worked: check the document's status before sending again.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.send_document_by_link200_response import SendDocumentByLink200Response
from signedly.models.send_document_by_link_request import SendDocumentByLinkRequest
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
    api_instance = signedly.SendingApi(api_client)
    data = signedly.SendDocumentByLinkRequest() # SendDocumentByLinkRequest | 

    try:
        # Send a document and get the signing link
        api_response = api_instance.send_document_by_link(data)
        print("The response of SendingApi->send_document_by_link:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SendingApi->send_document_by_link: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**SendDocumentByLinkRequest**](SendDocumentByLinkRequest.md)|  | 

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
**200** | Sent; the document is now 4 Sent. |  -  |
**400** | The document can&#39;t be sent (see above). Nothing was sent. |  -  |
**403** | &#x60;expiry_date&#x60; isn&#39;t in the future. Nothing was sent. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

