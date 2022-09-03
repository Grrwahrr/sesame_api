const solana = require('@solana/web3.js');


const RPC_URL = "https://api.devnet.solana.com";


const establishConnection = async () => {
    return new solana.Connection(RPC_URL, 'confirmed');
}

const getRecentBlock = async (con) => {
    const info = await con.getEpochInfo()
    console.log("BLOCK: ", info);
}

const testChainSomething = async () => {
    let con = await establishConnection();

    await getRecentBlock(con);
}

const getKeyPairForSecretKey = (secretKey) => {
    return solana.Keypair.fromSecretKey(secretKey);
}

const getKeyPairForSeed = (numArray) => {
    numArray = [
        174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
        222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246,
        15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121,
        121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135,
    ];
    const key = solana.Keypair.fromSeed(Uint8Array.from(numArray));

    // DEBUG
    console.log("DEBUG getKeyPairForSecretKey(): ", solana.PublicKey.isOnCurve(key.toBytes()));

    return key;
}


module.exports = { testChainSomething };