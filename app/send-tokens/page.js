import { SendToken } from "@/components";

export default function SendTokensPage({searchParams}) {
  const from = searchParams.from;
  const to = searchParams.to;
  const balance = searchParams.balance;
  const tokenAddress = searchParams.tokenAddress;
  const symbol = searchParams.symbol;

  return (
    <SendToken
      from={from}
      to={to}
      balance={balance}
      tokenAddress={tokenAddress}
      symbol={symbol}
    />
  );
}
