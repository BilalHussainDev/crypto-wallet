import { getWeb3 } from "@/constants/web3";

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
    // create transaction
    const transactionParams = {
      from,
      to,
      value: web3.utils.toWei(amount, "ether"),
    };

    // calculate gas
    transactionParams.gas = await web3.eth.estimateGas(transactionParams);

    // calculate gas price
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

    return {
      ok: true,
      message: "Transaction Successful",
      receipt,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || "Transaction Failed",
    };
  }
};

export const storeTransactionHistory = (receipt, amount, symbol) => {
  // find transaction date
  const date = new Date();
  const options = { month: "short", day: "2-digit" };
  const transactionDate = date.toLocaleDateString("en-US", options);

  // extract required fields from receipt
  const transactionHash = receipt.transactionHash;
  const from = receipt.from;
  const to = receipt.to;

  // create transaction Obj to store
  const transactionDetails = {
    transactionHash,
    transactionDate,
    from,
    to,
    amount,
    symbol,
  };

  // get stored transactions from local storage
  const transactions = JSON.parse(localStorage.getItem("transactions")) || {};

  // update transactions of current account
  transactions[from] = transactions[from]
    ? [transactionDetails, ...transactions[from]]
    : [transactionDetails];

  // store transaction again in local storage
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

export const getTransactionHistory = (address) => {
  // get stored transactions from local storage
  const transactions = JSON.parse(
    localStorage.getItem("transactions")
  );

  // check if there is no transaction 
  if (!transactions || !transactions[address]) {
    return [];
  }
  return transactions[address];
};
