# # Field

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**align** | **int** | Text: 0 Left · 1 Center · 2 Right. | [optional]
**checked** | **bool** | Checkbox: ticked or not. | [optional] [default to false]
**created_at** | **\DateTime** | When the field was added. | [optional] [readonly]
**date_format** | **int** | Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy. | [optional]
**font** | **string** | Text, Date and Dropdown: the font. | [optional] [default to 'Roboto']
**font_size** | **int** | Text and Dropdown: the font size in points (Date: 10). | [optional]
**formula** | **string** | A calculated field&#39;s formula, or null. | [optional]
**group_name** | **string** | Radio: the option group&#39;s name. | [optional]
**height** | **int** | In PDF points (1/72 inch): the field&#39;s height. | [optional]
**id** | **string** | The field&#39;s ID. | [optional] [readonly]
**is_multi_line** | **bool** | Text: the signer may type several lines. | [optional]
**is_required** | **bool** | False: the signer may leave it empty. | [optional]
**items** | **object[]** | Radio: the options, each &#x60;{x, y, selected}&#x60;. | [optional]
**kind** | **int** | The field&#39;s type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp. | [optional]
**label** | **string** | The field&#39;s name, shown to the signer. | [optional]
**max_length** | **int** | Text: the most characters the signer may type. | [optional]
**number_format** | **object** | How a calculated number is shown, or null. | [optional]
**page** | **string** | The ID of the page the field is on. | [optional]
**page_number** | **int** | That page&#39;s number, counting from 0. | [optional]
**placeholder** | **string** | Hint text shown while the field is empty. | [optional]
**select_options** | **string[]** | Dropdown: the choices the signer picks from. | [optional]
**signatory_id** | **string** | The ID of the signatory who fills it in. | [optional]
**size** | **int** | Checkbox and Radio: the side of the tick or dot in points. | [optional]
**tool_tip** | **string** | Shown when the signer points at the field. | [optional]
**updated_at** | **\DateTime** | When the field last changed. | [optional] [readonly]
**value** | **string** | The field&#39;s current value. | [optional]
**width** | **float** | In PDF points (1/72 inch): the field&#39;s width. | [optional]
**x** | **float** | In PDF points (1/72 inch): from the page&#39;s left edge to the field&#39;s left edge. | [optional]
**y** | **float** | In PDF points (1/72 inch): from the page&#39;s top edge to the field&#39;s top edge. | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
