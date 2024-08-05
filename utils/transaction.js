import { getWeb3 } from "@/constants/web3";

const web3 = getWeb3();

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
