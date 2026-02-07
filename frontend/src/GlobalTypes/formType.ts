// type.ts
import type { RadioOption } from '../ComponentPreview/RadioButtonPreview.jsx'

// ---------- Shared Types ----------
export type InputDataType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "file"

export type RadioSelectionMode =
  | "single_choice"
  | "independent";


export interface FormDetails {
  FormName: string ;
}


// ---------- Base Class ----------
export abstract class BaseFormComponent {
  constructor(
    public id: string,
    public type: string,
    public label: string,
    public isMandatory: boolean,
    public comment?: string
  ) {}
}

// ---------- Text Input ----------
export class TextInputComponent extends BaseFormComponent {
  constructor(
    id: string,
    label: string,
    public inputDataType: InputDataType,
    isMandatory: boolean,
    public placeholder?: string,
    public validationRegex?: string,
    comment?: string
  ) {
    super(id, "Text Input", label, isMandatory , comment);
  }
}

// ---------- Checkbox ----------
export class CheckboxComponent extends BaseFormComponent {
  constructor(
    id: string,
    label: string,
    public options: string[],
    isMandatory: boolean,
    comment?: string
  ) {
    super(id, "Check Box", label, isMandatory, comment);
  }
}

// ---------- Radio Button ----------
export class RadioButtonComponent extends BaseFormComponent {
  constructor(
    id: string,
    label: string,
    public selectionMode: RadioSelectionMode,
    public  radioOptionList : RadioOption[],
    isMandatory: boolean,
    comment?: string,
    public defaultSelection?: number
  ) {
    super(id, "Radio Button", label, isMandatory,comment);
  }
}

// ---------- Dropdown ----------
export class DropdownComponent extends BaseFormComponent {
  constructor(
    id: string,
    label: string,
    public options: string[],
    isMandatory: boolean,
    public placeholder?: string,
    comment?: string
  ) {
    super(id, "Drop Down", label, isMandatory,comment);
  }
}

// ---------- Text Area ----------
export class TextAreaComponent extends BaseFormComponent {
  constructor(
    id: string,
    label: string,
    public fieldName: string,
    public rows: number,
    isMandatory: boolean,
    public placeholder?: string,
    public validationRegex?: string,
    comment?: string
  ) {
    super(id, "Text Area", label, isMandatory , comment);
  }
}

// ---------- Union Type ----------
export type FormComponent =
  | TextInputComponent
  | CheckboxComponent
  | RadioButtonComponent
  | DropdownComponent
  | TextAreaComponent;

// ---------- Helper Type ----------
type ComponentByType<T extends FormComponent["type"]> =
  Extract<FormComponent, { type: T }>;

// ---------- Default Components ----------
export const DEFAULT_COMPONENTS: {
  [K in FormComponent["type"]]: () => ComponentByType<K>;
} = {
  text_input: () =>
    new TextInputComponent(
      crypto.randomUUID(),
      "",
      "text",
      false,
      ""
    ),

  checkbox: () =>
    new CheckboxComponent(
      crypto.randomUUID(),
      "",
      [],
      false,
      ""
    ),

  radio: () =>
    new RadioButtonComponent(
      crypto.randomUUID(),
      "",
      "single_choice",
      [],
      false,
      ""
    ),

  dropdown: () =>
    new DropdownComponent(
      crypto.randomUUID(),
      "",
      [],
      false,
      ""
    ),

  textarea: () =>
    new TextAreaComponent(
      crypto.randomUUID(),
      "",
      "",
      3,
      false,
      ""
    ),
};
