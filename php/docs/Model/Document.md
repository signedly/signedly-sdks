# # Document

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **\DateTime** | When it was made. | [optional] [readonly]
**document_name** | **string** | The document&#39;s name. | [optional] [readonly]
**expired_at** | **\DateTime** | The last day it can be signed, or null. | [optional]
**id** | **string** | The document&#39;s ID. | [optional] [readonly]
**is_bulk_signing** | **bool** | True for a copy made by a bulk send. | [optional]
**is_template** | **bool** | Always false here. | [optional]
**message** | **string** | The signing email&#39;s message, once sent. | [optional]
**pages** | [**\Signedly\Model\Page[]**](Page.md) | Its pages, each with its fields. | [optional]
**sent_at** | **\DateTime** | When it was sent, or null. | [optional]
**signatories** | [**\Signedly\Model\Signatory[]**](Signatory.md) | Who signs it. | [optional]
**status** | **int** | 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired | [optional]
**subject** | **string** | The signing email&#39;s subject, once sent. | [optional]
**updated_at** | **\DateTime** | When it last changed. | [optional] [readonly]
**upload** | [**\Signedly\Model\Upload**](Upload.md) |  | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
