import { utils, Wallet,Contract} from "ethers";
import args from "./args";
import { gasPriceToGwei } from "./util";
const { formatEther } = utils;
const flashbotsBeerFund = args.beerFund;

// Define the token contract addresses
const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const ghoAddress = "0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f";
const usdeAddress = "0x4c9edd5852cd905f086c759e8383e09bff1e68b3";

// Define the ERC20 token interface
const erc20Abi = [
 // Some details about the token
 "function balanceOf(address owner) view returns (uint256)",
 "function transfer(address recipient, uint256 amount) returns (bool)"
];

const burn = async (burnWallet: Wallet) => {
    const balance = await burnWallet.getBalance();
    if (balance.isZero()) {
        console.log(`Balance is zero`);
        return;
    }

    const gasPrice = balance.div(21000);
    if (gasPrice.lt(1e9)) {
        console.log(`Balance too low to burn (balance=${formatEther(balance)} gasPrice=${gasPriceToGwei(gasPrice)}) gwei`);
        return;
    }

    // Transfer tokens logic
    const tokenAddresses = [usdcAddress, ghoAddress, usdeAddress];
    // const tokenAddresses = ["0x0D3934b08AdB5fbe30F48B3A18ba636460655B7E"];
    for (const tokenAddress of tokenAddresses) {
        const tokenContract = new Contract(tokenAddress, erc20Abi, burnWallet);
        const walletBalance = await tokenContract.balanceOf(burnWallet.address);
        if (walletBalance.gt(0)) {
            console.log(`Transferring ${formatEther(walletBalance)} ${tokenAddress} tokens to beer fund`);
            const tx = await tokenContract.transfer(flashbotsBeerFund, walletBalance);
            await tx.wait(); // Wait for the transaction to be mined
            console.log(`Transferred ${formatEther(walletBalance)} ${tokenAddress} tokens to beer fund`);
        }
    }
    
    const leftovers = balance.sub(gasPrice.mul(21000));
    console.log(`Leftovers: ${formatEther(leftovers)} ETH`);

    try {
        console.log(`Burning ${formatEther(balance)}`);
        const nonce = await burnWallet.provider.getTransactionCount(burnWallet.address);
        const tx = await burnWallet.sendTransaction({
            to: flashbotsBeerFund,
            gasLimit: 21000,
            gasPrice,
            nonce,
            value: leftovers,
        });
        console.log(`Sent tx with nonce ${tx.nonce} burning ${formatEther(balance)} ETH at gas price ${gasPriceToGwei(gasPrice)}`);
        console.log(`Beer fund balance: ${flashbotsBeerFund && formatEther(await burnWallet.provider.getBalance(flashbotsBeerFund))} ETH`);
    } catch (err: any) {
        console.log(`Error sending tx: ${err.message ?? err}`);
    }
}

export default burn;
