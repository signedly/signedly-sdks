

# CreateDocumentFromTemplateRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**name** | **String** | The new document&#39;s name. It must differ from every other upload of this API client. |  |
|**recipients** | [**List&lt;CreateDocumentFromTemplateRequestRecipientsInner&gt;**](CreateDocumentFromTemplateRequestRecipientsInner.md) | Who fills each open role, by the role&#39;s name (as in the template, e.g. \&quot;Employee\&quot;): every open role exactly once. |  [optional] |
|**signingOrder** | **Boolean** | True: recipients sign one after another in the roles&#39; order; false: all at once. Leave out for the template&#39;s setting. |  [optional] |
|**templateId** | **UUID** | The template&#39;s ID. |  |



