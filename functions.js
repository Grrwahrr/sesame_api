const fs = require("fs");
const crypto = require("crypto");
const qrCode = require("qrcode");
const pdf = require("pdf-creator-node");
const config = require("./config.json");

const {sendEmail} = require("./google");

const createQrCode = async (ticketData) => {
    let encoded = Buffer.from(JSON.stringify(
        {ns: ticketData.name, si: ticketData.seatId, sn: ticketData.seatName, se: ticketData.seed, ev: ticketData.eventId}
    )).toString('base64');
    // decode: let actual = JSON.parse(Buffer.from(encoded, 'base64').toString());

    // Dummy data
    ticketData.qrCode = false;

    try {
        ticketData.qrCode = await qrCode.toDataURL(encoded);
        return ticketData;
    } catch (err) {
        return ticketData;
    }
}

const createTicketPdf = async (ticket) => {
    // Use a template file
    const html = fs.readFileSync("template/ticket.html", "utf8");

    // Options
    let options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm"
    };

    let document = {
        html: html,
        data: {
            event: config.app.event,
            ticket: ticket
        },
        type: "buffer",
    };

    try {
        return await pdf.create(document, options);
    } catch (err) {
        return undefined;
    }
}

const createTicketAndSendByMail = async (ticketData) => {
    // Create QR
    ticketData = await createQrCode(ticketData);

    // Check for error
    if ( !ticketData.qrCode ) {
        return {success: false, error: "Could not create QR code in createTicketAndSendByMail()"};
    }

    // Attach to PDF
    let pdf = await createTicketPdf(ticketData);

    // Check for error
    if ( pdf === undefined ) {
        return {success: false, error: "Could not create PDF in createTicketAndSendByMail()"};
    }

    // DEBUG store copy of pdf
    // fs.writeFileSync(ticketData.seed + ".pdf", pdf, "utf8");

    // Send the email containing the ticket pdf
    return await sendEmail(ticketData.email, config.app.mail.subject, config.app.mail.contentPlain, config.app.mail.contentHtml, config.app.mail.fileName, pdf);
}

// Log payment details using SHEETS API
const logCustomerPurchase = async (payId, payIntent, email, name, seatId, seatName, seed) => {
    // Current time
    const dateTime = new Date().toISOString();


    let url = "POST https://sheets.googleapis.com/v4/spreadsheets/spreadsheetId/values/Sheet1!A1:I1:append?valueInputOption=USER_ENTERED";
    let callData = {
        "range": "Sheet1!A1:I1",
        "majorDimension": "ROWS",
        "values": [
            [dateTime, payId, payIntent, email, name, seatId, seatName, seed],
        ],
    };

    // TODO
    // https://developers.google.com/sheets/api/quickstart/nodejs
}

const issueOnChainTicket = (ticketData) => {
    const eventPubKey = config.app.event.pubKey;

    ticketData.seatId = 0;
    ticketData.onChainSuccess = false;

    // TODO

    return ticketData;
}

const issueOnChainTicketForEventPass = () => {
    // TODO later
}

const completePurchase = async (src, paymentDetails) => {
    // Debug
    // console.log("DEBUG completePurchase(): ", src, paymentDetails);

    // Amount total
    if ( paymentDetails.amount_total !== config.stripe.productPrice ) {
        console.log("ERROR completePurchase(): Price is not as expected!");
        return;
    }

    if ( !paymentDetails.customer_details.email || paymentDetails.customer_details.email.length <= 1 ) {
        console.log("ERROR completePurchase(): No email found: ", paymentDetails);
        return;
    }

    if ( !paymentDetails.customer_details.name || paymentDetails.customer_details.name.length <= 1 ) {
        console.log("ERROR completePurchase(): No name found: ", paymentDetails);
        return;
    }


    // Get relevant data from paymentDetails and config
    let ticketData = {
        email: paymentDetails.customer_details.email,
        name: paymentDetails.customer_details.name,
        seatId: -1,
        seatName: paymentDetails.metadata.seatName,
        seed: crypto.randomBytes(6).toString("hex"),
        eventId: config.app.event.pubKey,
        onChainSuccess: false,
    }

    // Attempt to issue the on chain ticket
    ticketData = issueOnChainTicket(ticketData);

    // Log payment details
    await logCustomerPurchase(paymentDetails.id, paymentDetails.payment_intent, ticketData.email, ticketData.name, ticketData.seatId, ticketData.seatName, ticketData.seed);

    // Mail ticket to customer
    await createTicketAndSendByMail(ticketData);
}

const testSendMail = (sampleData) => {
    createTicketAndSendByMail(sampleData).then(r => {
        console.log("DEBUG testSendMail():", r);
    });
}

module.exports = { testSendMail, completePurchase };