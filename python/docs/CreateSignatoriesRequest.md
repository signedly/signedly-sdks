# CreateSignatoriesRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_id** | **str** | The document&#39;s ID. | 
**is_ordered_signing** | **bool** | True: they sign one after another, in this order, each emailed when it is their turn. False (the default): all are emailed at once. | [optional] [default to False]
**signatories** | [**List[CreateSignatoriesRequestSignatoriesInner]**](CreateSignatoriesRequestSignatoriesInner.md) | The signatories, at least one. | 

## Example

```python
from signedly.models.create_signatories_request import CreateSignatoriesRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CreateSignatoriesRequest from a JSON string
create_signatories_request_instance = CreateSignatoriesRequest.from_json(json)
# print the JSON string representation of the object
print(CreateSignatoriesRequest.to_json())

# convert the object into a dict
create_signatories_request_dict = create_signatories_request_instance.to_dict()
# create an instance of CreateSignatoriesRequest from a dict
create_signatories_request_from_dict = CreateSignatoriesRequest.from_dict(create_signatories_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


