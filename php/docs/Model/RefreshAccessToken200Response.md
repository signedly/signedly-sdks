# # RefreshAccessToken200Response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**access_token** | **string** | Send as &#x60;Authorization: Bearer &lt;access_token&gt;&#x60;. | [optional]
**expired** | **bool** | True once a call was made with the expired token. | [optional]
**expiry_date** | **\DateTime** | When the access token expires (2 hours after it was made). | [optional]
**refresh_token** | **string** | Gets a new access token at /ap1/refreshtoken/. | [optional]
**refresh_token_expiry_date** | **\DateTime** | When the refresh token expires (7 days after it was made). | [optional]
**updated_at** | **\DateTime** | When the tokens last changed. | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
