# CreateDocumentFromTemplateRequestRecipientsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **str** | Their email address. | 
**name** | **str** | The person&#39;s name. | 
**role** | **str** | The template role&#39;s name. | 

## Example

```python
from signedly.models.create_document_from_template_request_recipients_inner import CreateDocumentFromTemplateRequestRecipientsInner

# TODO update the JSON string below
json = "{}"
# create an instance of CreateDocumentFromTemplateRequestRecipientsInner from a JSON string
create_document_from_template_request_recipients_inner_instance = CreateDocumentFromTemplateRequestRecipientsInner.from_json(json)
# print the JSON string representation of the object
print(CreateDocumentFromTemplateRequestRecipientsInner.to_json())

# convert the object into a dict
create_document_from_template_request_recipients_inner_dict = create_document_from_template_request_recipients_inner_instance.to_dict()
# create an instance of CreateDocumentFromTemplateRequestRecipientsInner from a dict
create_document_from_template_request_recipients_inner_from_dict = CreateDocumentFromTemplateRequestRecipientsInner.from_dict(create_document_from_template_request_recipients_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


