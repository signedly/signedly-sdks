# WebhookDeliveryPage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** | How many results in all. | 
**next** | **str** | The next page, or null. | 
**previous** | **str** | The previous page, or null. | 
**results** | [**List[WebhookDelivery]**](WebhookDelivery.md) |  | 

## Example

```python
from signedly.models.webhook_delivery_page import WebhookDeliveryPage

# TODO update the JSON string below
json = "{}"
# create an instance of WebhookDeliveryPage from a JSON string
webhook_delivery_page_instance = WebhookDeliveryPage.from_json(json)
# print the JSON string representation of the object
print(WebhookDeliveryPage.to_json())

# convert the object into a dict
webhook_delivery_page_dict = webhook_delivery_page_instance.to_dict()
# create an instance of WebhookDeliveryPage from a dict
webhook_delivery_page_from_dict = WebhookDeliveryPage.from_dict(webhook_delivery_page_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


