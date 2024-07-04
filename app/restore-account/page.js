"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccountFromMnemonic } from "@/utils/mnemonic";

const RestoreAccount = () => {
  const [mnemonic, setMnemonic] = useState("");
  const router = useRouter();

  const handleMnemonicSubmit = (e) => {
    e.preventDefault();
    const restoredAccount = getAccountFromMnemonic(mnemonic);
    router.push(`/account?address=${restoredAccount.address}`);
  };

  return (
    <div>
      <h1>Restore Account</h1>
      <form onSubmit={handleMnemonicSubmit}>
        <label>
          Enter your mnemonic phrase:
          <input
            type="text"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            required
          />
        </label>
        <button type="submit">Restore Account</button>
      </form>
    </div>
  );
};

export default RestoreAccount;
