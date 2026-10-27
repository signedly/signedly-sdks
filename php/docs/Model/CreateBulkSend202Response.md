# # CreateBulkSend202Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**documents** | **object[]** | Each document: id, status and its signatories&#39; email and status. | [optional]
**documents_made** | **int** | Documents made and sent so far. | [optional]
**failed_rows** | **object[]** | Rows that couldn&#39;t be sent, with why. | [optional]
**id** | **string** | The bulk send&#39;s ID. | [optional]
**is_test** | **bool** | Sent with test keys: its documents are test documents. | [optional]
**sent_at** | **\DateTime** | The day it was sent. | [optional]
**status** | **int** | 1 Created · 2 CSV Uploaded · 3 Sent · 4 Ready | [optional]
**template_id** | **string** | Its template. | [optional]
**total_documents** | **int** | Rows in the file: one document each. | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
