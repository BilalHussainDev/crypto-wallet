"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";

import { ActivityTab } from "@/components";

function DashboardComponent() {
	const searchParams = useSearchParams();
	const address = searchParams.get("address");
	const tokenAddress = searchParams.get("tokenAddress");
	const balance = +searchParams.get("balance");
	const symbol = searchParams.get("symbol");

	if (!address) {
		return <p>No account selected.</p>;
	}

	return (
		<Box component="section">
			<Typography
				sx={{
					whiteSpace: "nowrap",
					overflow: "hidden",
					textOverflow: "ellipsis",
					textAlign: "center",
					fontSize: "14px",
					pt: "16px",
				}}
			>
				{address}
			</Typography>

			<Box>
				<Image
					src="/img/bobbin.png"
					alt="ETH"
					width={100}
					height={100}
					priority
				/>
			</Box>

			<Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
				{balance.toFixed(4)} {symbol}
			</Typography>

			<Box
				sx={{
					margin: "1.5rem 0",
					display: "flex",
					justifyContent: "space-evenly",
				}}
			>
				<Button
					sx={{ width: "96px", padding: "0", height: "2rem" }}
					variant="outlined"
				>
					<Link
						href={`/send-tokens?address=${address}&tokenAddress=${tokenAddress}`}
						style={{ width: "100%" }}
					>
						Send
					</Link>
				</Button>
				<Button
					sx={{ width: "96px", padding: "0", height: "2rem" }}
					variant="outlined"
				>
					<Link
						href={`/receive-funds?address=${address}`}
						style={{ width: "100%" }}
					>
						Receive
					</Link>
				</Button>
				<Button
					sx={{ width: "96px", padding: "0", height: "2rem" }}
					variant="outlined"
				>
					<Link href={`/unlock-wallet`} style={{ width: "100%" }}>
						Logout
					</Link>
				</Button>
			</Box>

			<Typography
				color="primary"
				sx={{
					mb: "1.5rem",
					fontSize: "25px",
					fontWeight: "500",
					lineHeight: "0.78",
					textAlign: "center",
				}}
			>
				Activity
			</Typography>

			<ActivityTab address={address} />
		</Box>
	);
}

export default function TokenDashboardPage() {
	return (
		<Suspense
			fallback={
				<Box>
					<Typography>Loading.....</Typography>
				</Box>
			}
		>
			<DashboardComponent />
		</Suspense>
	);
}
