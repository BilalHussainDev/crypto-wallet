"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { Logo, PasswordField } from "@/components";
import { generateMnemonic, getAccountFromMnemonic } from "@/utils/mnemonic";
import { encrypt } from "@/utils/encrypt";

// 1 uppercase, 1 lowercase, 1 numeric and 1 special character
const passwordRules = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).*$";

// schema for reset password form or like that
const formSchema = object({
	password: string()
		.matches(passwordRules, {
			message:
				"Must contain one uppercase, one lowercase, one number and one special character",
		})
		.required("Required"),
	confirmPassword: string()
		.oneOf([ref("password")], "Passwords must match")
		.required("Required"),
});

const CreateAccount = () => {
	const [mnemonic, setMnemonic] = useState("");

	const router = useRouter();

	const handlePasswordSubmit = async (data, { resetForm }) => {
		// generate mnemonic
		const generatedMnemonic = generateMnemonic();
		// remember mnemonic
		setMnemonic(generatedMnemonic);
		// encrypt mnemonic
		const encryptedMnemonic = encrypt(generatedMnemonic, data.password);
		// store encrypted mnemonic
		localStorage.setItem("encryptedKey", JSON.stringify(encryptedMnemonic));
		// clear the form
		resetForm();
	};

	const handleDone = () => {
		const newAccount = getAccountFromMnemonic(mnemonic);
		router.push(`/account/${newAccount.address}`);
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
			confirmPassword: "",
		},
		validationSchema: formSchema,
		onSubmit: handlePasswordSubmit,
	});

	return (
		<>
			<Logo />

			{!mnemonic ? (
				<>
					<Typography sx={{ color: "#06213c", mb: "2rem" }}>
						Choose a password for your wallet
					</Typography>

					<Box
						component="form"
						onSubmit={handleSubmit}
						autoComplete="off"
					>
						<FormControl fullWidth sx={{ minHeight: "80px" }}>
							<PasswordField
								name="password"
								placeholder="Enter new password"
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={isSubmitting}
								error={
									errors.password && touched.password
										? true
										: false
								}
							/>
							<FormHelperText sx={{ color: "red" }}>
								{errors.password && touched.password
									? errors.password
									: ""}
							</FormHelperText>
						</FormControl>

						<FormControl fullWidth sx={{ minHeight: "80px" }}>
							<PasswordField
								name="confirmPassword"
								placeholder="Confirm password"
								value={values.confirmPassword}
								onChange={handleChange}
								onBlur={handleBlur}
								disabled={isSubmitting}
								error={
									errors.confirmPassword &&
									touched.confirmPassword
										? true
										: false
								}
							/>
							<FormHelperText sx={{ color: "red" }}>
								{errors.confirmPassword &&
								touched.confirmPassword
									? errors.confirmPassword
									: ""}
							</FormHelperText>
						</FormControl>

						<Button
							fullWidth
							type="submit"
							variant="contained"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Please Wait" : "Continue"}
						</Button>
					</Box>
				</>
			) : (
				<>
					<Typography sx={{ color: "#06213c", mb: "2rem" }}>
						Write down the secret phrase and store in a secure
						location. It will help to backup and restore your
						wallet. Never Disclose it to anyone.
					</Typography>

					<Typography
						sx={{
							fontWeight: "bold",
							color: "#0e64b9",
							mb: "2rem",
						}}
					>
						{mnemonic}
					</Typography>

					<Button fullWidth variant="contained" onClick={handleDone}>
						Continue
					</Button>
				</>
			)}
			<Typography
				variant="body2"
				color="primary"
				textAlign="center"
				mt="1rem"
			>
				<Link href="/">Cancel</Link>
			</Typography>
		</>
	);
};

export default CreateAccount;
