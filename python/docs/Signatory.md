# Signatory


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **datetime** | When they were added. | [optional] [readonly] 
**document_id** | **str** | The document&#39;s ID. | [optional] [readonly] 
**email** | **str** | The signatory&#39;s email address. | [optional] 
**id** | **str** | The signatory&#39;s ID. | [optional] [readonly] 
**name** | **str** | The signatory&#39;s name. | [optional] 
**position** | **int** | Their place in the signing order, from 0. | [optional] 
**require_email_otp** | **bool** | A one-time code is e-mailed to them when they open their link. | [optional] [default to False]
**status** | **int** | 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected | [optional] 
**updated_at** | **datetime** | When they last changed. | [optional] [readonly] 

## Example

```python
from signedly.models.signatory import Signatory

# TODO update the JSON string below
json = "{}"
# create an instance of Signatory from a JSON string
signatory_instance = Signatory.from_json(json)
# print the JSON string representation of the object
print(Signatory.to_json())

# convert the object into a dict
signatory_dict = signatory_instance.to_dict()
# create an instance of Signatory from a dict
signatory_from_dict = Signatory.from_dict(signatory_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


