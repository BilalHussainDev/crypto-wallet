"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBalance, getTransactionHistory } from "@/utils/account";
import SendTransaction from "@/components/SendTransaction";
import ReceiveTransaction from "@/components/RecieveTransaction";
import { getWeb3 } from "@/utils/web3";

const web3 = getWeb3();

const Account = () => {
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
      <SendTransaction from={address} />
      <ReceiveTransaction address={address} />
    </div>
  );
};

export default Account;
