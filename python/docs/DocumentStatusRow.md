# DocumentStatusRow


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | The document&#39;s ID. | 
**status** | **int** | 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired | 

## Example

```python
from signedly.models.document_status_row import DocumentStatusRow

# TODO update the JSON string below
json = "{}"
# create an instance of DocumentStatusRow from a JSON string
document_status_row_instance = DocumentStatusRow.from_json(json)
# print the JSON string representation of the object
print(DocumentStatusRow.to_json())

# convert the object into a dict
document_status_row_dict = document_status_row_instance.to_dict()
# create an instance of DocumentStatusRow from a dict
document_status_row_from_dict = DocumentStatusRow.from_dict(document_status_row_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


