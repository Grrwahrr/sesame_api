const fs = require("fs");
const path = require('path');
const {google} = require("googleapis");
const {authenticate} = require('@google-cloud/local-auth');
const MailComposer = require('nodemailer/lib/mail-composer');

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/spreadsheets',
];
const TOKEN_PATH = path.join(process.cwd(), 'google.token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'google.credentials.json');


async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

async function loadSavedCredentialsIfExist() {
    try {
        const content = fs.readFileSync(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client) {
    const content = fs.readFileSync(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    fs.writeFileSync(TOKEN_PATH, payload);
}



const sendEmail = async (to, subject, content, contentHTML, fileName, fileContent) => {
    let mail = new MailComposer(
        {
            to: to,
            text: content,
            html: contentHTML,
            subject: subject,
            textEncoding: "base64",
            attachments: [
                {
                    filename: fileName,
                    content: fileContent,
                    encoding: 'base64'
                },
            ]
        });

    try {
        // Create and encode message
        let msg = await mail.compile().build();
        const encodedMessage = Buffer.from(msg)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // Send using GMAIL API
        const auth = await authorize();
        const gmail = google.gmail({version: 'v1', auth});
        let result = await gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: encodedMessage,
            }
        });

        if ( result.status === 200 ) {
            return {success: true, id: result.data.id};
        }

        // DEBUG result.headers
        console.log("DEBUG: send mail error?: ", result);

        return {success: false, data: result.data, status: result.status};
    } catch (e) {
        // DEBUG
        console.log("ERROR: sendEmail(): ", e);

        return {success: false, error: e};
    }
}



const connectGoogle = async () => {
    await authorize();
}

module.exports = { connectGoogle, sendEmail };