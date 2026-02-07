import { useState, type JSX } from 'react';
import { useFormBuilder } from '../Global/FormBuilderContext.tsx';
import type { InputPreviewProps } from '../GlobalTypes/types.ts'
import { TextInputComponent } from '../GlobalTypes/formType.ts';
import type { InputDataType } from '../GlobalTypes/formType.ts';

function TextInputPreview({ inputId , currentIndex , isSubmitted }: InputPreviewProps) {
    const { getSpecificField , setSubmittedFormComponent , removeElement } = useFormBuilder();
    
    const { 
        label: inputLabelText, 
        placeholder: inputPlaceholder, 
        inputDataType: inputDataType, 
        validationRegex: regexPattern, 
        comment: fieldComment ,
        isMandatory : currentIsMandatory
    } = getSpecificField(inputId) as TextInputComponent;

    const [inputlabel, setInputLabel] = useState<string>(inputLabelText || "");
    const [placeholder, setPlaceHolder] = useState<string>(inputPlaceholder || "");
    const [inputType, setInputType] = useState<InputDataType>(inputDataType);
    const [validation, setValidation] = useState<string>(regexPattern || "");
    const [comment, setComment] = useState<string>(fieldComment || "");
    const [isMandatory, setIsMandatory] = useState<boolean>(currentIsMandatory || false);

    const addComponentList = (inputId : string) => {
        setSubmittedFormComponent( inputId , new TextInputComponent(
            inputId ,
            inputlabel,
            inputType,
            isMandatory,
            placeholder,
            validation,
            comment
        ));
    };

    let ReturnHTML: JSX.Element = <></>;

    if (isSubmitted === false) {
        ReturnHTML = (
            <div className="p-4 border rounded bg-white shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg">Edit Input Field</h3>

                    <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isMandatory}
                            onChange={(e) => setIsMandatory(e.target.checked)}
                            className="accent-blue-500"
                        />
                        Mandatory
                    </label>
                </div>

                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Label Name:</label>
                        <input
                            type="text"
                            value={inputlabel}
                            onChange={(e) => setInputLabel(e.target.value)}
                            className="block w-full p-2 border rounded text-gray-700"
                            placeholder="e.g. Full Name"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Input Type:</label>
                        <select 
                            value={inputType}
                            onChange={(e) => setInputType(e.target.value as InputDataType)}
                            className="block w-full p-2 border rounded text-gray-700"
                        >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="password">Password</option>
                            <option value="date">Date</option>
                            <option value="file">FilePath</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold">Placeholder:</label>
                    <input
                        type="text"
                        value={placeholder}
                        onChange={(e) => setPlaceHolder(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="e.g. John Doe"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Validation (Regex/Rule):</label>
                        <input
                            type="text"
                            value={validation}
                            onChange={(e) => setValidation(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="e.g. required"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Comment/Help Text:</label>
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Small hint text"
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow"
                        onClick={() => { 
                            addComponentList(inputId) ;
                        }}>
                        Submit
                    </button>
                    <button 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md"
                        onClick={() => removeElement(currentIndex)}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
    else {

        ReturnHTML = (
            <div className="p-4 border rounded bg-gray-50 relative group">
                <label className="font-bold text-gray-800">
                    {inputlabel}
                    {isMandatory && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </label>
                
                <input
                    type={inputType} // Dynamically sets type (email, password, etc)
                    className="block w-full p-2 border rounded bg-white text-gray-700"
                    placeholder={placeholder}
                />
                
                {/* COMMENT DISPLAY */}
                {comment && (
                    <p className="mt-1 text-xs text-gray-500 italic">*{comment}</p>
                )}

                {/* VALIDATION DISPLAY (Visual hint) */}
                {validation && (
                    <div className="mt-1">
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            Rule: {validation}
                        </span>
                    </div>
                )}
            </div>
        );
    }

    return (ReturnHTML);
}

export default TextInputPreview;