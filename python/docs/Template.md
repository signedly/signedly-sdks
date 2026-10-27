# Template


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **datetime** | When it was made. | [optional] [readonly] 
**id** | **str** | The template&#39;s ID. | [optional] [readonly] 
**pages** | [**List[Page]**](Page.md) | Its pages, each with its fields. | [optional] 
**status** | **int** | 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired | [optional] 
**title** | **str** | The template&#39;s title. | [optional] 
**updated_at** | **datetime** | When it last changed. | [optional] [readonly] 
**upload** | [**Upload**](Upload.md) |  | [optional] 

## Example

```python
from signedly.models.template import Template

# TODO update the JSON string below
json = "{}"
# create an instance of Template from a JSON string
template_instance = Template.from_json(json)
# print the JSON string representation of the object
print(Template.to_json())

# convert the object into a dict
template_dict = template_instance.to_dict()
# create an instance of Template from a dict
template_from_dict = Template.from_dict(template_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


