# # WebhookDelivery

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**attempts** | **int** | Tries so far. | [optional] [readonly]
**created_at** | **\DateTime** | When the event was queued. | [optional] [readonly]
**delivered_at** | **\DateTime** | When it succeeded, or null. | [optional] [readonly]
**duration_ms** | **int** | How long the last try took. | [optional] [readonly]
**event_id** | **string** | The event&#39;s ID (Signedly-Event-Id). | [optional] [readonly]
**event_type** | **string** | e.g. document.signed | [optional] [readonly]
**id** | **string** | The delivery&#39;s ID. | [optional] [readonly]
**last_error** | **string** | Why the last try failed, or empty. | [optional] [readonly]
**last_status_code** | **int** | Your endpoint&#39;s last HTTP answer, or null. | [optional] [readonly]
**next_attempt_at** | **\DateTime** | When it is tried next, while pending. | [optional] [readonly]
**payload** | **object** | The body sent. | [optional] [readonly]
**response_snippet** | **string** | The start of your endpoint&#39;s last answer. | [optional] [readonly]
**status** | **string** | pending (being tried), succeeded or failed. | [optional] [readonly]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
