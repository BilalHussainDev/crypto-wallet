const bip39 = require("bip39");
import { hdkey } from "ethereumjs-wallet";

export const generateMnemonic = () => {
  return bip39.generateMnemonic();
};

export const getAccountFromMnemonic = (mnemonic) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const hdWallet = hdkey.fromMasterSeed(seed);
  const key = hdWallet.derivePath(`m/44'/60'/0'/0/0`).getWallet();
  const address = `0x${key.getAddress().toString("hex")}`;
  const privateKey = key.getPrivateKey().toString("hex");
  return { address, privateKey };
};
