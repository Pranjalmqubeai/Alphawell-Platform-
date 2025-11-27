// import React, { useMemo, useEffect, useState } from "react";
// import {
//   Activity,
//   DollarSign,
//   Droplet,
//   Zap,
//   Calendar,
//   AlertTriangle,
//   CheckCircle,
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { useAlphaWell } from "../../../context/AlphaWellContext";
// import { exportElementToPDF } from "../../../utils/ExportPdf";
// import ExecParamsModal from "./ExecParamsModal";

// export default function ExecutiveSummary() {
//   const {
//     kpis,
//     productionData,
//     economicData,
//     carbonData,
//     economicParams,
//     wellParams,
//     lastApiResponse,
//   } = useAlphaWell();

//   const [openEdit, setOpenEdit] = useState(false);

//   /* -----------------------------------------
//       NEW: States to store S3 data
//   ------------------------------------------*/
//   const [remoteProduction, setRemoteProduction] = useState([]);
//   const [remoteCashflow, setRemoteCashflow] = useState([]);

//   /* -----------------------------------------
//       Fetch Production + Cashflow S3 URLs
//   ------------------------------------------*/
//   useEffect(() => {
//     if (!lastApiResponse) return;

//     const fetchS3 = async () => {
//       try {
//         // --- Production Data ---
//         if (lastApiResponse.production_data_url) {
//           const r1 = await fetch(lastApiResponse.production_data_url);
//           const d1 = await r1.json();
//           setRemoteProduction(Array.isArray(d1) ? d1 : []);
//         }

//         // --- Cash Flow Data ---
//         if (lastApiResponse.cash_flow_url) {
//           const r2 = await fetch(lastApiResponse.cash_flow_url);
//           const d2 = await r2.json();
//           setRemoteCashflow(Array.isArray(d2) ? d2 : []);
//         }
//       } catch (e) {
//         console.error("S3 fetch failed:", e);
//       }
//     };

//     fetchS3();
//   }, [lastApiResponse]);

//   /* -----------------------------------------
//       Defensive guard for KPI section
//   ------------------------------------------*/
//   const hasData =
//     kpis &&
//     carbonData?.length > 0 &&
//     productionData?.length > 0 &&
//     economicData?.length > 0;

//   /* -----------------------------------------
//       Pie Chart Data
//   ------------------------------------------*/
//   const pieData = useMemo(() => {
//     if (!hasData) return [];
//     const oilComb = carbonData.reduce((s, d) => s + (d.combustionOil || 0), 0);
//     const gasComb = carbonData.reduce((s, d) => s + (d.combustionGas || 0), 0);
//     const proc = carbonData.reduce((s, d) => s + (d.processing || 0), 0);
//     const flare = carbonData.reduce((s, d) => s + (d.flaring || 0), 0);
//     return [
//       { name: "Oil Combustion", value: oilComb },
//       { name: "Gas Combustion", value: gasComb },
//       { name: "Processing", value: proc },
//       { name: "Flaring", value: flare },
//     ];
//   }, [hasData, carbonData]);

//   /* -----------------------------------------
//       PDF Export Hook
//   ------------------------------------------*/
//   useEffect(() => {
//     const handler = async () => {
//       try {
//         await exportElementToPDF(
//           "exec-summary",
//           `AlphaWell_ExecutiveSummary_${wellParams.wellId || "Well"}.pdf`
//         );
//       } catch (e) {
//         alert(`PDF failed: ${e.message}`);
//       }
//     };
//     window.addEventListener("aw-export-exec-pdf", handler);
//     return () =>
//       window.removeEventListener("aw-export-exec-pdf", handler);
//   }, [wellParams.wellId]);

//   if (!hasData) {
//     return (
//       <div className="bg-white rounded-xl p-8 shadow">
//         <p className="text-gray-700">
//           Run <span className="font-semibold">Analyze</span> to
//           generate your Executive Summary.
//         </p>
//       </div>
//     );
//   }

//   /* ========================================================================
//       RENDER
//   ========================================================================*/
//   return (
//     <div className="space-y-6" id="exec-summary">
//       {/* --- Verdict Banner --- */}
//       <div
//         className={`rounded-xl p-6 ${
//           kpis.verdict === "Drill"
//             ? "bg-gradient-to-r from-green-500 to-emerald-600"
//             : kpis.verdict === "Evaluate Further"
//             ? "bg-gradient-to-r from-yellow-500 to-orange-600"
//             : "bg-gradient-to-r from-red-500 to-pink-600"
//         } text-white`}
//       >
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-3xl font-bold mb-2">
//               Decision: {kpis.verdict}
//             </h2>
//             <p className="text-lg opacity-90">
//               ESG Risk: {kpis.esgRisk}
//             </p>
//           </div>
//           <div className="text-right">
//             {kpis.verdict === "Drill" ? (
//               <CheckCircle className="w-16 h-16" />
//             ) : (
//               <AlertTriangle className="w-16 h-16" />
//             )}
//           </div>
//         </div>

