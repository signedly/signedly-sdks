

# CreateBulkSend202Response


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**documents** | **List&lt;Object&gt;** | Each document: id, status and its signatories&#39; email and status. |  [optional] |
|**documentsMade** | **Integer** | Documents made and sent so far. |  [optional] |
|**failedRows** | **List&lt;Object&gt;** | Rows that couldn&#39;t be sent, with why. |  [optional] |
|**id** | **UUID** | The bulk send&#39;s ID. |  [optional] |
|**isTest** | **Boolean** | Sent with test keys: its documents are test documents. |  [optional] |
|**sentAt** | **LocalDate** | The day it was sent. |  [optional] |
|**status** | **Integer** | 1 Created · 2 CSV Uploaded · 3 Sent · 4 Ready |  [optional] |
|**templateId** | **UUID** | Its template. |  [optional] |
|**totalDocuments** | **Integer** | Rows in the file: one document each. |  [optional] |



