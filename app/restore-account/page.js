"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccountFromMnemonic } from "@/utils/mnemonic";
import { storeAccountDetails } from "@/utils/auth";

const RestoreAccount = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleMnemonicSubmit = (e) => {
    e.preventDefault();
    const restoredAccount = getAccountFromMnemonic(mnemonic);
    // Encrypt and Store mnemonic in local storage
    storeAccountDetails(mnemonic, password);
    router.push(`/account/${restoredAccount.address}`);
  };

  return (
    <div>
      <h1>Restore Account</h1>
      <form onSubmit={handleMnemonicSubmit}>
        <p>
          <label htmlFor="phrase">Enter your secret phrase: </label>
          <input
            type="text"
            id="phrase"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            required
          />
        </p>
        <p>
          <label htmlFor="password">Create a Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </p>
        <button type="submit">Restore Account</button>
      </form>
    </div>
  );
};

export default RestoreAccount;
