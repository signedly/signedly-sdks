# CreateSignatoryRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_id** | **str** | The document&#39;s ID. | 
**email** | **str** | The signatory&#39;s email address; the signing link goes there. | 
**name** | **str** | The signatory&#39;s name. | 
**require_email_otp** | **bool** | True: whenever they open their signing link, a one-time code is e-mailed to them first (needs a plan with signer access codes). | [optional] [default to False]

## Example

```python
from signedly.models.create_signatory_request import CreateSignatoryRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CreateSignatoryRequest from a JSON string
create_signatory_request_instance = CreateSignatoryRequest.from_json(json)
# print the JSON string representation of the object
print(CreateSignatoryRequest.to_json())

# convert the object into a dict
create_signatory_request_dict = create_signatory_request_instance.to_dict()
# create an instance of CreateSignatoryRequest from a dict
create_signatory_request_from_dict = CreateSignatoryRequest.from_dict(create_signatory_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


