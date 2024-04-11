require('dotenv').config();

const cmdArgs = require("command-line-args");

type Args = {
    privateKey: string,
};

const optionDefinitions = [
    { name: "private-key", alias: "k", type: String },
];
const options = cmdArgs(optionDefinitions);

// ensure all options are set
for (const option of optionDefinitions) {
    if (!options[option.name]) {
        console.error(`Missing argument --${option.name}`);
        process.exit(1);
    }
}

const args: Args = {
    privateKey: options["private-key"],
};

export default args;
