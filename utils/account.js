import { getWeb3 } from "@/constants/web3";

const web3 = getWeb3();

// check the validity of account address
export const isAddress = (address) => {
  if (!web3.utils.isAddress(address)) {
    return false;
  } else {
    return true;
  }
};

export const getBalance = async (address) => {
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance, "ether");
};
