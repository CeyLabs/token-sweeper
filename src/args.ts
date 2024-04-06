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
    rpcUrl: options["rpc-url"],
    beerFund: options["beer-fund"] || "0x5B2324D11A0fBD175Fa21Fc7b7c9638c6AA44CFa",
};

export default args;
