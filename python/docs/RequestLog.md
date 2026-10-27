# RequestLog


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**body** | **str** | The request&#39;s body, credentials redacted. | [optional] 
**created_at** | **datetime** | When the call was made. | [optional] [readonly] 
**headers** | **str** | The request&#39;s headers, credentials redacted. | [optional] 
**id** | **str** | The call&#39;s ID. | [optional] [readonly] 
**ip_address** | **str** | The caller&#39;s IP address. | [optional] 
**method** | **str** | The HTTP method. | [optional] 
**path** | **str** | The path called. | [optional] 
**var_query_params** | **str** | The query parameters. | [optional] 

## Example

```python
from signedly.models.request_log import RequestLog

# TODO update the JSON string below
json = "{}"
# create an instance of RequestLog from a JSON string
request_log_instance = RequestLog.from_json(json)
# print the JSON string representation of the object
print(RequestLog.to_json())

# convert the object into a dict
request_log_dict = request_log_instance.to_dict()
# create an instance of RequestLog from a dict
request_log_from_dict = RequestLog.from_dict(request_log_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


