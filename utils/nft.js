import { getWeb3 } from "@/constants/web3";
import { nftABI } from "@/constants/abi";

const web3 = getWeb3();

export async function getNftDetails(userAddress, contractAddress, tokenId) {
  try {
    const nftContract = new web3.eth.Contract(nftABI, contractAddress);

    // Check ownership of the tokenId
    const owner = await nftContract.methods.ownerOf(tokenId).call();
    if (owner.toLowerCase() !== userAddress.toLowerCase()) {
      return {
        ok: false,
        message: "User is not the owner of the NFT",
      };
    }

    // Fetching the name and symbol of the NFT contract
    const name = await nftContract.methods.name().call();
    const symbol = await nftContract.methods.symbol().call();

    return {
      ok: true,
      data: {
        name,
        symbol,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: "Invalid contract address or tokenId",
    };
  }
}


export const getNftImage = async (contractAddress, tokenId) => {
  const nftContract = new web3.eth.Contract(nftABI, contractAddress);
  const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
  const res = await fetch(tokenURI);
  const data = await res.json();
  return data.image;
};

// transfer tokens
export async function sendToken({
  from,
  to,
  amount,
  privateKey,
  tokenAddress,
}) {
  try {
    const tokenContract = new web3.eth.Contract(nftABI, tokenAddress);
    const symbol = await tokenContract.methods.symbol().call();

    // Create transaction
    const transaction = tokenContract.methods.transfer(
      to,
      web3.utils.toWei(amount, "ether")
    );

    const gas = await transaction.estimateGas({ from });
    const gasPrice = await web3.eth.getGasPrice();
    const data = transaction.encodetokenABI();
    const nonce = await web3.eth.getTransactionCount(from);

    const tx = {
      from,
      to: tokenAddress,
      gas,
      gasPrice,
      data,
      nonce,
    };

    // Sign transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // Send signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    // Create transaction details to return
    const date = new Date();
    const options = { month: "short", day: "2-digit" };
    const transactionDate = date.toLocaleDateString("en-US", options);
    const transactionDetails = {
      transactionHash: receipt.transactionHash,
      from,
      to,
      value: amount,
      transactionDate,
      tokenSymbol: symbol,
    };

    return {
      ok: true,
      message: "Token transfer successful",
      transactionDetails,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || "Token transfer failed",
    };
  }
}

// save NFT addresses in local storage
export const storeNFT = (accountAddress, contractAddress, tokenId) => {
  // get previously stored NFTs from local storage
  const nfts = JSON.parse(localStorage.getItem("nfts")) || {};

    // update transactions history
    nfts[accountAddress] = nfts[accountAddress]
      ? [...nfts[accountAddress], { contractAddress, tokenId }]
      : [{ contractAddress, tokenId }];

    // store transaction again in local storage
    localStorage.setItem("nfts", JSON.stringify(nfts));
};

// retrive account related nft list form local storage
export const getAccountNftList = (address) => {
  const nfts = JSON.parse(localStorage.getItem("nfts"));
  if (nfts && nfts[address]) {
    return nfts[address];
  }
  return [];
};
