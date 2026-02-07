import { createContext, useContext } from "react";
import type { SystemStateContextType } from "../GlobalTypes/types.ts";

export const SystemStateContext = createContext<SystemStateContextType | undefined>(undefined);

export const useSystemState = () => {
  const ctx = useContext(SystemStateContext);
  if (!ctx) throw new Error("useSystemState must be used within SystemStateProvider");
  return ctx;
};