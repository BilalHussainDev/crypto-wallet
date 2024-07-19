import { Box, CircularProgress, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getTokenAddressList,
  getTokenBalance,
  getTokenDetails,
} from "@/utils/token";

export default function AssetsTab({ address }) {
  const [tokenList, setTokenList] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokenAddressList = getTokenAddressList(address);
        const tokens = await Promise.all(
          tokenAddressList.map(async (tokenAddress) => {
            const res = await getTokenDetails(tokenAddress);
            if (!res.ok) {
              throw new Error(res.message);
            }
            const tokenDetails = res.data;
            const tokenAmount = await getTokenBalance(address, tokenAddress);
            tokenDetails.balance = tokenAmount;
            tokenDetails.address = tokenAddress;
            return tokenDetails;
          })
        );
        setTokenList(tokens);
      } catch (error) {
        setTokenList([]);
        throw new Error(
          "Error fetching token details. Might be due to Network Issue. Check your internet and try again."
        );
      }
    };

    fetchTokens();
  }, [address]);

  return (
    <>
      <Typography
        sx={{ fontWeight: "bold" }}
        variant="body1"
        color="primary"
        textAlign="right"
        mt="0.5rem"
        mb="1rem"
      >
        <Link href={`/import-token?address=${address}`}>Import Tokens</Link>
      </Typography>

      {!tokenList ? (
        <CircularProgress />
      ) : (
        tokenList.map((tokenDetails, i) => (
          <Box key={i + 1}>
            <Link
              href={`/token-dashboard?address=${address}&tokenAddress=${tokenDetails.address}&symbol=${tokenDetails.symbol}`}
            >
              <SingleToken tokenDetails={tokenDetails} />
            </Link>
          </Box>
        ))
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
        backgroundColor: "#e5feff",
        borderRadius: "10px",
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
          <Typography color="primary" sx={{ fontSize: "12px" }}>
            {(+tokenDetails.balance).toFixed(4)} {tokenDetails.symbol}
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
