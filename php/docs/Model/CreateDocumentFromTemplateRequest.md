# # CreateDocumentFromTemplateRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | The new document&#39;s name. It must differ from every other upload of this API client. |
**recipients** | [**\Signedly\Model\CreateDocumentFromTemplateRequestRecipientsInner[]**](CreateDocumentFromTemplateRequestRecipientsInner.md) | Who fills each open role, by the role&#39;s name (as in the template, e.g. \&quot;Employee\&quot;): every open role exactly once. | [optional]
**signing_order** | **bool** | True: recipients sign one after another in the roles&#39; order; false: all at once. Leave out for the template&#39;s setting. | [optional]
**template_id** | **string** | The template&#39;s ID. |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
