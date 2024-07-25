"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { SendTransaction } from "@/components";

function SendFundsComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const balance = searchParams.get("balance");

  if (!address) {
    return <p>No account selected.</p>;
  }

  return <SendTransaction from={address} balance={balance} />;
}

export default function SendFundsPage() {
  return (
    <Suspense
      fallback={
        <Box>
          <Typography>Loading.....</Typography>
        </Box>
      }
    >
      <SendFundsComponent />
    </Suspense>
  );
}
