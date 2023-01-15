import express from "express";
import ViteExpress from "vite-express";
import * as dotenv from 'dotenv';
import crypto from 'crypto'
import querystring from 'querystring'
import chalk from 'chalk'
import fetch from 'cross-fetch'
import { LocalStorage } from 'node-localstorage'
import moment from 'moment'

// -----------------------
// express app
// -----------------------
const app = express()
const port = 8888
const appName = chalk.hex('#1877f2')('[triple-whale] ')
app.use(express.json())

// -----------------------
// data
// -----------------------
dotenv.config()
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SHOP_URL, SCOPE } = process.env

const localStorage = new LocalStorage('./scratch')
let TOKEN = localStorage.getItem('TOKEN') || false
let LOCAL_SECRET = localStorage.getItem('LOCAL_SECRET') || false
if(!LOCAL_SECRET) {
  LOCAL_SECRET = crypto.randomBytes(20).toString('hex');
  localStorage.setItem('LOCAL_SECRET', LOCAL_SECRET)
}


// -----------------------
// Login -- first step of oauth flow
// -----------------------
app.get("/login", (req, res) => {
  // Authorization URL
  const authUrl = "https://api.triplewhale.com/api/v2/auth/oauth2/auth"

  // Request parameters
  const params = {
    client_id: CLIENT_ID,
    scope: SCOPE,
    response_type: "code",
    state: LOCAL_SECRET,
    redirect_uri: REDIRECT_URI,
  };

  const redirect = `${authUrl}?${querystring.stringify(params)}`
  console.log(chalk.magenta(`[redirect] url: ${redirect}`))
  
  res.send({
    // Encode the url with the params
    redirect
  })
});

// -----------------------
// Callback - second step with oauth flow
// -----------------------
app.get("/callback", (req, res) => {
  // Get the authorization code from the query parameters
  const code = req.query.code;

  // Exchange the authorization code for an access token
  const url = "https://api.triplewhale.com/api/v2/auth/oauth2/token";

  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
  };

  const options = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: querystring.stringify(data),
  };

  fetch(url, options)
    .then(response => response.json())
    .then((response) => {
      // THIS IS YOUR TOKEN FOR AUTHENTICATING API REQUESTS
      const token = response.access_token;

      // Your token has an expiry date. 
      // In order to get a new token, you will need to store the refresh token in your database.
      // const refreshToken = JSON.parse(body).refresh_token;

      // For local dev, cache token in localStorage
      localStorage.setItem('TOKEN', token)
      TOKEN = token
      console.log(chalk.magenta(`[callback] token acquired`))

      res.redirect("/");
    })
    .catch((err) => {
      res.json(err)
    })
});

// -----------------------
// Test API Requests - third step in flow
// -----------------------

app.post("/get-orders-with-journeys", (req, res) => {
  const url = "https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys"

  const data = {
    shop: SHOP_URL,
    state: LOCAL_SECRET,
    startDate: req.body?.startDate || "2022-12-01",
    endDate: req.body?.endDate || "2022-12-02",
    page: req.body?.page || 0
  }
  
  const options = {
    method: "POST",
    headers: { 
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify(data)
  };

  fetch(url, options)
    .then(response => response.json())
    .then((response) => {
      if(response.code == 401) {
        localStorage.removeItem('TOKEN')
        localStorage.removeItem('LOCAL_SECRET')
        console.log(appName + chalk.red(`token expired! please restart your app`))
      }

      res.json(response)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
});

app.get("/get-metrics", (req, res) => {
  const url = `https://api.triplewhale.com/api/v2/tw-metrics/metrics-data?service_id=attribution&account_id=${SHOP_URL}&start=${moment().subtract(7, 'day').startOf('day').format('YYYY-MM-DD')}&end=${moment().endOf('day').format('YYYY-MM-DD')}`

  // @TODO why isn't this returning any data?
  console.log(url)
  
  fetch(url, {
     headers: { 
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`
    }
  })
    .then(response => response.text())
    .then((response) => {
      res.json(response)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
});

// -----------------------
// are we logged in? -- for frontend
// -----------------------
app.get("/logged-in", (req, res) => {
  res.json({ token: TOKEN })
})

// -----------------------
// date ranges
// -----------------------
app.get("/date-ranges", (req, res) => {
  res.json([
    {
      value: {
        start: moment().startOf('day'),
        end: moment().endOf('day'),
        id: 'today'
      },
      label: 'Today'
    },
    {
      value: {
        start: moment().subtract(1, 'day').startOf('day'),
        end: moment().subtract(1, 'day').startOf('day'), //.endOf('day') // bug with endOf day
        id: 'yesterday'
      },
      label: 'Yesterday'
    },
    {
      value: {
        start: moment().subtract(7, 'days').startOf('day'),
        end: moment().subtract(1, 'day').endOf('day'),
        id: 'last7Days'
      },
      label: 'Last 7 days'
    },
    {
      value: {
        start: moment().subtract(30, 'days').startOf('day'),
        end: moment().subtract(1, 'day').endOf('day'),
        id: 'last30Days'
      },
      label: 'Last 30 days'
    },
    {
      value: {
        start: moment().subtract(90, 'days').startOf('day'),
        end: moment().subtract(1, 'day').endOf('day'),
        id: 'last90Days'
      },
      label: 'Last 90 days'
    }
  ])
})

ViteExpress.listen(app, port, () => {
  console.log(appName + chalk.green(`🐳🐳🐳 listening http://localhost:${port}`))
  console.log(
    appName + (
      !!CLIENT_ID 
      && !!CLIENT_SECRET 
      && REDIRECT_URI 
      && SCOPE 
      ? chalk.green(`required data is present 🎉`) 
      : chalk.red(`🛑 please provide required .env data`)
    )
  )
});