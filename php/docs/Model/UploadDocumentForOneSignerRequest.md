# # UploadDocumentForOneSignerRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**file** | **\SplFileObject** | A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. |
**signee_name** | **string** | The signer&#39;s name. |
**signee_email** | **string** | The signer&#39;s email address. |
**redirect_url** | **string** | Where the signer is sent after signing. |
**final_email** | **string** | Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
