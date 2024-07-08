"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBalance, getTransactionHistory } from "@/utils/account";
import { getWeb3 } from "@/utils/web3";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

const web3 = getWeb3();

function DashboardComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const [balance, setBalance] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (address) {
        const accountBalance = await getBalance(address);
        setBalance(accountBalance);
        const accountTransactions = await getTransactionHistory(address);
        setTransactions(accountTransactions);
      }
    };
    fetchAccountDetails();
  }, [address]);

  if (!address) {
    return <p>No account selected.</p>;
  }

  return (
    <>
      <Typography
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: "center",
          fontSize: "14px",
          pt: "16px",
        }}
      >
        {address}
      </Typography>

      <Box>
        <Image
          src="/img/ethereum.png"
          alt="ETH"
          width={100}
          height={100}
          priority
        />
      </Box>

      <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
        {balance} ETH
      </Typography>

      <Box sx={{ margin: "1rem 0" }}>
        <Button
          sx={{ width: "40%", margin: "8px", height: "34px", padding: "0" }}
          variant="outlined"
        >
          <Link
            href={`/send-funds?address=${address}`}
            style={{ width: "100%" }}
          >
            Send
          </Link>
        </Button>
        <Button
          sx={{ width: "40%", margin: "8px", height: "34px", padding: "0" }}
          variant="outlined"
        >
          <Link
            href={`/receive-funds?address=${address}`}
            style={{ width: "100%" }}
          >
            Recieve
          </Link>
        </Button>
      </Box>

      <Box>
        <Typography variant="h4" mb="1rem">
          Activity
        </Typography>
        <Box component="ul">
          {transactions.map((tx, index) => (
            <Box
              sx={{ borderBottom: "1px solid #19cfd2", padding: "0.5rem" }}
              component="li"
              key={index}
            >
              <Typography fontSize="14px">
                {address === tx.from ? "Sent: " : "Recieved: "}
                {web3.utils.fromWei(tx.value, "ether")} ETH
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardComponent />
    </Suspense>
  );
}
