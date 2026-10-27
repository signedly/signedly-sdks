# # SendDocumentRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_id** | **string** | The document&#39;s ID. |
**expiry_date** | **\DateTime** | The last day the document can be signed, YYYY-MM-DD; it must be in the future. |
**message** | **string** | The email&#39;s message. |
**reminder_before_expiry_days** | **int** | One more reminder this many days before the deadline (2–30); 0 is off. Every signatory still waiting is also reminded the day before it. | [optional]
**reminder_every_days** | **int** | Automatic reminders: email each signatory who hasn&#39;t signed yet every this many days (1–30) after they were asked; 0 is off. Left out, your organisation&#39;s default applies (off unless set in the web app). | [optional]
**reminder_max** | **int** | At most this many automatic reminders per signatory (1–10; 3 if left out while &#x60;reminder_every_days&#x60; is on). | [optional]
**subject** | **string** | The email&#39;s subject. |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
