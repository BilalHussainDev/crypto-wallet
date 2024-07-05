"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

const Home = () => {
  const [isNewUser, setIsNewUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem("encryptedKey");
      setIsNewUser(value === null);
    }
  }, []);

  useEffect(() => {
    if (isNewUser === false) {
      router.push("/unlock-account");
    }
  }, [isNewUser]);

  return (
    <>
      <Box>
        <Image src="/img/ethereum.png" alt="ETH" width={150} height={150} priority />
      </Box>

      {isNewUser === null && <CircularProgress />}

      {isNewUser === true && (
        <>
          <Typography sx={{ color: "#06213c", mb: "2rem" }}>
            Welcome to next generation crypto wallet exchange, the most complete
            dapp solution.
          </Typography>

          <Button
            sx={{ width: "80%", marginBottom: "1.5rem" }}
            color="primary"
            variant="contained"
          >
            <Link href="/create-account">Create Account</Link>
          </Button>

          <Button sx={{ width: "80%" }} color="primary" variant="contained">
            <Link href="/restore-account">Import Account</Link>
          </Button>
        </>
      )}
    </>
  );
};

export default Home;
