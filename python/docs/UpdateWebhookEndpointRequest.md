# UpdateWebhookEndpointRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**description** | **str** | Your note about it (up to 200 characters). | [optional] 
**events** | **List[str]** | The event types to send; leave out for all: &#x60;document.approved&#x60;, &#x60;document.completed&#x60;, &#x60;document.expired&#x60;, &#x60;document.rejected&#x60;, &#x60;document.sent&#x60;, &#x60;document.signed&#x60;, &#x60;document.viewed&#x60;. | [optional] 
**is_active** | **bool** | False stops sending events to it; true resumes. | [optional] 
**url** | **str** | Where to post events: https://, on a public internet address. Redirects aren&#39;t followed. | [optional] 

## Example

```python
from signedly.models.update_webhook_endpoint_request import UpdateWebhookEndpointRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateWebhookEndpointRequest from a JSON string
update_webhook_endpoint_request_instance = UpdateWebhookEndpointRequest.from_json(json)
# print the JSON string representation of the object
print(UpdateWebhookEndpointRequest.to_json())

# convert the object into a dict
update_webhook_endpoint_request_dict = update_webhook_endpoint_request_instance.to_dict()
# create an instance of UpdateWebhookEndpointRequest from a dict
update_webhook_endpoint_request_from_dict = UpdateWebhookEndpointRequest.from_dict(update_webhook_endpoint_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


