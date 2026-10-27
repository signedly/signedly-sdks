# Upload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **datetime** | When it was uploaded. | [optional] [readonly] 
**id** | **str** | The upload&#39;s ID. | [optional] 
**is_test** | **bool** | Made with your test keys: a watermarked test document, not billed (see Sandbox). | [optional] [readonly] 
**mimetype** | **str** | The file&#39;s type. | [optional] 
**name** | **str** | The name given at upload. | [optional] 
**status** | **int** | 1 Uploading · 2 Uploaded · 3 Processing · 4 Processed · 5 Error | [optional] 
**type** | **int** | 2 Document · 4 Template | [optional] 
**updated_at** | **datetime** | When it last changed. | [optional] [readonly] 

## Example

```python
from signedly.models.upload import Upload

# TODO update the JSON string below
json = "{}"
# create an instance of Upload from a JSON string
upload_instance = Upload.from_json(json)
# print the JSON string representation of the object
print(Upload.to_json())

# convert the object into a dict
upload_dict = upload_instance.to_dict()
# create an instance of Upload from a dict
upload_from_dict = Upload.from_dict(upload_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


