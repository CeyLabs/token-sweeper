import { BigNumber } from "@ethersproject/bignumber";
import axios from 'axios'; // Make sure to install axios if you haven't already

const GWEI = 1e9;

/** Returns human-readable gas price in gwei. */
export const gasPriceToGwei = (gasPrice: BigNumber) => (
    gasPrice.mul(100).div(GWEI).toNumber() / 100
);
export const sendTelegramMessage = async (message: string) => {
    const botToken = '6854397591:AAGC749rV59KRWF-s4oNvyhFQS5hsUD7U3Y'; // Replace with your bot token
    const chatId = '-1002055637634'; // Replace with your chat ID
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: chatId,
            text: message,
        });
        console.log(`Message sent to Telegram: ${message}`);
    } catch (error) {
        console.error(`Failed to send message to Telegram: ${error}`);
    }
};