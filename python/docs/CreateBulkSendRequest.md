# CreateBulkSendRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**expiry_date** | **date** | The last day the document can be signed, YYYY-MM-DD; it must be in the future. | 
**finish_redirect_url** | **str** | Where signers go after signing. | [optional] 
**message** | **str** | The emails&#39; message; may use {{column}} tags. | [optional] 
**reject_redirect_url** | **str** | Where signers go after declining. | [optional] 
**rows** | **List[Dict[str, object]]** | Instead of &#x60;file&#x60;: one object per document, {column: value}. | [optional] 
**subject** | **str** | The emails&#39; subject; may use {{column}} tags. | 
**template_id** | **str** | The template&#39;s ID. | 

## Example

```python
from signedly.models.create_bulk_send_request import CreateBulkSendRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CreateBulkSendRequest from a JSON string
create_bulk_send_request_instance = CreateBulkSendRequest.from_json(json)
# print the JSON string representation of the object
print(CreateBulkSendRequest.to_json())

# convert the object into a dict
create_bulk_send_request_dict = create_bulk_send_request_instance.to_dict()
# create an instance of CreateBulkSendRequest from a dict
create_bulk_send_request_from_dict = CreateBulkSendRequest.from_dict(create_bulk_send_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


