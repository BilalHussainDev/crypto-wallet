"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { ButtonLoader, Logo, PasswordField } from "@/components";
import { generateMnemonic } from "@/utils/mnemonic";
import { encrypt } from "@/utils/encrypt";
import { useRouter } from "next/navigation";

// 1 uppercase, 1 lowercase, 1 numeric and 1 special character
const passwordRules = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).*$";

// schema for reset password form or like that
const formSchema = object({
  password: string()
    .min(8, "Password should be of at least 8 characters long")
    .matches(passwordRules, {
      message:
        "Must contain one uppercase, one lowercase, one number and one special character",
    })
    .required("Password is required"),
  confirmPassword: string()
    .oneOf([ref("password")], "Both passwords need to be the same")
    .required("Confirm password is required"),
});

const CreateAccount = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState('');
  const [isCreating, setIsCreating] = useState('');

  const router = useRouter();

  const handlePasswordSubmit = async (data) => {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    // generate mnemonic
    const generatedMnemonic = generateMnemonic();
    // set mnemonic state
    setMnemonic(generatedMnemonic);
    // set password state
    setPassword(data.password);
  };

  const handleCreateAccount = async () => {
    setIsCreating(true);
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    // encrypt mnemonic
    const encrypted = encrypt(mnemonic, password);
    if (encrypted.ok) {
      // store encrypted mnemonic
      localStorage.setItem("encryptedKey", JSON.stringify(encrypted.key));
      // navigate to CreateAccountSuccess Page
      router.replace('/create-wallet-success');
    }
    setIsCreating(false);
  }

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
      confirmPassword: "",
    },
    validationSchema: formSchema,
    onSubmit: handlePasswordSubmit,
  });

  return (
    <>
      <Logo />

      {!mnemonic && (
        <>
          <Typography sx={{ color: "#06213c", mb: "2rem" }}>
            Choose a password for your wallet
          </Typography>

          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
            <FormControl fullWidth sx={{ minHeight: "80px" }}>
              <PasswordField
                name="password"
                placeholder="Enter new password"
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

            <FormControl fullWidth sx={{ minHeight: "80px" }}>
              <PasswordField
                name="confirmPassword"
                placeholder="Confirm password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                error={
                  errors.confirmPassword && touched.confirmPassword
                    ? true
                    : false
                }
              />
              <FormHelperText sx={{ color: "red" }}>
                {errors.confirmPassword && touched.confirmPassword
                  ? errors.confirmPassword
                  : ""}
              </FormHelperText>
            </FormControl>

            {isSubmitting ? (
              <ButtonLoader>Loading.....</ButtonLoader>
            ) : (
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ height: "40px" }}
              >
                {isSubmitting ? "Please Wait" : "Continue"}
              </Button>
            )}
          </Box>

          <Typography
            variant="body2"
            type="button"
            color="primary"
            textAlign="center"
            mt="1rem"
          >
            {isSubmitting ? (
              <span style={{ color: "#86a4c2" }}>Cancel</span>
            ) : (
              <Link href="/">Cancel</Link>
            )}
          </Typography>
        </>
      )}

      {mnemonic !== "" && (
        <>
          <Typography sx={{ color: "#b90e0e", mb: "2rem" }}>
            Write down the secret phrase, it will help you to restore your
            wallet. Never Disclose it to anyone.
          </Typography>

          <Typography
            sx={{
              fontWeight: "bold",
              color: "#0e64b9",
              mb: "2rem",
            }}
          >
            {mnemonic}
          </Typography>

          {isCreating ? (
            <ButtonLoader>Creating Account.....</ButtonLoader>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={handleCreateAccount}
              sx={{ height: "40px" }}
            >
              Continue
            </Button>
          )}

          <Typography
            variant="body2"
            color="primary"
            textAlign="center"
            mt="1rem"
          >
            <Link href="/">Cancel</Link>
          </Typography>
        </>
      )}
    </>
  );
};

export default CreateAccount;
