# FillAndSendDocumentRequestElementsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**checked** | **bool** | Checkbox: ticked or not. | [optional] 
**id** | **str** | The field&#39;s ID. | 
**page** | **str** | Optional: the field&#39;s page (one of this document&#39;s). | [optional] 
**signee** | **str** | Optional: the field&#39;s signatory (one of this document&#39;s). | [optional] 
**value** | **str** | The field&#39;s value. | [optional] 

## Example

```python
from signedly.models.fill_and_send_document_request_elements_inner import FillAndSendDocumentRequestElementsInner

# TODO update the JSON string below
json = "{}"
# create an instance of FillAndSendDocumentRequestElementsInner from a JSON string
fill_and_send_document_request_elements_inner_instance = FillAndSendDocumentRequestElementsInner.from_json(json)
# print the JSON string representation of the object
print(FillAndSendDocumentRequestElementsInner.to_json())

# convert the object into a dict
fill_and_send_document_request_elements_inner_dict = fill_and_send_document_request_elements_inner_instance.to_dict()
# create an instance of FillAndSendDocumentRequestElementsInner from a dict
fill_and_send_document_request_elements_inner_from_dict = FillAndSendDocumentRequestElementsInner.from_dict(fill_and_send_document_request_elements_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


