import { getAccountFromMnemonic } from "./mnemonic";
import { getWeb3 } from "./web3";

const web3 = getWeb3();

export async function storeAccountDetails(mnemonic, password) {
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
  localStorage.setItem("encryptedKey", JSON.stringify(encryptedKey));
}

export async function verifyPassword(password) {
  const encryptedKey = JSON.parse(localStorage.getItem("encryptedKey"));

  if (!encryptedKey) {
    console.error("No encrypted key found in local storage");
    return false;
  }

  try {
    // decrypt encrypted key
    const decryptedAccount = await web3.eth.accounts.decrypt(
      encryptedKey,
      password
    );
    return {
      ok: true,
      message: "Verification Successfull",
      account: decryptedAccount,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Verification Failed",
    };
  }
}
