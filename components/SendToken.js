import Link from "next/link";
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
import { getTokenBalance, sendToken } from "@/utils/token";
import { getAccountFromMnemonic } from "@/utils/mnemonic";
import { isAddress, storeTransactionHistory } from "@/utils/transaction";

// schema for send transaction form or like that
const formSchema = object({
	to: string().required("Address is required"),
	amount: number()
		.positive("Enter valid amount")
		.required("Amount is required"),
	password: string().required("Password is required"),
});

const SendToken = ({ from, tokenAddress, symbol, balance }) => {
	const [transactionHash, setTransactionHash] = useState("");

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

		// check for enough balance
		const balance = await getTokenBalance(from, tokenAddress);
		if (data.amount > balance) {
			actions.setErrors({ amount: "You don't have enough balance" });
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
		const transactionResponse = await sendToken({
			to: data.to,
			from,
			amount: data.amount,
			privateKey,
			tokenAddress,
		});

		if (transactionResponse.ok) {
			storeTransactionHistory(transactionResponse.transactionDetails);
			setTransactionHash(
				transactionResponse.transactionDetails.transactionHash
			);
			actions.resetForm();
		} else {
			actions.setSubmitting(false);
			throw new Error(transactionResponse.message);
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
          <Typography
            variant="body2"
            type="button"
            color="primary"
            textAlign="center"
            padding="0.5rem 0"
            sx={{ fontSize: "2.5rem", textAlign: "left" }}
          >
            <Link
              href={`/token-dashboard?address=${from}&tokenAddress=${tokenAddress}&symbol=${symbol}`}
            >
              ⬅
            </Link>
          </Typography>
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: "2rem", fontWeight: "bold" }}
          >
            Transfer Tokens
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
                placeholder="Enter amount"
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
            sx={{ width: "80%", height: "34px", padding: "0" }}
            variant="contained"
          >
            <Link
              href={`/token-dashboard?address=${from}&tokenAddress=${tokenAddress}&symbol=${symbol}`}
              style={{ width: "100%" }}
            >
              Back to Dashboard
            </Link>
          </Button>
        </>
      )}
    </>
  );
};

export default SendToken;
