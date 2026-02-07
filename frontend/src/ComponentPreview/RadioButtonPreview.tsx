import { useState } from 'react';
import { useFormBuilder } from '../Global/FormBuilderContext.tsx';
import type { InputPreviewProps } from '../GlobalTypes/types.ts';
import { RadioButtonComponent } from '../GlobalTypes/formType.ts';

export interface RadioOption {
    label: string;
    name: string;
    isChecked: boolean;
}

function RadioButtonPreview({ currentIndex , isSubmitted , inputId }: InputPreviewProps) {

    const { getSpecificField , setSubmittedFormComponent , removeElement } = useFormBuilder();
    
    const { 
        label: currentLabel, 
        selectionMode : currSelectionMode, 
        radioOptionList: currentRadioOptionList, 
        defaultSelection: currentDefaultSelection,
        comment: currentComment ,
        isMandatory : currentIsMandatory
    } = getSpecificField(inputId) as RadioButtonComponent;

    const [groupLabel, setGroupLabel] = useState<string>(currentLabel || "Select an Option");
    const [isGrouped, setIsGrouped] = useState<boolean>(currSelectionMode == "single_choice"); // true = same name attribute, false = different names
    const [commonName, setCommonName] = useState<string>("radio_group_1");
    const [options, setOptions] = useState<RadioOption[]>(currentRadioOptionList || [
        { label: "Option 1", name: "option_1" , isChecked: false },
        { label: "Option 2", name: "option_2" , isChecked: false }
    ]);
    const [defaultIndex, setDefaultIndex] = useState<number>(currentDefaultSelection || 0);
    const [comment, setComment] = useState<string>(currentComment || "");
    const [isMandatory, setIsMandatory] = useState<boolean>(currentIsMandatory || false);


    const addOption = () => {
        const nextId = options.length + 1;
        setOptions([...options, { label: `Option ${nextId}`, name: `option_${nextId}`, isChecked: false }]);
    };

    const updateOption = (index: number, field: keyof RadioOption, value: string) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setOptions(newOptions);
    };

    const removeOption = (index: number) => {
        if (options.length > 1) {
            setOptions(options.filter((_, i) => i !== index));
            if (defaultIndex === index) setDefaultIndex(0);
        }
    };

    const handleOptionClick = (currentName: string) => {
    const newOptions: RadioOption[] = options.map(option =>
        option.name === currentName
        ? { ...option, isChecked: !option.isChecked }
        : option
    );

    setOptions(newOptions);
    };

    const addComponentList = (inputId : string) => {
        setSubmittedFormComponent( inputId , new RadioButtonComponent(
        inputId,
        groupLabel,
        isGrouped ? "single_choice" : "independent",
        options,
        isMandatory,
        comment,
        defaultIndex
    ));
    };


    if (!isSubmitted) {
        return (
            <div className="p-4 border rounded bg-white shadow-sm space-y-4 border-l-4 border-rose-500">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg text-rose-600">Edit Radio Buttons</h3>

                    <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isMandatory}
                            onChange={(e) => setIsMandatory(e.target.checked)}
                            className="accent-rose-500"
                        />
                        Mandatory
                    </label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Group Label:</label>
                        <input
                            type="text"
                            value={groupLabel}
                            onChange={(e) => setGroupLabel(e.target.value)}
                            className="block w-full p-2 border rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Selection Mode:</label>
                        <select 
                            value={isGrouped ? "single" : "multiple"}
                            onChange={(e) => setIsGrouped(e.target.value === "single")}
                            className="block w-full p-2 border rounded text-sm bg-rose-50 border-rose-200"
                        >
                            <option value="single">Single Choice (Same Name)</option>
                            <option value="multiple">Independent (Different Names)</option>
                        </select>
                    </div>
                </div>

                {isGrouped && (
                    <div>
                        <label className="block mb-1 text-sm font-semibold">Group Name Attribute:</label>
                        <input
                            type="text"
                            value={commonName}
                            onChange={(e) => setCommonName(e.target.value)}
                            className="block w-full p-2 border rounded text-sm font-mono bg-gray-50"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="block text-sm font-semibold">Options & Default Selection:</label>
                    {options.map((opt, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-dashed border-gray-300">
                            <input 
                                type="radio" 
                                checked={defaultIndex === index} 
                                onChange={() => setDefaultIndex(index)}
                                title="Set as default"
                                className="w-4 h-4 accent-rose-500 cursor-pointer"
                            />
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={opt.label}
                                    onChange={(e) => updateOption(index, 'label', e.target.value)}
                                    className="p-1.5 border rounded text-xs"
                                    placeholder="Label"
                                />
                                {!isGrouped && (
                                    <input
                                        type="text"
                                        value={opt.name}
                                        onChange={(e) => updateOption(index, 'name', e.target.value)}
                                        className="p-1.5 border rounded text-xs font-mono bg-white"
                                        placeholder="Unique Name"
                                    />
                                )}
                            </div>
                            <button 
                                onClick={() => removeOption(index)}
                                className="text-gray-400 hover:text-red-500 px-1"
                            >✕</button>
                        </div>
                    ))}
                    <button onClick={addOption} className="text-xs text-rose-600 font-bold mt-1">+ Add Radio Button</button>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-semibold">Comment / Instructions:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        rows={2}
                    />
                </div>

                <div className="flex gap-2 pt-2 border-t">
                    <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-md shadow" onClick={() => addComponentList(inputId)}>Save Radio Group</button>
                    <button className="bg-gray-100 text-gray-600 font-semibold py-2 px-4 rounded-md" onClick={() => removeElement(currentIndex)}>Remove</button>
                </div>
            </div>
        );
    }
    else{

        return (
            <div className="p-4 border rounded bg-gray-50 relative border-rose-100">
                
                <label className="font-bold text-gray-800">
                    {groupLabel}
                    {isMandatory && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </label>
                
                <div className="flex flex-col space-y-2">
                    {options.map((opt, index) => (
                        <label key={index} className="inline-flex items-center group cursor-pointer">
                        <input
                            type="radio"
                            name={isGrouped ? commonName : opt.name}
                            defaultChecked={defaultIndex === index}
                            className="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                            {...(!isGrouped && {
                            checked: opt.isChecked,
                            onClick: () => handleOptionClick(opt.name),
                            readOnly: true, // prevents React warning since we control checked
                            })}
                        />
                        <span className="ml-2 text-gray-700 group-hover:text-rose-700 transition-colors">
                            {opt.label}
                        </span>
                        </label>
                    ))}
                </div>

                {comment && (
                    <div className="mt-4 p-2 bg-white border rounded text-xs text-gray-500 italic flex items-start gap-2">
                        <span className="text-rose-400">●</span> {comment}
                    </div>
                )}
            </div>
        );
    }
}

export default RadioButtonPreview;
