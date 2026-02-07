import { useState } from "react";
import type { fieldType, JsonDataType } from "../GlobalTypes/types";
import {useFormDetails} from '../Global/FormDetailsContext.tsx';
import {useFormBuilder} from '../Global/FormBuilderContext.tsx';

// type Props = {
//   formJson: JsonDataType;
//   endpoint?: string;
// };

const SubmitFormButton = () => {
  const selectedElementsList : fieldType[] = useFormBuilder().getSelectedFieldList()[0] ;
  const {formDetails} = useFormDetails() ;
  const formJson = { formDetails , formData: selectedElementsList } as JsonDataType ;
  const endpoint = "https://crm-low-code-application.onrender.com/save-form" ;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setStatus("idle");

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formJson)
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className={`
        px-6 py-2 rounded-xl font-semibold transition-all
        ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
        text-white shadow-md
      `}
    >
      {loading
        ? "Submitting..."
        : status === "success"
        ? "Saved ✓"
        : status === "error"
        ? "Retry ✗"
        : "Submit Form"}
    </button>
  );
};

export default SubmitFormButton;
