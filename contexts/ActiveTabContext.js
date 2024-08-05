"use client";
import { createContext, useContext, useState } from "react";

// Creating Context
const ActiveTabContext = createContext();

// Context Provider Function
function ActiveTabProvider({ children }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
}

// custom hook to use ActiveTabContext
function useActiveTab() {
  const context = useContext(ActiveTabContext);
  if (context === undefined) {
    throw new Error(
      "ActiveTabContext seems to be used outside of the ActiveTabProvider."
    );
  }
  return context;
}

export { ActiveTabProvider, useActiveTab };
