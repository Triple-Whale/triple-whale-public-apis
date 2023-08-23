# Triple Whale Public APIs

Welcome to the documentation and examples for using the Triple Whale APIs! 

With the Triple Whale API, you can easily integrate our powerful analytics and attribution features into your own applications and workflows. The API provides two main endpoints for interacting with Triple Whale data:

## Available Endpoints

- **Summary Endpoint**: [[`/summary-page`](https://developers.triplewhale.com/swagger/index.html#/summary-page/summary-page-get-data-post)] - This endpoint allows you to extract all of your metrics from the summary page for a given timeframe.
  - Supported Methods:
    - POST

- **Metrics Endpoint**: [[`/tw-metrics`](https://developers.triplewhale.com/swagger/index.html#/summary/summary-add-metrics)] - This endpoint allows you to push custom metrics into the Triple Whale summary page/dashboard and extract any data pushed in to the summary page by your external service.
  - Supported Methods: 
    - POST [[`/tw-metrics/metrics`](https://developers.triplewhale.com/swagger/index.html#/summary/summary-get-metrics)]
    - GET [[`/tw-metrics/metrics-data`](https://developers.triplewhale.com/swagger/index.html#/summary/summary-add-metrics)]

- **Attribution Endpoint**: [[`/attribution/get-orders-with-journeys-v2`](https://developers.triplewhale.com/swagger/index.html#/attribution/attribution-get-orders-with-journeys-v2-post)] - With this endpoint, you can export full customer journey data for all customers who placed an order.
  - Supported Methods: 
    - POST
  - Please note, **v1 of this endpoint will soon be deprecated**.

To learn more about the specifics of each endpoint, and to explore the full range of available options, be sure to check out the [Swagger Docs](https://developers.triplewhale.com/swagger/index.html).

## Authentication

The Triple Whale API offers 2 forms of authentication:

### OAuth2
Triple Whale offers Oauth2 as an authentication method for third-parties looking to integrate with Triple Whale. In order to build an OAuth authenticated integration, you must first [register your app with the Triple Whale OAuth server via the Triple Whale website](https://developers.triplewhale.com/register-new-app). 

Make sure to include proper app and redirect URIs in your application, or your requests will be rejected by the OAuth server.

### Personal API Keys
For customers with access to a Triple Whale subscription, a personal API key can be generated from within the Triple Whale UI. In order to create a key, visit [the API Keys page in the app](https://app.triplewhale.com/api-keys) and click "Create Key". Be sure to select the correct scopes for the endpoints you intend to use and save your key somewhere safe once it is generated.

## Getting Started

For Oauth2 apps:

1. Register your app with Triple Whale
2. Receive your OAuth credentials from Triple Whale
3. Execute the OAuth flow and grant access to your shop
4. Retrieve the OAuth token and make authenticated requests to the API  

For customer using API Keys:

Visit [the API Keys page in the app](https://app.triplewhale.com/api-keys) and create a new key. You can test your key by making a curl request and passing in the x-api-key parameter in the header of your request.

```
curl https://api.triplewhale.com/api/v2/users/api-keys/me -H "x-api-key:
  <PUT_API_KEY_HERE>"
```

### Examples  

To help you get started, this repo contains a sample app that demonstrate how to set up the OAuth flow and execute requests. Be sure to try it out and feel free to customize it to suit your needs.

If you have any questions or need further assistance, please don't hesitate to [reach out to us.](mailto:kellet@triplewhale.com)

Thank you for choosing Triple Whale!
