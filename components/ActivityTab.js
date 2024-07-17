import { getTransactionHistory } from "@/utils/transaction";
import {Box, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ActivityTab(){
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (address) {
        const accountTransactions = await getTransactionHistory(address);
        setTransactions(accountTransactions);
      }
    };
    fetchAccountDetails();
  }, [address]);

  return (
    <Box>
      {transactions.length <= 0 ? (
        <Typography mb="1rem" sx={{ color: "#8d9dab" }}>
          No Transactions Yet
        </Typography>
      ) : (
        <Box component="ul">
          {transactions.map((tx, index) => (
            <Box
              sx={{
                borderBottom: "1px solid #1976d2",
                padding: "0.5rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
              }}
              component="li"
              key={index}
            >
              <Typography textAlign="left">{tx.transactionDate}</Typography>
              <Typography sx={{ color: "#1976d2" }}>{tx.value} ETH</Typography>
              <Typography textAlign="right">
                {address === tx.from ? "Sent" : "Recieved "}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}