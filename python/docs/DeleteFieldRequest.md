# DeleteFieldRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_id** | **str** | The ID of the document (or template) the item is on. | 

## Example

```python
from signedly.models.delete_field_request import DeleteFieldRequest

# TODO update the JSON string below
json = "{}"
# create an instance of DeleteFieldRequest from a JSON string
delete_field_request_instance = DeleteFieldRequest.from_json(json)
# print the JSON string representation of the object
print(DeleteFieldRequest.to_json())

# convert the object into a dict
delete_field_request_dict = delete_field_request_instance.to_dict()
# create an instance of DeleteFieldRequest from a dict
delete_field_request_from_dict = DeleteFieldRequest.from_dict(delete_field_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


