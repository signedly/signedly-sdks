# Document


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **datetime** | When it was made. | [optional] [readonly] 
**document_name** | **str** | The document&#39;s name. | [optional] [readonly] 
**expired_at** | **datetime** | The last day it can be signed, or null. | [optional] 
**id** | **str** | The document&#39;s ID. | [optional] [readonly] 
**is_bulk_signing** | **bool** | True for a copy made by a bulk send. | [optional] 
**is_template** | **bool** | Always false here. | [optional] 
**message** | **str** | The signing email&#39;s message, once sent. | [optional] 
**pages** | [**List[Page]**](Page.md) | Its pages, each with its fields. | [optional] 
**sent_at** | **datetime** | When it was sent, or null. | [optional] 
**signatories** | [**List[Signatory]**](Signatory.md) | Who signs it. | [optional] 
**status** | **int** | 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired | [optional] 
**subject** | **str** | The signing email&#39;s subject, once sent. | [optional] 
**updated_at** | **datetime** | When it last changed. | [optional] [readonly] 
**upload** | [**Upload**](Upload.md) |  | [optional] 

## Example

```python
from signedly.models.document import Document

# TODO update the JSON string below
json = "{}"
# create an instance of Document from a JSON string
document_instance = Document.from_json(json)
# print the JSON string representation of the object
print(Document.to_json())

# convert the object into a dict
document_dict = document_instance.to_dict()
# create an instance of Document from a dict
document_from_dict = Document.from_dict(document_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