//         <div className="mt-4 flex gap-3">
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold"
//           >
//             Edit Parameters
//           </button>
//         </div>
//       </div>

//       {/* --- KPI CARDS --- */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <KpiCard title="NPV" icon={<DollarSign className="text-green-600"/>}
//           value={kpis.npv.toLocaleString()} desc="Net Present Value" />

//         <KpiCard title="IRR" value={`${kpis.irr.toFixed(1)}%`} />

//         <KpiCard title="EUR Oil"
//           icon={<Droplet className="text-orange-600" />}
//           value={`${(kpis.eurOil/1000).toFixed(0)}K`} desc="bbl" />

//         <KpiCard title="EUR Gas"
//           icon={<Zap className="text-purple-600" />}
//           value={`${(kpis.eurGas/1000).toFixed(0)}K`} desc="mcf" />

//         <KpiCard title="Total CO₂"
//           icon={<Zap className="text-emerald-600"/>}
//           value={kpis.totalCO2.toFixed(0)} desc="tons" />

//         <KpiCard title="Intensity"
//           icon={<Activity className="text-teal-600" />}
//           value={kpis.avgIntensity.toFixed(0)} desc="g CO₂e/BOE" />

//         <KpiCard title="Carbon Credits"
//           icon={<DollarSign className="text-green-600" />}
//           value={`$${kpis.carbonCreditPotential.toFixed(0)}K`} />

//         <KpiCard title="Payback"
//           icon={<Calendar className="text-indigo-600" />}
//           value={kpis.paybackMonths ?? "—"} desc="months" />
//       </div>

//       {/* =====================================================================
//             UPDATED — PRODUCTION DECLINE GRAPH (S3 DATA)
//       ===================================================================== */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold mb-4">
//             Production Decline Preview
//           </h3>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={remoteProduction}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />

//               <Line
//                 type="monotone"
//                 dataKey="gross_production_oil_bbls"
//                 stroke="#f97316"
//                 strokeWidth={2}
//                 name="Oil (bbl/mo)"
//               />

//               <Line
//                 type="monotone"
//                 dataKey="gross_production_wh_gas_mcf"
//                 stroke="#8b5cf6"
//                 strokeWidth={2}
//                 name="Gas (mcf/mo)"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* =====================================================================
//               UPDATED — CASHFLOW GRAPH (S3 DATA)
//         ===================================================================== */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold mb-4">
//             Cumulative Cash Flow
//           </h3>

//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={remoteCashflow}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip formatter={(v)=> `$${(v/1_000_000).toFixed(2)}M`} />
//               <Legend />

//               <Area
//                 type="monotone"
//                 dataKey="cumulative_cash_flow"
//                 stroke="#10b981"
//                 fill="#10b981"
//                 fillOpacity={0.5}
//                 name="Cumulative CF ($)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* --- WELL CHARACTERISTICS --- */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold mb-4">Well Characteristics</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Char title="Formation" value={wellParams.formation} />
//           <Char title="Trajectory" value={wellParams.trajectory} />
//           <Char title="TVD" value={`${wellParams.tvd?.toLocaleString()} ft`} />
//           <Char title="Lateral Length"
//             value={`${wellParams.lateralLength?.toLocaleString()} ft`} />
//           <Char title="CAPEX"
//             value={`$${(economicParams.totalCAPEX/1_000_000).toFixed(2)}M`} />
//           <Char title="Fixed OPEX"
//             value={`$${(economicParams.fixedOPEX/1000).toFixed(0)}K/yr`} />
//         </div>
//       </div>

//       <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
//     </div>
//   );
// }

// /* --------------------------------------------------------------------
//       Small Reusable Components
// --------------------------------------------------------------------- */

// function KpiCard({ title, value, desc, icon }) {
//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <div className="flex items-center justify-between mb-2">
//         <span className="text-sm text-gray-600">{title}</span>
//         {icon}
//       </div>
//       <p className="text-3xl font-bold text-gray-900">{value}</p>
//       {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
//     </div>
//   );
// }

// function Char({ title, value }) {
//   return (
//     <div>
//       <p className="text-sm text-gray-600">{title}</p>
//       <p className="font-semibold text-gray-900">{value}</p>
//     </div>
//   );
// }
/* --- FULL EXECUTIVE SUMMARY COMPONENT WITH S3 CHARTS + SUMMARY TABLE --- */

