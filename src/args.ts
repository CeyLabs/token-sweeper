require('dotenv').config();

const cmdArgs = require("command-line-args");

type Args = {
    privateKey: string,
    rpcUrl: string,
    beerFund?: string,
};

const optionDefinitions = [
    { name: "private-key", alias: "k", type: String },
    { name: "rpc-url", alias: "u", type: String },
    { name: "beer-fund", alias: "b", type: String, defaultOption: true },
];
const options = cmdArgs(optionDefinitions);

// ensure all options are set
for (const o of optionDefinitions) {
    if (!options[o.name] && !o.defaultOption) {
        console.error(`Missing argument --${o.name}`);
        process.exit(1);
    }
}

const args: Args = {
    privateKey: options["private-key"],
    rpcUrl: process.env.RPC_URL as string,
    beerFund: process.env.BEER_FUND,
};

export default args;
