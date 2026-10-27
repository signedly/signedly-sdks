

# WebhookEndpointWithSecret


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**createdAt** | **OffsetDateTime** | When made. |  [optional] [readonly] |
|**description** | **String** | Your note about it. |  [optional] |
|**disabledAt** | **OffsetDateTime** | When Signedly switched it off, or null. |  [optional] [readonly] |
|**events** | **List&lt;String&gt;** | The event types to send (empty: all). |  [optional] |
|**failuresInARow** | **Integer** | Events that failed for good since the last success. |  [optional] [readonly] |
|**id** | **UUID** | The endpoint&#39;s ID. |  [optional] [readonly] |
|**isActive** | **Boolean** | False when you or Signedly switched it off; true switches it on. |  [optional] |
|**secret** | **String** | Signs every event (Signedly-Signature). Shown only when made or rotated: keep it. |  [optional] [readonly] |
|**updatedAt** | **OffsetDateTime** | Last change. |  [optional] [readonly] |
|**url** | **URI** | Where events are posted: https://, public. |  |



