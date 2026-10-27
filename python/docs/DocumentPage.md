# DocumentPage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** | How many results in all. | 
**next** | **str** | The next page, or null. | 
**previous** | **str** | The previous page, or null. | 
**results** | [**List[Document]**](Document.md) |  | 

## Example

```python
from signedly.models.document_page import DocumentPage

# TODO update the JSON string below
json = "{}"
# create an instance of DocumentPage from a JSON string
document_page_instance = DocumentPage.from_json(json)
# print the JSON string representation of the object
print(DocumentPage.to_json())

# convert the object into a dict
document_page_dict = document_page_instance.to_dict()
# create an instance of DocumentPage from a dict
document_page_from_dict = DocumentPage.from_dict(document_page_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


