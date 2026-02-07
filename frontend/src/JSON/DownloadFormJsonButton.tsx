import React, { useCallback, useState } from "react";
import type { JsonDataType } from "../GlobalTypes/types";
import { delay } from "../Utility/DelayUtility" ;

interface ExportJsonToRenderFormProps {
  /** Provide the data you want to export as JSON */
  onExport: () => JsonDataType | Promise<JsonDataType>;
  /** Optional: customize the filename; you can pass `form-components` and we’ll add `.json` */
  filenameBase?: string;
  /** Optional: include a timestamp suffix (default: true) */
  includeTimestamp?: boolean;
  /** Optional: error reporting hook for toasts/logging */
  onError?: (message: string, error?: unknown) => void;
}

/**
 * Safely JSON-stringify objects, handling circular references by replacing them with "[Circular]".
 * Also supports pretty-printing via space=2.
 */
function safeStringify(value: unknown, space = 2): string {
  const seen = new WeakSet<object>();
  return JSON.stringify(
    value,
    (_ , val) => {
      if (typeof val === "object" && val !== null) {
        if (seen.has(val as object)) return "[Circular]";
        seen.add(val as object);
      }
      return val;
    },
    space
  )!;
}

function buildFilename(base: string, includeTimestamp: boolean): string {
  const cleanBase = base.replace(/[^a-zA-Z0-9-_]+/g, "_");
  if (!includeTimestamp) return `${cleanBase}.json`;
  const ts = new Date()
    .toISOString()
    .replace(/[:.]/g, "-"); // safer for Windows file systems
  return `${cleanBase}-${ts}.json`;
}

const DownloadFormJsonButton: React.FC<ExportJsonToRenderFormProps> = ({
  onExport,
  filenameBase = "form-components",
  includeTimestamp = true,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    await delay(5000) ;

    try {
      // 1) Get data (supports sync or async onExport)
      const data = await onExport();

      // 2) Convert instances to plain objects when possible
      // structuredClone is safer than JSON parse/stringify for plain conversion,
      // but it doesn't handle functions/DOM/Map/Set classes. Fallback to stringify if needed.
      let plainData: unknown = data;
      try {
        // If not supported by env, you can polyfill or skip this step.
        plainData = typeof structuredClone === "function" ? structuredClone(data) : JSON.parse(JSON.stringify(data));
      } catch {
        // Fallback if structuredClone fails
        plainData = JSON.parse(JSON.stringify(data));
      }

      // 3) Stringify (safely, to handle circular references)
      const jsonText = safeStringify(plainData, 2);

      // 4) Optional BOM (uncomment if a consumer requires Excel-friendly UTF-8)
      // const BOM = "\uFEFF";
      // const blob = new Blob([BOM, jsonText], { type: "application/json;charset=utf-8" });

      const blob = new Blob([jsonText], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      // 5) Build filename
      const fileName = buildFilename(filenameBase, includeTimestamp);

      // 6) Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      // Some browsers require anchor to be in the DOM
      document.body.appendChild(a);
      a.click();
      a.remove();

      // 7) Revoke the URL after the click (next tick to ensure the download starts)
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 0);
    } catch (err) {
      const message = "Failed to export JSON.";
      console.error(message, err);
      onError?.(message, err);
    } finally {
      setLoading(false);
    }
  }, [onExport, onError, filenameBase, includeTimestamp]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={`
        inline-flex items-center gap-2
        rounded-md bg-blue-600 px-4 py-2 text-white font-medium
        hover:bg-blue-700
        active:scale-[0.98] transition-all
        disabled:opacity-60 disabled:cursor-not-allowed
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
      `}
      aria-busy={loading}
      aria-live="polite"
    >
      {loading ? (
        <>
          <span
            className="inline-block animate-spin w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full"
            aria-hidden="true"
          />
          <span>Preparing JSON…</span>
        </>
      ) : (
        "Export as JSON"
      )}
    </button>
  );
};

export default DownloadFormJsonButton ;

