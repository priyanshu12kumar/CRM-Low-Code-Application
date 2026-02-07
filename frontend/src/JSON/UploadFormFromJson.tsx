import { JsonDataType } from "../GlobalTypes/types";
import React, { useCallback, useRef, useState } from "react";
import { delay } from "../Utility/DelayUtility" ;
import { useFormBuilder } from "../Global/FormBuilderContext.tsx"

type ImportJsonToRenderFormProps = {
  onImport: (data: JsonDataType) => void | Promise<void>;
  onError?: (message: string, error?: unknown) => void;
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error("File reading was aborted"));

    reader.readAsText(file);
  });
};

// Optional: plug in a schema validator (e.g., zod) here
const validateJson = (parsed: unknown): parsed is JsonDataType => {
  // Example minimal guard; replace with real validation
  return parsed !== null && parsed !== undefined;
};

export const ImportJsonToRenderForm: React.FC<ImportJsonToRenderFormProps> = ({
  onImport,
}) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { getSelectedFieldList } = useFormBuilder() ;

  const openFilePicker = useCallback(() => {
    // Do NOT set loading here—file picking is user interaction, not work.
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = 
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      await delay(5000);
      const file = event.target.files?.[0];
      // Reset input value so selecting the same file again still triggers onChange
      event.target.value = "";

      if (!file) return;

      try {
        const text = await readFileAsText(file);

        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch (parseErr) {
          const message = "Invalid JSON: unable to parse file content.";
          console.error(message, parseErr);
          return;
        }

        if (!validateJson(parsed)) {
          const message = "JSON structure is not valid for the expected schema.";
          console.error(message, parsed);
          return;
        }

        await onImport(parsed as JsonDataType);
      } catch (err) {
        const message = "Failed to read the selected file.";
        console.error(message, err);
      } finally {
        setLoading(false);
        console.log(getSelectedFieldList()) ;
      }
    }

  return (
    <>
      <button
        type="button"
        onClick={openFilePicker}
        disabled={loading}
        className={`
          inline-flex items-center gap-2
          rounded-md bg-gray-600 px-4 py-2 text-white font-medium
          hover:bg-gray-700
          disabled:opacity-60 disabled:cursor-not-allowed
          active:scale-[0.98] transition-all
        `}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span
              className="inline-block animate-spin w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full"
              aria-hidden="true"
            />
            <span className="sr-only">Loading</span>
            Loading…
          </>
        ) : (
          "Import from JSON"
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};


export default ImportJsonToRenderForm;
