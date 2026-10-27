# GetAuditTrailLink200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**url** | **str** | A link to the PDF, valid for about 7 days. | [optional] 

## Example

```python
from signedly.models.get_audit_trail_link200_response import GetAuditTrailLink200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetAuditTrailLink200Response from a JSON string
get_audit_trail_link200_response_instance = GetAuditTrailLink200Response.from_json(json)
# print the JSON string representation of the object
print(GetAuditTrailLink200Response.to_json())

# convert the object into a dict
get_audit_trail_link200_response_dict = get_audit_trail_link200_response_instance.to_dict()
# create an instance of GetAuditTrailLink200Response from a dict
get_audit_trail_link200_response_from_dict = GetAuditTrailLink200Response.from_dict(get_audit_trail_link200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


