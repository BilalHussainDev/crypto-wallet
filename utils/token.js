import { getWeb3 } from "@/constants/web3";
import { tokenABI } from "@/constants/abi";

const web3 = getWeb3();

export async function getTokenDetails(tokenAddress) {
  try {
    const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
    const name = await tokenContract.methods.name().call();
    const symbol = await tokenContract.methods.symbol().call();
    const decimals = await tokenContract.methods.decimals().call();

    return {
      ok: true,
      data: {
        name,
        symbol,
        decimals,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: "Invalid contract address",
    };
  }
}

export const getTokenBalance = async (address, tokenAddress) => {
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
  const balance = await tokenContract.methods.balanceOf(address).call();
  return web3.utils.fromWei(balance, "ether");
};

// give esimated transaction fee
export async function getEstimatedFee({ contractAddress }) {
  try {
    const tokenContract = new web3.eth.Contract(tokenABI, contractAddress);

    // Create transaction
    const transaction = tokenContract.methods.transfer(
      to,
      web3.utils.toWei(amount, "ether")
    );

    const gas = await transaction.estimateGas({ from });
    const gasPrice = await web3.eth.getGasPrice();
    const fee = web3.utils.fromWei(gas * gasPrice, "ether");
    return {
      ok: true,
      estimatedFee: +fee,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || "Failed while estimating fee",
    };
  }
}

// transfer tokens
export async function sendToken({
  from,
  to,
  amount,
  privateKey,
  tokenAddress,
}) {
  try {
    const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

    // Create transaction
    const transaction = tokenContract.methods.transfer(
      to,
      web3.utils.toWei(amount, "ether")
    );

    const gas = await transaction.estimateGas({ from });
    const gasPrice = await web3.eth.getGasPrice();
    const data = transaction.encodeABI();
    const nonce = await web3.eth.getTransactionCount(from);

    const tx = {
      from,
      to: tokenAddress,
      gas,
      gasPrice,
      data,
      nonce,
    };

    // Sign transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // Send signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    return {
      ok: true,
      message: "Token transfer successful",
      receipt,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || "Token transfer failed",
    };
  }
}

// save token addresses in local storage
export const storeToken = (address, tokenAddress) => {
  // get transactions from local storage
  const tokens = JSON.parse(localStorage.getItem("tokens")) || {};

  // check for already imported token
  if (!tokens[address] || !tokens[address].includes(tokenAddress)) {
    // update transactions history
    tokens[address] = tokens[address]
      ? [...tokens[address], tokenAddress]
      : [tokenAddress];

    // store transaction again in local storage
    localStorage.setItem("tokens", JSON.stringify(tokens));
  }
};

// retrieve token addresses from local storage
export const getTokenAddressList = (address) => {
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  if (tokens && tokens[address]) {
    return tokens[address];
  }
  return [];
};
