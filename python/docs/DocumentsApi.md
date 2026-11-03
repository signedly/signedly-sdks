# signedly.DocumentsApi

All URIs are relative to *https://l0ads.signedly.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_document_from_template**](DocumentsApi.md#create_document_from_template) | **POST** /ap1/documents/fromtemplate/ | Make a document from a template
[**delete_document**](DocumentsApi.md#delete_document) | **DELETE** /ap1/documents-status/{id}/ | Delete a template or an unsent document
[**get_download_status**](DocumentsApi.md#get_download_status) | **GET** /ap1/documents-status/{id}/ | Check whether the signed PDF is ready
[**list_document_pages**](DocumentsApi.md#list_document_pages) | **GET** /ap1/documents/{id}/pages/ | List a document&#39;s pages and their fields
[**list_document_statuses**](DocumentsApi.md#list_document_statuses) | **GET** /ap1/documents-status-list/ | List the status of your organisation&#39;s documents
[**list_documents**](DocumentsApi.md#list_documents) | **GET** /ap1/documents/ | List the documents this API client created
[**upload_document**](DocumentsApi.md#upload_document) | **POST** /ap1/upload/ | Upload a document or template
[**upload_document_for_one_signer**](DocumentsApi.md#upload_document_for_one_signer) | **POST** /ap1/upload_app/ | Upload a document for one signer and get their signing link


# **create_document_from_template**
> CreateDocumentFromTemplate200Response create_document_from_template(data)

Make a document from a template

Copies one of your templates into a new document, with its pages and fields, one recipient per template role and the template's signing order. Fill the open roles here with `recipients`, or later with POST /ap1/signatories/ (each takes the next open role); a document with an unfilled role can't be sent. To prefill a field, add a key with the field's label and the value, e.g. `\"Company\": \"Acme Ltd\"`.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.create_document_from_template200_response import CreateDocumentFromTemplate200Response
from signedly.models.create_document_from_template_request import CreateDocumentFromTemplateRequest
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
    api_instance = signedly.DocumentsApi(api_client)
    data = signedly.CreateDocumentFromTemplateRequest() # CreateDocumentFromTemplateRequest | 

    try:
        # Make a document from a template
        api_response = api_instance.create_document_from_template(data)
        print("The response of DocumentsApi->create_document_from_template:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->create_document_from_template: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**CreateDocumentFromTemplateRequest**](CreateDocumentFromTemplateRequest.md)|  | 

### Return type

[**CreateDocumentFromTemplate200Response**](CreateDocumentFromTemplate200Response.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The new document. |  -  |
**400** | The ID isn&#39;t a template, the name is taken, or &#x60;recipients&#x60; don&#39;t fill the template&#39;s open roles exactly once. |  -  |
**404** | The template doesn&#39;t exist or isn&#39;t yours. |  -  |

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
    api_instance = signedly.DocumentsApi(api_client)
    id = 'id_example' # str | The document's or template's ID.

    try:
        # Delete a template or an unsent document
        api_response = api_instance.delete_document(id)
        print("The response of DocumentsApi->delete_document:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->delete_document: %s\n" % e)
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

# **get_download_status**
> GetDownloadStatus200Response get_download_status(id)

Check whether the signed PDF is ready

Says whether the document's signed PDF can be downloaded yet (`download_status`). For the document's signing status, use `GET /ap1/documents-status-list/?document_ids=<id>`.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.get_download_status200_response import GetDownloadStatus200Response
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
    api_instance = signedly.DocumentsApi(api_client)
    id = 'id_example' # str | The document's ID.

    try:
        # Check whether the signed PDF is ready
        api_response = api_instance.get_download_status(id)
        print("The response of DocumentsApi->get_download_status:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->get_download_status: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The document&#39;s ID. | 

### Return type

[**GetDownloadStatus200Response**](GetDownloadStatus200Response.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Whether the signed PDF is ready. |  -  |
**403** | The document isn&#39;t your organisation&#39;s. |  -  |
**404** | No document has this ID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_document_pages**
> List[Page] list_document_pages(id)

List a document's pages and their fields

The document's (or template's) pages, in order, each with its fields. Use a page's `id` and `page_number` when placing a field on it. A new upload has no pages until it has been processed.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.page import Page
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
    api_instance = signedly.DocumentsApi(api_client)
    id = 'id_example' # str | The document's or template's ID.

    try:
        # List a document's pages and their fields
        api_response = api_instance.list_document_pages(id)
        print("The response of DocumentsApi->list_document_pages:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->list_document_pages: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **str**| The document&#39;s or template&#39;s ID. | 

### Return type

[**List[Page]**](Page.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The pages. |  -  |
**404** | The document doesn&#39;t exist or isn&#39;t your organisation&#39;s. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_document_statuses**
> DocumentStatusPage list_document_statuses(name=name, status=status, document_ids=document_ids, limit=limit, offset=offset)

List the status of your organisation's documents

The ID and status of every document of your organisation's admin account, including those made in the web app, newest change first. Templates and unsent bulk-send copies aren't listed. A light way to poll for completed documents. Paged: see `limit` and `offset`.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.document_status_page import DocumentStatusPage
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
    api_instance = signedly.DocumentsApi(api_client)
    name = 'name_example' # str | Only documents whose name contains this (any case). (optional)
    status = [56] # List[int] | Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (`status=4&status=6`) or separate values with commas (`status=4,6`). (optional)
    document_ids = ['document_ids_example'] # List[str] | Only these documents. Repeat it or separate IDs with commas. (optional)
    limit = 56 # int | How many results to return (default 10). (optional)
    offset = 56 # int | How many results to skip. (optional)

    try:
        # List the status of your organisation's documents
        api_response = api_instance.list_document_statuses(name=name, status=status, document_ids=document_ids, limit=limit, offset=offset)
        print("The response of DocumentsApi->list_document_statuses:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->list_document_statuses: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **str**| Only documents whose name contains this (any case). | [optional] 
 **status** | [**List[int]**](int.md)| Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). | [optional] 
 **document_ids** | [**List[str]**](str.md)| Only these documents. Repeat it or separate IDs with commas. | [optional] 
 **limit** | **int**| How many results to return (default 10). | [optional] 
 **offset** | **int**| How many results to skip. | [optional] 

### Return type

[**DocumentStatusPage**](DocumentStatusPage.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A page of document statuses. |  -  |
**400** | A &#x60;status&#x60; isn&#39;t one of the values above, or an ID isn&#39;t a UUID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_documents**
> DocumentPage list_documents(name=name, status=status, document_ids=document_ids, limit=limit, offset=offset)

List the documents this API client created

The documents this API client uploaded or made from a template, newest change first, with their signatories, pages and fields. Templates and unsent bulk-send copies aren't listed. Paged: see `limit` and `offset`.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.document_page import DocumentPage
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
    api_instance = signedly.DocumentsApi(api_client)
    name = 'name_example' # str | Only documents whose name contains this (any case). (optional)
    status = [56] # List[int] | Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (`status=4&status=6`) or separate values with commas (`status=4,6`). (optional)
    document_ids = ['document_ids_example'] # List[str] | Only these documents. Repeat it or separate IDs with commas. (optional)
    limit = 56 # int | How many results to return (default 10). (optional)
    offset = 56 # int | How many results to skip. (optional)

    try:
        # List the documents this API client created
        api_response = api_instance.list_documents(name=name, status=status, document_ids=document_ids, limit=limit, offset=offset)
        print("The response of DocumentsApi->list_documents:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->list_documents: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **str**| Only documents whose name contains this (any case). | [optional] 
 **status** | [**List[int]**](int.md)| Only documents with these statuses: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Repeat it (&#x60;status&#x3D;4&amp;status&#x3D;6&#x60;) or separate values with commas (&#x60;status&#x3D;4,6&#x60;). | [optional] 
 **document_ids** | [**List[str]**](str.md)| Only these documents. Repeat it or separate IDs with commas. | [optional] 
 **limit** | **int**| How many results to return (default 10). | [optional] 
 **offset** | **int**| How many results to skip. | [optional] 

### Return type

[**DocumentPage**](DocumentPage.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | A page of documents. |  -  |
**400** | A &#x60;status&#x60; isn&#39;t one of the values above, or an ID isn&#39;t a UUID. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **upload_document**
> Upload upload_document(file, name, type, template_name=template_name)

Upload a document or template

Uploads a PDF or DOCX file of up to 2 MB as a document (`type` 2) or a template (`type` 4). The answer is the upload; the document itself is made in the background. Find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is this upload's `id`), or a template in `GET /ap1/templates/`, and wait until `GET /ap1/documents/{id}/pages/` lists its pages before placing fields.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.upload import Upload
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
    api_instance = signedly.DocumentsApi(api_client)
    file = None # bytearray | A PDF or DOCX file. A PDF that can't be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB.
    name = 'name_example' # str | The document's name. It must differ from every other upload of this API client.
    type = 56 # int | 2 Document · 4 Template
    template_name = 'template_name_example' # str | The template's title. Required with `type` 4; it must differ from this API client's other templates. (optional)

    try:
        # Upload a document or template
        api_response = api_instance.upload_document(file, name, type, template_name=template_name)
        print("The response of DocumentsApi->upload_document:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->upload_document: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **bytearray**| A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB. | 
 **name** | **str**| The document&#39;s name. It must differ from every other upload of this API client. | 
 **type** | **int**| 2 Document · 4 Template | 
 **template_name** | **str**| The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. | [optional] 

### Return type

[**Upload**](Upload.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The upload. Its &#x60;status&#x60; is 2 Uploaded; the document is made next. |  -  |
**400** | The file is missing, not a PDF or DOCX, or over 2 MB; the name is taken; or &#x60;type&#x60; or &#x60;template_name&#x60; is missing or wrong. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **upload_document_for_one_signer**
> UploadDocumentForOneSigner200Response upload_document_for_one_signer(file, signee_name, signee_email, redirect_url, final_email=final_email)

Upload a document for one signer and get their signing link

Uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; give it to the signer. They place their own signature on the signing page and are then sent to the `redirect_url` you gave. The signed PDF and its audit trail are emailed to `final_email`, or to your organisation's admin without one.

### Example

* Api Key Authentication (Bearer):

```python
import signedly
from signedly.models.upload_document_for_one_signer200_response import UploadDocumentForOneSigner200Response
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
    api_instance = signedly.DocumentsApi(api_client)
    file = None # bytearray | A PDF or DOCX file. A PDF that can't be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that.
    signee_name = 'signee_name_example' # str | The signer's name.
    signee_email = 'signee_email_example' # str | The signer's email address.
    redirect_url = 'redirect_url_example' # str | Where the signer is sent after signing.
    final_email = 'final_email_example' # str | Who gets the signed PDF and audit trail by email. Without it, your organisation's admin does. (optional)

    try:
        # Upload a document for one signer and get their signing link
        api_response = api_instance.upload_document_for_one_signer(file, signee_name, signee_email, redirect_url, final_email=final_email)
        print("The response of DocumentsApi->upload_document_for_one_signer:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DocumentsApi->upload_document_for_one_signer: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **bytearray**| A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. | 
 **signee_name** | **str**| The signer&#39;s name. | 
 **signee_email** | **str**| The signer&#39;s email address. | 
 **redirect_url** | **str**| Where the signer is sent after signing. | 
 **final_email** | **str**| Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. | [optional] 

### Return type

[**UploadDocumentForOneSigner200Response**](UploadDocumentForOneSigner200Response.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The new document. |  -  |
**400** | A value is missing or not valid (the file isn&#39;t a PDF or DOCX, an email or the URL isn&#39;t valid). Nothing was kept. |  -  |
**502** | The file couldn&#39;t be stored. Nothing was kept; try again. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

