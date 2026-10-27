

# Document


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**createdAt** | **OffsetDateTime** | When it was made. |  [optional] [readonly] |
|**documentName** | **String** | The document&#39;s name. |  [optional] [readonly] |
|**expiredAt** | **OffsetDateTime** | The last day it can be signed, or null. |  [optional] |
|**id** | **UUID** | The document&#39;s ID. |  [optional] [readonly] |
|**isBulkSigning** | **Boolean** | True for a copy made by a bulk send. |  [optional] |
|**isTemplate** | **Boolean** | Always false here. |  [optional] |
|**message** | **String** | The signing email&#39;s message, once sent. |  [optional] |
|**pages** | [**List&lt;Page&gt;**](Page.md) | Its pages, each with its fields. |  [optional] |
|**sentAt** | **OffsetDateTime** | When it was sent, or null. |  [optional] |
|**signatories** | [**List&lt;Signatory&gt;**](Signatory.md) | Who signs it. |  [optional] |
|**status** | **Integer** | 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired |  [optional] |
|**subject** | **String** | The signing email&#39;s subject, once sent. |  [optional] |
|**updatedAt** | **OffsetDateTime** | When it last changed. |  [optional] [readonly] |
|**upload** | [**Upload**](Upload.md) |  |  [optional] |



