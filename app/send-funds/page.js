import { SendCoins } from "@/components";

export default function SendFundsPage({searchParams}) {
  const from = searchParams.from;
  const to = searchParams.to;
  const balance = searchParams.balance;

  return <SendCoins from={from} to={to} balance={balance} />;
}