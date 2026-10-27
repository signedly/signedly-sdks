

# Field


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**align** | **Integer** | Text: 0 Left · 1 Center · 2 Right. |  [optional] |
|**checked** | **Boolean** | Checkbox: ticked or not. |  [optional] |
|**createdAt** | **OffsetDateTime** | When the field was added. |  [optional] [readonly] |
|**dateFormat** | **Integer** | Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy. |  [optional] |
|**font** | **String** | Text, Date and Dropdown: the font. |  [optional] |
|**fontSize** | **Integer** | Text and Dropdown: the font size in points (Date: 10). |  [optional] |
|**formula** | **String** | A calculated field&#39;s formula, or null. |  [optional] |
|**groupName** | **String** | Radio: the option group&#39;s name. |  [optional] |
|**height** | **Integer** | In PDF points (1/72 inch): the field&#39;s height. |  [optional] |
|**id** | **UUID** | The field&#39;s ID. |  [optional] [readonly] |
|**isMultiLine** | **Boolean** | Text: the signer may type several lines. |  [optional] |
|**isRequired** | **Boolean** | False: the signer may leave it empty. |  [optional] |
|**items** | **List&lt;Object&gt;** | Radio: the options, each &#x60;{x, y, selected}&#x60;. |  [optional] |
|**kind** | **Integer** | The field&#39;s type: 1 Text · 2 Signature · 3 Date · 4 Initials · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp. |  [optional] |
|**label** | **String** | The field&#39;s name, shown to the signer. |  [optional] |
|**maxLength** | **Integer** | Text: the most characters the signer may type. |  [optional] |
|**numberFormat** | **Object** | How a calculated number is shown, or null. |  [optional] |
|**page** | **UUID** | The ID of the page the field is on. |  [optional] |
|**pageNumber** | **Integer** | That page&#39;s number, counting from 0. |  [optional] |
|**placeholder** | **String** | Hint text shown while the field is empty. |  [optional] |
|**selectOptions** | **List&lt;String&gt;** | Dropdown: the choices the signer picks from. |  [optional] |
|**signatoryId** | **UUID** | The ID of the signatory who fills it in. |  [optional] |
|**size** | **Integer** | Checkbox and Radio: the side of the tick or dot in points. |  [optional] |
|**toolTip** | **String** | Shown when the signer points at the field. |  [optional] |
|**updatedAt** | **OffsetDateTime** | When the field last changed. |  [optional] [readonly] |
|**value** | **String** | The field&#39;s current value. |  [optional] |
|**width** | **BigDecimal** | In PDF points (1/72 inch): the field&#39;s width. |  [optional] |
|**x** | **BigDecimal** | In PDF points (1/72 inch): from the page&#39;s left edge to the field&#39;s left edge. |  [optional] |
|**y** | **BigDecimal** | In PDF points (1/72 inch): from the page&#39;s top edge to the field&#39;s top edge. |  [optional] |



