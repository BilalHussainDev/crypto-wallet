'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography,
} from "@mui/material";

import { BackButton, ButtonLoader } from ".";
import { getTokenDetails, storeToken } from "@/utils/token";

const addressRules = /^0x[a-fA-F0-9]{40}$/;

const ImportToken = ({ address }) => {
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // function for yup validation test of token address
  async function isTokenValid(address) {
    setIsLoading(true);
    const res = await getTokenDetails(address);
    setIsLoading(false);
    if (res.ok) {
      setSymbol(res.data.symbol);
      setDecimals(res.data.decimals.toString());
      return true;
    }
    setSymbol("");
    setDecimals("");
    return false;
  }

  // schema for reset password form or like that
  const formSchema = object({
    address: string()
      .matches(addressRules, {
        message: "Invalid contract address",
      })
      .required("Contract address is required")
      .test("is-token-valid", "Invalid contract address", isTokenValid),
  });

  async function handleTokenSubmit(data, actions) {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // store token address in local storage
    storeToken(address, data.address);

    // redirect to dashboard with account address
    router.replace(`/dashboard?address=${address}`);
    actions.resetForm();
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
      address: "",
    },
    validationSchema: formSchema,
    onSubmit: handleTokenSubmit,
  });

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
        Import Tokens
      </Typography>

      <Box component="form" onSubmit={handleSubmit} autoComplete="off">
        <FormControl fullWidth sx={{ minHeight: "80px" }}>
          <OutlinedInput
            name="address"
            placeholder="Enter token contract address"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            error={errors.address && touched.address ? true : false}
          />
          <FormHelperText sx={{ color: "red" }}>
            {errors.address && touched.address ? errors.address : ""}
          </FormHelperText>
        </FormControl>

        <Box>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "16.5px 14px",
              height: "56px",
              color: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(0, 0, 0, 0.23)",
              borderRadius: "4px",
              marginBottom: "24px",
            }}
          >
            Token Symbol:{" "}
            {isLoading ? (
              <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />
            ) : (
              symbol
            )}
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "16.5px 14px",
              height: "56px",
              color: "rgba(0, 0, 0, 0.35)",
              border: "1px solid rgba(0, 0, 0, 0.23)",
              borderRadius: "4px",
              marginBottom: "24px",
            }}
          >
            Token Decimals:{" "}
            {isLoading ? (
              <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />
            ) : (
              decimals
            )}
          </Typography>
        </Box>

        {isSubmitting ? (
          <ButtonLoader>Adding Token.....</ButtonLoader>
        ) : (
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ height: "40px" }}
          >
            Add Custom Token
          </Button>
        )}
      </Box>
    </>
  );
};

export default ImportToken;
