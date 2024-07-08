"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode.react";
import { Typography } from "@mui/material";
import Link from "next/link";

function RecieveFundsComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  if (!address) {
    return <p>No account selected.</p>;
  }

  return (
    <div>
      <h2>Recieve</h2>
      <p>Scan this QR code to receive funds:</p>
      <QRCode value={address} />
      <p
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Address: {address}
      </p>

      <Typography
        variant="body2"
        type="button"
        color="primary"
        textAlign="center"
        mt="1rem"
      >
        <Link href={`/dashboard?address=${address}`}>Back</Link>
      </Typography>
    </div>
  );
}

export default function RecieveFundsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecieveFundsComponent />
    </Suspense>
  );
}
