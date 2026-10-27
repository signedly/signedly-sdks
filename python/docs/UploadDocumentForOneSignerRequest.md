# UploadDocumentForOneSignerRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**file** | **bytearray** | A PDF or DOCX file. | 
**signee_name** | **str** | The signer&#39;s name. | 
**signee_email** | **str** | The signer&#39;s email address. | 
**redirect_url** | **str** | Where the signer is sent after signing. | 
**final_email** | **str** | Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. | [optional] 

## Example

```python
from signedly.models.upload_document_for_one_signer_request import UploadDocumentForOneSignerRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UploadDocumentForOneSignerRequest from a JSON string
upload_document_for_one_signer_request_instance = UploadDocumentForOneSignerRequest.from_json(json)
# print the JSON string representation of the object
print(UploadDocumentForOneSignerRequest.to_json())

# convert the object into a dict
upload_document_for_one_signer_request_dict = upload_document_for_one_signer_request_instance.to_dict()
# create an instance of UploadDocumentForOneSignerRequest from a dict
upload_document_for_one_signer_request_from_dict = UploadDocumentForOneSignerRequest.from_dict(upload_document_for_one_signer_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


