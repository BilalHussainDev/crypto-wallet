"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";

import { ActivityTab, BackButton } from "@/components";
import { getTokenBalance } from "@/utils/token";

function DashboardComponent() {
	const [balance, setBalance] = useState();
	const searchParams = useSearchParams();
	const address = searchParams.get("address");
	const tokenAddress = searchParams.get("tokenAddress");
	const symbol = searchParams.get("symbol");

	useEffect(() => {
		(async() => {
				const tokenBalance = await getTokenBalance(address, tokenAddress);
				setBalance(+tokenBalance);
		})()
	}, [address, tokenAddress])


	if (!address) {
		return <p>No account selected.</p>;
	}

	return (
    <>
      <Box component="section">
        <Box sx={{ margin: "1rem 0", textAlign: "left" }}>
          <BackButton />
        </Box>

        <Typography
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          {address}
        </Typography>

        <Box>
          <Image
            src="/img/bobbin.png"
            alt="MATIC"
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
              {balance.toFixed(4)} {symbol}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            margin: "1.5rem 0 2rem 0",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            sx={{ width: "120px", padding: "0", height: "2rem" }}
            variant="outlined"
          >
            <Link
              href={`/send-to?from=${address}&balance=${balance}&tokenAddress=${tokenAddress}&symbol=${symbol}&next=send-tokens`}
              style={{ width: "100%" }}
            >
              Send
            </Link>
          </Button>
          <Button
            sx={{ width: "120px", padding: "0", height: "2rem" }}
            variant="outlined"
          >
            <Link
              href={`/receive-funds?address=${address}`}
              style={{ width: "100%" }}
            >
              Receive
            </Link>
          </Button>
        </Box>

        <Typography
          color="primary"
          sx={{
            mb: "1rem",
            fontSize: "25px",
            fontWeight: "500",
            lineHeight: "0.78",
            textAlign: "center",
          }}
        >
          Activity
        </Typography>

        <Box mb="1rem">
          <ActivityTab address={address} activityOf={symbol} />
        </Box>
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

export default function TokenDashboardPage() {
	return (
		<Suspense
			fallback={
				<Box>
					<Typography>Loading.....</Typography>
				</Box>
			}
		>
			<DashboardComponent />
		</Suspense>
	);
}
