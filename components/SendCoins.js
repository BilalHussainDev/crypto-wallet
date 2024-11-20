"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { getEstimatedFee, sendCoins } from "@/utils/coin";
import { storeTransactionHistory } from "@/utils/transaction";
import { useActiveTab } from "@/contexts/ActiveTabContext";
import BackButton from "./BackButton";

const SendCoins = ({ from, to, balance }) => {
  const [transactionHash, setTransactionHash] = useState("");
  const [estimatedFee, setEstimatedFee] = useState(0);

  const router = useRouter();
  const { setActiveTab } = useActiveTab();

  // schema for send coins
  const formSchema = object({
    amount: number()
      .positive("Enter valid amount")
      .required("Amount is required")
      .test(
        "is-balance-enough",
        "You don't have enough balance",
        (amount) => amount < balance
      )
      .test(
        "estimate-fee",
        "Somethings wents wrong while estimating fee",
        async (amount) => {
          const res = await getEstimatedFee({
            from,
            to,
            amount: amount.toString(),
          });
          if (res.ok) {
            setEstimatedFee(res.estimatedFee);
            return true;
          }
          return false;
        }
      ),
    password: string().required("Password is required"),
  });

  async function handleTransferSubmit(data, actions) {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 100));

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
    const res = await sendCoins({
      to,
      from,
      amount: data.amount,
      privateKey,
    });

    if (res.ok) {
      storeTransactionHistory(res.receipt, data.amount, "POL");
      setTransactionHash(res.receipt.transactionHash);
      setActiveTab(1);
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
      amount: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: handleTransferSubmit,
  });

  useEffect(() => {
    getEstimatedFee({
      from,
      to,
      amount: "0",
    }).then((res) => {
      if (res.ok) {
        setEstimatedFee(res.estimatedFee);
      }
    });
  }, [from, to]);

  return (
    <>
      {!transactionHash && (
        <>
          <Box sx={{ margin: "1rem 0 0.5rem 0", textAlign: "left" }}>
            <BackButton />
          </Box>

          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: "1rem", fontWeight: "bold" }}
          >
            Transfer Funds
          </Typography>

          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
            <Box>
              <Typography
                sx={{
                  padding: "16.5px 14px",
                  height: "56px",
                  color: "#1b1f21",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                  marginBottom: "24px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {to}
              </Typography>
            </Box>

            <FormControl fullWidth sx={{ minHeight: "80px" }}>
              <OutlinedInput
                name="amount"
                placeholder="Enter amount in pol"
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "1.5rem",
                backgroundColor: "#bce4f6",
                border: "1px solid #f1fbff",
                borderRadius: "4px",
                padding: "14px",
              }}
            >
              <Typography fontWeight="bold">Estimated fee:</Typography>
              <Typography fontWeight="bold" color="primary">
                {estimatedFee.toFixed(8)} POL
              </Typography>
            </Box>

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
              <Link
                href={`https://www.oklink.com/amoy/tx/${transactionHash}`}
                target="_blank"
              >
                {transactionHash}
              </Link>
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
