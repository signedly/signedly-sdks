# GetAccessTokenRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**client_id** | **str** | Your client ID. | 
**client_secret** | **str** | Your client secret. | 

## Example

```python
from signedly.models.get_access_token_request import GetAccessTokenRequest

# TODO update the JSON string below
json = "{}"
# create an instance of GetAccessTokenRequest from a JSON string
get_access_token_request_instance = GetAccessTokenRequest.from_json(json)
# print the JSON string representation of the object
print(GetAccessTokenRequest.to_json())

# convert the object into a dict
get_access_token_request_dict = get_access_token_request_instance.to_dict()
# create an instance of GetAccessTokenRequest from a dict
get_access_token_request_from_dict = GetAccessTokenRequest.from_dict(get_access_token_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


