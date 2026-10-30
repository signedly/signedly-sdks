# CreateSignatoriesRequestSignatoriesInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **str** | The signatory&#39;s email address. | 
**name** | **str** | The signatory&#39;s name. | 
**require_email_otp** | **bool** | True: whenever they open their signing link, a one-time code is e-mailed to them first (needs Personal Pro, Business Pro or Teams; see Plans). | [optional] [default to False]

## Example

```python
from signedly.models.create_signatories_request_signatories_inner import CreateSignatoriesRequestSignatoriesInner

# TODO update the JSON string below
json = "{}"
# create an instance of CreateSignatoriesRequestSignatoriesInner from a JSON string
create_signatories_request_signatories_inner_instance = CreateSignatoriesRequestSignatoriesInner.from_json(json)
# print the JSON string representation of the object
print(CreateSignatoriesRequestSignatoriesInner.to_json())

# convert the object into a dict
create_signatories_request_signatories_inner_dict = create_signatories_request_signatories_inner_instance.to_dict()
# create an instance of CreateSignatoriesRequestSignatoriesInner from a dict
create_signatories_request_signatories_inner_from_dict = CreateSignatoriesRequestSignatoriesInner.from_dict(create_signatories_request_signatories_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


