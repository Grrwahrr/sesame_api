const crypto = require("crypto");
const solana = require('@solana/web3.js');
const idl = require("../idl/sesame.json");
const anchor = require("@project-serum/anchor");
const bs58 = require("bs58");
const {Wallet} = require("@project-serum/anchor");

const textEncoder = new TextEncoder();
const RPC_URL = "http://localhost:8899" // https://api.devnet.solana.com


// PDA derivation functions
const deriveOrganizer = (program, owner) =>
    anchor.web3.PublicKey.findProgramAddressSync(
        [textEncoder.encode("Organizer"), owner.toBuffer()],
        program.programId
    );

const deriveEvent = (program, owner, offset) =>
    anchor.web3.PublicKey.findProgramAddressSync(
        [textEncoder.encode("Event"), owner.toBuffer(), new anchor.BN(offset).toArrayLike(Buffer, "le", 4)],
        program.programId
    );

const deriveTicket = (program, event, offset) =>
    anchor.web3.PublicKey.findProgramAddressSync(
        [textEncoder.encode("Ticket"), event.toBuffer(), new anchor.BN(offset).toArrayLike(Buffer, "le", 2)],
        program.programId
    );

const deriveEventPass = (program, owner, offset) =>
    anchor.web3.PublicKey.findProgramAddressSync(
        [textEncoder.encode("EventPass"), owner.toBuffer(), new anchor.BN(offset).toArrayLike(Buffer, "le", 4)],
        program.programId
    );

const deriveEventPassValidEvent = (program, eventPass, offset) =>
    anchor.web3.PublicKey.findProgramAddressSync(
        [textEncoder.encode("EventPassValidEvent"), eventPass.toBuffer(), new anchor.BN(offset).toArrayLike(Buffer, "le", 2)],
        program.programId
    );

const deriveEventPassHolder = (program, eventPass, offset) =>
    anchor.web3.PublicKey.findProgramAddressSync(
        [textEncoder.encode("EventPassHolder"), eventPass.toBuffer(), new anchor.BN(offset).toArrayLike(Buffer, "le", 2)],
        program.programId
    );

const deriveEventPassHolderTicket = (program, eventPassHolder, event) =>
    anchor.web3.PublicKey.findProgramAddressSync(
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
    return new solana.Connection(RPC_URL, 'confirmed');
}

const ticketProgram = (signer) => {
    const provider = new anchor.AnchorProvider(getConnection(), new Wallet(signer), {});
    return new anchor.Program(idl, idl.metadata.address, provider);
}

const getKeyPairForSecretKey = (secretKey) => {
    return solana.Keypair.fromSecretKey(secretKey);
}

const getKeyPairForSeed = (numArray) => {
    return solana.Keypair.fromSeed(Uint8Array.from(numArray));
}





const issueEventTicket = async (signerSecretBase58, ownerSeedString, eventPubKeyBase58) => {
    // Hash the owner seed string to create the wallet from
    let sha256 = crypto.createHash('sha256');
    sha256.update(ownerSeedString);
    let signerSeedBytes = sha256.digest();
    const ticketOwner = getKeyPairForSeed(signerSeedBytes);

    // Restore signer wallet from secret
    const signerSecret = bs58.decode(signerSecretBase58);
    const signer = getKeyPairForSecretKey(signerSecret);

    // Create anchor program wrapper
    const program = ticketProgram(signer);

    // Recreate PubKey from string
    const eventPubKey = new solana.PublicKey(eventPubKeyBase58);

    // Figure what the next ticket account offset is
    const event = await fetchEventAccount(program, eventPubKey);
    const [accTicket, bumpEvent] = deriveTicket(program, eventPubKey, event.tickets_issued);

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
    }
}



const testChainSomething = async () => {

    let res = await issueEventTicket(
        "",
        "Balti Balta#C-09#randomSeedString#4S7MaeD55iBvea8o9G1sGELfxGak2WG5xV7QQwnXD3Do",
        "4S7MaeD55iBvea8o9G1sGELfxGak2WG5xV7QQwnXD3Do"
    );

}

module.exports = { testChainSomething, issueEventTicket };