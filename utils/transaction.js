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

export const sendTransaction = async ({
  to,
  from,
  amount,
  privateKey,
}) => {
  try {
    // get block to calculate the transaction's maxFeePerGas
    const block = await web3.eth.getBlock();

    // create transaction
    const transactionParameters = {
      from,
      to,
      value: web3.utils.toWei(amount, "ether"),
      maxFeePerGas: block.baseFeePerGas * 2n,
      maxPriorityFeePerGas: 100000,
    };

    // sign the transaction
    const signedTransaction = await web3.eth.accounts.signTransaction(
      transactionParameters,
      privateKey
    );

    // send signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );

    return {
      ok: true,
      message: "Transaction Successful",
      transactionHash: receipt.transactionHash,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || "Transaction Failed",
    };
  }
};

export const getTransactionHistory = async (address) => {
  const transactions = [];
  const latestBlock = await web3.eth.getBlockNumber();

  // loop through all blocks
  for (let i = 0; i <= latestBlock; i++) {
    const block = await web3.eth.getBlock(i, true);
    const timestamp = Number(block.timestamp);
    const date = new Date(timestamp * 1000); // Convert to milliseconds

    // Format the date to "Jun 02"
    const options = { month: "short", day: "2-digit" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    if (block && block.transactions) {
      block.transactions.forEach((tx) => {
        if (
          tx.from.toLowerCase() === address.toLowerCase() ||
          tx.to.toLowerCase() === address.toLowerCase()
        ) {
          tx.date = formattedDate;
          transactions.unshift(tx);
        }
      });
    }
  }
  return transactions;
};
