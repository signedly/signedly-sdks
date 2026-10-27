

# RefreshAccessToken200Response


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**accessToken** | **String** | Send as &#x60;Authorization: Bearer &lt;access_token&gt;&#x60;. |  [optional] |
|**expired** | **Boolean** | True once a call was made with the expired token. |  [optional] |
|**expiryDate** | **OffsetDateTime** | When the access token expires (2 hours after it was made). |  [optional] |
|**refreshToken** | **String** | Gets a new access token at /ap1/refreshtoken/. |  [optional] |
|**refreshTokenExpiryDate** | **OffsetDateTime** | When the refresh token expires (7 days after it was made). |  [optional] |
|**updatedAt** | **OffsetDateTime** | When the tokens last changed. |  [optional] |



