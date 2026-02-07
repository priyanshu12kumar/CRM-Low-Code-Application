import { createContext, useContext, Dispatch } from "react";


export type PageNames = "Creating the form format" | "Filling the created Form";

export type State = {
  page: PageNames;
};

export type Action = {
  type: "SET_PAGE";
  page: PageNames ;
};

export const StateContext = createContext<State | undefined>(undefined);
export const DispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

const useAppState = () => {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStoreProvider");
  return ctx;
};

const useAppDispatch = () => {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useAppDispatch must be used within AppStoreProvider");
  return ctx;
};

export {useAppState , useAppDispatch} ;