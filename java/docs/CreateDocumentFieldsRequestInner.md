

# CreateDocumentFieldsRequestInner


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**align** | **Integer** | Text: 0 Left · 1 Center · 2 Right. |  [optional] |
|**checked** | **Boolean** | Checkbox: true starts it ticked. |  [optional] |
|**dateFormat** | **Integer** | Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy. |  [optional] |
|**documentId** | **UUID** | The document&#39;s ID. |  |
|**font** | [**FontEnum**](#FontEnum) | Text, Date and Dropdown: the font. |  [optional] |
|**fontSize** | **Integer** | Text and Dropdown: the font size in points. Date fields always use 10. |  [optional] |
|**formula** | **String** | Text field: makes it a calculated field, worked out when the document is sent from other fields by their labels in brackets, e.g. &#x60;round([CTC] * 40%)&#x60; or &#x60;if([Grade] &#x3D; \&quot;A\&quot;, 50000, 20000)&#x60;. Refused if a name is unknown or the formulas loop. |  [optional] |
|**groupName** | **String** | Radio: required; the name of the option group. |  [optional] |
|**height** | **Integer** | In PDF points (1/72 inch), whole: the field&#39;s height (each option&#39;s, for Radio). |  |
|**isMultiLine** | **Boolean** | Text: true lets the signer type several lines. |  [optional] |
|**isRequired** | **Boolean** | False lets the signer leave it empty. |  [optional] |
|**items** | [**List&lt;UpdateDocumentFieldByBodyRequestItemsInner&gt;**](UpdateDocumentFieldByBodyRequestItemsInner.md) | Radio: required; the options, at least two, each &#x60;width&#x60; x &#x60;height&#x60;. &#x60;selected&#x60; 1 starts that option chosen. |  [optional] |
|**kind** | **Integer** | The field&#39;s type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp. |  |
|**label** | **String** | The field&#39;s name, shown to the signer. |  |
|**maxLength** | **Integer** | Text: the most characters the signer may type (1–550). |  [optional] |
|**numberFormat** | **Object** | How a calculated number is shown, e.g. {\&quot;kind\&quot;: \&quot;number\&quot;, \&quot;style\&quot;: \&quot;indian\&quot;, \&quot;decimals\&quot;: 2} or {\&quot;kind\&quot;: \&quot;words\&quot;, \&quot;currency\&quot;: \&quot;INR\&quot;}. |  [optional] |
|**page** | **UUID** | The ID of the page the field is on (GET /ap1/documents/{id}/pages/). |  |
|**pageNumber** | **Integer** | That page&#39;s number, counting from 0 (the first page is 0). |  |
|**placeholder** | **String** | Hint text shown while the field is empty. Send an empty string for Checkbox and Radio. |  |
|**selectOptions** | **List&lt;String&gt;** | Dropdown: required; the choices the signer picks from, at least one (up to 100 characters each). |  [optional] |
|**signatoryId** | **UUID** | The signatory who fills in this field (from GET /ap1/signatories/). |  |
|**size** | **Integer** | Checkbox and Radio: the side of the tick or dot in points, centred in the box. Defaults to the box&#39;s smaller side. |  [optional] |
|**toolTip** | **String** | Shown when the signer points at the field. Defaults to the label. |  [optional] |
|**width** | **BigDecimal** | In PDF points (1/72 inch): the field&#39;s width (each option&#39;s, for Radio). The field must fit on its page. |  |
|**x** | **BigDecimal** | In PDF points (1/72 inch): from the page&#39;s left edge to the field&#39;s left edge. Required for every type but Radio (whose options have their own). |  [optional] |
|**y** | **BigDecimal** | In PDF points (1/72 inch): from the page&#39;s top edge to the field&#39;s top edge. Required for every type but Radio. |  [optional] |



## Enum: FontEnum

| Name | Value |
|---- | -----|
| ROBOTO | &quot;Roboto&quot; |
| OPEN_SANS | &quot;Open Sans&quot; |
| LATO | &quot;Lato&quot; |
| INTER | &quot;Inter&quot; |



