const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const config = require('./config.json');
const stripe = require("stripe")(config.stripe.secretKey);
const {completePurchase, testSendMail} = require("./functions");
const {connectGoogle} = require("./google");

const app = express();


/* TEST FUNCTIONALITY FOR SANDBOX */
const sampleData = {
    email: "durgus@pm.me",
    name: 'Balthasar VeryLongName',
    seatId: 1,
    seatName: "C-09",
    seed: crypto.randomBytes(6).toString("hex"),
    eventId: "2WEXvXAiBVEcAD2gUAaurKpBvhpririWSEGZmZkdexzg",
};
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






//
app.get('/', (req, res) => {
    testSendMail(sampleData);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ testSendMail: "Some JSON" }));
});

app.get('/connectGoogle', (req, res) => {
    connectGoogle().then(r => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ result: "OK" }));
    });
});

app.post('/stripeCheckoutSession', async (req, res) => {
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
        metadata: {"seatName": "na"},
        mode: 'payment',
        success_url: config.stripe.urlSuccess,
        cancel_url: config.stripe.urlError,
    });

    res.redirect(303, session.url);
});

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
            // TODO Handle this? Message some one?
            response.status(200);
            break;
        }
    }
});


app.listen(config.app.port, () => console.log("Example app listening on http://"+ config.app.host + ":" + config.app.port +"/ "));



// https://www.npmjs.com/package/qrcode

/*
Need a config for necessary keys


ENDPOINTS

    SALE completed
        issue on chain
            ticket
            event pass

        create the QR
        put it into some PDF

        GMAIL API to send mail

        SHEETS API to log sale

    REDEEM EVENT PASS
        issue on chain ticket based on pass

        - rest as above -

    ADMIN
        refunds

        create a manual ticket
 */