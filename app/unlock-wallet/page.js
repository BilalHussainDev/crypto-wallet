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
import { Logo, PasswordField } from "@/components";
import { decrypt } from "@/utils/encrypt";
import { getAccountFromMnemonic } from "@/utils/mnemonic";

const formSchema = object({
	password: string().required("Required"),
});

const UnlockAccount = () => {
	const router = useRouter();

	const handlePasswordSubmit = (data, { resetForm, setErrors }) => {
		// get encryptedKey from the localStorage
		const encryptedKey = JSON.parse(localStorage.getItem("encryptedKey"));
		// decrypt the encrypted key
		const decrypted = decrypt(encryptedKey, data.password);
		if (!decrypted.ok) {
			setErrors({ password: "Something wents wrong. Try again." });
			return;
		} else {
			const res = getAccountFromMnemonic(decrypted.key);
			router.push(`/dashboard?address=${res.address}`);
			resetForm();
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
				<FormControl fullWidth sx={{ height: "80px" }}>
					<PasswordField
						name="password"
						placeholder="Enter your password"
						value={values.password}
						onChange={handleChange}
						onBlur={handleBlur}
						disabled={isSubmitting}
						error={
							errors.password && touched.password ? true : false
						}
					/>
					<FormHelperText sx={{ color: "red" }}>
						{errors.password && touched.password
							? errors.password
							: ""}
					</FormHelperText>
				</FormControl>

				<Typography
					variant="body2"
					color="primary"
					textAlign="right"
					mb="2rem"
				>
					<Link href="/restore-wallet">Forgot Password?</Link>
				</Typography>

				<Button
					fullWidth
					type="submit"
					variant="contained"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Unlocking..." : "Unlock"}
				</Button>
			</Box>
		</>
	);
};

export default UnlockAccount;
