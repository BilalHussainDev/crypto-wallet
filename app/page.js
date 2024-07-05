"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";

const Home = () => {
  const [isNewUser, setIsNewUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem("encryptedKey");
      setIsNewUser(value === null);
    }
  }, []);

  return (
    <>
      <Box>
        <Image src="/img/ethereum.png" alt="ETH" width={150} height={150} />
      </Box>
      <Typography sx={{ color: "#dfffff", mb: "2rem" }}>
        Welcome to next generation crypto wallet exchange, the most complete
        dapp solution.
      </Typography>
      {isNewUser === true && (
        <>
          <Button
            sx={{ width: "90%", marginBottom: "1.5rem" }}
            color="primary"
            variant="contained"
          >
            <Link href="/create-account">Create Account</Link>
          </Button>
          <Button sx={{ width: "90%" }} color="primary" variant="contained">
            <Link href="/restore-account">Import Account</Link>
          </Button>
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
    </>
  );
};

export default Home;
