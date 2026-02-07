import type { fieldType, JsonDataType } from "../GlobalTypes/types";
import type { FormDetails } from "../GlobalTypes/formType";

/**
 * Safely imports a JSON payload into state.
 * Returns the normalized payload so callers can reuse it if needed.
 */
export function onImportCallback(
  jsonObject: JsonDataType,
  setFormDetails: React.Dispatch<React.SetStateAction<FormDetails>>,
  setSelectedElementsList: React.Dispatch<React.SetStateAction<fieldType[]>>
) {
  // Defensive normalize (shape guard)
  const safeFormDetails: FormDetails = jsonObject?.formDetails ?? { FormName: "" };
  const safeFormData: fieldType[] = Array.isArray(jsonObject?.formData)
    ? (jsonObject.formData as fieldType[])
    : [];

  setFormDetails(safeFormDetails);
  setSelectedElementsList(safeFormData);
}

/**
 * Exports current state as a JSON payload.
 * Returns the payload synchronously to avoid stale reads by consumers.
 */
export function onExportCallback(
  formDetails: FormDetails,
  selectedElementsList: fieldType[]
): JsonDataType {
  const payload: JsonDataType = { formDetails, formData: selectedElementsList };
  console.log(payload);
  return payload;
}