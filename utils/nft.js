import { getWeb3 } from "@/constants/web3";
import { nftABI } from "@/constants/abi";

const web3 = getWeb3();

// import nft
export async function getNftDetails(userAddress, contractAddress, tokenId) {
  try {
    const nftContract = new web3.eth.Contract(nftABI, contractAddress);

    // Fetching the name and symbol of the NFT contract
    const name = await nftContract.methods.name().call();
    const symbol = await nftContract.methods.symbol().call();

    // Check ownership of the tokenId
    const owner = await nftContract.methods.ownerOf(tokenId).call();
    const isOwner = owner.toLowerCase() === userAddress.toLowerCase();

    return {
      ok: true,
      data: {
        name,
        symbol,
        isOwner
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: "Invalid contract address or tokenId",
    };
  }
}

// give nft image
export const getNftImage = async (contractAddress, tokenId) => {
  const nftContract = new web3.eth.Contract(nftABI, contractAddress);
  const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
  const res = await fetch(tokenURI);
  const data = await res.json();
  return data.image;
};

// give esimated transaction fee
export async function getEstimatedFee({
  from,
  to,
  contractAddress,
  tokenId,
}) {
  try {
    const tokenContract = new web3.eth.Contract(nftABI, contractAddress);

    // Create transaction
    const transaction = tokenContract.methods.transferFrom(from, to, tokenId);

    const gas = await transaction.estimateGas({ from });
    const gasPrice = await web3.eth.getGasPrice();
    const fee = web3.utils.fromWei(gas * gasPrice, "ether");
    return {
      ok: true,
      estimatedFee: +fee
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || "Failed while estimating fee",
    };
  }
}

// transfer nft
export async function sendNft({
  from,
  to,
  tokenId,
  privateKey,
  contractAddress,
}) {
  try {
    const tokenContract = new web3.eth.Contract(nftABI, contractAddress);

    // Create transaction
    const transaction = tokenContract.methods.transferFrom(from, to, tokenId);

    const gas = await transaction.estimateGas({ from });
    const gasPrice = await web3.eth.getGasPrice();
    const data = transaction.encodeABI();
    const nonce = await web3.eth.getTransactionCount(from);

    const tx = {
      from,
      to: contractAddress,
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

    return {
      ok: true,
      message: "NFT transfer successful",
      receipt,
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || "NFT transfer failed",
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

// retrive all nfts form local storage
export const getAllStoredNfts = () => {
  const nfts = JSON.parse(localStorage.getItem("nfts"));
  return nfts || {};
};
