# WebhookEndpoint


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
**updated_at** | **datetime** | Last change. | [optional] [readonly] 
**url** | **str** | Where events are posted: https://, public. | 

## Example

```python
from signedly.models.webhook_endpoint import WebhookEndpoint

# TODO update the JSON string below
json = "{}"
# create an instance of WebhookEndpoint from a JSON string
webhook_endpoint_instance = WebhookEndpoint.from_json(json)
# print the JSON string representation of the object
print(WebhookEndpoint.to_json())

# convert the object into a dict
webhook_endpoint_dict = webhook_endpoint_instance.to_dict()
# create an instance of WebhookEndpoint from a dict
webhook_endpoint_from_dict = WebhookEndpoint.from_dict(webhook_endpoint_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


