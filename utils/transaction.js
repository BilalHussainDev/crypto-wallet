import { getWeb3 } from "./web3";

const web3 = getWeb3();

export const sendTransaction = async (from, to, value) => {
  const transactionParameters = {
    to,
    from,
    value: web3.utils.toWei(value, "ether"),
  };
  try {
    await web3.eth.sendTransaction(transactionParameters);
    return true;
  } catch (error) {
    console.error("Transaction failed:", error);
    return false;
  }
};
