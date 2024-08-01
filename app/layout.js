import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { NftsProvider } from "@/contexts/nftsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Crypto Wallet",
  description: "Safe and Simple way to access web3.",
};

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <body className={inter.className}>
        <div id="container">
          <header id="header">
            <Header />
          </header>
          <main id="main">
            <div style={{ padding: "0 16px" }}>
              <NftsProvider>
                {children}
              </NftsProvider>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
