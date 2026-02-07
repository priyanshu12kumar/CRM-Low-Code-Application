// Objective: Create a low-code implementation to dynamically create forms in React and save/export/load using JSON
import {useState} from 'react'
import FormElements from './FormElements.tsx';
import PreviewSection from './PreviewSection.tsx';
import type { SystemStateContextType} from '../GlobalTypes/types.ts' ;
import FormSection from './FormSection.tsx' ;
import DownloadFormJsonButton from '../JSON/DownloadFormJsonButton.tsx'
import ImportJsonToRenderForm from '../JSON/UploadFormFromJson.tsx' ;
import {onImportCallback , onExportCallback} from '../Utility/JsonUtility.ts' ;
import {useSystemState} from '../Global/SystemStateContext.tsx'
import {useFormDetails} from '../Global/FormDetailsContext.tsx'
import {useFormBuilder} from '../Global/FormBuilderContext.tsx'


export function FormCreator() {
  const [ShowList, setShowList] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedElementsList, setSelectedElementsList] = useFormBuilder().getSelectedFieldList() ;
  const {formDetails, setFormDetails} = useFormDetails() ;
  const { setState: setWindowMode, state: windowMode } = useSystemState() as SystemStateContextType;

  return (
    <div className="flex bg-gray-100 relative">
      {/* Left panel */}
      <div
        className={`
          h-screen sticky top-0
          bg-white border-r border-gray-300 shadow-md
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "w-1/3 p-6" : "w-0 p-0 overflow-hidden"}
        `}
      >
        {isSidebarOpen && (
          <>
            {/* Header */}
            <h1 className="text-3xl font-bold text-blue-600 mb-6">
              Dynamic Form Builder
            </h1>

            {/* Description */}
            <p className="text-gray-700 mb-4">
              Choose your form elements:
            </p>

            {/* Toggle Form Elements Button */}
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow mb-6 transition-colors duration-200"
              onClick={() => setShowList(!ShowList)}
            >
              {ShowList ? "Hide Elements" : "Show Elements"}
            </button>

            {/* Form Elements Section */}
            {ShowList && (
            <div className="space-y-4">
              <FormElements />
            </div>)}
          </>
        )}
        <br></br>
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
          onClick={() =>
            setWindowMode(prev => (prev === "preview" ? "form" : "preview"))
          }
        >
          Toggle to {windowMode === "preview" ? "form" : "preview"} View
        </button>
        <br></br>
        <br></br>
        <div className="flex items-center gap-4">
          {/* Export Button */}
          <DownloadFormJsonButton 
            onExport= {() => onExportCallback(formDetails, selectedElementsList)}/>

          {/* Import Component */}
          <ImportJsonToRenderForm 
            onImport={(newJsonObject) => onImportCallback(newJsonObject , setFormDetails , setSelectedElementsList)}/>
        </div>

      </div>

      {/* Right panel */}
      <div className="flex-1 h-screen p-6 bg-gray-50 overflow-y-auto">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="
            fixed top-2 left-2 z-50
            text-gray-400 text-sm
            hover:text-gray-800
            opacity-90 hover:opacity-100
            transition-all duration-200
            select-none
          "
        >
          {isSidebarOpen ? "⬅️" : "➡️"}
        </button>
        
        {
        windowMode === 'preview' && (
            <PreviewSection />
        )}

        {
        windowMode === 'form' && (
          <>
            <FormSection />
          </>
        )}
      </div>
    </div>
  );

}

export default FormCreator ;
