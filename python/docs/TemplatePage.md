# TemplatePage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** | How many results in all. | 
**next** | **str** | The next page, or null. | 
**previous** | **str** | The previous page, or null. | 
**results** | [**List[Template]**](Template.md) |  | 

## Example

```python
from signedly.models.template_page import TemplatePage

# TODO update the JSON string below
json = "{}"
# create an instance of TemplatePage from a JSON string
template_page_instance = TemplatePage.from_json(json)
# print the JSON string representation of the object
print(TemplatePage.to_json())

# convert the object into a dict
template_page_dict = template_page_instance.to_dict()
# create an instance of TemplatePage from a dict
template_page_from_dict = TemplatePage.from_dict(template_page_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


