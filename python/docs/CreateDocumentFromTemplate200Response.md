# CreateDocumentFromTemplate200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **datetime** | When it was made. | [optional] 
**id** | **str** | The new document&#39;s ID. | [optional] 
**mimetype** | **str** | The file type, e.g. &#x60;application/pdf&#x60;. | [optional] 
**name** | **str** | Its name. | [optional] 
**status** | **int** | Its status: 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. | [optional] 
**type** | **int** | Always 2 (Document). | [optional] 
**updated_at** | **datetime** | When it last changed. | [optional] 

## Example

```python
from signedly.models.create_document_from_template200_response import CreateDocumentFromTemplate200Response

# TODO update the JSON string below
json = "{}"
# create an instance of CreateDocumentFromTemplate200Response from a JSON string
create_document_from_template200_response_instance = CreateDocumentFromTemplate200Response.from_json(json)
# print the JSON string representation of the object
print(CreateDocumentFromTemplate200Response.to_json())

# convert the object into a dict
create_document_from_template200_response_dict = create_document_from_template200_response_instance.to_dict()
# create an instance of CreateDocumentFromTemplate200Response from a dict
create_document_from_template200_response_from_dict = CreateDocumentFromTemplate200Response.from_dict(create_document_from_template200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


