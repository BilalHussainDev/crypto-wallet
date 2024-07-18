"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ImportToken } from "@/components";

function ImportTokenComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  if (!address) {
    return <p>No account selected.</p>;
  }

  return <ImportToken address={address} />;
}

export default function ImportTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImportTokenComponent />
    </Suspense>
  );
}
