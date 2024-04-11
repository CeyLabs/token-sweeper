import "log-timestamp";
import { providers, Wallet } from "ethers";

import args from "./args";
import burn from "./burn";
import { sendTelegramMessage } from "./util";

// pulls args from cmd line
const VICTIM_KEY = args.privateKey;

async function main() {
    await sendTelegramMessage(`Connected to ${process.env.RPC_URL}`);
    const provider = new providers.JsonRpcProvider(process.env.RPC_URL);
    const burnWallet = new Wallet(VICTIM_KEY, provider);
    await provider.ready;
    await sendTelegramMessage("Beer fund address: "+ process.env.BEER_FUND);

    provider.on("block", async blockNumber => {
        await sendTelegramMessage(`[BLOCK ${blockNumber}]`);
        await burn(burnWallet);
    });
}

main();

export default {};
