import Web3 from "web3";

let web3;

export function getWeb3() {
  if (!web3) {
    web3 = new Web3("http://127.0.0.1:7545");
  }
  return web3;
}
