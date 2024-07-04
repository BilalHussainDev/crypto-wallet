import { useState } from "react";
import { sendTransaction } from "@/utils/transaction";
import { useRouter } from "next/navigation";
import { verifyPassword } from "@/utils/auth";

const SendTransaction = ({ from }) => {
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { ok } = await verifyPassword(password);
    console.log(ok);
    if (!ok) {
      throw new Error("Incorrect Password.");
    }

    const success = await sendTransaction(from, to, value);
    if (success) {
      setTo("");
      setValue("");
      setPassword("");
      router.push(`/account?address=${from}`);
    } else {
      throw new Error("Transaction Failed. Try again later");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Send</h2>
      <div>
        <label>Recipient Address: </label>
        <input value={to} onChange={(e) => setTo(e.target.value)} required />
      </div>
      <div>
        <label>Amount (ETH): </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Send</button>
    </form>
  );
};

export default SendTransaction;
