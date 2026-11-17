

# SendDocument200ResponseExistingSignatures

Whether the uploaded PDF already had digital signatures (Adobe, DocuSign, a DSC or Aadhaar eSign). Signing it on Signedly invalidates them; the request is never refused for it. `existing_signatures.count` is how many (null when the file couldn't be checked, e.g. an encrypted PDF, or a document uploaded before the check existed), `existing_signatures.names` the signers' names where readable, and `warnings` the text to show your user (empty when there is nothing to warn about).

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**count** | **Integer** | How many digital signatures the PDF already had; null when unknown. |  [optional] |
|**names** | **List&lt;String&gt;** | The signers&#39; names (certificate common name), each once; may be fewer than &#x60;count&#x60;. |  [optional] |



