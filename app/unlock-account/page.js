"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyPassword } from "@/utils/auth";
import Link from "next/link";

const UnlockAccount = () => {
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const res = await verifyPassword(password);
    if (!res.ok) {
      throw new Error("Incorrect Password. Try to restore your account.");
    }

    router.push(`/account?address=${res.account.address}`);
  };

  return (
    <div>
      <h1>Verify it's you</h1>
      <form onSubmit={handlePasswordSubmit}>
        <label htmlFor="password">Enter your password </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <p>
        or &nbsp;
        <Link
          href="/restore-account"
          style={{ fontSize: "14px", color: "blue" }}
        >
          Restore Account
        </Link>
      </p>
    </div>
  );
};

export default UnlockAccount;
