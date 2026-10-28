

# UploadDocumentForOneSignerRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**_file** | **File** | A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. |  |
|**signeeName** | **String** | The signer&#39;s name. |  |
|**signeeEmail** | **String** | The signer&#39;s email address. |  |
|**redirectUrl** | **URI** | Where the signer is sent after signing. |  |
|**finalEmail** | **String** | Who gets the signed PDF and audit trail by email. Without it, your organisation&#39;s admin does. |  [optional] |



