"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SendTransaction } from "@/components";

function SendFundsComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  if (!address) {
    return <p>No account selected.</p>;
  }

  return <SendTransaction from={address} />;
}

export default function SendFundsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SendFundsComponent />
    </Suspense>
  );
}
