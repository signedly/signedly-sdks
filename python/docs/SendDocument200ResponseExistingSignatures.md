# SendDocument200ResponseExistingSignatures

Whether the uploaded PDF already had digital signatures (Adobe, DocuSign, a DSC or Aadhaar eSign). Signing it on Signedly invalidates them; the request is never refused for it. `existing_signatures.count` is how many (null when the file couldn't be checked, e.g. an encrypted PDF, or a document uploaded before the check existed), `existing_signatures.names` the signers' names where readable, and `warnings` the text to show your user (empty when there is nothing to warn about).

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **int** | How many digital signatures the PDF already had; null when unknown. | [optional] 
**names** | **List[str]** | The signers&#39; names (certificate common name), each once; may be fewer than &#x60;count&#x60;. | [optional] 

## Example

```python
from signedly.models.send_document200_response_existing_signatures import SendDocument200ResponseExistingSignatures

# TODO update the JSON string below
json = "{}"
# create an instance of SendDocument200ResponseExistingSignatures from a JSON string
send_document200_response_existing_signatures_instance = SendDocument200ResponseExistingSignatures.from_json(json)
# print the JSON string representation of the object
print(SendDocument200ResponseExistingSignatures.to_json())

# convert the object into a dict
send_document200_response_existing_signatures_dict = send_document200_response_existing_signatures_instance.to_dict()
# create an instance of SendDocument200ResponseExistingSignatures from a dict
send_document200_response_existing_signatures_from_dict = SendDocument200ResponseExistingSignatures.from_dict(send_document200_response_existing_signatures_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


