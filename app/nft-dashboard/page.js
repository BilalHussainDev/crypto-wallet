"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import copy from "clipboard-copy";

import { BackButton } from "@/components";
import { getNftImage } from "@/utils/nft";

function DashboardComponent() {
  const [imageURL, setImageURL] = useState("/img/nft.png");
  const [isCopied, setIsCopied] = useState(false);
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const contractAddress = searchParams.get("contractAddress");
  const tokenId = searchParams.get("tokenId");
  const symbol = searchParams.get("symbol");
  const nftName = searchParams.get("nftName");

  const handleCopyClick = async () => {
    try {
      await copy(contractAddress);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 10000);
    } catch (error) {
      console.error("Failed to copy text to clipboard", error);
    }
  };

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

        <Typography sx={{ fontSize: "18px", fontWeight: "600", mb: "1rem" }}>
          {`${nftName} (#${tokenId})`}
        </Typography>

        <Box>
          <Image
            src={imageURL}
            alt="token-logo"
            width={280}
            height={224}
            priority
          />
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            mt: "1rem",
          }}
        >
          Contract Address
        </Typography>
        <Tooltip
          title={isCopied ? "Copied ✔" : "Click to Copy"}
          placement="top-start"
          arrow
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: "#0e64b9",
              cursor: "pointer",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            onClick={handleCopyClick}
          >
            {contractAddress}
          </Typography>
        </Tooltip>

        <Button
          sx={{ width: "100%", padding: "0", height: "2rem", mt: "1.5rem" }}
          variant="contained"
        >
          <Link
            href={`/send-nft?address=${address}&contractAddress=${contractAddress}&tokenId=${tokenId}&symbol=${symbol}`}
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
