import { getWeb3 } from "./web3";

const web3 = getWeb3();

export const getBalance = async (address) => {
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance, "ether");
};

export const getTransactionHistory = async (address) => {
  const latestBlock = await web3.eth.getBlockNumber();
  const transactions = [];

  for (let i = 0; i <= latestBlock; i++) {
    const block = await web3.eth.getBlock(i, true);
    if (block && block.transactions) {
      block.transactions.forEach((tx) => {
        if (
          tx.from.toLowerCase() === address.toLowerCase() ||
          tx.to.toLowerCase() === address.toLowerCase()
        ) {
          transactions.push(tx);
        }
      });
    }
  }

  // console.log(transactions);
  return transactions;
};
