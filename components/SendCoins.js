'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Tooltip,
  Typography,
} from "@mui/material";

import { ButtonLoader, PasswordField, Logo } from ".";
import { decrypt } from "@/utils/encrypt";
import { getAccountFromMnemonic } from "@/utils/mnemonic";
import {
  isAddress,
  sendTransaction,
  storeTransactionHistory,
} from "@/utils/transaction";
import BackButton from "./BackButton";

const SendCoins = ({ from, balance }) => {
  const [transactionHash, setTransactionHash] = useState("");

  const router = useRouter();

  // schema for send transaction form or like that
  const formSchema = object({
    to: string().required("Address is required"),
    amount: number()
      .positive("Enter valid amount")
      .required("Amount is required")
      .test(
          "is-balance-enough",
          "You don't have enough balance",
          (amount) => amount < balance
        ),
    password: string().required("Password is required"),
  });

  async function handleTransferSubmit(data, actions) {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // check validity of address
    const isValidAddress = isAddress(data.to);
    if (!isValidAddress) {
      actions.setErrors({ to: "Address is invalid" });
      actions.setSubmitting(false);
      return;
    }

    // check for password
    const encryptedKey = JSON.parse(localStorage.getItem("encryptedKey"));
    const { ok, key } = decrypt(encryptedKey, data.password);
    if (!ok) {
      actions.setErrors({ password: "Invalid Password" });
      actions.setSubmitting(false);
      return;
    }

    // get account from key i.e mnemonic
    const { privateKey } = getAccountFromMnemonic(key);

    // send transaction
    const res = await sendTransaction({
      to: data.to,
      from,
      amount: data.amount,
      privateKey,
    });

    if (res.ok) {
      storeTransactionHistory(res.receipt, data.amount, "ETH");
      setTransactionHash(res.receipt.transactionHash);
      actions.resetForm();
    } else {
      actions.setSubmitting(false);
      throw new Error(res.message);
    }
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
      to: "",
      amount: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: handleTransferSubmit,
  });

  return (
    <>
      {!transactionHash && (
        <>
          <Box sx={{ margin: "1rem 0", textAlign: "left" }}>
            <BackButton />
          </Box>

          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: "2rem", fontWeight: "bold" }}
          >
            Transfer Funds
          </Typography>
          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
            <FormControl fullWidth sx={{ minHeight: "80px" }}>
              <OutlinedInput
                name="to"
                placeholder="Enter receiver address"
                value={values.to}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                error={errors.to && touched.to ? true : false}
              />
              <FormHelperText sx={{ color: "red" }}>
                {errors.to && touched.to ? errors.to : ""}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ minHeight: "80px" }}>
              <OutlinedInput
                name="amount"
                placeholder="Enter amount in eth"
                type="number"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                error={errors.amount && touched.amount ? true : false}
              />
              <FormHelperText sx={{ color: "red" }}>
                {errors.amount && touched.amount ? errors.amount : ""}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ minHeight: "80px" }}>
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
              <ButtonLoader>Transfering.....</ButtonLoader>
            ) : (
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ height: "40px" }}
              >
                Transfer
              </Button>
            )}
          </Box>
        </>
      )}

      {transactionHash && (
        <>
          <Logo />

          <Typography sx={{ color: "green", mb: "2rem" }}>
            Transaction successful.
          </Typography>

          <Typography sx={{ color: "green", fontSize: "3rem", mb: "2rem" }}>
            ✅
          </Typography>

          <Tooltip title="Transaction Hash" placement="top">
            <Typography
              sx={{
                mb: "2rem",
                overflowWrap: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "#1565c0",
              }}
            >
              {transactionHash}
            </Typography>
          </Tooltip>

          <Button
            sx={{ width: "80%" }}
            variant="contained"
            onClick={() => router.back()}
          >
            Back to Dashboard
          </Button>
        </>
      )}
    </>
  );
};

export default SendCoins;