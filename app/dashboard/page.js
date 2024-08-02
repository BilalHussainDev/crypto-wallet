"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";

import { getBalance } from "@/utils/account";
import { DashboardTabs } from "@/components";

function Dashboard() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const [balance, setBalance] = useState();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (address) {
        const accountBalance = await getBalance(address);
        setBalance(+accountBalance);
      }
    };
    fetchAccountDetails();
  }, [address]);

  return (
    <>
      <Box component="section">
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

        <Box sx={{ display: "flex", justifyContent: "center", height: "28px" }}>
          {balance === undefined ? (
            <div className="loader"></div>
          ) : (
            <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
              {balance.toFixed(4)} ETH
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            margin: "1.5rem 0",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            sx={{ width: "96px", padding: "0", height: "2rem" }}
            variant="outlined"
          >
            <Link
              href={`/send-to?from=${address}&balance=${balance}`}
              style={{ width: "100%" }}
            >
              Send
            </Link>
          </Button>
          <Button
            sx={{ width: "96px", padding: "0", height: "2rem" }}
            variant="outlined"
          >
            <Link
              href={`/receive-funds?address=${address}`}
              style={{ width: "100%" }}
            >
              Receive
            </Link>
          </Button>
          <Button
            sx={{ width: "96px", padding: "0", height: "2rem" }}
            variant="outlined"
          >
            <Link href={`/`} replace style={{ width: "100%" }}>
              Logout
            </Link>
          </Button>
        </Box>

        <DashboardTabs address={address} />
      </Box>

      {/* Disable all interactions while loading */}
      {balance === undefined && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "0",
            zIndex: "100",
            width: "100%",
            height: "100%",
          }}
        ></Box>
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <Box>
          <Typography>Loading.....</Typography>
        </Box>
      }
    >
      <Dashboard />
    </Suspense>
  );
}
