# RefreshAccessToken200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**access_token** | **str** | Send as &#x60;Authorization: Bearer &lt;access_token&gt;&#x60;. | [optional] 
**expired** | **bool** | True once a call was made with the expired token. | [optional] 
**expiry_date** | **datetime** | When the access token expires (2 hours after it was made). | [optional] 
**refresh_token** | **str** | Gets a new access token at /ap1/refreshtoken/. | [optional] 
**refresh_token_expiry_date** | **datetime** | When the refresh token expires (7 days after it was made). | [optional] 
**updated_at** | **datetime** | When the tokens last changed. | [optional] 

## Example

```python
from signedly.models.refresh_access_token200_response import RefreshAccessToken200Response

# TODO update the JSON string below
json = "{}"
# create an instance of RefreshAccessToken200Response from a JSON string
refresh_access_token200_response_instance = RefreshAccessToken200Response.from_json(json)
# print the JSON string representation of the object
print(RefreshAccessToken200Response.to_json())

# convert the object into a dict
refresh_access_token200_response_dict = refresh_access_token200_response_instance.to_dict()
# create an instance of RefreshAccessToken200Response from a dict
refresh_access_token200_response_from_dict = RefreshAccessToken200Response.from_dict(refresh_access_token200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


