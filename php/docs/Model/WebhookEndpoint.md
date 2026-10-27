# # WebhookEndpoint

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **\DateTime** | When made. | [optional] [readonly]
**description** | **string** | Your note about it. | [optional]
**disabled_at** | **\DateTime** | When Signedly switched it off, or null. | [optional] [readonly]
**events** | **string[]** | The event types to send (empty: all). | [optional]
**failures_in_a_row** | **int** | Events that failed for good since the last success. | [optional] [readonly]
**id** | **string** | The endpoint&#39;s ID. | [optional] [readonly]
**is_active** | **bool** | False when you or Signedly switched it off; true switches it on. | [optional]
**updated_at** | **\DateTime** | Last change. | [optional] [readonly]
**url** | **string** | Where events are posted: https://, public. |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
