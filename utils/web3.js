import Web3 from "web3";

let web3;

export function getWeb3() {
  if (!web3) {
    web3 = new Web3("https://80002.rpc.thirdweb.com/");
  }
  return web3;
}
