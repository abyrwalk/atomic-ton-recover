// script to recover funds from a disfunctional TON wallet client
// based on an example from https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/README.md

const tonweb = require("tonweb")
const tonMnemonic = require("tonweb-mnemonic")
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const TON_API_DELAY = 1000;

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function getArgs() {

    // Use yargs to parse command-line arguments
    const argv = yargs(hideBin(process.argv))
        .env("TON")
        .option('sourceAddress', {
            alias: 'src',
            describe: 'Your source TON wallet address',
            type: 'string',
            demandOption: true,
        })
        .option('privateKey', {
            alias: 'privatekey',
            describe: 'Your private key (128 hex characters). Can be provided with an environment variable TON_PRIVATEKEY instead',
            type: 'string',
            // demandOption: true,
        })
        .option('mnemonic', {
            describe: 'Your recovery mnemonic phrase (normally 12 or 24 words). Can be provided with an environment variable TON_MNEMONIC instead',
            type: 'string',
            // demandOption: true,
        })
        .option('destinationAddress', {
            alias: 'dst',
            describe: 'Destination TON address to move funds to',
            type: 'string',
            demandOption: true,
        })
        .option('amount', {
            alias: 'amt',
            describe: 'TON amount to send (e.g., 0.01)',
            type: 'string',
            default: '0.01',
        })
        .option('dry-run', {
            alias: 'dry',
            describe: 'do not send a transaction',
            type: 'bool',
            default: false,
        })
        .help()
        .alias('help', 'h')
        .argv;
    return argv
}


async function getValidSeqno(wallet, maxRetries = 10, interval = 300) {
    let retries = 0;
    while (retries < maxRetries) {
        const seqno = await wallet.methods.seqno().call();
        if (seqno !== null) {
            return seqno; // Return the valid seqno
        }
        // Wait for the interval before retrying
        await sleep(interval);
        retries++;
        console.log("retrying to get seqno with attempt", retries);
    }
    return 0;
}


function arrayToHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}


async function recoverTon() {
    const argv = getArgs()
    console.log("args:", argv)
    const srcAddr = argv.sourceAddress; // Your source TON wallet address
    const PKSrc = argv.privatekey; // Your private key (128 hex characters)
    const mnemonic = argv.mnemonic; // OR your 12-words mnemonic pjras
    const dstAddr = argv.destinationAddress; // Destination TON address to move funds to
    const amountToSend = argv.amount; // Amount to send (e.g., '0.01' TON)
    // end of settings

    const TonWeb = new tonweb();

    var pkBytes = null;

    if (mnemonic !== null) {
        mnemonicArr = mnemonic.split(" ")
        console.log("Mnemonic is set. Generating a private key")
        keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonicArr);
        console.log("keypair", keyPair);
        pkBytes = keyPair.secretKey
        console.log("got secret key from mnemonic:", arrayToHexString(pkBytes));
    } else pkBytes = TonWeb.utils.hexToBytes(PKSrc)

    if (pkBytes === null) throw Error("Unable to parse secret key from the provided key or mnemonic")

    const wallet = TonWeb.wallet.create({ address: srcAddr }); // if your know only address at this moment


    const address = await wallet.getAddress();
    console.log("my address: " + address)

    await sleep(TON_API_DELAY);


    const balance = await TonWeb.getBalance(address);
    console.log("current balance: " + TonWeb.utils.fromNano(balance))
    await sleep(TON_API_DELAY);


    // var seqno = await wallet.methods.seqno().call()
    const seqno = await getValidSeqno(wallet, 10, 300)
    console.log("seqno:", seqno)

    await sleep(TON_API_DELAY);


    console.log("#### Trying to deploy the wallet")
    const deploy = wallet.deploy(pkBytes)
    console.log("Deployed:", deploy)

    await sleep(TON_API_DELAY); // to avoid public api ratelimits

    const deployFee = await deploy.estimateFee()

    console.log("deploy fee: ", deployFee)



    const transfer = wallet.methods.transfer({
        secretKey: pkBytes,
        toAddress: dstAddr,
        amount: TonWeb.utils.toNano(amountToSend),
        seqno: seqno,
        payload: '',
        sendMode: 3,
    });
    console.log("transfer:", transfer)
    await sleep(TON_API_DELAY);

    const transferFee = await transfer.estimateFee();   // get estimate fee of transfer
    console.log("transferFee:", transferFee)
    await sleep(TON_API_DELAY);

    console.log("##### starting transfer:")
    if (argv.dry) {
        console.log("dry run: do not sending transfer");
        return 0;
    }
    const transferSent = await transfer.send();  // send transfer query to blockchain
    console.log("transfer sent:", transferSent)
    await sleep(TON_API_DELAY);

    // const transferQuery = await transfer.getQuery(); // get transfer query Cell, not needed actually
    // console.log("transferQuery:", transferQuery)
}

recoverTon();
