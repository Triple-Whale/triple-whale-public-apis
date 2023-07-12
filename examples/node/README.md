# 🐳 Triple Whale API Node App

For documentation on available endpoints and request structure, visit https://developers.triplewhale.com/swagger/index.html

## ⚡ Live demos

We have two live demos, both hosted on GCP. The first uses the OAuth flow, and the second uses an API key.

[OAuth Flow Example](https://client-cgrzlhwaka-uk.a.run.app/)

[API Key Example](https://node-api-key-cgrzlhwaka-uk.a.run.app)

## 🟡 Prerequesites

1. Ensure you have [node](https://nodejs.org/en/download/), [nvm](https://github.com/nvm-sh/nvm), and optionally [yarn](https://yarnpkg.com/getting-started/install) installed on your machine
1. Ensure you are using Node 18: `nvm use`
1. Install the `package.json` dependencies: `npm i` or `yarn`
1. Ensure you have a properly formatted `.env` file; an `.env.example` file has been provided

## 🧙‍♂️ Choose your own adventure

You can choose to use either the OAuth or API Key example, but not both.

### 🅰️ OAuth

You can obtain your OAuth credentials by visiting [https://developers.triplewhale.com/](https://developers.triplewhale.com/) and creating a new app.

Your `.env` file should contain the following:

```bash
# OAuth
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URL=
SHOP_URL=
SCOPE=
```

### 🔑 API Key

Your `.env` file should contain the following:

```bash
# API Key
SHOP_URL=
SCOPE=
API_KEY=
```

NOTE: the presence of API_KEY in your `.env` file negates the OAuth flow, and will be used instead of the bearer token.

## 🏁 Quickstart

```bash
## one-liner
nvm use && yarn && yarn dev
```

## 👨‍💻 Dev server

```bash
## npm
npm run dev

## OR

## yarn
yarn dev
```

## 🟢 Production server

```bash
## build the app
## then run express + vite in production mode
yarn start
```

## 🐋 Docker

We have included `Dockerfile` and `docker.compose`, which should enable you to host this app in a Docker container.

You can build and run the Docker image with the following commands:

```bash
# Build the image
yarn docker:build

# Run the image
yarn docker:compose
```

### ☁️ GCP Cloud Run

We have also included a `cloudbuild.yaml` file, which should enable you to host this app on GCP Cloud Run.

You can build and run the Cloud Run image with the following commands:

```bash
# Build and deploy
gcloud run deploy
```

## ⏸️ Caveats

This is **not production ready!**

This repository's purpose is to demonstrate interfacing with our API, and is not intended to be used in production.

Thus we use `node-localstorage` to store JWT data, which you will find under the `/scratch` folder. You should be able to drop in your own DB of choice, but we have not tested this yet.

## 😠 Common issues

### "I cannot install package.json"

- Ensure you have Node installed on your machine

- Ensure you are using the correct Node version, v18

- Ensure you are in the correct directory, eg: `<YOUR_PC>/triple-whale-public-apis/examples/node`

### "The CLI says I'm missing required data"

- Ensure you have a provided all required data in your `.env` file

### "I cannot complete the oAuth flow"

- Ensure your redirect URL and matches your `.env` file

- Ensure your, Client ID, and Client Secret are correct

### "I cannot make any requests to the backend"

- Ensure your bearer token has been acquired, is accurate, and is present within your `/scratch` folder (or DB of choice)

### "My app isn't approved yet, but I want to ___"

- You cannot interface with the TW API until your app is approved

### "I don't like how you did ___ in this example"

- We're always looking to improve; submit a pull request and we'll gladly review it!

### "Docker isn't working for me"

- Ensure you have Docker installed on your machine

### Feel free to submit a pull request if you have any requests or improvements!