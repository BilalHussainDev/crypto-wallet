import { BackButton, ReceiverForm } from "@/components";
import { Box, Typography } from "@mui/material";

export default function SendToPage({searchParams}) {
  const from = searchParams.from;
  const balance = searchParams.balance;
  const next = searchParams.next;
  const tokenAddress = searchParams.tokenAddress
  const symbol = searchParams.symbol

  return (
    <>
      <Box sx={{ margin: "1rem 0", textAlign: "left" }}>
        <BackButton />
      </Box>

      <Typography
        component="h1"
        variant="h5"
        sx={{ mb: "2rem", fontWeight: "bold" }}
      >
        Send To
      </Typography>

      <ReceiverForm from={from} balance={balance} tokenAddress={tokenAddress} symbol={symbol} next={next} />
    </>
  );
}
