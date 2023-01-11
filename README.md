# triple-whale-public-apis
Documentation and examples for using the Triple Whale APIs

## Available Endpoints
The Triple Whale API currently offers two public endpoints for interacting with Triple Whale Data:

-**Metrics Endpoint**: You can use our Metrics end to push custom metrics into the Triple Whale summary page/dashboard, or extract summary page data.

-**Attribution Endpoint**: With our Attribution endpoint you can export full customer journey data for all customers who placed an order

## Swagger Docs 
https://developers.triplewhale.com/swagger/index.html

## Authentication
The Triple Whale API uses Oauth2 for authentication. In order to access the API, you must first [register your app with the Triple Whale Oauth server via the Triple Whale website](https://developers.triplewhale.com/register-new-app). Be sure to include proper app and redirect uris in your application, or your requests will be rejected by the Oauth server.

## Getting Started
The basic steps to get started are as follows:
-Register your app with Triple Whale
-Receive your Oauth credentials from Triple Whale
-Using your supplied credentials, execute Oauth flow and grant access to your shop
-Retrieve Oauth token and make authenticated request to API

**See examples in this repo for setting up Oauth flow and executing requests**
