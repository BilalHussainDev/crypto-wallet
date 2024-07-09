import { Box, Typography } from "@mui/material";

export default function ButtonLoader({ children }) {
  return (
    <Box
      sx={{
        height: "40px",
        backgroundColor: "#86a4c2",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        cursor: "default",
        textTransform: 'uppercase',
        fontSize: '0.875rem'
      }}
    >
      <Typography>{children}</Typography>
    </Box>
  );
}
