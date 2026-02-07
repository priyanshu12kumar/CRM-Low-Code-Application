import { useState } from 'react';
import { useFormBuilder } from '../Global/FormBuilderContext.tsx';
import type { InputPreviewProps } from '../GlobalTypes/types.ts';
import { TextAreaComponent } from '../GlobalTypes/formType.ts';

function TextAreaPreview({ currentIndex , isSubmitted , inputId }: InputPreviewProps) {
    const { getSpecificField , setSubmittedFormComponent , removeElement } = useFormBuilder();
    
    const { 
        label: currentLabel, 
        fieldName : currentName,
        placeholder: currentPlaceholder, 
        validationRegex : currentValidationRegex, 
        comment: currentComment,
        rows: currentRows,
        isMandatory : currentIsMandatory
    } = getSpecificField(inputId) as TextAreaComponent;


    const [label, setLabel] = useState<string>(currentLabel || "Description");
    const [name, setName] = useState<string>(currentName || "description_field");
    const [placeholder, setPlaceholder] = useState<string>(currentPlaceholder || "Enter detailed information here...");
    const [regex, setRegex] = useState<string>(currentValidationRegex || "");
    const [comment, setComment] = useState<string>(currentComment || "");
    const [rows, setRows] = useState<number>(currentRows || 4);
    const [isMandatory, setIsMandatory] = useState<boolean>(currentIsMandatory || false);

    const addComponentList = (inputId : string) => {
        setSubmittedFormComponent( inputId , new TextAreaComponent(
                inputId,
                label,
                name,
                rows,
                isMandatory,
                placeholder,
                regex,
                comment,
            ));
    };


    if (!isSubmitted) {
        return (
            <div className="p-4 border rounded bg-white shadow-sm space-y-4 border-l-4 border-orange-500">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg text-orange-600">
                        Edit Text Area
                    </h3>

                    <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isMandatory}
                            onChange={(e) => setIsMandatory(e.target.checked)}
                            className="accent-orange-500"
                        />
                        Mandatory
                    </label>
                </div>



                <div className="grid grid-cols-2 gap-4">
                    {/* Label Selection */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Display Label:</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="block w-full p-2 border rounded text-sm"
                            placeholder="e.g. Comments"
                        />
                    </div>
                    {/* Name Selection */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Field Name (ID):</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full p-2 border rounded text-sm font-mono bg-gray-50"
                            placeholder="e.g. user_comments"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Placeholder Selection */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Placeholder Text:</label>
                        <input
                            type="text"
                            value={placeholder}
                            onChange={(e) => setPlaceholder(e.target.value)}
                            className="block w-full p-2 border rounded text-sm"
                        />
                    </div>
                    {/* Height Selection */}
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Height (Rows):</label>
                        <input
                            type="number"
                            value={rows}
                            onChange={(e) => setRows(parseInt(e.target.value) || 2)}
                            className="block w-full p-2 border rounded text-sm"
                            min="2"
                            max="10"
                        />
                    </div>
                </div>

                {/* Regex Validation Field */}
                <div>
                    <label className="block mb-1 text-sm font-semibold">Validation (Regex Pattern):</label>
                    <input
                        type="text"
                        value={regex}
                        onChange={(e) => setRegex(e.target.value)}
                        className="block w-full p-2 border rounded text-sm font-mono text-blue-600"
                        placeholder="e.g. ^[a-zA-Z0-9 ]+$"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Leave blank for no validation.</p>
                </div>

                {/* Comment Box */}
                <div>
                    <label className="block mb-1 text-sm font-semibold">Comment / Instructions:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Help text for the user..."
                        rows={2}
                    />
                </div>

                <div className="flex gap-2 pt-2 border-t">
                    <button
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors"
                        onClick={() => {
                            addComponentList(inputId) ;
                            }
                        }>
                        Save Text Area
                    </button>
                    <button 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-md transition-colors"
                        onClick={() => removeElement(currentIndex)}>
                        Remove
                    </button>
                </div>
            </div>
        );
    }
    else{
        // PREVIEW MODE

        return (
            <div className="p-4 border rounded bg-gray-50 relative border-orange-100">
                <div className="flex justify-between items-start mb-2">
                    
                    <label className="font-bold text-gray-800">
                        {label}
                        {isMandatory && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>


                    <span className="text-[10px] text-gray-400 font-mono">name: {name}</span>
                </div>
                
                <textarea
                    className="w-full p-2 border rounded bg-white text-gray-700 focus:ring-2 focus:ring-orange-300 outline-none"
                    placeholder={placeholder}
                    rows={rows}
                />

                <div className="mt-2 space-y-1">
                    {comment && (
                        <p className="text-xs text-gray-500 italic">
                            ℹ️ {comment}
                        </p>
                    )}
                    
                    {regex && (
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                                Regex: <code className="text-orange-900">{regex}</code>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default TextAreaPreview;