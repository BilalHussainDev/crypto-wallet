"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SendToken } from "@/components";

function SendTokenComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const tokenAddress = searchParams.get("tokenAddress");
  const symbol = searchParams.get("symbol");
  const balance = searchParams.get("balance");
  console.log(balance)

  if (!address) {
    return <p>No account selected.</p>;
  }

  return <SendToken from={address} tokenAddress={tokenAddress} symbol={symbol} balance={balance}/>;
}

export default function SendTokensPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SendTokenComponent />
    </Suspense>
  );
}
