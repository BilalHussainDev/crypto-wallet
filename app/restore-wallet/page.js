"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccountFromMnemonic } from "@/utils/mnemonic";
import { Typography } from "@mui/material";
import { encrypt } from "@/utils/encrypt";

const RestoreWallet = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleMnemonicSubmit = (e) => {
    e.preventDefault();
    // encrypt mnemonic
    const encrypted = encrypt(mnemonic, password);
    if (encrypted.ok) {
      // store encrypted mnemonic
      localStorage.setItem("encryptedKey", JSON.stringify(encrypted.key));
    }
    const res = getAccountFromMnemonic(mnemonic);
    router.push(`/dashboard?address=${res.address}`);
  };

  return (
    <>
      <Typography variant="h4" sx={{ pt: "1rem" }}>
        Restore Account
      </Typography>
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
    </>
  );
};

export default RestoreWallet;
