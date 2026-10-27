# UploadDocumentRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**file** | **bytearray** | A PDF or DOCX file. At most 2 MB. | 
**name** | **str** | The document&#39;s name. It must differ from every other upload of this API client. | 
**type** | **int** | 2 Document · 4 Template | 
**template_name** | **str** | The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. | [optional] 

## Example

```python
from signedly.models.upload_document_request import UploadDocumentRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UploadDocumentRequest from a JSON string
upload_document_request_instance = UploadDocumentRequest.from_json(json)
# print the JSON string representation of the object
print(UploadDocumentRequest.to_json())

# convert the object into a dict
upload_document_request_dict = upload_document_request_instance.to_dict()
# create an instance of UploadDocumentRequest from a dict
upload_document_request_from_dict = UploadDocumentRequest.from_dict(upload_document_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


