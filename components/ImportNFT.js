import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography,
} from "@mui/material";

import { BackButton, ButtonLoader } from ".";
import { getNftDetails, storeNFT } from "@/utils/nft";
import { useState } from "react";

const addressRules = /^0x[a-fA-F0-9]{40}$/;

// schema for import NFTs
const formSchema = object({
  contractAddress: string()
    .matches(addressRules, {
      message: "Invalid contract address",
    })
    .required("Contract address is required"),
  id: number().required('ID is required')
});

const ImportToken = ({ address }) => {
  const [message, setMessage] = useState('')

  const router = useRouter();

  async function handleImportNFT(data, actions) {
    const res = await getNftDetails(address, data.contractAddress, data.id);

    if (!res.ok) {
      setMessage(res.message);
      return;
    } 

    console.log(res.data)

    // store NFT data in local storage
    // storeNFT(address, data.contractAddress, data.id);

    // redirect to dashboard with account address
    // router.replace(`/dashboard?address=${address}`);
    // actions.resetForm();
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
      contractAddress: "",
      id: "",
    },
    validationSchema: formSchema,
    onSubmit: handleImportNFT,
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
        Import NFT
      </Typography>

      <Typography
        sx={{ mb: "1rem", textAlign: 'left'}}
      >
        {!message ? (
          "Please provide the following details."
        ) : (
          <Typography component="span" sx={{ color: "#b90e0e" }}>{message}</Typography>
        )}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} autoComplete="off">
        <FormControl fullWidth sx={{ minHeight: "80px" }}>
          <OutlinedInput
            name="contractAddress"
            placeholder="Enter token contract address"
            value={values.contractAddress}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            error={
              errors.contractAddress && touched.contractAddress ? true : false
            }
          />
          <FormHelperText sx={{ color: "red" }}>
            {errors.contractAddress && touched.contractAddress
              ? errors.contractAddress
              : ""}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth sx={{ minHeight: "80px" }}>
          <OutlinedInput
            name="id"
            type="number"
            placeholder="Enter token ID"
            value={values.id}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            error={errors.id && touched.id ? true : false}
          />
          <FormHelperText sx={{ color: "red" }}>
            {errors.id && touched.id ? errors.id : ""}
          </FormHelperText>
        </FormControl>

        {isSubmitting ? (
          <ButtonLoader>Importing.....</ButtonLoader>
        ) : (
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ height: "40px" }}
          >
            Import NFT
          </Button>
        )}
      </Box>
    </>
  );
};

export default ImportToken;
