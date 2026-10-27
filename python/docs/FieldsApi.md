# signedly.FieldsApi

All URIs are relative to *https://l0ads.signedly.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_document_fields**](FieldsApi.md#create_document_fields) | **POST** /ap1/documents/fields/ | Add fields to a document
[**create_template_fields**](FieldsApi.md#create_template_fields) | **POST** /ap1/templates/fields/ | Add fields to a template
[**delete_field**](FieldsApi.md#delete_field) | **DELETE** /ap1/documents/fields/{id}/ | Delete a field
[**list_document_fields**](FieldsApi.md#list_document_fields) | **GET** /ap1/documents/fields/ | List a document&#39;s fields
[**list_template_fields**](FieldsApi.md#list_template_fields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields
[**update_document_field**](FieldsApi.md#update_document_field) | **PUT** /ap1/documents/fields/{id}/ | Change a document&#39;s field
[**update_document_field_by_body**](FieldsApi.md#update_document_field_by_body) | **PUT** /ap1/documents/fields/ | Change a document&#39;s field (ID in the body)
[**update_template_field**](FieldsApi.md#update_template_field) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field


# **create_document_fields**
> List[ModelField] create_document_fields(data)

Add fields to a document

Places fields on a document, each assigned to a signatory. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). A field must sit wholly on its page (1 point of tolerance). For a template, use POST /ap1/templates/fields/.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.create_document_fields_request_inner import CreateDocumentFieldsRequestInner
from signedly.models.model_field import ModelField
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
    api_instance = signedly.FieldsApi(api_client)
    data = [signedly.CreateDocumentFieldsRequestInner()] # List[CreateDocumentFieldsRequestInner] | 

    try:
        # Add fields to a document
        api_response = api_instance.create_document_fields(data)
        print("The response of FieldsApi->create_document_fields:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FieldsApi->create_document_fields: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**List[CreateDocumentFieldsRequestInner]**](CreateDocumentFieldsRequestInner.md)|  | 

### Return type

[**List[ModelField]**](ModelField.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | The fields; the document is now 3 Prepared. |  -  |
**400** | A value is missing or not valid, or a field doesn&#39;t fit on its page; the list has one entry per field. Nothing was saved. |  -  |
**404** | The document doesn&#39;t exist, isn&#39;t yours, or has already been sent. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **create_template_fields**
> List[TemplateField] create_template_fields(data)

Add fields to a template

Places fields on a template. They have no signatory yet: on a document made from the template, they go to its first signatory. A field must sit wholly on its page (1 point of tolerance).

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.create_template_fields_request_inner import CreateTemplateFieldsRequestInner
from signedly.models.template_field import TemplateField
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
    api_instance = signedly.FieldsApi(api_client)
    data = [signedly.CreateTemplateFieldsRequestInner()] # List[CreateTemplateFieldsRequestInner] | 

    try:
        # Add fields to a template
        api_response = api_instance.create_template_fields(data)
        print("The response of FieldsApi->create_template_fields:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FieldsApi->create_template_fields: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**List[CreateTemplateFieldsRequestInner]**](CreateTemplateFieldsRequestInner.md)|  | 

### Return type

[**List[TemplateField]**](TemplateField.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | The fields. |  -  |
**400** | The ID isn&#39;t a template, or a value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_field**
> SendDocument200Response delete_field(id, data)

Delete a field

Deletes a field of a template, or of a document that isn't sent yet. The document's or template's ID goes in the JSON body.

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
    api_instance = signedly.FieldsApi(api_client)
    id = 'id_example' # str | The field's ID.
    data = signedly.DeleteFieldRequest() # DeleteFieldRequest | 

    try:
        # Delete a field
        api_response = api_instance.delete_field(id, data)
        print("The response of FieldsApi->delete_field:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FieldsApi->delete_field: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The field&#39;s ID. | 
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
**204** | Deleted. |  -  |
**400** | The document has already been sent; nothing was changed. |  -  |
**404** | The document or field doesn&#39;t exist or isn&#39;t yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_document_fields**
> List[ModelField] list_document_fields(document_id)

List a document's fields

The fields of a document. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared).

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.model_field import ModelField
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
    api_instance = signedly.FieldsApi(api_client)
    document_id = 'document_id_example' # str | The document's ID.

    try:
        # List a document's fields
        api_response = api_instance.list_document_fields(document_id)
        print("The response of FieldsApi->list_document_fields:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FieldsApi->list_document_fields: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_id** | **str**| The document&#39;s ID. | 

### Return type

[**List[ModelField]**](ModelField.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The fields. |  -  |
**400** | The document has already been sent; nothing was changed. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_template_fields**
> List[TemplateField] list_template_fields(document_id)

List a template's fields

The fields of a template (or of any of your documents).

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.template_field import TemplateField
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
    api_instance = signedly.FieldsApi(api_client)
    document_id = 'document_id_example' # str | The template's ID.

    try:
        # List a template's fields
        api_response = api_instance.list_template_fields(document_id)
        print("The response of FieldsApi->list_template_fields:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FieldsApi->list_template_fields: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_id** | **str**| The template&#39;s ID. | 

### Return type

[**List[TemplateField]**](TemplateField.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The fields. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_document_field**
> ModelField update_document_field(id, data)

Change a document's field

Changes a document's field; send all of its values, as when adding it. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can't change: delete the field and add it again. For a template's field, use PUT /ap1/templates/fields/{id}/.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.create_document_fields_request_inner import CreateDocumentFieldsRequestInner
from signedly.models.model_field import ModelField
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
    api_instance = signedly.FieldsApi(api_client)
    id = 'id_example' # str | The field's ID.
    data = signedly.CreateDocumentFieldsRequestInner() # CreateDocumentFieldsRequestInner | 

    try:
        # Change a document's field
        api_response = api_instance.update_document_field(id, data)
        print("The response of FieldsApi->update_document_field:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FieldsApi->update_document_field: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The field&#39;s ID. | 
 **data** | [**CreateDocumentFieldsRequestInner**](CreateDocumentFieldsRequestInner.md)|  | 

### Return type

[**ModelField**](ModelField.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The field. |  -  |
**400** | A value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
**404** | The document or field doesn&#39;t exist or isn&#39;t yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_document_field_by_body**
> ModelField update_document_field_by_body(data)

Change a document's field (ID in the body)

Changes a document's field, named by `element_id` in the body; the same as PUT /ap1/documents/fields/{id}/. Only while the document isn't sent yet (status 1 Draft, 2 Signees Added or 3 Prepared). Its page and signatory can't change: delete the field and add it again.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.model_field import ModelField
from signedly.models.update_document_field_by_body_request import UpdateDocumentFieldByBodyRequest
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
    api_instance = signedly.FieldsApi(api_client)
    data = signedly.UpdateDocumentFieldByBodyRequest() # UpdateDocumentFieldByBodyRequest | 

    try:
        # Change a document's field (ID in the body)
        api_response = api_instance.update_document_field_by_body(data)
        print("The response of FieldsApi->update_document_field_by_body:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FieldsApi->update_document_field_by_body: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**UpdateDocumentFieldByBodyRequest**](UpdateDocumentFieldByBodyRequest.md)|  | 

### Return type

[**ModelField**](ModelField.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The field. |  -  |
**400** | A value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
**404** | The document or field doesn&#39;t exist or isn&#39;t yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **update_template_field**
> TemplateField update_template_field(id, data)

Change a template's field

Changes a template's field; send all of its values, as when adding it. Its page can't change: delete the field and add it again.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.create_template_fields_request_inner import CreateTemplateFieldsRequestInner
from signedly.models.template_field import TemplateField
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
    api_instance = signedly.FieldsApi(api_client)
    id = 'id_example' # str | The field's ID.
    data = signedly.CreateTemplateFieldsRequestInner() # CreateTemplateFieldsRequestInner | 

    try:
        # Change a template's field
        api_response = api_instance.update_template_field(id, data)
        print("The response of FieldsApi->update_template_field:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FieldsApi->update_template_field: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The field&#39;s ID. | 
 **data** | [**CreateTemplateFieldsRequestInner**](CreateTemplateFieldsRequestInner.md)|  | 

### Return type

[**TemplateField**](TemplateField.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The field. |  -  |
**400** | A value is missing or not valid, or the field doesn&#39;t fit on its page. Nothing was saved. |  -  |
**404** | The template or field doesn&#39;t exist or isn&#39;t yours. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

