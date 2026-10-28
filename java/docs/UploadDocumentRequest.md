

# UploadDocumentRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**_file** | **File** | A PDF or DOCX file. A PDF that can&#39;t be read (damaged, or not really a PDF) is refused with 400 and the reason; save or export it as a new PDF and upload that. At most 2 MB. |  |
|**name** | **String** | The document&#39;s name. It must differ from every other upload of this API client. |  |
|**type** | [**TypeEnum**](#TypeEnum) | 2 Document · 4 Template |  |
|**templateName** | **String** | The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. |  [optional] |



## Enum: TypeEnum

| Name | Value |
|---- | -----|
| NUMBER_2 | 2 |
| NUMBER_4 | 4 |



