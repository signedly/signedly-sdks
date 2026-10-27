# SendDocumentByLinkRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_id** | **str** | The document&#39;s ID. | 
**expiry_date** | **date** | The last day the document can be signed, YYYY-MM-DD; it must be in the future. | 

## Example

```python
from signedly.models.send_document_by_link_request import SendDocumentByLinkRequest

# TODO update the JSON string below
json = "{}"
# create an instance of SendDocumentByLinkRequest from a JSON string
send_document_by_link_request_instance = SendDocumentByLinkRequest.from_json(json)
# print the JSON string representation of the object
print(SendDocumentByLinkRequest.to_json())

# convert the object into a dict
send_document_by_link_request_dict = send_document_by_link_request_instance.to_dict()
# create an instance of SendDocumentByLinkRequest from a dict
send_document_by_link_request_from_dict = SendDocumentByLinkRequest.from_dict(send_document_by_link_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


