import { Box, CircularProgress, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAccountNftList, getNftDetails } from "@/utils/nft";

export default function NFTsTab({ address }) {
  const [nftList, setNftList] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const accountNftList = getAccountNftList(address);
        const nfts = await Promise.all(
          accountNftList.map(async (nftObj) => {
            const res = await getNftDetails(
              address,
              nftObj.contractAddress,
              nftObj.tokenId
            );
            if (!res.ok) {
              throw new Error(res.message);
            }
            const nftDetails = res.data;
            nftDetails.contractAddress = nftObj.contractAddress;
            nftDetails.tokenId = nftObj.tokenId;
            return nftDetails;
          })
        )
        setNftList(nfts);

      } catch (error) {
        setNftList([]);
        throw new Error(
          "Error fetching NFT details. Might be due to Network Issue. Check your internet and try again."
        );
      }
    };

    fetchTokens();
  }, [address]);

  return (
    <>
      {!nftList ? (
        <CircularProgress />
      ) : (
        <>
          {
            nftList.map((nftDetails, i) => (
              <Box key={i + 1}>
                <Link
                  href={`/nft-dashboard?address=${address}&contractAddress=${nftDetails.contractAddress}&symbol=${nftDetails.tokenId}`}
                >
                  <SingleToken tokenDetails={nftDetails} />
                </Link>
              </Box>
            ))}

          <Link href={`/import-nft?address=${address}`}>
            <Box
              sx={{
                mt: "1rem",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "4px",
                backgroundImage:
                  "linear-gradient(180deg, #f0fdff, #e4f1f7 50%)",
              }}
            >
              <Typography variant="h3" color="primary" textAlign="center">
                +
              </Typography>
              <Typography
                sx={{ color: "#06213c" }}
                variant="body1"
                textAlign="center"
                mb="1rem"
              >
                Import NFT
              </Typography>
            </Box>
          </Link>
        </>
      )}
    </>
  );
}

function SingleToken({ tokenDetails }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "4px",
        backgroundImage:
          "linear-gradient(180deg, #f0fdff, #e4f1f7 80%)",
        cursor: "pointer",
        mb: "8px",
        p: "10px 12px 12px 12px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: "34px",
            height: "34px",
            marginRight: "12px",
            borderRadius: "10px",
            boxShadow: "rgba(202, 206, 220, 0.3) 7px 7px 10px",
            backgroundColor: "rgb(255, 255, 255)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography fontWeight="bold" color="primary">
            {tokenDetails.symbol?.at(0)}
          </Typography>
        </Box>

        <Box sx={{ maxWidth: "12rem", overflow: "hidden" }}>
          <Typography
            compoents="h2"
            sx={{
              fontSize: "13px",
              color: "rgb(9,9,9)",
              lineHeight: "1.25",
              textAlign: "left",
            }}
          >
            {tokenDetails.name}
          </Typography>
          <Typography color="primary" sx={{ fontSize: "12px", textAlign: 'left' }}>
            {tokenDetails.symbol}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "29px",
          height: "28px",
          borderRadius: "10px",
          boxShadow: "rgba(202, 206, 220, 0.3) 7px 7px 10px",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ArrowForwardIosIcon fontSize="x-small" sx={{ ml: "2px" }} />
      </Box>
    </Box>
  );
}
