// src/state/AppStore.tsx
import { useReducer, ReactNode } from "react";
import {Action, State , StateContext , DispatchContext} from './PageName.ts' ;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.page };
    default:
      return state;
  }
}

const initialState: State = { page: "Creating the form format" };

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

