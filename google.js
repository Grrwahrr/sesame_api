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
    const auth = await authorize();

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

    mail.compile().build( (error, msg) => {
        if (error) {
            console.log('ERROR: mail.compile() failed: ' + error);
            return false;
        }

        const encodedMessage = Buffer.from(msg)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: encodedMessage,
            }
        }, (err, result) => {
            if (err) {
                console.log('ERROR: gmail api: ' + err);
                return false;
            }

            console.log("DEBUG: send mail: ", result.data);
        });
    })
}



const connectGoogle = async () => {
    await authorize();
}

module.exports = { connectGoogle, sendEmail };