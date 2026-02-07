import { createContext, useContext } from "react";
import type { FormDetailsContextType } from "../GlobalTypes/types.ts"

export const FormDetailsContext = createContext< FormDetailsContextType | undefined>(undefined);

export const useFormDetails = () => {
  const ctx = useContext(FormDetailsContext);
  if (!ctx) throw new Error("useFormDetails must be used within useFormDetailsProvider");
  return ctx;
};