// working with table

// import React, { useMemo, useEffect, useState } from "react";
// import {
//   Activity,
//   DollarSign,
//   Droplet,
//   Zap,
//   Calendar,
//   AlertTriangle,
//   CheckCircle,
// } from "lucide-react";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { useAlphaWell } from "../../../context/AlphaWellContext";
// import { exportElementToPDF } from "../../../utils/ExportPdf";
// import ExecParamsModal from "./ExecParamsModal";

// export default function ExecutiveSummary() {
//   const {
//     kpis,
//     productionData,
//     economicData,
//     carbonData,
//     economicParams,
//     wellParams,
//     lastApiResponse,
//   } = useAlphaWell();

//   const [openEdit, setOpenEdit] = useState(false);

//   /* -----------------------------------------
//       S3 data: production + cashflow
//   ------------------------------------------*/
//   const [remoteProduction, setRemoteProduction] = useState([]);
//   const [remoteCashflow, setRemoteCashflow] = useState([]);

//   /* -----------------------------------------
//       NEW: summary_report_url table data
//   ------------------------------------------*/
//   const [summaryRows, setSummaryRows] = useState([]);
//   const [summaryLoading, setSummaryLoading] = useState(false);
//   const [summaryError, setSummaryError] = useState(null);

//   /* -----------------------------------------
//       Fetch Production + Cashflow + Summary S3 URLs
//   ------------------------------------------*/
//   useEffect(() => {
//     if (!lastApiResponse) return;

//     const fetchS3 = async () => {
//       try {
//         // --- Production Data ---
//         if (lastApiResponse.production_data_url) {
//           const r1 = await fetch(lastApiResponse.production_data_url);
//           const d1 = await r1.json();
//           setRemoteProduction(Array.isArray(d1) ? d1 : []);
//         } else {
//           setRemoteProduction([]);
//         }

//         // --- Cash Flow Data ---
//         if (lastApiResponse.cash_flow_url) {
//           const r2 = await fetch(lastApiResponse.cash_flow_url);
//           const d2 = await r2.json();
//           setRemoteCashflow(Array.isArray(d2) ? d2 : []);
//         } else {
//           setRemoteCashflow([]);
//         }

//         // --- NEW: Summary Report Data ---
//         if (lastApiResponse.summary_report_url) {
//           setSummaryLoading(true);
//           setSummaryError(null);
//           try {
//             const r3 = await fetch(lastApiResponse.summary_report_url);
//             if (!r3.ok) {
//               throw new Error(`summary_report_url error: ${r3.status}`);
//             }
//             const d3 = await r3.json();
//             console.log("🔥 Summary Report Response:", d3);
//             setSummaryRows(Array.isArray(d3) ? d3 : []);
//           } catch (e) {
//             console.error("Summary report fetch failed:", e);
//             setSummaryRows([]);
//             setSummaryError(e.message || "Failed to load summary report.");
//           } finally {
//             setSummaryLoading(false);
//           }
//         } else {
//           setSummaryRows([]);
//           setSummaryLoading(false);
//           setSummaryError(null);
//         }
//       } catch (e) {
//         console.error("S3 fetch failed:", e);
//       }
//     };

//     fetchS3();
//   }, [lastApiResponse]);

//   /* -----------------------------------------
//       Defensive guard for KPI section
//   ------------------------------------------*/
//   const hasData =
//     kpis &&
//     carbonData?.length > 0 &&
//     productionData?.length > 0 &&
//     economicData?.length > 0;

//   /* -----------------------------------------
//       Pie Chart Data (unchanged, still available)
//   ------------------------------------------*/
//   const pieData = useMemo(() => {
//     if (!hasData) return [];
//     const oilComb = carbonData.reduce((s, d) => s + (d.combustionOil || 0), 0);
//     const gasComb = carbonData.reduce((s, d) => s + (d.combustionGas || 0), 0);
//     const proc = carbonData.reduce((s, d) => s + (d.processing || 0), 0);
//     const flare = carbonData.reduce((s, d) => s + (d.flaring || 0), 0);
//     return [
//       { name: "Oil Combustion", value: oilComb },
//       { name: "Gas Combustion", value: gasComb },
//       { name: "Processing", value: proc },
//       { name: "Flaring", value: flare },
//     ];
//   }, [hasData, carbonData]);

//   /* -----------------------------------------
//       PDF Export Hook (unchanged)
//   ------------------------------------------*/
//   useEffect(() => {
//     const handler = async () => {
//       try {
//         await exportElementToPDF(
//           "exec-summary",
//           `AlphaWell_ExecutiveSummary_${wellParams.wellId || "Well"}.pdf`
//         );
//       } catch (e) {
//         alert(`PDF failed: ${e.message}`);
//       }
//     };
//     window.addEventListener("aw-export-exec-pdf", handler);
//     return () => window.removeEventListener("aw-export-exec-pdf", handler);
//   }, [wellParams.wellId]);

