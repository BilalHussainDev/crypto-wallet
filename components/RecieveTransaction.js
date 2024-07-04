import QRCode from "qrcode.react";

const ReceiveTransaction = ({ address }) => (
  <div>
    <h2>Recieve</h2>
    <p>Scan this QR code to receive funds:</p>
    <QRCode value={address} />
    <p>Address: {address}</p>
  </div>
);

export default ReceiveTransaction;
