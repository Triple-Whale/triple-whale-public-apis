import express, { Request, Response } from 'express'
import ViteExpress from 'vite-express'
import * as dotenv from 'dotenv'
import crypto from 'crypto'
import querystring from 'node:querystring'
import chalk from 'chalk'
import fetch from 'cross-fetch'
import { LocalStorage } from 'node-localstorage'
import moment from 'moment'

// Types
import { ParsedQs } from 'qs'
import {
  oldOrder,
  oldOrders,
  ordersWithJourneyOld,
  newOrder,
  newOrders,
  ordersWithJourneyNew,
  GlobalHeaders,
} from './src/types/Types'

// -----------------------
// express app
// -----------------------
const app = express()
const port = 3000
const appName = chalk.hex('#1877f2')('[triple-whale] ')
app.use(express.json())

// -----------------------
// data
// -----------------------
dotenv.config()
const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  SHOP_URL,
  SCOPE,
  NODE_ENV,
  API_KEY,
} = process.env

let LOCAL_TIME = new Date().getTime() / 1000

const localStorage = new LocalStorage('./scratch')
let TOKEN = localStorage.getItem('TOKEN') || false
let REFRESH_TOKEN = localStorage.getItem('REFRESH_TOKEN') || false
let LOCAL_SECRET = localStorage.getItem('LOCAL_SECRET') || false
if (!LOCAL_SECRET) {
  LOCAL_SECRET = crypto.randomBytes(20).toString('hex')
  localStorage.setItem('LOCAL_SECRET', LOCAL_SECRET)
}

// -----------------------
// Helpers
// -----------------------
const refresh = async (res?: Response) => {
  console.log(chalk.magenta(`[refresh] token re-requested`))

  // Exchange the refresh token for a fresh token
  const url = 'https://api.triplewhale.com/api/v2/auth/oauth2/token'

  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  }

  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      const token = response.access_token
      const refresh = response.refresh_token

      if (token && refresh) {
        localStorage.setItem('TOKEN', token)
        localStorage.setItem('REFRESH_TOKEN', refresh)

        TOKEN = token
        REFRESH_TOKEN = refresh
        console.log(chalk.magenta(`[refresh] new token acquired`))
      } else {
        console.log(
          chalk.magenta(`[refresh] error refreshing token`, response.error)
        )
      }

      if (res && response.error) {
        res.json(response)
      } else {
        res?.redirect('/')
      }
    })
    .catch((err) => {
      console.log(chalk.red('[refresh] error refreshing token', err))
      if (res) res.json(err)
    })
}

const globalHeaders = (): GlobalHeaders =>
  !API_KEY
    ? {
        'content-type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      }
    : {
        'content-type': 'application/json',
        'x-api-key': API_KEY,
      }

// -----------------------
// Refresh every 10 min
// -----------------------
if (!API_KEY) {
  setInterval(
    () => CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN && refresh(),
    600000
  )
}

const responseChecker = async (response: any) => {
  const currentTime = new Date().getTime() / 1000

  // auto-refresh token every 10 minutes
  if (!API_KEY && currentTime - LOCAL_TIME >= 600) {
    await refresh()
    LOCAL_TIME = new Date().getTime() / 1000
  }

  if (response.code == 401) {
    if (!API_KEY) await refresh()
    throw response
  }
}

// -----------------------
// Login -- first step of oauth flow
// -----------------------
app.get('/login', (_req: Request, res: Response) => {
  // Authorization URL
  const authUrl = 'https://api.triplewhale.com/api/v2/auth/oauth2/auth'

  // Request parameters
  const params = {
    client_id: CLIENT_ID,
    scope: SCOPE,
    response_type: 'code',
    state: LOCAL_SECRET,
    redirect_uri: REDIRECT_URI,
  }

  const redirect = `${authUrl}?${querystring.stringify(params)}`
  console.log(chalk.magenta(`[redirect] url: ${redirect}`))

  res.send({
    // Encode the url with the params
    redirect,
  })
})

// -----------------------
// Callback - second step with oauth flow
// -----------------------
app.get('/callback', (req: Request, res: Response) => {
  // Get the authorization code from the query parameters
  const code: string | ParsedQs | string[] | ParsedQs[] | undefined =
    req.query.code?.toString()

  // Exchange the authorization code for an access token
  const url = 'https://api.triplewhale.com/api/v2/auth/oauth2/token'

  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
  }

  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify(data),
  }

  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      if (response.access_token) {
        // This is your token
        const token = response.access_token

        // This is used to refresh this token when it expires
        const refresh = response.refresh_token

        // For local dev, cache token in localStorage
        localStorage.setItem('TOKEN', token)
        localStorage.setItem('REFRESH_TOKEN', refresh)

        TOKEN = token
        REFRESH_TOKEN = refresh
        console.log(chalk.magenta(`[callback] token acquired`))

        res.redirect('/')
      } else {
        console.log(
          chalk.red(`[callback] error acquiring token, ${response.error}`)
        )

        res.json(response)
      }
    })
    .catch((err) => {
      res.json(err)
    })
})

// -----------------------
// Refresh token
// -----------------------
app.get('/refresh', async (_req: Request, res: Response) => {
  await refresh(res)
})

