"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { SendNft } from "@/components";

function SendNftComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const contractAddress = searchParams.get("contractAddress");
  const tokenId = searchParams.get("tokenId");
  const symbol = searchParams.get("symbol");

  if (!address) {
    return <p>No account selected.</p>;
  }

  return (
    <SendNft
      from={address}
      contractAddress={contractAddress}
      tokenId={tokenId}
      symbol={symbol}
    />
  );
}

export default function SendNftPage() {
  return (
    <Suspense
      fallback={
        <Box>
          <Typography>Loading.....</Typography>
        </Box>
      }
    >
      <SendNftComponent />
    </Suspense>
  );
}
