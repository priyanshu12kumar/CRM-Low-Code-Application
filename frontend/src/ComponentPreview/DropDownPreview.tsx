import { useState } from 'react';
import { useFormBuilder } from '../Global/FormBuilderContext.tsx';
import type { InputPreviewProps } from '../GlobalTypes/types.ts';
import {DropdownComponent} from '../GlobalTypes/formType.ts';

function DropDownPreview({ currentIndex , isSubmitted , inputId }: InputPreviewProps) {
    const { getSpecificField , setSubmittedFormComponent , removeElement } = useFormBuilder();

    const { 
        label: currentLabel, 
        placeholder: currentPlaceHolder,
        options: currentOptions, 
        comment: fieldComment ,
        isMandatory: currentIsMandatory
    } = getSpecificField(inputId) as DropdownComponent;


    const [groupLabel, setGroupLabel] = useState<string>(currentLabel || "e.g., Select your Location");
    const [options, setOptions] = useState<string[]>(currentOptions || []);
    const [comment, setComment] = useState<string>(currentPlaceHolder || "");
    const [dropDownPlaceholder , setdropDownPlaceholder] = useState<string>(fieldComment || "");
    const [isMandatory, setIsMandatory] = useState<boolean>(currentIsMandatory || false);

    // Add a new empty option to the list
    const addOption = () => {
        setOptions([...options, `New Option ${options.length + 1}`]);
    };

    // Update the text of a specific option
    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Remove an option from the list
    const removeOption = (index: number) => {
        if (options.length > 1) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const addComponentList = (inputId : string) => {
        setSubmittedFormComponent( inputId , new DropdownComponent(
            inputId,
            groupLabel,
            options,
            isMandatory,
            dropDownPlaceholder,
            comment
        ));
    };


    if (!isSubmitted) {
        return (
            <div className="p-4 border rounded bg-white shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg text-blue-600">
                        Edit Dropdown Menu
                    </h3>

                    <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isMandatory}
                            onChange={(e) => setIsMandatory(e.target.checked)}
                            className="accent-blue-600"
                        />
                        Mandatory
                    </label>
                </div>

                
                {/* Main Label */}
                <div>
                    <label className="block mb-1 text-sm font-semibold">Field Label:</label>
                    <input
                        type="text"
                        value={groupLabel}
                        onChange={(e) => setGroupLabel(e.target.value)}
                        className="block w-full p-2 border rounded text-gray-700"
                        placeholder="e.g., Select from following Countries"
                    />
                </div>

                {/* Dynamic Options List */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold">Dropdown Options:</label>
                    {options.map((opt, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(index, e.target.value)}
                                className="flex-1 p-2 border rounded text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                placeholder={`Option ${index + 1}`}
                            />
                            <button 
                                onClick={() => removeOption(index)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete Option"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addOption}
                        className="mt-1 text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
                    >
                        <span>+</span> Add Menu Item
                    </button>

                </div>

                {/* Comment Box */}
                <div>
                    <label className="block mb-1 text-sm font-semibold">Comment / Help Text:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Instructions for the user..."
                        rows={2}
                    />
                </div>

                {/* Placeholder Label */}
                <div>
                    <label className="block mb-1 text-sm font-semibold">Placeholder Label</label>
                    <input
                        type="text"
                        onChange={(e) => setdropDownPlaceholder(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="e.g., Choose your Country"
                    />
                </div>

                <div className="flex gap-2 pt-2 border-t">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors"
                        onClick={() => addComponentList(inputId)}>
                        Save Dropdown
                    </button>
                    <button 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-md transition-colors"
                        onClick={() => removeElement(currentIndex)}>
                        Remove Component
                    </button>
                </div>
            </div>
        );
    }
    else{

        // PREVIEW MODE
        return (
            <div className="p-4 border rounded bg-gray-50 relative group border-blue-100">
                <label className="block mb-2 font-bold text-gray-800">
                    {groupLabel}
                    {isMandatory && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </label>

                
                <select className="w-full p-2 border rounded bg-white text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer">
                    <option value="" disabled selected>{dropDownPlaceholder}</option>
                    {options.map((opt, index) => (
                        <option key={index} value={opt.toLowerCase().replace(/\s+/g, '-')}>
                            {opt}
                        </option>
                    ))}
                </select>

                {comment && (
                    <p className="mt-2 text-xs text-gray-500 italic bg-white p-2 rounded border-l-2 border-blue-400">
                        {comment}
                    </p>
                )}
            </div>
        );
    }
}

export default DropDownPreview;