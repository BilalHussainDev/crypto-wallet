'use client'
import { useFormik } from "formik";
import { object, string } from "yup";
import { Box, Button, FormControl, FormHelperText, OutlinedInput, Typography } from "@mui/material";
import { BackButton } from "@/components";

// schema for search reciever address
const formSchema = object({
  to: string().required("Address is required"),
});

export default function SendToPage(){
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

  function handleSearchAddress(){};

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
        Send To
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
            Search
          </Button>
        )}
      </Box>
    </>
  );
}