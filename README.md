# Sesame API


## TODO

Issue ticket on chain

This should work for multiple parallel events
- LATER

Need NFT minting functionality for users
- LATER

Add Event Pass functionality
- LATER

Need ADMIN functions to
- issue a custom ticket to someone
- delete / invalidate some ticket

---
## HTML templates

There are a few HTML templates that can be customized. They can be found in the /template folder. They mostly serve as examples, you are encouraged to create your own.  
The 3 files `shop.html`, `success.html` and `error.html` are static HTML files and can be hosted / integrated on any website you choose.  


#### 1) Template `shop.html`
This template is for the ticket sale site. All it does is redirect to stripe when the button is clicked.

#### 2) Template `success.html`
This template is for the purchase confirmation.

#### 3) Template `error.html`
This template is used when the customer cancels the checkout process.

#### 4) Template `ticket.html`
This template is used to generate PDFs containing the event ticket. The text is customizable in the config.json.

---
## Configuring Google Workspace API

It is necessary to configure Google Cloud. First the OAuth consent screen should be set up [cloud console](https://console.cloud.google.com/apis/credentials/consent). Enter some authorized domains and allow the privileges for:  
- Gmail API - auth/gmail.send
- Google Sheets API - auth/spreadsheets (check if this can be further restricted)

Then go to [credentials](https://console.cloud.google.com/apis/credentials) and click `Create OAuth client ID`. Enter the details for your web application.

Store the generated configuration in the `google.credentials.json` in the main folder of this app.  

You might need to add the `redirect_uris` section to the generated file, so that it looks something like this:  
```
{
  "web": {
    "client_id": ...,
    "project_id": ...,
    "auth_uri": ...,
    "token_uri": ...,
    "auth_provider_x509_cert_url": ...,
    "client_secret": ...,
    "redirect_uris": [
      "http://localhost:3040/oauth2callback"
    ]
  }
}
```

You can then run the app using `node app` and visit the `/connectGoogle` endpoint. This will then generate the `google.token.json` for your app.

---
# Notes

Setup:  
`npm install`

Run:  
`node app`


Stripe webhook
https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local
https://stripe.com/docs/stripe-cli

./stripe login

./stripe listen --forward-to localhost:3001/stripeCallback

---
Stripe payment / item  data
https://stripe.com/docs/api/products/object

---
Stripe branding
https://dashboard.stripe.com/settings/branding