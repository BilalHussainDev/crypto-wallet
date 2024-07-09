import { getWeb3 } from "./web3";

console.log(getWeb3)

const web3 = getWeb3();

export const isAddress = (address) => {
    // Validate the to address
  if (!web3.utils.isAddress(address)) {
    return false;
  } else {
    return true;
  }
}

export const sendTransaction = async (from, to, value) => {
  const transactionParameters = {
    to,
    from,
    value: web3.utils.toWei(value, "ether"),
  };

  try {
    await web3.eth.sendTransaction(transactionParameters);
    return {
      ok: true,
      message: "Transaction Successful",
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || "Transaction Failed",
    };
  }
};
