# CreateDocumentFromTemplateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | The new document&#39;s name. It must differ from every other upload of this API client. | 
**recipients** | [**List[CreateDocumentFromTemplateRequestRecipientsInner]**](CreateDocumentFromTemplateRequestRecipientsInner.md) | Who fills each open role, by the role&#39;s name (as in the template, e.g. \&quot;Employee\&quot;): every open role exactly once. | [optional] 
**signing_order** | **bool** | True: recipients sign one after another in the roles&#39; order; false: all at once. Leave out for the template&#39;s setting. | [optional] 
**template_id** | **str** | The template&#39;s ID. | 

## Example

```python
from signedly.models.create_document_from_template_request import CreateDocumentFromTemplateRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CreateDocumentFromTemplateRequest from a JSON string
create_document_from_template_request_instance = CreateDocumentFromTemplateRequest.from_json(json)
# print the JSON string representation of the object
print(CreateDocumentFromTemplateRequest.to_json())

# convert the object into a dict
create_document_from_template_request_dict = create_document_from_template_request_instance.to_dict()
# create an instance of CreateDocumentFromTemplateRequest from a dict
create_document_from_template_request_from_dict = CreateDocumentFromTemplateRequest.from_dict(create_document_from_template_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


