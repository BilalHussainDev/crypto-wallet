import { Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 20px",
      }}
    >
      <Box
        sx={{
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c668f",
        }}
      >
        <Typography
          sx={{ color: "#c7dbdf", fontSize: "10px", fontWeight: "bold" }}
        >
          ETH
        </Typography>
      </Box>

      <Box
        sx={{
          height: "2rem",
          border: "1px solid #0459ad",
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          color: "#0459ad",
        }}
      >
        <Typography fontSize={14}>Polygon Amoy Testnet</Typography>
      </Box>
    </Box>
  );
}
