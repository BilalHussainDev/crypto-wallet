"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { object, string } from "yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Typography,
} from "@mui/material";
import { PasswordField } from "@/components";
import { verifyPassword } from "@/utils/auth";

const formSchema = object({
  password: string().required("Required"),
});

const UnlockAccount = () => {
  const router = useRouter();

  const handlePasswordSubmit = async (data, { resetForm, setErrors }) => {
    const res = await verifyPassword(data.password);
    if (!res.ok) {
      setErrors({ password: "Incorrect Password" });
    } else {
      resetForm();
      router.push(`/account/${res.account.address}`);
    }
  };

  // Extracting Form State and Helper Methods from formik
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: handlePasswordSubmit,
  });

  return (
    <>
      <Box>
        <Image
          src="/img/ethereum.png"
          alt="ETH"
          width={150}
          height={150}
          priority
        />
      </Box>

      <Typography sx={{ color: "#06213c", mb: "2rem" }}>
        Welcome back! The decentralized web awaits.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} autoComplete="off">
        <FormControl fullWidth sx={{ height: "80px" }}>
          <PasswordField
            name="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            error={errors.password && touched.password ? true : false}
          />
          <FormHelperText sx={{ color: "red" }}>
            {errors.password && touched.password ? errors.password : ""}
          </FormHelperText>
        </FormControl>

        <Typography variant="body2" color="primary" textAlign="right" mb="2rem">
          <Link href="/restore-account">Forgot Password?</Link>
        </Typography>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Unlocking..." : "Unlock"}
        </Button>
      </Box>
    </>
  );
};

export default UnlockAccount;
