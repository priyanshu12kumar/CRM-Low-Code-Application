// src/App.tsx
import { useEffect, useState , useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import FormCreator from "./FormCreator/FormCreator";
import FormRender from "./FormView/FormView";
import {useAppState, useAppDispatch} from "./state/PageName.ts";
import type { PageNames } from "./state/PageName.ts";
import type { SystemState ,  } from './GlobalTypes/types.ts' ;
import { FormBuilderContext } from './Global/FormBuilderContext.tsx';
import { SystemStateContext } from './Global/SystemStateContext.tsx' ;
import { FormDetailsContext } from './Global/FormDetailsContext.tsx' ;
import type { FormBuilderContextType , fieldType} from './GlobalTypes/types.ts' ;
import FormComponentsArrayUtility from './Utility/ArrayUtility.ts' ;
import { FormDetails } from './GlobalTypes/formType.ts' ;


const pathToPage = (pathname: string): PageNames =>
  pathname === "/form" ? "Filling the created Form" : "Creating the form format";


function App() {
  const { page } = useAppState();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [selectedElementsList, setSelectedElementsList] = useState<fieldType[]>([]);
  const [windowMode, setWindowMode] = useState<SystemState>("preview");
  const [formDetails, setFormDetails] = useState<FormDetails>({ FormName: "Form Preview" });


  // When URL changes (e.g., back/forward), update store.page
  useEffect(() => {
    const fromURL = pathToPage(location.pathname);
    if (fromURL !== page) {
      dispatch({ type: "SET_PAGE", page: fromURL });
    }
  }, [location.pathname, page, dispatch]);


    // ---------- Context API (FormBuilder) ----------
  const contextValue = useMemo<FormBuilderContextType>(() => FormComponentsArrayUtility(setSelectedElementsList , selectedElementsList) , [selectedElementsList]);

  return (
        <SystemStateContext.Provider value = {{state : windowMode , setState : setWindowMode}}>
          <FormBuilderContext.Provider value={contextValue}>
            <FormDetailsContext.Provider value= {{formDetails : formDetails , setFormDetails : setFormDetails }}>
              <Routes>
                <Route path="/" element={<FormCreator />} />
                <Route path="/form" element={<FormRender />} />
              </Routes>
            </FormDetailsContext.Provider>
          </FormBuilderContext.Provider>
        </SystemStateContext.Provider>
  );
}

export default App;