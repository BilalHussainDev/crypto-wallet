"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateMnemonic, getAccountFromMnemonic } from "@/utils/mnemonic";
import { storeMnemonic } from "@/utils/storage";

const CreateAccount = () => {
  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState("");

  const router = useRouter();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    // generate mnemonic
    const generatedMnemonic = generateMnemonic();
    // remember mnemonic
    setMnemonic(generatedMnemonic);
    // Encrypt and Store mnemonic in local storage
    storeMnemonic(mnemonic, password);
  };

  const handleDone = () => {
    const newAccount = getAccountFromMnemonic(mnemonic);
    router.push(`/account?address=${newAccount.address}`);
  };

  return (
    <div>
      <h1>Create Account</h1>
      {!mnemonic ? (
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
      ) : (
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
