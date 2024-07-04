"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateMnemonic, getAccountFromMnemonic } from "@/utils/mnemonic";
import { getWeb3 } from "@/utils/web3";

const CreateAccount = () => {
  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);

  const router = useRouter();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    // generate mnemonic
    const generatedMnemonic = generateMnemonic();
    // show mnemonic to user
    setMnemonic(generatedMnemonic);
    // get privatekey from mnemonic
    const { privateKey } = getAccountFromMnemonic(generatedMnemonic);
    // encrypt private key
    const web3 = await getWeb3();
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
    setShowMnemonic(true);
  };

  const handleDone = () => {
    const newAccount = getAccountFromMnemonic(mnemonic);
    router.push(`/account?address=${newAccount.address}`);
  };

  return (
    <div>
      <h1>Create Account</h1>
      {!showMnemonic && (
        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="password">Enter a password </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {showMnemonic && (
        <div>
          <p>
            Note these words, as there is no way of restoring it after you press
            done:
          </p>
          <p>{mnemonic}</p>
          <button onClick={handleDone}>Done</button>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;
