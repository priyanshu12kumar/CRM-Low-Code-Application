import CheckBoxPreview from '../ComponentPreview/CheckBoxPreview.tsx';
import DropDownPreview from '../ComponentPreview/DropDownPreview.tsx';
import RadioButtonPreview from '../ComponentPreview/RadioButtonPreview.tsx';
import TextAreaPreview from '../ComponentPreview/TextAreaPreview.tsx';
import TextInputPreview from '../ComponentPreview/TextInputPreview.tsx';
import { useFormDetails } from '../Global/FormDetailsContext.tsx' ;
import { useFormBuilder } from '../Global/FormBuilderContext.tsx' ;
import type { fieldType, FormBuilderContextType , FormDetailsContextType } from '../GlobalTypes/types.ts';
import { useSystemState } from '../Global/SystemStateContext.tsx';


function PreviewSection() {
  const { getSelectedFieldList, setSubmittedStatus, removeElement, moveElement } = useFormBuilder() as FormBuilderContextType;
  const { formDetails, setFormDetails } = useFormDetails() as FormDetailsContextType;
  const componentsArray: fieldType[] = getSelectedFieldList()[0] ;
  const { state } = useSystemState();

  const handleMoveUp = (index: number) => {
    moveElement(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    moveElement(index, index + 1);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        <input
          value={formDetails.FormName}
          onChange={(e) => setFormDetails({ ...formDetails, FormName: e.target.value })}
          className="border-b border-gray-400 p-1 outline-none"
        />
      </h2>

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

                  {/* Up/Down floating controls - bottom-right */}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      aria-label="Move component up"
                      className={`p-1 rounded border shadow-sm bg-white hover:bg-gray-50 active:scale-95 disabled:opacity-40`}
                      title="Move up"
                    >
                      {/* Up Chevron (inline SVG) */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                           fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd"
                          d="M14.707 12.293a1 1 0 01-1.414 1.414L10 10.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4z"
                          clipRule="evenodd" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === componentsArray.length - 1}
                      aria-label="Move component down"
                      className={`p-1 rounded border shadow-sm bg-white hover:bg-gray-50 active:scale-95 disabled:opacity-40`}
                      title="Move down"
                    >
                      {/* Down Chevron (inline SVG) */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                           fill="currentColor" className="w-4 h-4 rotate-180">
                        <path fillRule="evenodd"
                          d="M14.707 12.293a1 1 0 01-1.414 1.414L10 10.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4z"
                          clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {/* Existing Edit/Delete buttons (kept as-is) */}
                  {component.isSubmitted && (
                    <div className={`mt-4 flex gap-2 ${state === "preview" ? "" : "targetRemove"}`}>
                      <button
                        className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded shadow"
                        onClick={() => setSubmittedStatus(component.inputId, false)}
                      >
                        Edit
                      </button>

                      <button
                        className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow"
                        onClick={() => removeElement(index)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </>
    </>
  );
}

export default PreviewSection;