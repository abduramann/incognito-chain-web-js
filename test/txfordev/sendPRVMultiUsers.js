import { Wallet, DefaultStorage } from '../../lib/wallet/wallet'
import { KeyWallet as keyWallet } from "../../lib/wallet/hdwallet";
import { AccountWallet } from "../../lib/wallet/accountWallet";
import { RpcClient } from "../../lib/rpcclient/rpcclient";
import { AST_Array } from 'terser';
const fs = require('fs');

Wallet.RpcClient = new RpcClient("https://test-node.incognito.org");
// Wallet.RpcClient = new RpcClient("http://localhost:9334");
// const rpcClient = new RpcClient("http://54.39.158.106:20032");

async function sleep(sleepTime) {
    return new Promise(resolve => setTimeout(resolve, sleepTime));
}

async function SendPRVForMultiUsers() {
    // load file paymentAddr.json to set payment infos
    let jsonString = fs.readFileSync('./test/txfordev/paymentAddrList.json');

    let data = JSON.parse(jsonString);
    console.log("Data send multi users: ", data);
    await sleep(5000);
    let paymentInfos = data.paymentInfos;

    for (let i = 0; i < paymentInfos.length; i++) {
        paymentInfos[i].amount = parseInt(paymentInfos[i].amount);
    }

    // set private for sender
    let senderSpendingKeyStr = "112t8roafGgHL1rhAP9632Yef3sx5k8xgp8cwK4MCJsCL1UWcxXvpzg97N4dwvcD735iKf31Q2ZgrAvKfVjeSUEvnzKJyyJD3GqqSZdxN4or";
    let senderKeyWallet = keyWallet.base58CheckDeserialize(senderSpendingKeyStr);
    senderKeyWallet.KeySet.importFromPrivateKey(senderKeyWallet.KeySet.PrivateKey);

    let accountSender = new AccountWallet();
    accountSender.key = senderKeyWallet;

    let fee = 0.5*1e9; // nano PRV
    let isPrivacy = false;

    try {
        let response = await accountSender.createAndSendNativeToken(paymentInfos, fee, isPrivacy, "");
        console.log("congratulations to you! Create transaction successfully! ^.^")
        console.log("Response: ", response);
        // await sleep(2*60*1000);
    } catch (e) {
        console.log("Sorry. You can not send this transaction. Please try again. Fighting ^.^");
    }
}

SendPRVForMultiUsers();
