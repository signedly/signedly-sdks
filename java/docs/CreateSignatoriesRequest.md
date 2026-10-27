

# CreateSignatoriesRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**documentId** | **UUID** | The document&#39;s ID. |  |
|**isOrderedSigning** | **Boolean** | True: they sign one after another, in this order, each emailed when it is their turn. False (the default): all are emailed at once. |  [optional] |
|**signatories** | [**List&lt;CreateSignatoriesRequestSignatoriesInner&gt;**](CreateSignatoriesRequestSignatoriesInner.md) | The signatories, at least one. |  |



