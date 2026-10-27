# RequestLogPage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** | How many results in all. | 
**next** | **str** | The next page, or null. | 
**previous** | **str** | The previous page, or null. | 
**results** | [**List[RequestLog]**](RequestLog.md) |  | 

## Example

```python
from signedly.models.request_log_page import RequestLogPage

# TODO update the JSON string below
json = "{}"
# create an instance of RequestLogPage from a JSON string
request_log_page_instance = RequestLogPage.from_json(json)
# print the JSON string representation of the object
print(RequestLogPage.to_json())

# convert the object into a dict
request_log_page_dict = request_log_page_instance.to_dict()
# create an instance of RequestLogPage from a dict
request_log_page_from_dict = RequestLogPage.from_dict(request_log_page_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


