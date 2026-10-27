# # CreateSignatoriesRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**document_id** | **string** | The document&#39;s ID. |
**is_ordered_signing** | **bool** | True: they sign one after another, in this order, each emailed when it is their turn. False (the default): all are emailed at once. | [optional] [default to false]
**signatories** | [**\Signedly\Model\CreateSignatoriesRequestSignatoriesInner[]**](CreateSignatoriesRequestSignatoriesInner.md) | The signatories, at least one. |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
