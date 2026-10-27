

# WebhookDelivery


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**attempts** | **Integer** | Tries so far. |  [optional] [readonly] |
|**createdAt** | **OffsetDateTime** | When the event was queued. |  [optional] [readonly] |
|**deliveredAt** | **OffsetDateTime** | When it succeeded, or null. |  [optional] [readonly] |
|**durationMs** | **Integer** | How long the last try took. |  [optional] [readonly] |
|**eventId** | **UUID** | The event&#39;s ID (Signedly-Event-Id). |  [optional] [readonly] |
|**eventType** | **String** | e.g. document.signed |  [optional] [readonly] |
|**id** | **UUID** | The delivery&#39;s ID. |  [optional] [readonly] |
|**lastError** | **String** | Why the last try failed, or empty. |  [optional] [readonly] |
|**lastStatusCode** | **Integer** | Your endpoint&#39;s last HTTP answer, or null. |  [optional] [readonly] |
|**nextAttemptAt** | **OffsetDateTime** | When it is tried next, while pending. |  [optional] [readonly] |
|**payload** | **Object** | The body sent. |  [optional] [readonly] |
|**responseSnippet** | **String** | The start of your endpoint&#39;s last answer. |  [optional] [readonly] |
|**status** | **String** | pending (being tried), succeeded or failed. |  [optional] [readonly] |



