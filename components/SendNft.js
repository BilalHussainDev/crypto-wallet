import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Tooltip,
  Typography,
} from "@mui/material";

import { BackButton, ButtonLoader, PasswordField, Logo } from ".";
import { decrypt } from "@/utils/encrypt";
import { getAccountFromMnemonic } from "@/utils/mnemonic";
import { isAddress, storeTransactionHistory } from "@/utils/transaction";
import { sendNft } from "@/utils/nft";
import Link from "next/link";

// schema for send transaction form or like that
const formSchema = object({
  to: string().required("Address is required"),
  password: string().required("Password is required"),
});

const SendNft = ({ from, contractAddress, tokenId, symbol }) => {
  const [transactionHash, setTransactionHash] = useState("");

  const router = useRouter();

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
    const transactionResponse = await sendNft({
      to: data.to,
      from,
      tokenId,
      privateKey,
      contractAddress,
    });

    if (transactionResponse.ok) {
      storeTransactionHistory(transactionResponse.transactionDetails, symbol);
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
            Transfer NFT
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
            Transaction Successful
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

          <Link href={`/dashboard?address=${from}`} replace>
            <Button sx={{ width: "80%" }} variant="contained">
              Back to Dashboard
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

export default SendNft;
