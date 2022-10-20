const express = require('express');
const https = require('https');
const fs = require("fs");
const bodyParser = require('body-parser');
const config = require('./config.json');
const stripe = require("stripe")(config.stripe.secretKey);
const {completePurchase, testSomething} = require("./lib/functions");
const {connectGoogle} = require("./lib/google");
const {testChainSomething} = require("./lib/solana");

const app = express();


/* TEST FUNCTIONALITY FOR SANDBOX */
app.get('/testShop', async (req, res) => {
    res.sendFile('/Users/grrwahrr/IdeaProjects/sesame_api/template/shop.html');
});
app.get('/testSuccess', async (req, res) => {
    res.sendFile('/Users/grrwahrr/IdeaProjects/sesame_api/template/success.html');
});
app.get('/testSuccess', async (req, res) => {
    res.sendFile('/Users/grrwahrr/IdeaProjects/sesame_api/template/error.html');
});
/* TEST FUNCTIONALITY FOR SANDBOX */


/**
 * Set up the google.token.json - requires the google.credentials.json file
 */
app.get('/connectGoogle', (req, res) => {
    //TODO only if the google.token.json file doesn't exist
    connectGoogle().then(r => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ result: "OK" }));
    });
});

/**
 * Creates a stripe check out session
 */
app.post('/stripeCheckoutSession', async (req, res) => {
    // Two params are set from the client: What ticket to buy and the seatId
    console.log("POST itemId: ", req.body.itemId);
    console.log("POST seatName: ", req.body.seatName);
    //TODO not currently supporting named seats - need to verify seat availability against a database

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: config.stripe.productName
                    },
                    unit_amount: config.stripe.productPrice
                },
                quantity: 1
            },
        ],
        metadata: {"seatName": ""},//TODO add named seating; add some ID for what ticket is being sold; multi config
        mode: 'payment',
        success_url: config.stripe.urlSuccess,
        cancel_url: config.stripe.urlError,
    });

    res.redirect(303, session.url);
});

/**
 * Stripe callback for payment processing
 */
app.post('/stripeCallback', bodyParser.raw({type: 'application/json'}), (request, response) => {
    const payload = request.body;
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, config.stripe.endpointSecret);
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Log
    // console.log("Stripe callback billing_details: ", payload.data.object.billing_details);
    // console.log("Stripe callback event: ", event);

    // Fetch session data
    const session = event.data.object;

    // Check if the app is in sandbox mode
    if ( config.app.mode === "sandbox" && event.livemode ) {
        console.log("App is in sandbox mode");
        return response.status(400).send("Webhook Error: app is in sandbox mode, request has live data.");
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            // A delayed notification payment will have an `unpaid` status
            if (session.payment_status !== 'paid') {
                // TODO Handle this? Payment is unsettled at this stage
                break;
            }

            // Payment is complete
            completePurchase('checkout.session.completed', session).then( () => {
                response.status(200);
            });
            break;
        }
        case 'checkout.session.async_payment_succeeded': {
            completePurchase('checkout.session.async_payment_succeeded', session).then( () => {
                response.status(200);
            });
            break;
        }
        case 'checkout.session.async_payment_failed': {
            // TODO Handle this? Message some one? Log to another google sheet?
            response.status(200);
            break;
        }
    }
});


// Start listening on configured port
// app.listen(config.app.port, () => console.log("Example app listening on http://"+ config.app.host + ":" + config.app.port +"/ "));

const key = fs.readFileSync(__dirname + '/ssl.key');
const cert = fs.readFileSync(__dirname + '/ssl.crt');

let server = https.createServer({
    key: key,
    cert: cert
}, app);

server.listen(config.app.port, () => {
    console.log("Example app listening on https://"+ config.app.host + ":" + config.app.port +"/ ");
});