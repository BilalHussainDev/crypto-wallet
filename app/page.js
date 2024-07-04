"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Home = () => {
  const [isNewUser, setIsNewUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem("encryptedKey");
      setIsNewUser(value === null);
    }
  }, []);

  return (
    <div>
      <h1>My Crypto Wallet</h1>
      {isNewUser === true && (
        <>
          <button>
            <Link href="/create-account">Create Account</Link>
          </button>
          <button>
            <Link href="/restore-account">Restore Account</Link>
          </button>
        </>
      )}
      {isNewUser === false && (
        <p>
          <button>
            <Link href="/unlock-account">Unlock Account</Link>
          </button>
          or &nbsp;
          <Link
            href="/restore-account"
            style={{ fontSize: "14px", color: "blue" }}
          >
            Restore Account
          </Link>
        </p>
      )}
    </div>
  );
};

export default Home;
