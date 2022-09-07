import {Connection, Keypair, PublicKey} from "@solana/web3.js";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import {AnchorProvider, BN, Program} from "@project-serum/anchor";

const crypto = require("crypto");
const idl = require("../idl/sesame.json");
const bs58 = require("bs58");

const textEncoder = new TextEncoder();
const RPC_URL = "http://localhost:8899"; // https://api.devnet.solana.com


// Derivation functions
const deriveOrganizer = (program, owner) =>
    PublicKey.findProgramAddressSync(
        [textEncoder.encode("Organizer"), owner.toBuffer()],
        program.programId
    );

const deriveEvent = (program, owner, offset) =>
    PublicKey.findProgramAddressSync(
        [textEncoder.encode("Event"), owner.toBuffer(), new BN(offset).toArrayLike(Buffer, "le", 4)],
        program.programId
    );

const deriveTicket = (program, event, offset) =>
    PublicKey.findProgramAddressSync(
        [textEncoder.encode("Ticket"), event.toBuffer(), new BN(offset).toArrayLike(Buffer, "le", 2)],
        program.programId
    );

const deriveEventPass = (program, owner, offset) =>
    PublicKey.findProgramAddressSync(
        [textEncoder.encode("EventPass"), owner.toBuffer(), new BN(offset).toArrayLike(Buffer, "le", 4)],
        program.programId
    );

const deriveEventPassValidEvent = (program, eventPass, offset) =>
    PublicKey.findProgramAddressSync(
        [textEncoder.encode("EventPassValidEvent"), eventPass.toBuffer(), new BN(offset).toArrayLike(Buffer, "le", 2)],
        program.programId
    );

const deriveEventPassHolder = (program, eventPass, offset) =>
    PublicKey.findProgramAddressSync(
        [textEncoder.encode("EventPassHolder"), eventPass.toBuffer(), new BN(offset).toArrayLike(Buffer, "le", 2)],
        program.programId
    );

const deriveEventPassHolderTicket = (program, eventPassHolder, event) =>
    PublicKey.findProgramAddressSync(
        [textEncoder.encode("EventPassHolderTicket"), eventPassHolder.toBuffer(), event.toBuffer()],
        program.programId
    );


// Fetch account functions
const fetchEventAccount = async (program, publicKey) => {
    try {
        return await program.account.event.fetch(publicKey);
    } catch (e) {
        console.log("ERROR: fetchEventAccount(): ", e);
        return undefined;
    }
}


// Connection setup and key restoration functions
const getConnection = () => {
    return new Connection(RPC_URL, 'confirmed');
}

const ticketProgram = (signer) => {
    const provider = new AnchorProvider(getConnection(), new NodeWallet(signer), {});
    return new Program(idl, idl.metadata.address, provider);
}

export const base58ToPubKey = (base58) => {
    return new PublicKey(base58);
}

const getKeyPairForSecretKeyBase58 = (secretKeyBase58) => {
    try {
        return Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
    } catch (e) {
        return undefined;
    }
}

const getKeyPairForSeed = (numArray) => {
    try {
        return Keypair.fromSeed(Uint8Array.from(numArray));
    } catch (e) {
        return undefined;
    }
}

const getKeyPairForTicket = (name, seatName, seed, event) => {
    let sha256 = crypto.createHash('sha256');
    sha256.update(name);
    sha256.update(seatName);
    sha256.update(seed);
    sha256.update(event);
    let signerSeedBytes = sha256.digest();
    return getKeyPairForSeed(signerSeedBytes);
}





const issueEventTicket = async (signerSecretBase58, ticketData, eventPubKeyBase58) => {
    // Hash the owner seed string to create the wallet from
    const ticketOwner = getKeyPairForTicket(ticketData.name, ticketData.seatName, ticketData.seed, ticketData.eventId);

    if (!ticketOwner) {
        return {success: false, error: "Could not create paper wallet"};
    }

    // Restore signer wallet from secret
    const signer = getKeyPairForSecretKeyBase58(signerSecretBase58);

    if (!signer) {
        return {success: false, error: "Signer wallet is invalid"};
    }

    // Create anchor program wrapper
    const program = ticketProgram(signer);

    // Recreate PubKey from string
    const eventPubKey = base58ToPubKey(eventPubKeyBase58);

    // We need the event account to find the next ticket offset
    const event = await fetchEventAccount(program, eventPubKey);

    if (!event) {
        return {success: false, error: "Event public key is invalid"};
    }

    // Derive the ticket account
    const ticketOffset = event.tickets_issued;
    const [accTicket, bumpTicket] = deriveTicket(program, eventPubKey, ticketOffset);

    try {
        await program.methods
            .ticketIssue()
            .accounts({
                payer: signer.publicKey,
                event: eventPubKey,
                ticket: accTicket,
                ticketOwner: ticketOwner.publicKey,
            })
            .rpc();
    }
    catch (e) {
        console.log("ERROR: issueEventTicket(): ", e);
        return {success: false, error: e.message};
    }

    return {success: true, ticketOffset: ticketOffset};
}



const testChainSomething = async () => {
    let res = await issueEventTicket(
        "INSERT SECRET KEY",
        {name: "Balti Balta", seatName:"C-09", seed:"randomSeedString", eventId:"4S7MaeD55iBvea8o9G1sGELfxGak2WG5xV7QQwnXD3Do"},
        "4S7MaeD55iBvea8o9G1sGELfxGak2WG5xV7QQwnXD3Do"
    );
}

module.exports = { testChainSomething, issueEventTicket };