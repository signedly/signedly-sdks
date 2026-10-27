# signedly.TemplatesApi

All URIs are relative to *https://l0ads.signedly.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_template_fields**](TemplatesApi.md#create_template_fields) | **POST** /ap1/templates/fields/ | Add fields to a template
[**delete_document**](TemplatesApi.md#delete_document) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document
[**list_template_fields**](TemplatesApi.md#list_template_fields) | **GET** /ap1/templates/fields/ | List a template&#39;s fields
[**list_templates**](TemplatesApi.md#list_templates) | **GET** /ap1/templates/ | List your organisation&#39;s templates
[**update_template_field**](TemplatesApi.md#update_template_field) | **PUT** /ap1/templates/fields/{id}/ | Change a template&#39;s field


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
    api_instance = signedly.TemplatesApi(api_client)
    data = [signedly.CreateTemplateFieldsRequestInner()] # List[CreateTemplateFieldsRequestInner] | 

    try:
        # Add fields to a template
        api_response = api_instance.create_template_fields(data)
        print("The response of TemplatesApi->create_template_fields:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TemplatesApi->create_template_fields: %s\n" % e)
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

# **delete_document**
> SendDocument200Response delete_document(id)

Delete a template or an unsent document

Deletes a template, or a document that was never sent, with its files. A document that has been sent is a signed record and can't be deleted.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
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
    api_instance = signedly.TemplatesApi(api_client)
    id = 'id_example' # str | The document's or template's ID.

    try:
        # Delete a template or an unsent document
        api_response = api_instance.delete_document(id)
        print("The response of TemplatesApi->delete_document:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TemplatesApi->delete_document: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The document&#39;s or template&#39;s ID. | 

### Return type

[**SendDocument200Response**](SendDocument200Response.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Deleted. |  -  |
**400** | The document has been sent, so it is kept. |  -  |
**403** | The document isn&#39;t your organisation&#39;s. |  -  |
**404** | No document has this ID. |  -  |

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
    api_instance = signedly.TemplatesApi(api_client)
    document_id = 'document_id_example' # str | The template's ID.

    try:
        # List a template's fields
        api_response = api_instance.list_template_fields(document_id)
        print("The response of TemplatesApi->list_template_fields:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TemplatesApi->list_template_fields: %s\n" % e)
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

# **list_templates**
> TemplatePage list_templates(name=name, limit=limit, offset=offset)

List your organisation's templates

The templates of your organisation's admin account, newest first, with their pages and fields. Bulk-send templates aren't listed. Paged: see `limit` and `offset`.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.template_page import TemplatePage
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
    api_instance = signedly.TemplatesApi(api_client)
    name = 'name_example' # str | Only templates whose title contains this (any case). (optional)
    limit = 56 # int | How many results to return (default 10). (optional)
    offset = 56 # int | How many results to skip. (optional)

    try:
        # List your organisation's templates
        api_response = api_instance.list_templates(name=name, limit=limit, offset=offset)
        print("The response of TemplatesApi->list_templates:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TemplatesApi->list_templates: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **str**| Only templates whose title contains this (any case). | [optional] 
 **limit** | **int**| How many results to return (default 10). | [optional] 
 **offset** | **int**| How many results to skip. | [optional] 

### Return type

[**TemplatePage**](TemplatePage.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A page of templates. |  -  |

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
    api_instance = signedly.TemplatesApi(api_client)
    id = 'id_example' # str | The field's ID.
    data = signedly.CreateTemplateFieldsRequestInner() # CreateTemplateFieldsRequestInner | 

    try:
        # Change a template's field
        api_response = api_instance.update_template_field(id, data)
        print("The response of TemplatesApi->update_template_field:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling TemplatesApi->update_template_field: %s\n" % e)
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

