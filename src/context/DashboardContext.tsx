// src/context/DashboardContext.tsx
import { createContext, useContext } from "react";

type DashboardContextType = {
  user: object | any;
};

export const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside DashboardContext.Provider");
  }
  return ctx;
};