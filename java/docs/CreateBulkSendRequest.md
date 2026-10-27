

# CreateBulkSendRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**expiryDate** | **LocalDate** | The last day the document can be signed, YYYY-MM-DD; it must be in the future. |  |
|**finishRedirectUrl** | **String** | Where signers go after signing. |  [optional] |
|**message** | **String** | The emails&#39; message; may use {{column}} tags. |  [optional] |
|**rejectRedirectUrl** | **String** | Where signers go after declining. |  [optional] |
|**rows** | **List&lt;Map&lt;String, Object&gt;&gt;** | Instead of &#x60;file&#x60;: one object per document, {column: value}. |  [optional] |
|**subject** | **String** | The emails&#39; subject; may use {{column}} tags. |  |
|**templateId** | **UUID** | The template&#39;s ID. |  |



