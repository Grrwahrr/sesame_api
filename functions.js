const qrCode = require("qrcode");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const config = require("./config.json");
const {google} = require("googleapis");
const crypto = require("crypto");

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
        // path: "output.pdf",
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

    // DEBUG
    console.log("DEBUG PDF: ", pdf);

    // Send mail, GMAIL API
    const { client_secret, client_id, redirect_uris } = config.gmail;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/gmail.send'],
    });

    // TODO https://www.labnol.org/google-api-service-account-220405

    return {success: true};
}

const logCustomerPurchase = (paymentDetails, ticketData) => {
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

    // TODO
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
    console.log("DEBUG completePurchase(): ", src, paymentDetails);

    // Get relevant data from paymentDetails and config
    let ticketData = {
        email: "durgus@pm.me",
        name: 'First Last',
        seatId: -1,
        seatName: "TODO",
        seed: crypto.randomBytes(6).toString("hex"),
        eventId: config.app.event.pubKey,
        onChainSuccess: false,
    }

    // Attempt to issue the on chain ticket
    ticketData = issueOnChainTicket(ticketData);

    // Log payment details
    logCustomerPurchase(paymentDetails, ticketData);

    // Mail ticket to customer
    await createTicketAndSendByMail(ticketData);
}

const testSendMail = (sampleData) => {
    createTicketAndSendByMail(sampleData).then(r => {
        console.log("DEBUG testSendMail():", r);


    });
}

module.exports = { testSendMail, completePurchase };