

# UploadDocumentForOneSigner200Response


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**existingSignatures** | [**SendDocument200ResponseExistingSignatures**](SendDocument200ResponseExistingSignatures.md) |  |  [optional] |
|**id** | **UUID** | The document&#39;s ID. |  [optional] |
|**redirectUrl** | **URI** | The signer&#39;s signing link (not the &#x60;redirect_url&#x60; you sent). |  [optional] |
|**warnings** | **List&lt;String&gt;** | Warnings about the document, e.g. that signing will invalidate its existing digital signatures. Empty when there are none. |  [optional] |



