# DocumentStatusPage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** | How many results in all. | 
**next** | **str** | The next page, or null. | 
**previous** | **str** | The previous page, or null. | 
**results** | [**List[DocumentStatusRow]**](DocumentStatusRow.md) |  | 

## Example

```python
from signedly.models.document_status_page import DocumentStatusPage

# TODO update the JSON string below
json = "{}"
# create an instance of DocumentStatusPage from a JSON string
document_status_page_instance = DocumentStatusPage.from_json(json)
# print the JSON string representation of the object
print(DocumentStatusPage.to_json())

# convert the object into a dict
document_status_page_dict = document_status_page_instance.to_dict()
# create an instance of DocumentStatusPage from a dict
document_status_page_from_dict = DocumentStatusPage.from_dict(document_status_page_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


