import QRCode from "./qrcode";
import { Box, Typography } from "@mui/material";
import BackButton from "@/components/BackButton";

export default function ReceiveFundsPage({ searchParams }) {
  const address = searchParams.address;

  if (!address) {
    return <p>No account selected.</p>;
  }

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
