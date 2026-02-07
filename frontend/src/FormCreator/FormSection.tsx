import CheckBoxPreview from '../ComponentPreview/CheckBoxPreview.tsx';
import DropDownPreview from '../ComponentPreview/DropDownPreview.tsx';
import RadioButtonPreview from '../ComponentPreview/RadioButtonPreview.tsx';
import TextAreaPreview from '../ComponentPreview/TextAreaPreview.tsx';
import TextInputPreview from '../ComponentPreview/TextInputPreview.tsx';
import { useFormDetails } from '../Global/FormDetailsContext.tsx' ;
import { useFormBuilder } from '../Global/FormBuilderContext.tsx' ;
import type { fieldType, FormBuilderContextType , FormDetailsContextType } from '../GlobalTypes/types.ts';
import { Link } from "react-router-dom";
import { useAppDispatch } from "../state/PageName.ts" ;


function FormSection() {
  const { getSelectedFieldList } = useFormBuilder() as FormBuilderContextType;
  const { formDetails} = useFormDetails() as FormDetailsContextType;
  const AllComponentsArray: fieldType[] = getSelectedFieldList()[0] ;
  const componentsArray : fieldType[] = AllComponentsArray.filter((element) => element.isSubmitted === true) ;
  const dispatch = useAppDispatch() ;

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold text-gray-800">
          {formDetails.FormName}
        </h2>

        <Link
          to="/form"
          className="
            inline-flex items-center justify-center
            rounded-md bg-emerald-600 px-4 py-2 text-white font-medium
            hover:bg-emerald-700 active:scale-[0.98] transition-all
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
          "
          onClick={() => dispatch({type: "SET_PAGE", page: "Filling the created Form"})}
        >
          Start filling the form
        </Link>
      </div>

      <>
        <div className="space-y-4">
          {componentsArray.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No components selected yet.</p>
            </div>
          ) : (
            componentsArray.map((component: fieldType, index: number) => {
              const currentComponent = { ...component, currentIndex: index };
              let previewSectionReturn: React.JSX.Element | null = null;

              switch (component.inputType) {
                case "Text Input":
                  previewSectionReturn = (
                    <TextInputPreview key={`input-${component.inputId}`} {...currentComponent} />
                  );
                  break;

                case "Text Area":
                  previewSectionReturn = (
                    <TextAreaPreview key={`textarea-${component.inputId}`} {...currentComponent} />
                  );
                  break;

                case "Drop Down":
                  previewSectionReturn = (
                    <DropDownPreview key={`dropdown-${component.inputId}`} {...currentComponent} />
                  );
                  break;

                case "Check Box":
                  previewSectionReturn = (
                    <CheckBoxPreview key={`checkbox-${component.inputId}`} {...currentComponent} />
                  );
                  break;

                case "Radio Button":
                  previewSectionReturn = (
                    <RadioButtonPreview key={`radio-${component.inputId}`} {...currentComponent} />
                  );
                  break;

                default:
                  return null; // unknown input type
              }

              return (
                <div key={component.inputId} className="mt-4 relative">
                  {previewSectionReturn}
                </div>
              );
            })
          )}
        </div>
      </>

    </>
  );
}

export default FormSection;