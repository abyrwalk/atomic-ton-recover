# atomic-ton-recover

This is a simple program that helps you move your TonCoin from an Atomic Wallet to a new wallet you own, as long as you have the secret information (like a secret key or a mnemonic phrase) from the old wallet.

## Context
For several months now, Atomic Wallet users have been experiencing issues with transferring TON to external wallets, stating that "TON sending operations might not work correctly in Atomic if your address is inactive on blockchain. ... Our team is working on the issue." And "Block explorer is currently unavailable".

Given that TonCoins are indeed stored on the blockchain and Atomic Wallet allows for the export of secret keys, it should be possible to import these keys into any compatible wallet. However, a challenge arises because no wallets either support the 12-word mnemonic phrases, or the secret key export format utilized by Atomic Wallet. To address this inconvenience, I have developed this handy tool.

## What This Tool Can Do For You
* It lets you transfer TonCoin to a new wallet if you have either a secret key or a special backup phrase (mnemonic).
* Think of it as a very basic version of a TonCoin wallet that can manage any TonCoin address you have credentials for.
* This tool was created using an example from the TonCoin community, found here: https://github.com/toncenter/tonweb/blob/master/src/contract/wallet/README.md


## Disclaimer
This script is made available "as is," with no guarantees or warranties of any kind, whether stated or implied. Originally crafted for personal use to achieve a particular goal, it has been successfully deployed only once. The author disclaims all liability for any complications or damages that may result from utilizing this script. Your decision to use this script signifies your understanding and acceptance of any risks that may be involved. The script is shared with the community in the hope that it may be useful to others facing similar challenges.

Should you require assistance with the operation of this tool, seek out a knowledgeable and trusted individual proficient in reading and executing JavaScript code. This person should be able to ensure that the script functions correctly and provide you with the necessary support.

## What You Need Before Starting

* Your secret key or the mnemonic phrase from your Atomic Wallet, and the address of the wallet. You can get the secret key by using the 12-word phrase you have from Atomic Wallet.
* NodeJS version 20.0 or newer. You can find how to install it here: https://nodejs.org/en/learn/getting-started/how-to-install-nodejs
* Basic knowledge of how to use the command line on your computer.
* Git, which is a tool for downloading and updating code (this is optional, see Manual Installation below if you don't want to use Git).

## How to Set Up the Tool
### Easy Way: Using Git

Copy the code and set up the tool and its dependencies by following these steps in your command line:

```
git clone https://github.com/abyrwalk/atomic-ton-recover.git
cd atomic-ton-recover
npm ci
```

### Manual Way: Without Git

1. Download the script from this link: https://raw.githubusercontent.com/abyrwalk/atomic-ton-recover/main/recover.js and save it to a new folder, like Downloads/atomic-recover.
2. Open your command line and go to the folder with `cd Downloads/atomic-recover`.
3. Install the necessary parts by typing `npm install tonweb tonweb-mnemonic yargs`.

## How to Use the Tool
### Find Your Secret Key from Atomic Wallet

* Open the Atomic Wallet App.
* Go to More -> Security -> Private Keys & Backup.
* Enter your wallet's password.
* Click on Show Private Keys.
* Read the warning, agree to it, and then find "Toncoin".
* Click SHOW PRIVATE KEY and copy the long string of characters. Send it to yourself but keep it secret! You will need it in the next steps.
* Alternatively the same way you can export your "12-word backup phrase" and use it with the tool `--mnemonic` option instead of `--privatekey`.

**Important**: Never share your secret key or mnemonic phrase! If someone else gets it, they can take your coins.

### Find Your Wallet Address

You probably already know this from when you've sent TonCoin before. If not:

* Open Wallet -> TON -> Receive.
* Copy your TonCoin address and send it to yourself.

### Use the Tool to Move Your TonCoin

Open the folder where you saved the recover.js script in the command line.
Type `node recover.js --help` to make sure the tool is working correctly. It should show you how to use it.

If everything looks fine, you can start moving your TonCoin.

To send TonCoin from your old Atomic Wallet to your new wallet, make sure you know how much you have and use that amount in the command below. Please subtract 0.01 TON from the target amount for transfer fees. Here is an example command to transfer the coins:

```
node recover.js  --sourceAddress "your_atomic_wallet_address" --destinationAddress "your_new_wallet_address" --amount "0.01" --privatekey "your_128_chars_long_private_key" --dry-run 1
```

The --dry-run 1 part means that it will simulate the transfer without actually sending the coins. Remove --dry-run 1 when you're ready to make the real transfer.

If the transaction fails try to reduce the amount for 0.01 TON and try again.

## Donations
If you've found the tool beneficial and would like to show your appreciation, consider buying me a coffee. You can do so by sending TonCoins to my wallet address:
`UQDjx-YFsL1KvbXQQsspn0T96Ac0Wj4__Oo9n4w4meHGyGvP`

# License
Licensed under the Apache 2.0 License
