require('dotenv').config();

import { BigNumber } from "@ethersproject/bignumber";
import axios from 'axios'; // Make sure to install axios if you haven't already

const GWEI = 1e9;

/** Returns human-readable gas price in gwei. */
export const gasPriceToGwei = (gasPrice: BigNumber) => (
    gasPrice.mul(100).div(GWEI).toNumber() / 100
);

export const sendTelegramMessage = async (message: string) => {
    try {
        await axios.post(process.env.TG_URL as string, {
            chat_id: process.env.TG_CHAT_ID,
            text: message,
        });
        console.log(`Message sent to Telegram: ${message}`);
    } catch (error) {
        console.error(`Failed to send message to Telegram: ${error}`);
    }
};