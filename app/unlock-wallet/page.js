"use client";

import Link from "next/link";
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
import { ButtonLoader, Logo, PasswordField } from "@/components";
import { decrypt } from "@/utils/encrypt";
import { getAccountFromMnemonic } from "@/utils/mnemonic";

const formSchema = object({
  password: string().required("Password is required"),
});

const UnlockAccount = () => {
  const router = useRouter();

  const handlePasswordSubmit = (
    data,
    { resetForm, setErrors, setSubmitting }
  ) => {
    setTimeout(() => {
      // get encryptedKey from the localStorage
      const encryptedKey = JSON.parse(localStorage.getItem("encryptedKey"));
      // decrypt the encrypted key
      const decrypted = decrypt(encryptedKey, data.password);
      if (!decrypted.ok) {
        setErrors({ password: "Invalid Password" });
        setSubmitting(false);
        return;
      } else {
        const res = getAccountFromMnemonic(decrypted.key);
        router.replace(`/dashboard?address=${res.address}`);
        resetForm();
      }
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
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: handlePasswordSubmit,
  });

  return (
    <>
      <Logo />

      <Typography sx={{ color: "#06213c", mb: "2rem" }}>
        Welcome again! <br /> Please enter your password to get started.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} autoComplete="off">
        <FormControl fullWidth sx={{ height: "80px", mb: "0.5rem" }}>
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

        {isSubmitting ? (
          <ButtonLoader>Unlocking.....</ButtonLoader>
        ) : (
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ height: "40px" }}
          >
            {isSubmitting ? "Unlocking....." : "Unlock"}
          </Button>
        )}

        <Typography mt={1.5}>or</Typography>

        <Typography
          color="primary"
          fontStyle='italic'
          mt={1}
        >
          <Link href="/restore-wallet">import using recovery phrase</Link>
        </Typography>
      </Box>
    </>
  );
};

export default UnlockAccount;
