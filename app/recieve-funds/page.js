"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode.react";

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
      <p>Address: {address}</p>
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
