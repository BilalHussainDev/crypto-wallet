import Web3 from "web3";
import { getAccountFromMnemonic } from "./mnemonic";

const web3 = new Web3("http://127.0.0.1:7545");

export async function storeMnemonic(mnemonic, password) {
  // get privatekey from mnemonic
  const { privateKey } = getAccountFromMnemonic(mnemonic);
  // encrypt private key
  const encryptedKey = await web3.eth.accounts.encrypt(
    `0x${privateKey}`,
    password,
    {
      iv: "bfb43120ae00e9de110f8325143a2709",
      salt: "210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd",
      c: 262144,
      kdf: "pbkdf2",
    }
  );
  // save encrypted key to local storage
  localStorage.setItem("encryptedKey", encryptedKey);
}
