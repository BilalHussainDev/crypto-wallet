"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SendTransaction from "@/components/SendTransaction";
import ReceiveTransaction from "@/components/RecieveTransaction";
import { getBalance, getTransactionHistory } from "@/utils/account";
import { getWeb3 } from "@/utils/web3";
import { Button } from "@mui/material";
import Link from "next/link";

const web3 = getWeb3();

function DashboardComponent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const [balance, setBalance] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (address) {
        const accountBalance = await getBalance(address);
        setBalance(accountBalance);
        const accountTransactions = await getTransactionHistory(address);
        setTransactions(accountTransactions);
      }
    };
    fetchAccountDetails();
  }, [address]);

  if (!address) {
    return <p>No account selected.</p>;
  }

  return (
    <div>
      <h1>Account Details</h1>
      <div>
        <h2>Address</h2>
        <p>{address}</p>
        <h2>Balance</h2>
        <p>{(+balance || 0).toFixed(2)} ETH</p>
      </div>

      <div>
        <Button
          sx={{ width: "40%", margin: "8px", height: "34px", padding: "0" }}
          variant="outlined"
        >
          <Link
            href={`/send-funds?address=${address}`}
            style={{ width: "100%" }}
          >
            Send
          </Link>
        </Button>
        <Button
          sx={{ width: "40%", margin: "8px", height: "34px", padding: "0" }}
          variant="outlined"
        >
          <Link
            href={`/recieve-funds?address=${address}`}
            style={{ width: "100%" }}
          >
            Recieve
          </Link>
        </Button>
      </div>

      <div>
        <h2>Transaction History</h2>
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              <p>
                {address === tx.from ? "SENT: " : "RECIEVED: "}
                {web3.utils.fromWei(tx.value, "ether")} ETH
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardComponent />
    </Suspense>
  );
}
