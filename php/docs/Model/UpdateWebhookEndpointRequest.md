# # UpdateWebhookEndpointRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**description** | **string** | Your note about it (up to 200 characters). | [optional]
**events** | **string[]** | The event types to send; leave out for all: &#x60;document.approved&#x60;, &#x60;document.completed&#x60;, &#x60;document.expired&#x60;, &#x60;document.rejected&#x60;, &#x60;document.sent&#x60;, &#x60;document.signed&#x60;, &#x60;document.viewed&#x60;. | [optional]
**is_active** | **bool** | False stops sending events to it; true resumes. | [optional]
**url** | **string** | Where to post events: https://, on a public internet address. Redirects aren&#39;t followed. | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
