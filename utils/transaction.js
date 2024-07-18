import { getWeb3 } from "./web3";

const web3 = getWeb3();

export const isAddress = (address) => {
  // Validate the receiver address
  if (!web3.utils.isAddress(address)) {
    return false;
  } else {
    return true;
  }
};

export const sendTransaction = async ({ to, from, amount, privateKey }) => {
  try {
    // get block to calculate the transaction's maxFeePerGas
    // const block = await web3.eth.getBlock();

    // create transaction
    const transactionParams = {
      from,
      to,
      value: web3.utils.toWei(amount, "ether"),
      // maxFeePerGas: block.baseFeePerGas * 2n,
      // maxPriorityFeePerGas: 100000,
    };

    transactionParams.gas = await web3.eth.estimateGas(
      transactionParams
    );
    transactionParams.gasPrice = await web3.eth.getGasPrice();

    // sign the transaction
    const signedTransaction = await web3.eth.accounts.signTransaction(
      transactionParams,
      privateKey
    );

    // send signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );

    // create transactionDetails to return back
    const date = new Date();
    const options = { month: "short", day: "2-digit" };
    const transactionDate = date.toLocaleDateString("en-US", options);
    const transactionDetails = {
      transactionHash: receipt.transactionHash,
      from,
      to,
      value: amount,
      transactionDate,
    };

    return {
      ok: true,
      message: "Transaction Successful",
      transactionDetails,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || "Transaction Failed",
    };
  }
};

export const storeTransactionHistory = (transactionDetails) => {
  // get transactions from local storage
  const transactions = JSON.parse(localStorage.getItem("transactions")) || {};

  const to = transactionDetails.to;
  const from = transactionDetails.from;
  
  // update transactions history
  transactions[from] = transactions[from]
    ? [...transactions[from], transactionDetails]
    : [transactionDetails];

  transactions[to] = transactions[to]
    ? [...transactions[to], transactionDetails]
    : [transactionDetails];

  // store transaction again in local storage
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

export const getTransactionHistory = (address) => {
  const transactions = JSON.parse(localStorage.getItem("transactions"));
  if (!transactions || !transactions[address]) {
    return [];
  }
  return transactions[address];
};