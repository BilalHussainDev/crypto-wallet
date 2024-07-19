"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SendToken } from "@/components";

function SendTokenComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const tokenAddress = searchParams.get("tokenAddress");

  if (!address) {
    return <p>No account selected.</p>;
  }

  return <SendToken from={address} tokenAddress={tokenAddress} />;
}

export default function SendTokensPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SendTokenComponent />
    </Suspense>
  );
}