// -----------------------
// API endpoints
// -----------------------
app.post('/get-orders-with-journeys', (req: Request, res: Response) => {
  const url =
    'https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys'

  let data = {
    shop: SHOP_URL,
    state: LOCAL_SECRET,
    startDate: req.body?.startDate || '2022-12-01',
    endDate: req.body?.endDate || '2022-12-02',
    page: req.body?.page || 0,
  }

  let ordersWithJourneys: oldOrders[] = []
  async function fetchOrdersWithJourneys() {
    const options = {
      method: 'POST',
      headers: globalHeaders(),
      body: JSON.stringify(data),
    }

    try {
      await fetch(url, options)
        .then((response) => response.json())
        .then(async (response: ordersWithJourneyOld) => {
          await responseChecker(response)
          ordersWithJourneys = ordersWithJourneys.concat(
            response.ordersWithJourneys?.filter(
              (order: oldOrder) => order
            ) as oldOrders
          )

          if (response.nextPage) {
            data.page += 1
            return await fetchOrdersWithJourneys()
          } else {
            res.json(ordersWithJourneys)
          }
        })
    } catch (err) {
      console.error(err)
      res.json(err)
    }
  }

  fetchOrdersWithJourneys()
})

app.post('/get-orders-with-journeys-v2', (req: Request, res: Response) => {
  const url =
    'https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys-v2'

  let data = {
    shop: SHOP_URL,
    state: LOCAL_SECRET,
    startDate: req.body?.startDate || '2022-12-01',
    endDate: req.body?.endDate || '2022-12-02',
  }

  let ordersWithJourneys: newOrders[] = []
  async function fetchOrdersWithJourneys() {
    const options = {
      method: 'POST',
      headers: globalHeaders(),
      body: JSON.stringify(data),
    }

    try {
      await fetch(url, options)
        .then((response) => response.json())
        .then(async (response: ordersWithJourneyNew) => {
          await responseChecker(response)
          ordersWithJourneys = ordersWithJourneys.concat(
            response.ordersWithJourneys?.filter(
              (order: newOrder) => order
            ) as newOrders
          )

          if (response.earliestDate) {
            data.endDate = response.earliestDate
            return await fetchOrdersWithJourneys()
          } else {
            res.json(ordersWithJourneys)
          }
        })
    } catch (err) {
      console.error(err)
      res.json(err)
    }
  }

  fetchOrdersWithJourneys()
})

app.get('/get-metrics', (req: Request, res: Response) => {
  const start =
    req.query?.start ||
    moment().subtract(7, 'day').startOf('day').format('YYYY-MM-DD')
  const end = req.query?.end || moment().endOf('day').format('YYYY-MM-DD')
  const url = `https://api.triplewhale.com/api/v2/tw-metrics/metrics-data?service_id=${CLIENT_ID}&account_id=${SHOP_URL}&start=${start}&end=${end}`

  fetch(url, {
    headers: globalHeaders(),
  })
    .then((response) => response.json())
    .then(async (response) => {
      await responseChecker(response)
      res.json(response)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
})

app.post('/post-metrics', (req: Request, res: Response) => {
  const url = 'https://api.triplewhale.com/api/v2/tw-metrics/metrics'
  const metrics = req.body?.metrics || false
  if (!metrics)
    res.json({
      code: 403,
      message: 'Please provide metrics',
      error: true,
    })

  const data = {
    account_id: SHOP_URL,
    data: [
      {
        date: req.body?.date || moment().startOf('day').format('YYYY-MM-DD'),
        hour: req.body?.hour || moment().startOf('day').format('HH'),
        metrics,
      },
    ],
  }

  const options = {
    method: 'POST',
    headers: globalHeaders(),
    body: JSON.stringify(data),
  }

  fetch(url, options)
    .then((response) => response.json())
    .then(async (response) => {
      await responseChecker(response)
      res.json(response)
    })
    .catch((err) => {
      console.log(err)
      res.json(err)
    })
})

app.post('/get-summary-page-data', (req: Request, res: Response) => {
  const url = 'https://api.triplewhale.com/api/v2/summary-page/get-data'

  let data = {
    shopDomain: SHOP_URL,
    state: LOCAL_SECRET,
    period: req.body?.period || {
      start: moment().startOf('day'),
      end: moment().endOf('day'),
    },
    todayHour: req.body?.todayHour || null,
  }

  const options = {
    method: 'POST',
    headers: globalHeaders(),
    body: JSON.stringify(data),
  }

  fetch(url, options)
    .then((response) => response.json())
    .then(async (response) => {
      await responseChecker(response)
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
app.get('/logged-in', (req: Request, res: Response) => {
  res.json({ token: API_KEY ?? TOKEN, isApiKey: !!API_KEY })
})

const loggy = () => {
  console.log(
    appName +
      chalk.green(
        `🐳 listening http://localhost:${
          NODE_ENV === 'production' ? '80' : port
        }`
      )
  )

  if (API_KEY) {
    console.log(
      appName + chalk.yellow(`🔑 API key present; using instead of OAuth flow`)
    )
  }

  console.log(
    appName +
      ((API_KEY && !!CLIENT_ID && !!SCOPE) ||
        !API_KEY ||
        (!!CLIENT_ID && !!CLIENT_SECRET && !!REDIRECT_URI && !!SCOPE))
      ? chalk.green(`🎉 all required data is present`)
      : chalk.red(`🛑 please provide required .env data`)
  )
}

NODE_ENV === 'production' ? app.use(express.static('dist')) : null
NODE_ENV === 'production'
  ? app.listen('80', loggy)
  : ViteExpress.listen(app, port, loggy)
