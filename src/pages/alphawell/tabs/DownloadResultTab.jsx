import React from "react";
import { FileText } from "lucide-react";
import { useAlphaWell } from "../../../context/AlphaWellContext";

export default function DownloadResultTab() {
  const { lastApiResponse, analyzed, wellParams } = useAlphaWell();

  const wellId = wellParams?.wellId || "well";

  // --- Download JSON result ---
  const handleDownloadJson = () => {
    if (!lastApiResponse) return;

    const blob = new Blob([JSON.stringify(lastApiResponse, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `alphawell-analysis-${wellId}.json`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/90 rounded-2xl shadow-md border border-slate-100 p-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Download Result
      </h2>

      <p className="text-sm text-slate-600 mb-4">
        Export your latest AlphaWell analysis. Download the raw JSON payload for
        engineering workflows, or use <span className="font-medium text-blue-700">
          Generate PDF
        </span>{" "}
        from the header for a formatted executive report.
      </p>

      {!analyzed || !lastApiResponse ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          No analysis result available. Run{" "}
          <span className="font-semibold">Analyze</span> from the Input screen
          first.
        </div>
      ) : (
        <>
          {/* Info Box */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 mb-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900 mb-1">
              Current Analysis Metadata
            </p>

            <p>
              <span className="font-medium">Well ID:</span> {wellId}
            </p>

            <p className="mt-1">
              <span className="font-medium">Included Keys:</span>{" "}
              {Object.keys(lastApiResponse).join(", ")}
            </p>
          </div>

          {/* Download JSON Button */}
          <button
            onClick={handleDownloadJson}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-blue-700 transition-all"
          >
            <FileText className="w-4 h-4" />
            Download JSON Result
          </button>

          <p className="mt-3 text-xs text-slate-500">
            The JSON includes production, economic, carbon, sensitivity, and
            forecast metrics returned by the AlphaWell API.
          </p>
        </>
      )}
    </div>
  );
}
