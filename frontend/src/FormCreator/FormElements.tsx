import {useFormBuilder} from "../Global/FormBuilderContext.tsx";
import  {DEFAULT_COMPONENTS} from "../GlobalTypes/formType.ts"

function FormElements() {
  const { addElement } = useFormBuilder();

  const ITEM_TYPE_MAP = {
  "Text Input": "text_input",
  "Check Box": "checkbox",
  "Radio Button": "radio",
  "Drop Down": "dropdown",
  "Text Area": "textarea",
  } as const;

return (
  <div className="space-y-4">
    <p>Here will be list type of elements like :</p>

    <ul className="space-y-2">
      {(
        [
          "Text Input",
          "Check Box",
          "Radio Button",
          "Drop Down",
          "Text Area",
        ] as const
      ).map((item) => {
        const componentType = ITEM_TYPE_MAP[item];

        return (
          <li
            key={item}
            onClick={() =>
              addElement({
                inputType: item,
                inputId: crypto.randomUUID(),
                isSubmitted: false,
                InputComponent: DEFAULT_COMPONENTS[componentType](),
              })
            }
            className="
              cursor-pointer
              rounded-md
              px-3 py-2
              text-gray-700
              hover:bg-blue-50 hover:text-blue-600
              transition-all duration-200
              active:scale-[0.98]
              select-none
              border border-gray-200
              shadow-sm
            "
          >
            {item}
          </li>
        );
      })}
    </ul>
  </div>
);

}

export default FormElements;
