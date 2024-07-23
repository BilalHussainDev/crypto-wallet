import Link from "next/link";
import QRCode from './qrcode';
import { Box, Typography } from "@mui/material";

export default function ReceiveFundsPage({ searchParams }) {
  const address = searchParams.address;

  if (!address) {
    return <p>No account selected.</p>;
  }

  return (
    <>
      <Typography
        variant="body2"
        type="button"
        color="primary"
        textAlign="center"
        padding="0.5rem 0"
        sx={{ fontSize: "2.5rem", textAlign: "left" }}
      >
        <Link href={`/dashboard?address=${address}`}>⬅</Link>
      </Typography>

      <Typography
        component="h1"
        variant="h5"
        sx={{ mb: "2rem", fontWeight: "bold" }}
      >
        Main Account
      </Typography>
      <Box sx={{ mb: "2rem" }}>
        <QRCode value={address} />
      </Box>

      <Typography
        style={{
          mt: "2rem",
          textWrap: "wrap",
          overflowWrap: "break-word",
        }}
      >
        {address}
      </Typography>
    </>
  );
}