//   if (!hasData) {
//     return (
//       <div className="bg-white rounded-xl p-8 shadow">
//         <p className="text-gray-700">
//           Run <span className="font-semibold">Analyze</span> to generate your
//           Executive Summary.
//         </p>
//       </div>
//     );
//   }

//   /* -----------------------------------------
//       Helper to format summary table cells
//   ------------------------------------------*/
//   const formatSummaryCell = (key, value) => {
//     if (value === null || value === undefined || value === "") return "-";

//     // Date-like keys
//     if (String(key).toLowerCase().includes("date")) {
//       const str = String(value);
//       // handle "2025-12-01 00:00:00" → "2025-12-01"
//       return str.length > 10 ? str.slice(0, 10) : str;
//     }

//     const num = Number(value);
//     if (!Number.isNaN(num) && value !== true && value !== false) {
//       // numeric
//       return num.toLocaleString(undefined, {
//         maximumFractionDigits: 2,
//       });
//     }

//     return String(value);
//   };

//   /* -----------------------------------------
//       NEW: Download CSV for summary table
//   ------------------------------------------*/
//   const handleDownloadSummaryCsv = () => {
//     if (!summaryRows.length) return;

//     const headers = Object.keys(summaryRows[0]);
//     const escapeVal = (v) => {
//       if (v === null || v === undefined) return "";
//       const s = String(v);
//       if (s.includes('"') || s.includes(",") || s.includes("\n")) {
//         return `"${s.replace(/"/g, '""')}"`;
//       }
//       return s;
//     };

//     const csvLines = [];
//     csvLines.push(headers.join(","));
//     summaryRows.forEach((row) => {
//       const line = headers.map((h) => escapeVal(row[h])).join(",");
//       csvLines.push(line);
//     });

//     const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `alphawell-summary-report-${
//       wellParams.wellId || "well"
//     }.csv`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   /* ========================================================================
//       RENDER
//   ========================================================================*/
//   return (
//     <div className="space-y-6" id="exec-summary">
//       {/* --- Verdict Banner --- */}
//       <div
//         className={`rounded-xl p-6 ${
//           kpis.verdict === "Drill"
//             ? "bg-gradient-to-r from-green-500 to-emerald-600"
//             : kpis.verdict === "Evaluate Further"
//             ? "bg-gradient-to-r from-yellow-500 to-orange-600"
//             : "bg-gradient-to-r from-red-500 to-pink-600"
//         } text-white`}
//       >
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-3xl font-bold mb-2">
//               Decision: {kpis.verdict}
//             </h2>
//             <p className="text-lg opacity-90">ESG Risk: {kpis.esgRisk}</p>
//           </div>
//           <div className="text-right">
//             {kpis.verdict === "Drill" ? (
//               <CheckCircle className="w-16 h-16" />
//             ) : (
//               <AlertTriangle className="w-16 h-16" />
//             )}
//           </div>
//         </div>

//         <div className="mt-4 flex gap-3">
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold"
//           >
//             Edit Parameters
//           </button>
//         </div>
//       </div>

//       {/* --- KPI CARDS --- */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <KpiCard
//           title="NPV"
//           icon={<DollarSign className="text-green-600" />}
//           value={kpis.npv.toLocaleString()}
//           desc="Net Present Value"
//         />

//         <KpiCard title="IRR" value={`${kpis.irr.toFixed(1)}%`} />

//         <KpiCard
//           title="EUR Oil"
//           icon={<Droplet className="text-orange-600" />}
//           value={`${(kpis.eurOil / 1000).toFixed(0)}K`}
//           desc="bbl"
//         />

//         <KpiCard
//           title="EUR Gas"
//           icon={<Zap className="text-purple-600" />}
//           value={`${(kpis.eurGas / 1000).toFixed(0)}K`}
//           desc="mcf"
//         />

//         <KpiCard
//           title="Total CO₂"
//           icon={<Zap className="text-emerald-600" />}
//           value={kpis.totalCO2.toFixed(0)}
//           desc="tons"
//         />

//         <KpiCard
//           title="Intensity"
//           icon={<Activity className="text-teal-600" />}
//           value={kpis.avgIntensity.toFixed(0)}
//           desc="g CO₂e/BOE"
//         />

//         <KpiCard
//           title="Carbon Credits"
//           icon={<DollarSign className="text-green-600" />}
//           value={`$${kpis.carbonCreditPotential.toFixed(0)}K`}
//         />

