# Sesame API

---
## HTML templates

There are a few HTML only templates that can be customized. They can be found in the /template folder.  

#### 1) Template `ticket.html`
This template is used to generate PDFs containing the event ticket.

#### 2) Template `shop.html`
This template is for the ticket sale site. All it does is redirect to stripe when the button is clicked.

#### 3) Template `success.html`
This template is for the purchase confirmation.

#### 4) Template `error.html`
This template is used when the customer cancels the checkout process.


---
## Configuring Google Workspace API

It is necessary to configure Google Cloud. First the OAuth consent screen should be set up [cloud console](https://console.cloud.google.com/apis/credentials/consent). Enter some authorized domains and allow the privileges for:  
- Gmail API - auth/gmail.send
- Google Sheets API - auth/spreadsheets

Then go to [credentials](https://console.cloud.google.com/apis/credentials) and click `Create OAuth client ID`. Enter the details for your web application.

Store the generated configuration in the `google.credentials.json` in the main folder of this app.  

You might need to add the `redirect_uris` section to the generated file, so that it looks something like this:  
```
{
  "web": {
    "client_id": "...",
    "project_id": "...",
    "auth_uri": "...",
    "token_uri": "...",
    "auth_provider_x509_cert_url": "...",
    "client_secret": "...",
    "redirect_uris": [
      "http://localhost:3040/oauth2callback"
    ]
  }
}
```

You can then run the app using `node app` and visit the `/connectGoogle` endpoint. This will then generate the `google.token.json` for your app.

---
# Notes

Run using:  
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