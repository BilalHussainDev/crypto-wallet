"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode.react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

function ReceiveFundsComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  if (!address) {
    return <p>No account selected.</p>;
  }

  return (
    <>
      <Typography
        variant="body2"
        type="button"
        color="primary"
        textAlign="center"
        padding="0.5rem 0"
        sx={{ fontSize: "2.5rem", textAlign: "left" }}
      >
        <Link href={`/dashboard?address=${address}`}>⬅</Link>
      </Typography>

      <Typography
        component="h1"
        variant="h5"
        sx={{ mb: "2rem", fontWeight: "bold" }}
      >
        Main Account
      </Typography>
      <Box sx={{ mb: "2rem" }}>
        <QRCode value={address} />
      </Box>

      <Typography
        style={{
          mt: "2rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Address: {address}
      </Typography>
    </>
  );
}

export default function ReceiveFundsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReceiveFundsComponent />
    </Suspense>
  );
}