//         <KpiCard
//           title="Payback"
//           icon={<Calendar className="text-indigo-600" />}
//           value={kpis.paybackMonths ?? "—"}
//           desc="months"
//         />
//       </div>

//       {/* =====================================================================
//             PRODUCTION DECLINE GRAPH (S3 DATA)
//       ===================================================================== */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold mb-4">Production Decline Preview</h3>

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={remoteProduction}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />

//               <Line
//                 type="monotone"
//                 dataKey="gross_production_oil_bbls"
//                 stroke="#f97316"
//                 strokeWidth={2}
//                 name="Oil (bbl/mo)"
//               />

//               <Line
//                 type="monotone"
//                 dataKey="gross_production_wh_gas_mcf"
//                 stroke="#8b5cf6"
//                 strokeWidth={2}
//                 name="Gas (mcf/mo)"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* =====================================================================
//               CASHFLOW GRAPH (S3 DATA)
//         ===================================================================== */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold mb-4">Cumulative Cash Flow</h3>

//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={remoteCashflow}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip
//                 formatter={(v) => `$${(Number(v) / 1_000_000).toFixed(2)}M`}
//               />
//               <Legend />

//               <Area
//                 type="monotone"
//                 dataKey="cumulative_cash_flow"
//                 stroke="#10b981"
//                 fill="#10b981"
//                 fillOpacity={0.5}
//                 name="Cumulative CF ($)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* =====================================================================
//             NEW — SUMMARY REPORT TABLE (BELOW GRAPHS)
//       ===================================================================== */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="text-lg font-bold text-gray-900">
//             Monthly Summary Report
//           </h3>

//           {summaryRows.length > 0 && (
//             <button
//               onClick={handleDownloadSummaryCsv}
//               className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-700 transition-all"
//             >
//               Download CSV
//             </button>
//           )}
//         </div>

//         {summaryLoading && (
//           <p className="text-sm text-gray-500">Loading summary report…</p>
//         )}

//         {summaryError && (
//           <p className="text-sm text-red-600">{summaryError}</p>
//         )}

//         {!summaryLoading && !summaryError && !summaryRows.length && (
//           <p className="text-sm text-gray-500">
//             Summary report is not available for this analysis run.
//           </p>
//         )}

//         {summaryRows.length > 0 && (
//           <div className="mt-3 overflow-x-auto rounded-xl border border-slate-100">
//             <table className="min-w-full text-xs md:text-sm">
//               <thead className="bg-slate-50">
//                 <tr className="border-b border-slate-200">
//                   {Object.keys(summaryRows[0]).map((col) => (
//                     <th
//                       key={col}
//                       className="px-3 py-2 text-left font-semibold text-slate-700 uppercase tracking-wide text-[11px] whitespace-nowrap"
//                     >
//                       {col.replace(/_/g, " ")}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {summaryRows.map((row, idx) => (
//                   <tr
//                     key={idx}
//                     className={
//                       idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
//                     }
//                   >
//                     {Object.keys(summaryRows[0]).map((col) => (
//                       <td
//                         key={col}
//                         className="px-3 py-1.5 whitespace-nowrap text-slate-700"
//                       >
//                         {formatSummaryCell(col, row[col])}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* --- WELL CHARACTERISTICS (unchanged) --- */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold mb-4">Well Characteristics</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Char title="Formation" value={wellParams.formation} />
//           <Char title="Trajectory" value={wellParams.trajectory} />
//           <Char
//             title="TVD"
//             value={`${wellParams.tvd?.toLocaleString()} ft`}
//           />
//           <Char
//             title="Lateral Length"
//             value={`${wellParams.lateralLength?.toLocaleString()} ft`}
//           />
//           <Char
//             title="CAPEX"
//             value={`$${(
//               economicParams.totalCAPEX / 1_000_000
//             ).toFixed(2)}M`}
//           />
//           <Char
//             title="Fixed OPEX"
//             value={`$${(economicParams.fixedOPEX / 1000).toFixed(0)}K/yr`}
//           />
//         </div>
//       </div>

//       <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
//     </div>
//   );
// }

// /* --------------------------------------------------------------------
//       Small Reusable Components
// --------------------------------------------------------------------- */

// function KpiCard({ title, value, desc, icon }) {
//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <div className="flex items-center justify-between mb-2">
//         <span className="text-sm text-gray-600">{title}</span>
//         {icon}
//       </div>
//       <p className="text-3xl font-bold text-gray-900">{value}</p>
//       {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
//     </div>
//   );
// }

