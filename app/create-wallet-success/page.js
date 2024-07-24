import Link from "next/link";
import { Button, Typography } from "@mui/material";
import Logo from "@/components/Logo";


export default function CreateWalletSuccessPage() {
  return (
    <>
      <Logo />

      <Typography sx={{ color: "green", mb: "2rem" }}>
        Your Wallet has been created successfully.
      </Typography>

      <Typography sx={{ color: "green", fontSize: "2rem", mb: "2rem" }}>
        ✅
      </Typography>

      <Link href="/unlock-wallet" replace>
        <Button variant="contained" sx={{ width: "80%" }}>
          Continue
        </Button>
      </Link>
    </>
  );
}
