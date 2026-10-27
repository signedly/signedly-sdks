# SendDocumentByLink200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_id** | **str** | The document&#39;s ID. | [optional] 
**url** | **str** | The signatory&#39;s signing link. | [optional] 

## Example

```python
from signedly.models.send_document_by_link200_response import SendDocumentByLink200Response

# TODO update the JSON string below
json = "{}"
# create an instance of SendDocumentByLink200Response from a JSON string
send_document_by_link200_response_instance = SendDocumentByLink200Response.from_json(json)
# print the JSON string representation of the object
print(SendDocumentByLink200Response.to_json())

# convert the object into a dict
send_document_by_link200_response_dict = send_document_by_link200_response_instance.to_dict()
# create an instance of SendDocumentByLink200Response from a dict
send_document_by_link200_response_from_dict = SendDocumentByLink200Response.from_dict(send_document_by_link200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


