# ListBulkSendColumns200ResponseInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**column** | **str** | The header to use. | [optional] 
**example** | **str** | An example value. | [optional] 
**hint** | **str** | What to put in it. | [optional] 

## Example

```python
from signedly.models.list_bulk_send_columns200_response_inner import ListBulkSendColumns200ResponseInner

# TODO update the JSON string below
json = "{}"
# create an instance of ListBulkSendColumns200ResponseInner from a JSON string
list_bulk_send_columns200_response_inner_instance = ListBulkSendColumns200ResponseInner.from_json(json)
# print the JSON string representation of the object
print(ListBulkSendColumns200ResponseInner.to_json())

# convert the object into a dict
list_bulk_send_columns200_response_inner_dict = list_bulk_send_columns200_response_inner_instance.to_dict()
# create an instance of ListBulkSendColumns200ResponseInner from a dict
list_bulk_send_columns200_response_inner_from_dict = ListBulkSendColumns200ResponseInner.from_dict(list_bulk_send_columns200_response_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


