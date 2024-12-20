"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Creating Context
const NftsContext = createContext();

// Context Provider Function
function NftsProvider({ children }) {
  const [nfts, setNfts] = useState({});

  useEffect(() => {
    const savedNfts = localStorage.getItem("nfts");
    if (savedNfts) {
      setNfts(JSON.parse(savedNfts));
    }
  }, []);

  return (
    <NftsContext.Provider value={{ nfts, setNfts }}>
      {children}
    </NftsContext.Provider>
  );
}

// custom hook to use authContext
function useNfts() {
  const context = useContext(NftsContext);
  if (context === undefined) {
    throw new Error(
      "NftsContext seems to be used outside of the NftsProvider."
    );
  }
  return context;
}

export { NftsProvider, useNfts };
