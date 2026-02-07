// FormBuilderContext.tsx
import { createContext, useContext } from "react";
import type { FormBuilderContextType } from "../GlobalTypes/types.ts";


export const FormBuilderContext =
  createContext<FormBuilderContextType | null>(null);

export const useFormBuilder = () => {
  const ctx = useContext(FormBuilderContext);
  if (!ctx) {
    throw new Error("useFormBuilder must be used inside FormBuilderProvider");
  }
  return ctx;
};