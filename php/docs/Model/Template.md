# # Template

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **\DateTime** | When it was made. | [optional] [readonly]
**id** | **string** | The template&#39;s ID. | [optional] [readonly]
**pages** | [**\Signedly\Model\Page[]**](Page.md) | Its pages, each with its fields. | [optional]
**status** | **int** | 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired | [optional]
**title** | **string** | The template&#39;s title. | [optional]
**updated_at** | **\DateTime** | When it last changed. | [optional] [readonly]
**upload** | [**\Signedly\Model\Upload**](Upload.md) |  | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
