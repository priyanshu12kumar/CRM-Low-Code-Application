import { useFormBuilder } from '../Global/FormBuilderContext.tsx';
import type { InputPreviewProps } from '../GlobalTypes/types.ts';
import { useState } from 'react';
import { CheckboxComponent } from '../GlobalTypes/formType.ts';

function CheckBoxPreview({ currentIndex , isSubmitted , inputId }: InputPreviewProps) {
    const { getSpecificField , setSubmittedFormComponent , removeElement } = useFormBuilder();

    const { 
        label : currentGroupLabel ,
        options : currentOptions ,
        comment : currentComment ,
        isMandatory : currentIsMandatory
    } = getSpecificField(inputId) as CheckboxComponent;

    const [groupLabel, setGroupLabel] = useState<string>(currentGroupLabel);
    const [options, setOptions] = useState<string[]>(currentOptions);
    const [comment, setComment] = useState<string>(currentComment || "");
    const [isMandatory, setIsMandatory] = useState<boolean>(currentIsMandatory || false);

    // Handler to update a specific option text
    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Handler to add a new checkbox field
    const addOption = () => {
        setOptions([...options, `Option ${options.length + 1}`]);
    };

    // Handler to remove a specific checkbox field
    const removeOption = (index: number) => {
        if (options.length > 1) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const addComponentList = (inputId : string) => {
        setSubmittedFormComponent( inputId , new CheckboxComponent(
            inputId,
            groupLabel,
            options,
            isMandatory,
            comment
        ));
    };

    if (!isSubmitted) {
        return (
            <div className="p-4 border rounded bg-white shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg text-blue-600">
                        Edit Checkbox Group
                    </h3>

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

                
                {/* Main Label */}
                <div>
                    <label className="block mb-1 text-sm font-semibold">Group Label:</label>
                    <input
                        type="text"
                        value={groupLabel}
                        onChange={(e) => setGroupLabel(e.target.value)}
                        className="block w-full p-2 border rounded text-gray-700"
                    />
                </div>

                {/* Dynamic Options List */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold">Checkboxes:</label>
                    {options.map((opt, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(index, e.target.value)}
                                className="flex-1 p-2 border rounded text-sm"
                                placeholder={`Option ${index + 1}`}
                            />
                            <button 
                                onClick={() => removeOption(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                                title="Delete Option"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addOption}
                        className="mt-2 flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline"
                    >
                        + Add Option
                    </button>
                </div>

                {/* Comment Field */}
                <div>
                    <label className="block mb-1 text-sm font-semibold">Comment / Description:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="Add instructions for users..."
                        rows={2}
                    />
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow"
                        onClick={() => addComponentList(inputId)}>
                        Save Group
                    </button>
                    <button 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md"
                        onClick={() => removeElement(currentIndex)}>
                        Delete Component
                    </button>
                </div>
            </div>
        );
    }
    else{

        // PREVIEW MODE
        return (
            <div className="p-4 border rounded bg-gray-50 relative group">
                <label className="block mb-3 font-bold text-gray-800">
                    {groupLabel}
                    {isMandatory && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </label>

                
                <div className="flex flex-col space-y-2">
                    {options.map((opt, index) => (
                        <label key={index} className="inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-gray-700">{opt}</span>
                        </label>
                    ))}
                </div>

                {comment && (
                    <div className="mt-4 p-2 bg-blue-50 border-l-4 border-blue-400">
                        <p className="text-xs text-blue-700 italic">{comment}</p>
                    </div>
                )}
            </div>
        );
    }
}

export default CheckBoxPreview;