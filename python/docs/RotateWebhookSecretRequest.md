# RotateWebhookSecretRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**expire_previous** | **bool** | True: the old secret stops signing at once. Default false: it keeps signing for 24 hours. | [optional] 

## Example

```python
from signedly.models.rotate_webhook_secret_request import RotateWebhookSecretRequest

# TODO update the JSON string below
json = "{}"
# create an instance of RotateWebhookSecretRequest from a JSON string
rotate_webhook_secret_request_instance = RotateWebhookSecretRequest.from_json(json)
# print the JSON string representation of the object
print(RotateWebhookSecretRequest.to_json())

# convert the object into a dict
rotate_webhook_secret_request_dict = rotate_webhook_secret_request_instance.to_dict()
# create an instance of RotateWebhookSecretRequest from a dict
rotate_webhook_secret_request_from_dict = RotateWebhookSecretRequest.from_dict(rotate_webhook_secret_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


