const http = require('node:http');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const qrCode = require('qrcode')
const {google} = require('googleapis');
const config = require('./config.json');

// Stripe
const stripe = require("stripe")(config.stripe.secretKey);

const app = express();



const sampleData = {
    email: "durgus@pm.me",
    name: 'Some Name',
    seatId: 1,
    seatName: "C-09",
    seed: crypto.randomUUID(),
    eventId: "2WEXvXAiBVEcAD2gUAaurKpBvhpririWSEGZmZkdexzg",
};


const createQrCode = async (data) => {
    let encoded = Buffer.from(JSON.stringify(
        {ns: data.name, si: data.seatId, sn: data.seatName, se: data.seed, ev: data.eventId}
    )).toString('base64');

    // decode: let actual = JSON.parse(Buffer.from(encoded, 'base64').toString());

    try {
        return await qrCode.toDataURL(encoded);
    } catch (err) {
        return console.error(err);
    }
}

const createTicketPdf = () => {
    // Use some template file?

    // Slap in the QR code PNG
}

const sendTicketMail = async (data) => {

    // Create QR
    let qrCode = await createQrCode(data);
    console.log("SEED: ", data.seed);
    console.log("QR CODE PNG: ", qrCode);

    // Attach to PDF
    let pdf = createTicketPdf();

    // Send mail, GMAIL API
    const { client_secret, client_id, redirect_uris } = config.gmail;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/gmail.send'],
    });

    // https://www.labnol.org/google-api-service-account-220405
}

const logPayment = () => {
    // Log payment details, SHEETS API
    // https://developers.google.com/sheets/api/quickstart/nodejs

    let url = "POST https://sheets.googleapis.com/v4/spreadsheets/spreadsheetId/values/Sheet1!A1:E1:append?valueInputOption=USER_ENTERED";
    let callData = {
        "range": "Sheet1!A1:E1",
        "majorDimension": "ROWS",
        "values": [
            ["Door", "$15", "2", "3/15/2016"],
        ],
    };
}

const issueOnChainTicket = () => {

}

const issueOnChainTicketForEventPass = () => {

}

const completePurchase = (src, mail, name, seatName) => {
    // Debug
    console.log("Complete purchase: ", src, mail, name, seatName);

    // Generate some random data
    const rand = crypto.randomBytes(8).toString("hex");

    // Log payment details

    // Issue on chain ticket

    // Mail ticket to customer
}



app.get('/', (req, res) => {
    sendTicketMail(sampleData).then(r => {
        console.log("THEN ", r);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ result: "TODO" }));
    });
});

app.get('/stripeCheckoutSession', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: config.stripe.productName,
                    },
                    unit_amount: config.stripe.productPrice,
                },
                quantity: 1,
            },
        ],
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

    if ( !event.livemode ) {
        console.log("TEST MODE");
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            // A delayed notification payment will have an `unpaid` status
            if (session.payment_status !== 'paid') {
                // TODO Handle this? Payment is unsettled at this stage
                break;
            }

            // Payment is complete
            completePurchase(1,"mail", "name", "seatName");
            break;
        }
        case 'checkout.session.async_payment_succeeded': {
            completePurchase(2, "mail", "name", "seatName");
            break;
        }
        case 'checkout.session.async_payment_failed': {
            // TODO Handle this? Message some one?
            break;
        }
        case 'charge.succeeded': {
            completePurchase(3, "mail", "name", "seatName");
            break;
        }
    }

    response.status(200);
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