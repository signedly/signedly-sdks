# RequestCountPage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** | How many results in all. | 
**next** | **str** | The next page, or null. | 
**previous** | **str** | The previous page, or null. | 
**results** | [**List[RequestHit]**](RequestHit.md) |  | 

## Example

```python
from signedly.models.request_count_page import RequestCountPage

# TODO update the JSON string below
json = "{}"
# create an instance of RequestCountPage from a JSON string
request_count_page_instance = RequestCountPage.from_json(json)
# print the JSON string representation of the object
print(RequestCountPage.to_json())

# convert the object into a dict
request_count_page_dict = request_count_page_instance.to_dict()
# create an instance of RequestCountPage from a dict
request_count_page_from_dict = RequestCountPage.from_dict(request_count_page_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


