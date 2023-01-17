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

## "Production" server

`yarn build && yarn preview` 

or 

`npm run build && npm run preview`

## Caveats

This is ***NOT*** production ready! 

This repository's purpose is to demonstrate the process of authorizing your app with Triple Whale, obtaining a JWT, and requesting data from our API.

## Common Issues

### "I cannot complete the oauth flow"

- Make sure your redirect URL and matches your `.env` file

- Make sure your, Client ID, and Client Secret are correct

### "I cannot make any requests to the backend"

- Make sure your bearer token is acquired, and accurate

### "My app isn't approved yet, but I want to ___"

- You cannot interface with the TW API until your app is approved