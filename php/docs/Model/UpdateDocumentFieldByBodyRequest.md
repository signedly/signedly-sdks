# # UpdateDocumentFieldByBodyRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**align** | **int** | Text: 0 Left · 1 Center · 2 Right. | [optional]
**checked** | **bool** | Checkbox: true starts it ticked. | [optional] [default to false]
**date_format** | **int** | Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy. | [optional]
**document_id** | **string** | The document&#39;s ID. |
**element_id** | **string** | The ID of the field to change. |
**font** | **string** | Text, Date and Dropdown: the font. | [optional] [default to 'Roboto']
**font_size** | **int** | Text and Dropdown: the font size in points. Date fields always use 10. | [optional]
**formula** | **string** | Text field: makes it a calculated field, worked out when the document is sent from other fields by their labels in brackets, e.g. &#x60;round([CTC] * 40%)&#x60; or &#x60;if([Grade] &#x3D; \&quot;A\&quot;, 50000, 20000)&#x60;. Refused if a name is unknown or the formulas loop. | [optional]
**group_name** | **string** | Radio: required; the name of the option group. | [optional]
**height** | **int** | In PDF points (1/72 inch), whole: the field&#39;s height (each option&#39;s, for Radio). |
**is_multi_line** | **bool** | Text: true lets the signer type several lines. | [optional] [default to false]
**is_required** | **bool** | False lets the signer leave it empty. | [optional] [default to true]
**items** | [**\Signedly\Model\UpdateDocumentFieldByBodyRequestItemsInner[]**](UpdateDocumentFieldByBodyRequestItemsInner.md) | Radio: required; the options, at least two, each &#x60;width&#x60; x &#x60;height&#x60;. &#x60;selected&#x60; 1 starts that option chosen. | [optional]
**kind** | **int** | The field&#39;s type: 1 Text · 2 Signature · 3 Date · 4 Initials · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp. |
**label** | **string** | The field&#39;s name, shown to the signer. |
**max_length** | **int** | Text: the most characters the signer may type (1–550). | [optional]
**number_format** | **object** | How a calculated number is shown, e.g. {\&quot;kind\&quot;: \&quot;number\&quot;, \&quot;style\&quot;: \&quot;indian\&quot;, \&quot;decimals\&quot;: 2} or {\&quot;kind\&quot;: \&quot;words\&quot;, \&quot;currency\&quot;: \&quot;INR\&quot;}. | [optional]
**page** | **string** | The ID of the page the field is on (GET /ap1/documents/{id}/pages/). |
**page_number** | **int** | That page&#39;s number, counting from 0 (the first page is 0). |
**placeholder** | **string** | Hint text shown while the field is empty. Send an empty string for Checkbox and Radio. |
**select_options** | **string[]** | Dropdown: required; the choices the signer picks from, at least one (up to 100 characters each). | [optional]
**signatory_id** | **string** | The signatory who fills in this field (from GET /ap1/signatories/). |
**size** | **int** | Checkbox and Radio: the side of the tick or dot in points, centred in the box. Defaults to the box&#39;s smaller side. | [optional]
**tool_tip** | **string** | Shown when the signer points at the field. Defaults to the label. | [optional]
**width** | **float** | In PDF points (1/72 inch): the field&#39;s width (each option&#39;s, for Radio). The field must fit on its page. |
**x** | **float** | In PDF points (1/72 inch): from the page&#39;s left edge to the field&#39;s left edge. Required for every type but Radio (whose options have their own). | [optional]
**y** | **float** | In PDF points (1/72 inch): from the page&#39;s top edge to the field&#39;s top edge. Required for every type but Radio. | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
