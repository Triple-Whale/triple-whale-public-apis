import express, { Request, Response } from 'express';
import ViteExpress from 'vite-express';
import * as dotenv from 'dotenv';
import crypto from 'crypto'
import querystring from 'node:querystring'
import chalk from 'chalk'
import fetch from 'cross-fetch'
import { LocalStorage } from 'node-localstorage'
import moment from 'moment'

// Types
import { ParsedQs } from 'qs'
import { twResponse } from './src/Types'

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
let REFRESH_TOKEN = localStorage.getItem('REFRESH_TOKEN') || false
let LOCAL_SECRET = localStorage.getItem('LOCAL_SECRET') || false
if(!LOCAL_SECRET) {
  LOCAL_SECRET = crypto.randomBytes(20).toString('hex');
  localStorage.setItem('LOCAL_SECRET', LOCAL_SECRET)
}

// -----------------------
// Helpers
// -----------------------
const refresh = async(res?: Response) => {
  console.log(chalk.magenta(`[refresh] token re-requested`))

  // Exchange the refresh token for a fresh token
  const url = "https://api.triplewhale.com/api/v2/auth/oauth2/token";

  const options = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: querystring.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN
    })
  };

  fetch(url, options)
    .then(response => response.json())
    .then((response) => {
        const token = response.access_token;
        const refresh = response.refresh_token;

        if(token && refresh) {
          localStorage.setItem('TOKEN', token)
          localStorage.setItem('REFRESH_TOKEN', refresh)

          TOKEN = token
          REFRESH_TOKEN = refresh
          console.log(chalk.magenta(`[refresh] new token acquired`))

        } else {
          console.log(chalk.magenta(`[refresh] error refreshing token`, response.error))
        }

        if(res) res.json(response)
    })
    .catch((err) => {
      console.log(chalk.red('[refresh] error refreshing token', err))
      if(res) res.json(err)
    })
}

const responseChecker = async (response: twResponse) => {
  if(response.code == 401) {
    await refresh()
  }
}

// -----------------------
// Login -- first step of oauth flow
// -----------------------
app.get("/login", (_req: Request, res: Response) => {
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
app.get("/callback", (req: Request, res: Response) => {
  // Get the authorization code from the query parameters
  const code : string | ParsedQs | string[] | ParsedQs[] | undefined = req.query.code?.toString();

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
      // This is your token
      const token = response.access_token;

      // This is used to refresh this token when it expires
      const refresh = response.refresh_token;

      // For local dev, cache token in localStorage
      localStorage.setItem('TOKEN', token)
      localStorage.setItem('REFRESH_TOKEN', refresh)

      TOKEN = token
      REFRESH_TOKEN = refresh
      console.log(chalk.magenta(`[callback] token acquired`))

      res.redirect("/");
    })
    .catch((err) => {
      res.json(err)
    })
});

// -----------------------
// Refresh token
// -----------------------
app.get('/refresh', async (_req: Request, res: Response) => {
  await refresh(res)
})

// -----------------------
// Test API requests
// -----------------------
app.post("/get-orders-with-journeys", (req: Request, res: Response) => {
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
      responseChecker(response)
      res.json(response)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
});

app.post("/get-orders-with-journeys-v2", (req: Request, res: Response) => {
  const url = "https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys-v2"

  const data = {
    shop: SHOP_URL,
    state: LOCAL_SECRET,
    startDate: req.body?.startDate || "2022-12-01",
    endDate: req.body?.endDate || "2022-12-02"
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
      responseChecker(response)
      res.json(response)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
});

app.get("/get-metrics", (req: Request, res: Response) => {
  const start = req.query?.start || moment().subtract(7, 'day').startOf('day').format('YYYY-MM-DD')
  const end = req.query?.end || moment().endOf('day').format('YYYY-MM-DD')
  const url = `https://api.triplewhale.com/api/v2/tw-metrics/metrics-data?service_id=${CLIENT_ID}&account_id=${SHOP_URL}&start=${start}&end=${end}`

  fetch(url, {
     headers: { 
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`
    }
  })
    .then(response => response.json())
    .then((response) => {
      responseChecker(response)
      res.json(response)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
});

app.post('/post-metrics', (req: Request, res: Response) => {
  const url = "https://api.triplewhale.com/api/v2/tw-metrics/metrics"
  const metrics = req.body?.metrics || false
  if(!metrics) res.json({
    code: 403,
    message: 'Please provide metrics',
    error: true
  })

  const data = {
    account_id: SHOP_URL,
    data: [
      {
        date: req.body?.date || moment().startOf('day').format('YYYY-MM-DD'),
        hour: req.body?.hour || moment().startOf('day').format('HH'),
        metrics
      }
    ]
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
      responseChecker(response)
      res.json(response)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
})

// -----------------------
// are we logged in? -- for frontend
// -----------------------
app.get("/logged-in", (req: Request, res: Response) => {
  res.json({ token: TOKEN })
})

ViteExpress.listen(app, port, () => {
  console.log(appName + chalk.green(`🐳🐳🐳 listening http://localhost:${port}`))
  console.log(
    appName + (
      !!CLIENT_ID 
      && !!CLIENT_SECRET 
      && !!REDIRECT_URI 
      && !!SCOPE 
      ? chalk.green(`required data is present 🎉`) 
      : chalk.red(`🛑 please provide required .env data`)
    )
  )
});