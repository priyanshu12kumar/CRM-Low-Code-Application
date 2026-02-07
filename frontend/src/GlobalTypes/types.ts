import React from 'react';
import type { FormComponent , FormDetails } from './formType.ts';

interface FormData {
  name: string;
  age: number;
}

interface FormElementsProps {
  componentsArray: fieldType[];
  setComponentsArray: React.Dispatch<React.SetStateAction<fieldType[]>>;
}

type FormBuilderContextType = {
  getSelectedFieldList: () => [fieldType[] , React.Dispatch<React.SetStateAction<fieldType[]>>] ;
  getSubmittedFieldList: () => fieldType[] ;
  addElement: (element: fieldType) => void;
  removeElement: (index: number) => void;
  removeById: (id: string) => void;

  getSpecificField: (currElementId: string) => FormComponent
  setSubmittedFormComponent : (currElementId: string , formComponent : FormComponent) => void ;
  setSubmittedStatus: (currElement : string , submitstatus : boolean) => void;

  moveElement : (fromIndex: number, toIndex: number) => void ;
  moveById : (id: string, targetIndex: number) => void ;
  moveRelativeAmongSubmitted : (id: string, dir: "up" | "down") => void ;
};

type InputPreviewProps = {
  key : string ;
  currentIndex : number ;
  isSubmitted : boolean ;
  inputType : string ;
  inputId : string ;
}

type fieldType = {
  isSubmitted : boolean ;
  inputType : string ;
  inputId : string ;
  InputComponent :FormComponent;
}



type SystemState = "login" | "preview" | "form";

type SystemStateContextType = {
  state: SystemState;
  setState: React.Dispatch<React.SetStateAction<SystemState>>;
};

type FormDetailsContextType = {
  formDetails : FormDetails;
  setFormDetails : React.Dispatch<React.SetStateAction<FormDetails>>;
};

type JsonDataType = {
  formDetails : FormDetails ;
  formData : fieldType[] ;
};



export type {  FormData ,
               FormElementsProps,
               FormBuilderContextType,
               InputPreviewProps,
               fieldType,
               SystemState,
               SystemStateContextType,
               FormDetailsContextType,
               JsonDataType
            };
