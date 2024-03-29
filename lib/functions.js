const fs = require("fs");
const crypto = require("crypto");
const qrCode = require("qrcode");
const pdf = require("pdf-creator-node");
const config = require("../config.json");

const {sendEmail, appendToSheet} = require("./google");
const {issueEventTicket} = require("./solana");

const createQrCode = async (ticketData) => {
    let encoded = Buffer.from(JSON.stringify(
        {ns: ticketData.name, to: ticketData.ticketOffset, sn: ticketData.seatName, se: ticketData.seed, ev: ticketData.eventId}
    )).toString('base64');

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
const logCustomerPurchase = async (payId, payIntent, email, name, ticketOffset, seatName, seed, gmailId) => {
    const dateTime = new Date().toISOString();

    return appendToSheet(config.app.salesLog.sheetId, config.app.salesLog.sheetRange, [
        [dateTime, payId, payIntent, email, name, ticketOffset, seatName, seed, gmailId],
    ]);
}

const issueOnChainTicket = async (ticketData) => {
    const res = await issueEventTicket(
        config.app.event.authorityTicketIssuer,
        ticketData,
        config.app.event.pubKey
    );

    if (!res.success) {
        console.log("Could not issue on chain ticket: ", res.error);
        ticketData.ticketOffset = -1;
        ticketData.onChainSuccess = false;
    }
    else {
        ticketData.ticketOffset = res.ticketOffset;
        ticketData.onChainSuccess = res.success;
    }

    return ticketData;
}

const issueOnChainTicketForEventPass = () => {
    // TODO EVENT_PASS LATER
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
        email: paymentDetails.customer_details.email.trim(),
        name: paymentDetails.customer_details.name.trim(),
        ticketOffset: -1,
        seatName: paymentDetails.metadata.seatName.trim(),
        seed: crypto.randomBytes(6).toString("hex"),
        eventId: config.app.event.pubKey,
        onChainSuccess: false,
    }

    // Attempt to issue the on chain ticket
    ticketData = await issueOnChainTicket(ticketData);
    //TODO check result; this may benefit from automated re-tries
    if (!ticketData.onChainSuccess) {

    }

    // Mail ticket to customer
    let resMail = await createTicketAndSendByMail(ticketData);

    if ( !resMail.success ) {
        //TODO handle error
    }

    // Log payment details
    let resLog = await logCustomerPurchase(paymentDetails.id, paymentDetails.payment_intent, ticketData.email, ticketData.name, ticketData.ticketOffset, ticketData.seatName, ticketData.seed, resMail.id);

    if ( !resLog.success ) {
        //TODO handle error
    }
}

const testSomething = (sampleData) => {
    // createTicketAndSendByMail({
    //     email: "durgus@pm.me",
    //     name: 'Balthasar VeryLongName',
    //     ticketOffset: 1,
    //     seatName: "C-09",
    //     seed: crypto.randomBytes(6).toString("hex"),
    //     eventId: "2WEXvXAiBVEcAD2gUAaurKpBvhpririWSEGZmZkdexzg",
    // }).then(r => {
    //     console.log("DEBUG testSendMail():", r);
    // });

    // logCustomerPurchase("2payId", "3payIntent", "4email", "name", "ticketOffset", "seatName", "seed", "gmailId").then( r => {
    //     console.log("DEBUG TEST logCustomerPurchase(): ", r);
    // });
}

module.exports = { testSomething, completePurchase };