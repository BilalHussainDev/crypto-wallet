import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import { sendTransaction } from "@/utils/transaction";
import { decrypt } from "@/utils/encrypt";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { PasswordField, Logo } from ".";

// schema for reset password form or like that
const formSchema = object({
  to: string().required("Required"),
  amount: number().positive("Invalid Amount").required("Required"),
  password: string().required("Required"),
});

const SendTransaction = ({ from }) => {
  const [isTransfered, setIsTransfered] = useState(false);
  // const router = useRouter();

  const handleTransferSubmit = async (
    data,
    { resetForm, setErrors, setSubmitting }
  ) => {
    const encryptedKey = JSON.parse(localStorage.getItem("encryptedKey"));
    const { ok } = decrypt(encryptedKey, data.password);
    if (!ok) {
      setErrors({ password: "Incorrect Password." });
      setSubmitting(false)
      return;
    }

    const res = await sendTransaction(from, data.to, data.amount);
    console.log(res)
    if (res.ok) {
      // router.push(`/dashboard?address=${from}`);
      setIsTransfered(true);
      resetForm();
    } else {
      // console.log("setting error");
      setSubmitting(false);
      setErrors({ to: res.message });
    }
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
      to: "",
      amount: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: handleTransferSubmit,
  });

  return (
    <>
      {!isTransfered && (
        <>
          <Typography
            variant="body2"
            type="button"
            color="primary"
            textAlign="center"
            padding="0.5rem 0"
            sx={{ fontSize: "2.5rem", textAlign: "left" }}
          >
            <Link href={`/dashboard?address=${from}`}>⬅</Link>
          </Typography>
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

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please Wait" : "Transfer"}
            </Button>
          </Box>
        </>
      )}

      {isTransfered && (
        <>
          <Logo />

          <Typography sx={{ color: "green", mb: "2rem" }}>
            Transaction successful.
          </Typography>

          <Typography sx={{ color: "green", fontSize: "2rem", mb: "2rem" }}>
            ✅
          </Typography>

          <Button
            sx={{ width: "80%", height: "34px", padding: "0" }}
            variant="contained"
          >
            <Link href={`/dashboard?address=${from}`} style={{ width: "100%" }}>
              Back to Dashboard
            </Link>
          </Button>
        </>
      )}
    </>
  );
};

export default SendTransaction;
