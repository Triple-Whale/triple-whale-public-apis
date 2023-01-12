# Triple Whale API Node App

For documentation on available endpoints and request structure, visit https://developers.triplewhale.com

## Prerequesites

1. Ensure you have [node](https://nodejs.org/en/download/), [nvm](https://github.com/nvm-sh/nvm), and optionally [yarn](https://yarnpkg.com/getting-started/install) installed on your machine
1. Ensure you are using Node 18: `nvm use`
1. Install the `package.json` dependencies: `npm i` or `yarn`
2. Ensure you have a properly formatted `.env` file; an `.env.example` file has been provided

## Dev server

`npm run dev` or `yarn dev`

## "Production" server

`npm start` or `yarn`

## Caveats

This is ***NOT*** production ready! 

This repository's purpose is to demonstrate the process of authorizing your app with Triple Whale, obtaining a JWT, and requesting data from our API.