"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { ImportNFT } from "@/components";

function ImportNftComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  if (!address) {
    return <p>No account selected.</p>;
  }

  return <ImportNFT address={address} />;
}

export default function ImportNftPage() {
  return (
    <Suspense
      fallback={
        <Box>
          <Typography>Loading.....</Typography>
        </Box>
      }
    >
      <ImportNftComponent />
    </Suspense>
  );
}
