import { getWeb3 } from "@/constants/web3";

const web3 = getWeb3();

// give Estimated Fee
export const getEstimatedFee = async ({ to, from, amount }) => {
  try {
    // create transaction
    const transaction = {
      from,
      to,
      value: web3.utils.toWei(amount, "ether"),
    };

    // calculate gas
    const gas = await web3.eth.estimateGas(transaction);

    // calculate gas price
    const gasPrice = await web3.eth.getGasPrice();

    // calculate fee for transaction
    const fee = web3.utils.fromWei(gas * gasPrice, "ether");

    return {
      ok: true,
      estimatedFee: +fee,
    };
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      message: err.message,
    };
  }
};

// send Transaction
export const sendCoins = async ({ to, from, amount, privateKey }) => {
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
