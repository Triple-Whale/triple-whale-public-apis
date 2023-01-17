# Triple Whale API Node App

For documentation on available endpoints and request structure, visit https://developers.triplewhale.com/swagger/index.html

`nvm use && yarn && yarn dev`

## Prerequesites

1. Ensure you have [node](https://nodejs.org/en/download/), [nvm](https://github.com/nvm-sh/nvm), and optionally [yarn](https://yarnpkg.com/getting-started/install) installed on your machine
1. Ensure you are using Node 18: `nvm use`
1. Install the `package.json` dependencies: `npm i` or `yarn`
2. Ensure you have a properly formatted `.env` file; an `.env.example` file has been provided

## Dev server

You can use npm or yarn to get started, simply

`npm run dev` 

or

`yarn dev`

## Production server

`yarn build && yarn preview` 

or 

`npm run build && npm run preview`

## Caveats

This is **not production ready!**

This repository's purpose is to demonstrate the process of authorizing your app with Triple Whale, obtaining a JWT, and requesting data from our API.

## Common Issues

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

We're always looking to improve; submit a pull request and we'll gladly review it!