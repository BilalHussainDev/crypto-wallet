'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getTransactionHistory } from "@/utils/transaction";

export default function ActivityTab({ address, activityOf }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      const allTransactions = await getTransactionHistory(address);
      if (activityOf) {
        const specificTransactions = allTransactions.filter(
          (tx) => tx.symbol === activityOf
        );
        setTransactions(specificTransactions)
      } else {
        setTransactions(allTransactions);
      }
    };
    fetchAccountDetails();
  }, [address, activityOf]);

  return (
    <Box>
      {transactions.length <= 0 ? (
        <Typography mb="1rem" sx={{ color: "#8d9dab" }}>
          No Transactions Yet
        </Typography>
      ) : (
        <Box component="ul">
          {transactions.map((tx, index) => (
            <Link
              href={`https://www.oklink.com/amoy/tx/${tx.transactionHash}`}
              target="_blank"
              key={index}
            >
              <Box
                sx={{
                  borderBottom: "1px solid #1976d2",
                  padding: "0.5rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "#bbeaff",
                  },
                }}
                component="li"
              >
                <Typography textAlign="left">{tx.transactionDate}</Typography>
                <Typography sx={{ color: "#1976d2" }}>
                  {tx.amount} {tx.symbol}
                </Typography>
                <Typography textAlign="right">Send</Typography>
              </Box>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}
