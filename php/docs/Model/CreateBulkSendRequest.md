# # CreateBulkSendRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**expiry_date** | **\DateTime** | The last day the document can be signed, YYYY-MM-DD; it must be in the future. |
**finish_redirect_url** | **string** | Where signers go after signing. | [optional]
**message** | **string** | The emails&#39; message; may use {{column}} tags. | [optional]
**reject_redirect_url** | **string** | Where signers go after declining. | [optional]
**rows** | **array<string,mixed>[]** | Instead of &#x60;file&#x60;: one object per document, {column: value}. | [optional]
**subject** | **string** | The emails&#39; subject; may use {{column}} tags. |
**template_id** | **string** | The template&#39;s ID. |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
