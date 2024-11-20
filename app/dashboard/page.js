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
        <Box margin={1} sx={{ filter: "drop-shadow(-2px 4px 6px #2063a5)" }}>
          <Image
            src="/img/pol.svg"
            alt="POL"
            width={80}
            height={80}
            priority
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", height: "28px" }}>
          {balance === undefined ? (
            <div className="loader"></div>
          ) : (
            <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
              {balance.toFixed(4)} POL
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            margin: "1.5rem 0 1rem 0",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            sx={{ width: "96px", padding: "0", height: "2rem" }}
            variant="outlined"
          >
            <Link
              href={`/send-to?from=${address}&balance=${balance}&next=send-funds`}
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
