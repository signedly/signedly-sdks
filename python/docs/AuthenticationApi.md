# signedly.AuthenticationApi

All URIs are relative to *https://l0ads.signedly.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_access_token**](AuthenticationApi.md#get_access_token) | **POST** /ap1/token/ | Get an access token
[**refresh_access_token**](AuthenticationApi.md#refresh_access_token) | **POST** /ap1/refreshtoken/ | Refresh the access token


# **get_access_token**
> RefreshAccessToken200Response get_access_token(data)

Get an access token

Exchanges your client ID and secret (Account & Settings → API in the web app) for an access token, valid 2 hours, and a refresh token, valid 7 days. While both are still valid, the same pair is returned again; once either has expired, a new pair is made. Your test keys get a test token of their own (see Sandbox).

### Example


```python
import signedly
from signedly.models.get_access_token_request import GetAccessTokenRequest
from signedly.models.refresh_access_token200_response import RefreshAccessToken200Response
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)


# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.AuthenticationApi(api_client)
    data = signedly.GetAccessTokenRequest() # GetAccessTokenRequest | 

    try:
        # Get an access token
        api_response = api_instance.get_access_token(data)
        print("The response of AuthenticationApi->get_access_token:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthenticationApi->get_access_token: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**GetAccessTokenRequest**](GetAccessTokenRequest.md)|  | 

### Return type

[**RefreshAccessToken200Response**](RefreshAccessToken200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The tokens. |  -  |
**400** | &#x60;client_id&#x60; or &#x60;client_secret&#x60; is missing. |  -  |
**403** | No client has this ID and secret. |  -  |
**429** | More than 60 calls a minute from this IP address. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **refresh_access_token**
> RefreshAccessToken200Response refresh_access_token(data)

Refresh the access token

Makes a new access token, valid 2 hours, with the refresh token. The refresh token itself isn't renewed: when it expires (7 days after /ap1/token/ made it), call /ap1/token/ again.

### Example


```python
import signedly
from signedly.models.refresh_access_token200_response import RefreshAccessToken200Response
from signedly.models.refresh_access_token_request import RefreshAccessTokenRequest
from signedly.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://l0ads.signedly.com
# See configuration.py for a list of all supported configuration parameters.
configuration = signedly.Configuration(
    host = "https://l0ads.signedly.com"
)


# Enter a context with an instance of the API client
with signedly.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = signedly.AuthenticationApi(api_client)
    data = signedly.RefreshAccessTokenRequest() # RefreshAccessTokenRequest | 

    try:
        # Refresh the access token
        api_response = api_instance.refresh_access_token(data)
        print("The response of AuthenticationApi->refresh_access_token:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthenticationApi->refresh_access_token: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**RefreshAccessTokenRequest**](RefreshAccessTokenRequest.md)|  | 

### Return type

[**RefreshAccessToken200Response**](RefreshAccessToken200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | The new access token, with the same refresh token. |  -  |
**400** | &#x60;refresh_token&#x60; is missing. |  -  |
**403** | The refresh token is unknown (&#x60;Token not found&#x60;) or has expired (&#x60;Refresh Token expired&#x60;). |  -  |
**429** | More than 60 calls a minute from this IP address. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