// function Char({ title, value }) {
//   return (
//     <div>
//       <p className="text-sm text-gray-600">{title}</p>
//       <p className="font-semibold text-gray-900">{value}</p>
//     </div>
//   );
// }

// with table colors
import React, { useMemo, useEffect, useState } from "react";
import {
  Activity,
  DollarSign,
  Droplet,
  Zap,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAlphaWell } from "../../../context/AlphaWellContext";
import { exportElementToPDF } from "../../../utils/ExportPdf";
import ExecParamsModal from "./ExecParamsModal";

export default function ExecutiveSummary() {
  const {
    kpis,
    productionData,
    economicData,
    carbonData,
    economicParams,
    wellParams,
    lastApiResponse,
  } = useAlphaWell();

  const [openEdit, setOpenEdit] = useState(false);

  /* -----------------------------------------
      S3 data: production + cashflow
  ------------------------------------------*/
  const [remoteProduction, setRemoteProduction] = useState([]);
  const [remoteCashflow, setRemoteCashflow] = useState([]);

  /* -----------------------------------------
      NEW: summary_report_url table data
  ------------------------------------------*/
  const [summaryRows, setSummaryRows] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  /* -----------------------------------------
      Pagination for summary table
      20 months (rows) per page
  ------------------------------------------*/
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  // Reset to page 1 whenever we get a new summary set
  useEffect(() => {
    setCurrentPage(1);
  }, [summaryRows]);

  const totalPages = useMemo(() => {
    if (!summaryRows.length) return 1;
    return Math.max(1, Math.ceil(summaryRows.length / rowsPerPage));
  }, [summaryRows, rowsPerPage]);

  const pagedSummaryRows = useMemo(() => {
    if (!summaryRows.length) return [];
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return summaryRows.slice(start, end);
  }, [summaryRows, currentPage, rowsPerPage]);

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  /* -----------------------------------------
      Fetch Production + Cashflow + Summary S3 URLs
  ------------------------------------------*/
  useEffect(() => {
    if (!lastApiResponse) return;

    const fetchS3 = async () => {
      try {
        // --- Production Data ---
        if (lastApiResponse.production_data_url) {
          const r1 = await fetch(lastApiResponse.production_data_url);
          const d1 = await r1.json();
          setRemoteProduction(Array.isArray(d1) ? d1 : []);
        } else {
          setRemoteProduction([]);
        }

        // --- Cash Flow Data ---
        if (lastApiResponse.cash_flow_url) {
          const r2 = await fetch(lastApiResponse.cash_flow_url);
          const d2 = await r2.json();
          setRemoteCashflow(Array.isArray(d2) ? d2 : []);
        } else {
          setRemoteCashflow([]);
        }

        // --- NEW: Summary Report Data ---
        if (lastApiResponse.summary_report_url) {
          setSummaryLoading(true);
          setSummaryError(null);
          try {
            const r3 = await fetch(lastApiResponse.summary_report_url);
            if (!r3.ok) {
              throw new Error(`summary_report_url error: ${r3.status}`);
            }
            const d3 = await r3.json();
            console.log("🔥 Summary Report Response:", d3);
            setSummaryRows(Array.isArray(d3) ? d3 : []);
          } catch (e) {
            console.error("Summary report fetch failed:", e);
            setSummaryRows([]);
            setSummaryError(e.message || "Failed to load summary report.");
          } finally {
            setSummaryLoading(false);
          }
        } else {
          setSummaryRows([]);
          setSummaryLoading(false);
          setSummaryError(null);
        }
      } catch (e) {
        console.error("S3 fetch failed:", e);
      }
    };

    fetchS3();
  }, [lastApiResponse]);

  /* -----------------------------------------
      Defensive guard for KPI section
  ------------------------------------------*/
  const hasData =
    kpis &&
    carbonData?.length > 0 &&
    productionData?.length > 0 &&
    economicData?.length > 0;

  /* -----------------------------------------
      Pie Chart Data (kept in case you reuse later)
  ------------------------------------------*/
  const pieData = useMemo(() => {
    if (!hasData) return [];
    const oilComb = carbonData.reduce((s, d) => s + (d.combustionOil || 0), 0);
    const gasComb = carbonData.reduce((s, d) => s + (d.combustionGas || 0), 0);
    const proc = carbonData.reduce((s, d) => s + (d.processing || 0), 0);
    const flare = carbonData.reduce((s, d) => s + (d.flaring || 0), 0);
    return [
      { name: "Oil Combustion", value: oilComb },
      { name: "Gas Combustion", value: gasComb },
      { name: "Processing", value: proc },
      { name: "Flaring", value: flare },
    ];
  }, [hasData, carbonData]);

  /* -----------------------------------------
      PDF Export Hook
  ------------------------------------------*/
  useEffect(() => {
    const handler = async () => {
      try {
        await exportElementToPDF(
          "exec-summary",
          `AlphaWell_ExecutiveSummary_${wellParams.wellId || "Well"}.pdf`
        );
      } catch (e) {
        alert(`PDF failed: ${e.message}`);
      }
    };
    window.addEventListener("aw-export-exec-pdf", handler);
    return () => window.removeEventListener("aw-export-exec-pdf", handler);
  }, [wellParams.wellId]);

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl p-8 shadow">
        <p className="text-gray-700">
          Run <span className="font-semibold">Analyze</span> to generate your
          Executive Summary.
        </p>
      </div>
    );
  }

  /* -----------------------------------------
      Helper to format summary table cells
  ------------------------------------------*/
  const formatSummaryCell = (key, value) => {
    if (value === null || value === undefined || value === "") return "-";

    // Date-like keys
    if (String(key).toLowerCase().includes("date")) {
      const str = String(value);
      return str.length > 10 ? str.slice(0, 10) : str;
    }

    const num = Number(value);
    if (!Number.isNaN(num) && value !== true && value !== false) {
      return num.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      });
    }

    return String(value);
  };

  const isNumeric = (value) => {
    const num = Number(value);
    return !Number.isNaN(num) && value !== true && value !== false;
  };

  /* -----------------------------------------
      Download CSV for entire summary table
  ------------------------------------------*/
  const handleDownloadSummaryCsv = () => {
    if (!summaryRows.length) return;

    const headers = Object.keys(summaryRows[0]);
    const escapeVal = (v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      if (s.includes('"') || s.includes(",") || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const csvLines = [];
    csvLines.push(headers.join(","));
    summaryRows.forEach((row) => {
      const line = headers.map((h) => escapeVal(row[h])).join(",");
      csvLines.push(line);
    });

    const blob = new Blob([csvLines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alphawell-summary-report-${wellParams.wellId || "well"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* ========================================================================
      RENDER
  ========================================================================*/
  return (
    <div className="space-y-6" id="exec-summary">
      {/* --- Verdict Banner --- */}
      <div
        className={`rounded-xl p-6 ${
          kpis.verdict === "Drill"
            ? "bg-gradient-to-r from-green-500 to-emerald-600"
            : kpis.verdict === "Evaluate Further"
            ? "bg-gradient-to-r from-yellow-500 to-orange-600"
            : "bg-gradient-to-r from-red-500 to-pink-600"
        } text-white`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Decision: {kpis.verdict}
            </h2>
            <p className="text-lg opacity-90">ESG Risk: {kpis.esgRisk}</p>
          </div>
          <div className="text-right">
            {kpis.verdict === "Drill" ? (
              <CheckCircle className="w-16 h-16" />
            ) : (
              <AlertTriangle className="w-16 h-16" />
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setOpenEdit(true)}
            className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold"
          >
            Edit Parameters
          </button>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="NPV"
          icon={<DollarSign className="text-green-600" />}
          value={kpis.npv.toLocaleString()}
          desc="Net Present Value"
        />

        <KpiCard title="IRR" value={`${kpis.irr.toFixed(1)}%`} />

        <KpiCard
          title="EUR Oil"
          icon={<Droplet className="text-orange-600" />}
          value={`${(kpis.eurOil / 1000).toFixed(0)}K`}
          desc="bbl"
        />

        <KpiCard
          title="EUR Gas"
          icon={<Zap className="text-purple-600" />}
          value={`${(kpis.eurGas / 1000).toFixed(0)}K`}
          desc="mcf"
        />

        <KpiCard
          title="Total CO₂"
          icon={<Zap className="text-emerald-600" />}
          value={kpis.totalCO2.toFixed(0)}
          desc="tons"
        />

        <KpiCard
          title="Intensity"
          icon={<Activity className="text-teal-600" />}
          value={kpis.avgIntensity.toFixed(0)}
          desc="g CO₂e/BOE"
        />

        <KpiCard
          title="Carbon Credits"
          icon={<DollarSign className="text-green-600" />}
          value={`$${kpis.carbonCreditPotential.toFixed(0)}K`}
        />

        <KpiCard
          title="Payback"
          icon={<Calendar className="text-indigo-600" />}
          value={kpis.paybackMonths ?? "—"}
          desc="months"
        />
      </div>

      {/* =====================================================================
            PRODUCTION DECLINE GRAPH (S3 DATA)
      ===================================================================== */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">Production Decline Preview</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={remoteProduction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="gross_production_oil_bbls"
                stroke="#f97316"
                strokeWidth={2}
                name="Oil (bbl/mo)"
              />
              <Line
                type="monotone"
                dataKey="gross_production_wh_gas_mcf"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Gas (mcf/mo)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* =====================================================================
              CASHFLOW GRAPH (S3 DATA)
        ===================================================================== */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">Cumulative Cash Flow</h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={remoteCashflow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(v) => `$${(Number(v) / 1_000_000).toFixed(2)}M`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="cumulative_cash_flow"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.5}
                name="Cumulative CF ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =====================================================================
            SUMMARY REPORT TABLE (CENTER ALIGNED + PAGINATION)
      ===================================================================== */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">
            Monthly Summary Report
          </h3>

          <div className="flex items-center gap-2">
            {summaryRows.length > 0 && (
              <span className="text-[11px] text-slate-500 mr-2 hidden md:inline">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * rowsPerPage + 1}
                </span>{" "}
                –{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * rowsPerPage, summaryRows.length)}
                </span>{" "}
                of <span className="font-semibold">{summaryRows.length}</span>{" "}
                months
              </span>
            )}

            {summaryRows.length > 0 && (
              <button
                onClick={handleDownloadSummaryCsv}
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-700 transition-all"
              >
                Download CSV
              </button>
            )}
          </div>
        </div>

        {summaryLoading && (
          <p className="text-sm text-gray-500">Loading summary report…</p>
        )}

        {summaryError && <p className="text-sm text-red-600">{summaryError}</p>}

        {!summaryLoading && !summaryError && !summaryRows.length && (
          <p className="text-sm text-gray-500">
            Summary report is not available for this analysis run.
          </p>
        )}

        {summaryRows.length > 0 && (
          <>
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 shadow-inner">
              <table className="min-w-full text-xs md:text-sm">
                <thead className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-800 text-slate-50">
                  <tr className="border-b border-slate-700/60">
                    {Object.keys(summaryRows[0]).map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap text-center"
                      >
                        {col.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedSummaryRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        idx % 2 === 0 ? "bg-slate-50/40" : "bg-white"
                      } hover:bg-sky-50/80`}
                    >
                      {Object.keys(summaryRows[0]).map((col) => {
                        const raw = row[col];
                        const numeric = isNumeric(raw);
                        const numericVal = numeric ? Number(raw) : null;

                        const isCashLike =
                          col.toLowerCase().includes("cash") ||
                          col.toLowerCase().includes("nvp") ||
                          col.toLowerCase().includes("npv") ||
                          col.toLowerCase().includes("revenue");

                        let textColor = "text-slate-700";
                        if (numeric && isCashLike && numericVal > 0) {
                          textColor = "text-emerald-600 font-semibold";
                        } else if (numeric && numericVal < 0) {
                          textColor = "text-rose-600 font-semibold";
                        }

                        return (
                          <td
                            key={col}
                            className={`px-3 py-1.5 whitespace-nowrap text-center ${textColor} ${
                              numeric ? "tabular-nums" : ""
                            }`}
                          >
                            {formatSummaryCell(col, raw)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="mt-3 flex items-center justify-between text-[11px] md:text-xs text-slate-600">
              <div>
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * rowsPerPage + 1}
                </span>{" "}
                –{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * rowsPerPage, summaryRows.length)}
                </span>{" "}
                of <span className="font-semibold">{summaryRows.length}</span>{" "}
                months
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded-lg border text-xs font-medium ${
                    currentPage === 1
                      ? "border-slate-200 text-slate-300 cursor-not-allowed"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Previous
                </button>
                <span className="text-[11px] text-slate-500">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded-lg border text-xs font-medium ${
                    currentPage === totalPages
                      ? "border-slate-200 text-slate-300 cursor-not-allowed"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- WELL CHARACTERISTICS --- */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Well Characteristics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Char title="Formation" value={wellParams.formation} />
          <Char title="Trajectory" value={wellParams.trajectory} />
          <Char title="TVD" value={`${wellParams.tvd?.toLocaleString()} ft`} />
          <Char
            title="Lateral Length"
            value={`${wellParams.lateralLength?.toLocaleString()} ft`}
          />
          <Char
            title="CAPEX"
            value={`$${(economicParams.totalCAPEX / 1_000_000).toFixed(2)}M`}
          />
          <Char
            title="Fixed OPEX"
            value={`$${(economicParams.fixedOPEX / 1000).toFixed(0)}K/yr`}
          />
        </div>
      </div>

      <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
    </div>
  );
}

/* --------------------------------------------------------------------
      Small Reusable Components
--------------------------------------------------------------------- */

function KpiCard({ title, value, desc, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{title}</span>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
    </div>
  );
}

function Char({ title, value }) {
  return (
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
