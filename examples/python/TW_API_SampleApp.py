# -----IMPORTS-----

import requests
from flask import Flask, redirect, request, render_template, session
import urllib
import uuid
import secrets
import config

# ----- GLOBAL VARIABLES -----

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

# Set the OAuth 2 parameters

# In example below, client id, client secret, and redirect URI are being loaded externally from an accompanying 'config.py' file
# Use the client id and secret provided when your TW API application was accepted
client_id = config.client_id
client_secret = config.client_secret

# The redirect uri should match the redirect uri you supplied in your API application form
redirect_uri = config.redirect_uri

# If you want to test without an external config, just replace the previous values with the client id, client secret and redirect URI
# client_id = 'INSERT_YOUR_CLIENT_ID'
# client_secret = 'INSERT_YOUR_CLIENT_SECRET'
# redirect_uri = 'YOUR_REDIRECT_URI'

# Generate a random state value. This will be provided with Oauth request and is a requirement in order to prevent request forgery.
state = uuid.uuid4().hex

# -----SAMPLE APP-----

@app.route('/login')

# For the login portion, you will make a request to the authorization url 
# which will redirect the user to a TW browser window to authorize access to their shop.

def login():
    # Authorization URL
    auth_url = 'https://api.triplewhale.com/api/v2/auth/oauth2/auth'
    
    # Request parameters
    # Include your client id, client secret, and the redirect URI and scopes you requested in your application form.
    params = {
        'client_id': client_id,
        'scope': config.scope,
        'response_type': 'code',
        'state': state,
        'redirect_uri': redirect_uri
    }

    # Encode the url with the params
    url = f'{auth_url}?{urllib.parse.urlencode(params)}'

    # Redirect the user to the authorization URL
    return redirect(url)

# Once the user has authorized the app, TW will send back a token to the callback url that can be used to authenticate API requests.

@app.route('/callback')
def callback():
    # Get the authorization code from the query parameters
    code = request.args.get('code')

    # Exchange the authorization code for an access token
    token_url = 'https://api.triplewhale.com/api/v2/auth/oauth2/token'
    data = {
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    # Make the request for an access token
    response = requests.post(token_url, headers=headers, data=data)

    # THIS IS YOUR TOKEN FOR AUTHENTICATING API REQUESTS
    token = response.json()['access_token']

    # Your token has an expiry date. In order to get a new token, you will need to store the refresh token in your database.
    # refresh_token = response.json()['refresh_token']

    # Save the access token in session storage
    session['token'] = token

    # After receiving the API response, redirect the user to the app home page
    return redirect('/home')

# In the example below, after the API request is made, the user is redirected to a new page that displays the response data.
@app.route('/home')
def home():
    # Get the access token from the session
    token = session['token']

    # Use the access token to make an authenticated API request to the TW attribution endpoint
    # For documentation on available endpoints and request structure, visit https://developers.triplewhale.com/swagger/index.html
    api_url = 'https://api.triplewhale.com/api/v2/attribution/get-orders-with-journeys'
    headers = {'Authorization': f'Bearer {token}'}
    
    body = {
    # The shop should be your myShopify url, ie. teststore.myshopify.com
    "shop": config.shop_url,
    "startDate": "2022-12-01",
    "endDate": "2022-12-02"
  }
    response = requests.post(api_url, json=body, headers=headers)
    data = response.json()
   
    # Render the home page and display the attribution data returned from the API request
    return render_template('home.html', data=data)

# Execute the script
if __name__ == '__main__':
    app.run()