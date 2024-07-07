"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { Logo } from "@/components";

const Home = () => {
	const [isNewUser, setIsNewUser] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const value = localStorage.getItem("encryptedKey");
			if (value === null) {
				setIsNewUser(true);
			} else {
				router.push("/unlock-account");
			}
		}
	}, []);

	return (
		<>
			<Logo />

			{isNewUser ? (
				<>
					<Typography sx={{ color: "#06213c", mb: "2rem" }}>
						Welcome to next generation crypto wallet exchange, the
						most complete dapp solution.
					</Typography>

					<Button
						sx={{ width: "80%", marginBottom: "1.5rem" }}
						color="primary"
						variant="contained"
					>
						<Link href="/create-wallet">Create New Wallet</Link>
					</Button>

					<Button
						sx={{ width: "80%" }}
						color="primary"
						variant="contained"
					>
						<Link href="/restore-account">Restore Wallet</Link>
					</Button>
				</>
			) : (
				<CircularProgress sx={{ mt: "4rem" }} />
			)}
		</>
	);
};

export default Home;
