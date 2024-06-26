import { utils, Wallet,Contract} from "ethers";
import { gasPriceToGwei, sendTelegramMessage } from "./util";
const { formatEther } = utils;

// Define the token contract addresses
const ERC20Tokens = [
    { name: "USDC", addr: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }, 
    { name: "GHO", addr: "0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f" }, 
    { name: "USDE", addr: "0x4c9edd5852cd905f086c759e8383e09bff1e68b3" },  
    { name: "MANA", addr: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942" }, 
    { name: "swETH", addr: "0xf951e335afb289353dc249e82926178eac7ded78" }, 
    { name: "DOP", addr: "0x97A9a15168C22B3C137E6381037E1499C8ad0978" }
]

// Define the ERC20 token interface
const erc20Abi = [
 // Some details about the token
 "function balanceOf(address owner) view returns (uint256)",
 "function transfer(address recipient, uint256 amount) returns (bool)"
];

const burn = async (burnWallet: Wallet) => {
    const balance = await burnWallet.getBalance();
    if (balance.isZero()) {
        await sendTelegramMessage(`Balance is zero`);
        return;
    }

    const gasPrice = balance.div(21000);
    if (gasPrice.lt(1e9)) {
        await sendTelegramMessage(`Balance too low to burn (balance=${formatEther(balance)} gasPrice=${gasPriceToGwei(gasPrice)}) gwei`);
        return;
    }
    try {
    // Transfer tokens logic
    for (const ERC20Token of ERC20Tokens) {
        const tokenContract = new Contract(ERC20Token.addr, erc20Abi, burnWallet);
        const walletBalance = await tokenContract.balanceOf(burnWallet.address);
        if (walletBalance.gt(0)) {
            await sendTelegramMessage(`Transferring ${formatEther(walletBalance)} ${ERC20Token.addr} tokens to beer fund`);
            const tx = await tokenContract.transfer(process.env.BEER_FUND, walletBalance);
            await tx.wait(); // Wait for the transaction to be mined
            await sendTelegramMessage(`Transferred ${formatEther(walletBalance)} ${ERC20Token.addr} tokens to beer fund`);
        }
    }    
    } catch (err: any) {
        await sendTelegramMessage(`Error sending tx: ${err.message ?? err}`);
    }
    
    const leftovers = balance.sub(gasPrice.mul(21000));
    await sendTelegramMessage(`Leftovers: ${formatEther(leftovers)} ETH`);

    try {
        await sendTelegramMessage(`Burning ${formatEther(balance)}`);
        const nonce = await burnWallet.provider.getTransactionCount(burnWallet.address);
        const tx = await burnWallet.sendTransaction({
            to: process.env.BEER_FUND,
            gasLimit: 21000,
            gasPrice,
            nonce,
            value: leftovers,
        });
        await sendTelegramMessage(`Sent tx with nonce ${tx.nonce} burning ${formatEther(balance)} ETH at gas price ${gasPriceToGwei(gasPrice)}`);
        await sendTelegramMessage(`Beer fund balance: ${process.env.BEER_FUND && formatEther(await burnWallet.provider.getBalance(process.env.BEER_FUND))} ETH`);
    } catch (err: any) {
        await sendTelegramMessage(`Error sending tx: ${err.message ?? err}`);
    }
}

export default burn;
