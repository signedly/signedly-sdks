# CreateBulkSend202Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**documents** | **List[object]** | Each document: id, status and its signatories&#39; email and status. | [optional] 
**documents_made** | **int** | Documents made and sent so far. | [optional] 
**failed_rows** | **List[object]** | Rows that couldn&#39;t be sent, with why. | [optional] 
**id** | **str** | The bulk send&#39;s ID. | [optional] 
**is_test** | **bool** | Sent with test keys: its documents are test documents. | [optional] 
**sent_at** | **date** | The day it was sent. | [optional] 
**status** | **int** | 1 Created · 2 CSV Uploaded · 3 Sent · 4 Ready | [optional] 
**template_id** | **str** | Its template. | [optional] 
**total_documents** | **int** | Rows in the file: one document each. | [optional] 

## Example

```python
from signedly.models.create_bulk_send202_response import CreateBulkSend202Response

# TODO update the JSON string below
json = "{}"
# create an instance of CreateBulkSend202Response from a JSON string
create_bulk_send202_response_instance = CreateBulkSend202Response.from_json(json)
# print the JSON string representation of the object
print(CreateBulkSend202Response.to_json())

# convert the object into a dict
create_bulk_send202_response_dict = create_bulk_send202_response_instance.to_dict()
# create an instance of CreateBulkSend202Response from a dict
create_bulk_send202_response_from_dict = CreateBulkSend202Response.from_dict(create_bulk_send202_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


