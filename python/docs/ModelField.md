# ModelField


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**align** | **int** | Text: 0 Left · 1 Center · 2 Right. | [optional] 
**checked** | **bool** | Checkbox: ticked or not. | [optional] [default to False]
**created_at** | **datetime** | When the field was added. | [optional] [readonly] 
**date_format** | **int** | Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy. | [optional] 
**font** | **str** | Text, Date and Dropdown: the font. | [optional] [default to 'Roboto']
**font_size** | **int** | Text and Dropdown: the font size in points (Date: 10). | [optional] 
**formula** | **str** | A calculated field&#39;s formula, or null. | [optional] 
**group_name** | **str** | Radio: the option group&#39;s name. | [optional] 
**height** | **int** | In PDF points (1/72 inch): the field&#39;s height. | [optional] 
**id** | **str** | The field&#39;s ID. | [optional] [readonly] 
**is_multi_line** | **bool** | Text: the signer may type several lines. | [optional] 
**is_required** | **bool** | False: the signer may leave it empty. | [optional] 
**items** | **List[object]** | Radio: the options, each &#x60;{x, y, selected}&#x60;. | [optional] 
**kind** | **int** | The field&#39;s type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp. | [optional] 
**label** | **str** | The field&#39;s name, shown to the signer. | [optional] 
**max_length** | **int** | Text: the most characters the signer may type. | [optional] 
**number_format** | **object** | How a calculated number is shown, or null. | [optional] 
**page** | **str** | The ID of the page the field is on. | [optional] 
**page_number** | **int** | That page&#39;s number, counting from 0. | [optional] 
**placeholder** | **str** | Hint text shown while the field is empty. | [optional] 
**select_options** | **List[str]** | Dropdown: the choices the signer picks from. | [optional] 
**signatory_id** | **str** | The ID of the signatory who fills it in. | [optional] 
**size** | **int** | Checkbox and Radio: the side of the tick or dot in points. | [optional] 
**tool_tip** | **str** | Shown when the signer points at the field. | [optional] 
**updated_at** | **datetime** | When the field last changed. | [optional] [readonly] 
**value** | **str** | The field&#39;s current value. | [optional] 
**width** | **float** | In PDF points (1/72 inch): the field&#39;s width. | [optional] 
**x** | **float** | In PDF points (1/72 inch): from the page&#39;s left edge to the field&#39;s left edge. | [optional] 
**y** | **float** | In PDF points (1/72 inch): from the page&#39;s top edge to the field&#39;s top edge. | [optional] 

## Example

```python
from signedly.models.model_field import ModelField

# TODO update the JSON string below
json = "{}"
# create an instance of ModelField from a JSON string
model_field_instance = ModelField.from_json(json)
# print the JSON string representation of the object
print(ModelField.to_json())

# convert the object into a dict
model_field_dict = model_field_instance.to_dict()
# create an instance of ModelField from a dict
model_field_from_dict = ModelField.from_dict(model_field_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


