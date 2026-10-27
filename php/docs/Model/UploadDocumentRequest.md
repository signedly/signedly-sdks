# # UploadDocumentRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**file** | **\SplFileObject** | A PDF or DOCX file. At most 2 MB. |
**name** | **string** | The document&#39;s name. It must differ from every other upload of this API client. |
**type** | **int** | 2 Document · 4 Template |
**template_name** | **string** | The template&#39;s title. Required with &#x60;type&#x60; 4; it must differ from this API client&#39;s other templates. | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
