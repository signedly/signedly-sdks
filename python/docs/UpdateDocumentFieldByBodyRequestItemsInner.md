# UpdateDocumentFieldByBodyRequestItemsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**selected** | **int** | 1 chosen, 0 not. | 
**x** | **float** | In PDF points (1/72 inch), from the page&#39;s left edge. | 
**y** | **float** | In PDF points (1/72 inch), from the page&#39;s top edge. | 

## Example

```python
from signedly.models.update_document_field_by_body_request_items_inner import UpdateDocumentFieldByBodyRequestItemsInner

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateDocumentFieldByBodyRequestItemsInner from a JSON string
update_document_field_by_body_request_items_inner_instance = UpdateDocumentFieldByBodyRequestItemsInner.from_json(json)
# print the JSON string representation of the object
print(UpdateDocumentFieldByBodyRequestItemsInner.to_json())

# convert the object into a dict
update_document_field_by_body_request_items_inner_dict = update_document_field_by_body_request_items_inner_instance.to_dict()
# create an instance of UpdateDocumentFieldByBodyRequestItemsInner from a dict
update_document_field_by_body_request_items_inner_from_dict = UpdateDocumentFieldByBodyRequestItemsInner.from_dict(update_document_field_by_body_request_items_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


