"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { ButtonLoader, PasswordField } from "@/components";
import { encrypt } from "@/utils/encrypt";
import { getAccountFromMnemonic } from "@/utils/mnemonic";

// 1 uppercase, 1 lowercase, 1 numeric and 1 special character
const passwordRules = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).*$";

// schema for reset password form or like that
const formSchema = object({
  mnemonic: string().required("Required"),
  password: string()
    .matches(passwordRules, {
      message:
        "Must contain one uppercase, one lowercase, one number and one special character",
    })
    .required("Required"),
  confirmPassword: string()
    .oneOf([ref("password")], "Passwords must match")
    .required("Required"),
});

const RestoreWallet = () => {
  const router = useRouter();

  const handleMnemonicSubmit = (data, { resetForm }) => {
    setTimeout(() => {
      // encrypt mnemonic
      const encrypted = encrypt(data.mnemonic, data.password);
      if (encrypted.ok) {
        // store encrypted mnemonic
        localStorage.setItem("encryptedKey", JSON.stringify(encrypted.key));
      }
      const res = getAccountFromMnemonic(data.mnemonic);
      router.push(`/dashboard?address=${res.address}`);
      resetForm();
    }, 0);
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
      mnemonic: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: formSchema,
    onSubmit: handleMnemonicSubmit,
  });

  return (
    <>
      <Typography variant="h4" sx={{ padding: "1rem 0" }}>
        Restore Account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} autoComplete="off">
        <FormControl fullWidth sx={{ minHeight: "80px" }}>
          <OutlinedInput
            name="mnemonic"
            placeholder="Enter secret recovery phrase"
            value={values.mnemonic}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            error={errors.mnemonic && touched.mnemonic ? true : false}
          />
          <FormHelperText sx={{ color: "red" }}>
            {errors.mnemonic && touched.mnemonic ? errors.mnemonic : ""}
          </FormHelperText>
        </FormControl>

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
              errors.confirmPassword && touched.confirmPassword ? true : false
            }
          />
          <FormHelperText sx={{ color: "red" }}>
            {errors.confirmPassword && touched.confirmPassword
              ? errors.confirmPassword
              : ""}
          </FormHelperText>
        </FormControl>

        {isSubmitting ? (
          <ButtonLoader>Restoring.....</ButtonLoader>
        ) : (
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ height: "40px" }}
          >
            Restore
          </Button>
        )}
      </Box>

      <Typography
        variant="body2"
        type="button"
        color="primary"
        textAlign="center"
        mt="1rem"
        disabled
      >
        {isSubmitting ? (
          <span style={{ color: "#86a4c2" }}>Cancel</span>
        ) : (
          <Link href="/">Cancel</Link>
        )}
      </Typography>
    </>
  );
};

export default RestoreWallet;
