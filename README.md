# Triple Whale Public APIs

Welcome to the documentation and examples for using the Triple Whale APIs! 

With the Triple Whale API, you can easily integrate our powerful analytics and attribution features into your own applications and workflows. The API provides two main endpoints for interacting with Triple Whale data:

## Available Endpoints

- **Metrics Endpoint**: [[`/tw-metrics/metrics`](https://developers.triplewhale.com/swagger/index.html#/summary/summary-add-metrics)] - This endpoint allows you to push custom metrics into the Triple Whale summary page/dashboard and extract summary page data.
  - Supported Methods: 
    - POST
    - GET

- **Attribution Endpoint**: [[`/attribution/get-orders-with-journeys`](https://developers.triplewhale.com/swagger/index.html#/attribution/attribution-get-orders-with-journeys-post)] - With this endpoint, you can export full customer journey data for all customers who placed an order.
  - Supported Methods: 
    - POST

To learn more about the specifics of each endpoint, and to explore the full range of available options, be sure to check out the [Swagger Docs](https://developers.triplewhale.com/swagger/index.html).

## Authentication

The Triple Whale API uses OAuth2 for authentication. In order to access the API, you must first [register your app with the Triple Whale OAuth server via the Triple Whale website](https://developers.triplewhale.com/register-new-app). 

Make sure to include proper app and redirect URIs in your application, or your requests will be rejected by the OAuth server.

## Getting Started

To get started with the Triple Whale API, just follow these basic steps:

1. Register your app with Triple Whale
2. Receive your OAuth credentials from Triple Whale
3. Execute the OAuth flow and grant access to your shop
4. Retrieve the OAuth token and make authenticated requests to the API

**Examples** 
To help you get started, this repo contains a sample app that demonstrate how to set up the OAuth flow and execute requests. Be sure to it out and feel free to customize it to suit your needs.

If you have any questions or need further assistance, please don't hesitate to [reach out to us.](mailto:kellet@triplewhale.com)

Thank you for choosing Triple Whale!
