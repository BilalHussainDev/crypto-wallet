import Web3 from "web3";

const web3 = new Web3("http://127.0.0.1:7545");

export const sendTransaction = async (from, to, value) => {
  const transactionParameters = {
    to,
    from,
    value: web3.utils.toWei(value, "ether"),
  };
  try {
    const txHash = await web3.eth.sendTransaction(transactionParameters);
    console.log("Transaction successful:", txHash);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
};
