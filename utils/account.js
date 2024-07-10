import { getWeb3 } from "./web3";

const web3 = getWeb3();

export const getBalance = async (address) => {
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance, "ether");
};
