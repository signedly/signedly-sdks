# UploadDocumentForOneSigner200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | The document&#39;s ID. | [optional] 
**redirect_url** | **str** | The signer&#39;s signing link (not the &#x60;redirect_url&#x60; you sent). | [optional] 

## Example

```python
from signedly.models.upload_document_for_one_signer200_response import UploadDocumentForOneSigner200Response

# TODO update the JSON string below
json = "{}"
# create an instance of UploadDocumentForOneSigner200Response from a JSON string
upload_document_for_one_signer200_response_instance = UploadDocumentForOneSigner200Response.from_json(json)
# print the JSON string representation of the object
print(UploadDocumentForOneSigner200Response.to_json())

# convert the object into a dict
upload_document_for_one_signer200_response_dict = upload_document_for_one_signer200_response_instance.to_dict()
# create an instance of UploadDocumentForOneSigner200Response from a dict
upload_document_for_one_signer200_response_from_dict = UploadDocumentForOneSigner200Response.from_dict(upload_document_for_one_signer200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


