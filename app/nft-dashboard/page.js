"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";

import { BackButton } from "@/components";
import { getNftImage } from "@/utils/nft";

function DashboardComponent() {
  const [imageURL, setImageURL] = useState('/img/fallbackImage.png');
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const contractAddress = searchParams.get("contractAddress");
  const tokenId = searchParams.get("tokenId");
  const symbol = searchParams.get("symbol");
  const nftName = searchParams.get("nftName");

  useEffect(() => {
    (async () => {
      const image = await getNftImage(contractAddress, tokenId);
      setImageURL(image);
    })();
  }, [contractAddress, tokenId]);

  if (!address) {
    return <p>No account selected.</p>;
  }

  return (
    <>
      <Box component="section">
        <Box sx={{ margin: "1rem 0", textAlign: "left" }}>
          <BackButton />
        </Box>

        <Typography sx={{ fontSize: "18px", fontWeight: "600", mb: '1rem' }}>
          {nftName}
        </Typography>

        <Box>
          <Image
            src={imageURL}
            alt="ETH"
            width={280}
            height={224}
            priority
            cover
          />
        </Box>

        <Typography
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "center",
            fontSize: "14px",
            m: '1rem 0'
          }}
        >
          Contract Address: {contractAddress}
        </Typography>

        <Button
          sx={{ width: "100%", padding: "0", height: "2rem" }}
          variant="contained"
        >
          <Link
            href={`/send-nft?address=${address}&contractAddress=${contractAddress}&symbol=${symbol}`}
            style={{ width: "100%" }}
          >
            Send
          </Link>
        </Button>
      </Box>
    </>
  );
}

export default function NftDashboardPage() {
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
