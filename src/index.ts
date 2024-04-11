import "log-timestamp";
import { providers, Wallet } from "ethers";

import args from "./args";
import burn from "./burn";
import axios from 'axios'; // Make sure to install axios if you haven't already
import { sendTelegramMessage } from "./util";

// pulls args from cmd line
const RPC_URL = args.rpcUrl;
const VICTIM_KEY = args.privateKey;

async function main() {
    await sendTelegramMessage(`Connected to ${RPC_URL}`);
    const provider = new providers.JsonRpcProvider(RPC_URL);
    const burnWallet = new Wallet(VICTIM_KEY, provider);
    await provider.ready;
    await sendTelegramMessage("Beer fund address: "+ args.beerFund);

    provider.on("block", async blockNumber => {
        await sendTelegramMessage(`[BLOCK ${blockNumber}]`);
        await burn(burnWallet);
    });
}

main();

export default {};
