'use client'
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      sx={{padding: '2px 2px 2px 12px', minWidth: 'auto',}}
      onClick={handleBack}
    />
  );
};

export default BackButton;
