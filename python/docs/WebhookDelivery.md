# WebhookDelivery


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**attempts** | **int** | Tries so far. | [optional] [readonly] 
**created_at** | **datetime** | When the event was queued. | [optional] [readonly] 
**delivered_at** | **datetime** | When it succeeded, or null. | [optional] [readonly] 
**duration_ms** | **int** | How long the last try took. | [optional] [readonly] 
**event_id** | **str** | The event&#39;s ID (Signedly-Event-Id). | [optional] [readonly] 
**event_type** | **str** | e.g. document.signed | [optional] [readonly] 
**id** | **str** | The delivery&#39;s ID. | [optional] [readonly] 
**last_error** | **str** | Why the last try failed, or empty. | [optional] [readonly] 
**last_status_code** | **int** | Your endpoint&#39;s last HTTP answer, or null. | [optional] [readonly] 
**next_attempt_at** | **datetime** | When it is tried next, while pending. | [optional] [readonly] 
**payload** | **object** | The body sent. | [optional] [readonly] 
**response_snippet** | **str** | The start of your endpoint&#39;s last answer. | [optional] [readonly] 
**status** | **str** | pending (being tried), succeeded or failed. | [optional] [readonly] 

## Example

```python
from signedly.models.webhook_delivery import WebhookDelivery

# TODO update the JSON string below
json = "{}"
# create an instance of WebhookDelivery from a JSON string
webhook_delivery_instance = WebhookDelivery.from_json(json)
# print the JSON string representation of the object
print(WebhookDelivery.to_json())

# convert the object into a dict
webhook_delivery_dict = webhook_delivery_instance.to_dict()
# create an instance of WebhookDelivery from a dict
webhook_delivery_from_dict = WebhookDelivery.from_dict(webhook_delivery_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


