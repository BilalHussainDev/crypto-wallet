import { useState } from "react";
import { sendTransaction } from "@/utils/transaction";

const SendTransaction = ({ from }) => {
  const [to, setTo] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendTransaction(from, to, value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Send</h2>
      <div>
        <label>Recipient Address</label>
        <input value={to} onChange={(e) => setTo(e.target.value)} required />
      </div>
      <div>
        <label>Amount (ETH)</label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>
      <button type="submit">Send</button>
    </form>
  );
};

export default SendTransaction;
