

# UpdateWebhookEndpointRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**description** | **String** | Your note about it (up to 200 characters). |  [optional] |
|**events** | [**List&lt;EventsEnum&gt;**](#List&lt;EventsEnum&gt;) | The event types to send; leave out for all: &#x60;document.approved&#x60;, &#x60;document.completed&#x60;, &#x60;document.expired&#x60;, &#x60;document.rejected&#x60;, &#x60;document.sent&#x60;, &#x60;document.signed&#x60;, &#x60;document.viewed&#x60;. |  [optional] |
|**isActive** | **Boolean** | False stops sending events to it; true resumes. |  [optional] |
|**url** | **String** | Where to post events: https://, on a public internet address. Redirects aren&#39;t followed. |  [optional] |



## Enum: List&lt;EventsEnum&gt;

| Name | Value |
|---- | -----|
| APPROVED | &quot;document.approved&quot; |
| COMPLETED | &quot;document.completed&quot; |
| EXPIRED | &quot;document.expired&quot; |
| REJECTED | &quot;document.rejected&quot; |
| SENT | &quot;document.sent&quot; |
| SIGNED | &quot;document.signed&quot; |
| VIEWED | &quot;document.viewed&quot; |



