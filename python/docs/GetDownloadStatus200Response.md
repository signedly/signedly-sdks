# GetDownloadStatus200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**download_status** | **bool** | True once GET /ap1/document/download-link/ gives the signed PDF. | [optional] 
**id** | **str** | The document&#39;s ID. | [optional] 

## Example

```python
from signedly.models.get_download_status200_response import GetDownloadStatus200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetDownloadStatus200Response from a JSON string
get_download_status200_response_instance = GetDownloadStatus200Response.from_json(json)
# print the JSON string representation of the object
print(GetDownloadStatus200Response.to_json())

# convert the object into a dict
get_download_status200_response_dict = get_download_status200_response_instance.to_dict()
# create an instance of GetDownloadStatus200Response from a dict
get_download_status200_response_from_dict = GetDownloadStatus200Response.from_dict(get_download_status200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


