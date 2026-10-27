# RequestHit


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**method** | **str** | The HTTP method. | [optional] 
**path** | **str** | The path called. | [optional] 
**total_hits** | **int** | How many calls this client has made to it. | [optional] 

## Example

```python
from signedly.models.request_hit import RequestHit

# TODO update the JSON string below
json = "{}"
# create an instance of RequestHit from a JSON string
request_hit_instance = RequestHit.from_json(json)
# print the JSON string representation of the object
print(RequestHit.to_json())

# convert the object into a dict
request_hit_dict = request_hit_instance.to_dict()
# create an instance of RequestHit from a dict
request_hit_from_dict = RequestHit.from_dict(request_hit_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


