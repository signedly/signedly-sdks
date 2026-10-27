# WebhookEndpointWithSecret


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **datetime** | When made. | [optional] [readonly] 
**description** | **str** | Your note about it. | [optional] 
**disabled_at** | **datetime** | When Signedly switched it off, or null. | [optional] [readonly] 
**events** | **List[str]** | The event types to send (empty: all). | [optional] 
**failures_in_a_row** | **int** | Events that failed for good since the last success. | [optional] [readonly] 
**id** | **str** | The endpoint&#39;s ID. | [optional] [readonly] 
**is_active** | **bool** | False when you or Signedly switched it off; true switches it on. | [optional] 
**secret** | **str** | Signs every event (Signedly-Signature). Shown only when made or rotated: keep it. | [optional] [readonly] 
**updated_at** | **datetime** | Last change. | [optional] [readonly] 
**url** | **str** | Where events are posted: https://, public. | 

## Example

```python
from signedly.models.webhook_endpoint_with_secret import WebhookEndpointWithSecret

# TODO update the JSON string below
json = "{}"
# create an instance of WebhookEndpointWithSecret from a JSON string
webhook_endpoint_with_secret_instance = WebhookEndpointWithSecret.from_json(json)
# print the JSON string representation of the object
print(WebhookEndpointWithSecret.to_json())

# convert the object into a dict
webhook_endpoint_with_secret_dict = webhook_endpoint_with_secret_instance.to_dict()
# create an instance of WebhookEndpointWithSecret from a dict
webhook_endpoint_with_secret_from_dict = WebhookEndpointWithSecret.from_dict(webhook_endpoint_with_secret_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


