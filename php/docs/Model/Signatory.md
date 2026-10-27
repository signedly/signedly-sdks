# # Signatory

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **\DateTime** | When they were added. | [optional] [readonly]
**document_id** | **string** | The document&#39;s ID. | [optional] [readonly]
**email** | **string** | The signatory&#39;s email address. | [optional]
**id** | **string** | The signatory&#39;s ID. | [optional] [readonly]
**name** | **string** | The signatory&#39;s name. | [optional]
**position** | **int** | Their place in the signing order, from 0. | [optional]
**require_email_otp** | **bool** | A one-time code is e-mailed to them when they open their link. | [optional] [default to false]
**status** | **int** | 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected | [optional]
**updated_at** | **\DateTime** | When they last changed. | [optional] [readonly]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
