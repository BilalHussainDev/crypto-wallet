import { Box, Icon, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";

export default function AssetsTab({address}) {
  return (
    <>
      <Typography
        sx={{ fontWeight: "bold" }}
        variant="body1"
        color="primary"
        textAlign="right"
        mt="0.5rem"
        mb="1.5rem"
      >
        <Link href={`/import-token?address=${address}`}>Import Tokens</Link>
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#e5feff",
          borderRadius: "10px",
          cursor: "pointer",
          mb: "8px",
          p: "10px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: "34px",
              height: "33px",
              marginRight: "12px",
              borderRadius: "10px",
              boxShadow: "rgba(202, 206, 220, 0.3) 7px 7px 10px",
              backgroundColor: "rgb(255, 255, 255)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography fontWeight="bold" color="primary">
              B
            </Typography>
          </Box>

          <Box>
            <Typography
              compoents="h2"
              sx={{
                fontSize: "13px",
                color: "rgb(9,9,9)",
                letterSpacing: "1.25",
                textAlign: "left",
              }}
            >
              Bobbin
            </Typography>
            <Typography color="primary" sx={{ fontSize: "12px" }}>
              0.2341 BOB
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: "29px",
            height: "28px",
            borderRadius: "10px",
            boxShadow: "rgba(202, 206, 220, 0.3) 7px 7px 10px",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowForwardIosIcon fontSize="x-small" sx={{ml: '2px'}} />
        </Box>
      </Box>
    </>
  );
}