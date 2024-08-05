"use client";
import { useFormik } from "formik";
import { object, string } from "yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
} from "@mui/material";
import { ButtonLoader } from "@/components";
import { isAddress } from "@/utils/account";
import { useRouter } from "next/navigation";

// schema for search reciever address
const formSchema = object({
  to: string().required("Address is required"),
});

export default function ReceiverForm({from, balance, tokenAddress, symbol, next}) {
  const router = useRouter();

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
    },
    validationSchema: formSchema,
    onSubmit: handleSearchAddress,
  });

  async function handleSearchAddress(data, actions) {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // check validity of address
    const isValidAddress = isAddress(data.to);
    if (!isValidAddress) {
      actions.setErrors({ to: "Address is invalid" });
      actions.setSubmitting(false);
      return;
    }

    router.replace(`/${next}?from=${from}&to=${data.to}&balance=${balance}&tokenAddress=${tokenAddress}&symbol=${symbol}`);
  }

  return (
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

        {isSubmitting ? (
          <ButtonLoader>Searching.....</ButtonLoader>
        ) : (
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ height: "40px" }}
          >
            Continue
          </Button>
        )}
      </Box>
  );
}
