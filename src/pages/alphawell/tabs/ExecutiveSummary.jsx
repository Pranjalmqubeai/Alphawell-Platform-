// import React, { useMemo, useEffect, useState } from "react";
// import {
//   Activity,
//   DollarSign,
//   Droplet,
//   Zap,
//   Calendar,
//   AlertTriangle,
//   CheckCircle,
//   MapPin,
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
//       Pagination for summary table
//       20 months (rows) per page
//   ------------------------------------------*/
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 20;

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [summaryRows]);

//   const totalPages = useMemo(() => {
//     if (!summaryRows.length) return 1;
//     return Math.max(1, Math.ceil(summaryRows.length / rowsPerPage));
//   }, [summaryRows, rowsPerPage]);

//   const pagedSummaryRows = useMemo(() => {
//     if (!summaryRows.length) return [];
//     const start = (currentPage - 1) * rowsPerPage;
//     const end = start + rowsPerPage;
//     return summaryRows.slice(start, end);
//   }, [summaryRows, currentPage, rowsPerPage]);

//   const handlePrevPage = () => {
//     setCurrentPage((p) => Math.max(1, p - 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage((p) => Math.min(totalPages, p + 1));
//   };

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
//       Helper to format summary / econ numbers
//   ------------------------------------------*/
//   const formatSummaryCell = (key, value) => {
//     if (value === null || value === undefined || value === "") return "-";

//     if (String(key).toLowerCase().includes("date")) {
//       const str = String(value);
//       return str.length > 10 ? str.slice(0, 10) : str;
//     }

//     const num = Number(value);
//     if (!Number.isNaN(num) && value !== true && value !== false) {
//       return num.toLocaleString(undefined, {
//         maximumFractionDigits: 2,
//       });
//     }

//     return String(value);
//   };

//   const isNumeric = (value) => {
//     const num = Number(value);
//     return !Number.isNaN(num) && value !== true && value !== false;
//   };

//   const formatEcon = (value, fractionDigits = 2) => {
//     if (value === null || value === undefined || value === "") return "-";
//     const num = Number(value);
//     if (Number.isNaN(num)) return String(value);
//     return num.toLocaleString(undefined, {
//       maximumFractionDigits: fractionDigits,
//       minimumFractionDigits: num % 1 === 0 ? 0 : fractionDigits,
//     });
//   };

//   /* -----------------------------------------
//       Download CSV for summary table
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

//     const blob = new Blob([csvLines.join("\n")], {
//       type: "text/csv;charset=utf-8",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `alphawell-summary-report-${wellParams.wellId || "well"}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   /* -----------------------------------------
//       NPV formatting: 2 decimal places
//   ------------------------------------------*/
//   const formattedNPV = Number(kpis.npv ?? 0).toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   /* -----------------------------------------
//       SUMMARY REPORT CHART HELPERS
//       - findSummaryKey: locate column in summaryRows (case-insensitive variants)
//       - moneyFormatter: format tooltip + axis labels
//   ------------------------------------------*/
//   const findSummaryKey = (candidates = []) => {
//     if (!summaryRows.length) return null;
//     const keys = Object.keys(summaryRows[0] || {});
//     const lowerToKey = keys.reduce((acc, k) => {
//       acc[k.toLowerCase()] = k;
//       return acc;
//     }, {});
//     for (const cand of candidates) {
//       const lower = cand.toLowerCase();
//       if (lowerToKey[lower]) return lowerToKey[lower];
//     }
//     // try fuzzy: find any key that includes candidate substring
//     for (const cand of candidates) {
//       const lower = cand.toLowerCase();
//       const found = keys.find((k) => k.toLowerCase().includes(lower));
//       if (found) return found;
//     }
//     return null;
//   };

//   const moneyFormatter = (v, decimals = 2, suffix = "") => {
//     const num = Number(v);
//     if (Number.isNaN(num)) return v;
//     // compact if large (but keep consistent): using toLocaleString with fixed decimals
//     return `$${num.toLocaleString(undefined, {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     })}${suffix}`;
//   };

//   // Detect likely column keys for Net Revenue & NPV
//   const netRevenueKey = useMemo(
//     () =>
//       findSummaryKey([
//         "net_revenue",
//         "net revenue",
//         "netrevenue",
//         "net_rev",
//         "netrevene",
//         "netrev",
//         "net revenue usd",
//         "net revenue ($)",
//       ]),
//     [summaryRows]
//   );

//   const npvKey = useMemo(
//     () =>
//       findSummaryKey([
//         "npv",
//         "nvp", // common typo
//         "net_present_value",
//         "net present value",
//         "npv_usd",
//         "npv ($)",
//       ]),
//     [summaryRows]
//   );

//   /* ========================================================================
//       RENDER
//   ========================================================================*/
//   return (
//     <div className="space-y-6" id="exec-summary">
//       {/* =====================================================================
//             WELL PARAMETERS PANEL
//       ===================================================================== */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50">
//               <MapPin className="w-4 h-4 text-sky-600" />
//             </span>
//             <h2 className="text-xl md:text-2xl font-bold text-slate-900">
//               Well Parameters
//             </h2>
//           </div>
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="cursor-pointer inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
//           >
//             Edit Parameters
//           </button>
//         </div>

//         <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
//           <EconPill label="Formation" value={wellParams.formation || "—"} />
//           <EconPill
//             label="Trajectory"
//             value={
//               wellParams.trajectory
//                 ? String(wellParams.trajectory).toUpperCase()
//                 : "—"
//             }
//           />
//           <EconPill
//             label="Latitude"
//             value={
//               wellParams.latitude != null ? wellParams.latitude.toFixed(4) : "—"
//             }
//           />
//           <EconPill
//             label="Longitude"
//             value={
//               wellParams.longitude != null
//                 ? wellParams.longitude.toFixed(4)
//                 : "—"
//             }
//           />
//           {/* <EconPill
//             label="TVD"
//             value={
//               wellParams.tvd != null
//                 ? `${Number(wellParams.tvd).toLocaleString()} ft`
//                 : "—"
//             }
//           /> */}

//           <EconPill
//             label="Radius"
//             value={`${Number(
//               wellParams.radiusMiles != null ? wellParams.radiusMiles : 15
//             ).toLocaleString()} mi`}
//           />
//           <EconPill
//             label="Prediction Horizon"
//             value={
//               wellParams.predictionHorizon
//                 ? `${wellParams.predictionHorizon} months`
//                 : "360 months"
//             }
//           />
//         </div>
//       </div>

//       {/* =====================================================================
//             ECONOMIC PARAMETERS PANEL (replaces Decision banner)
//       ===================================================================== */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
//               <DollarSign className="w-4 h-4 text-emerald-600" />
//             </span>
//             <h2 className="text-xl md:text-2xl font-bold text-slate-900">
//               Economic Parameters
//             </h2>
//           </div>
//         </div>

//         <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
//           <EconPill
//             label="Total CAPEX ($)"
//             value={formatEcon(economicParams.totalCAPEX, 0)}
//           />
//           <EconPill
//             label="Oil Price ($/bbl)"
//             value={formatEcon(economicParams.oilPrice)}
//           />
//           <EconPill
//             label="Gas Price ($/mcf)"
//             value={formatEcon(economicParams.gasPrice)}
//           />

//           <EconPill
//             label="Fixed OPEX ($/year)"
//             value={formatEcon(economicParams.fixedOPEX, 0)}
//           />
//           <EconPill label="Oil OPEX" value={formatEcon(economicParams.oilOPEX)} />
//           <EconPill label="Gas OPEX" value={formatEcon(economicParams.gasOPEX)} />

//           <EconPill
//             label="Water OPEX"
//             value={formatEcon(economicParams.waterOPEX)}
//           />
//           <EconPill label="Oil NRI" value={formatEcon(economicParams.oilNRI)} />
//           <EconPill label="Gas NRI" value={formatEcon(economicParams.gasNRI)} />

//           <EconPill
//             label="Discount Rate (%)"
//             value={formatEcon(economicParams.discountRate)}
//           />
//           <EconPill label="Ad Valorem" value={formatEcon(economicParams.adValorem)} />
//           <EconPill
//             label="Oil Sev Tax"
//             value={formatEcon(economicParams.oilSeverance)}
//           />
//           <EconPill
//             label="Gas Sev Tax"
//             value={formatEcon(economicParams.gasSeverance)}
//           />
//         </div>
//       </div>

//       {/* --- KPI CARDS --- */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <KpiCard
//           title={
//             <>
//               NPV{" "}
//               <span className="text-gray-500 font-semibold">
//                 (for 1st Month)
//               </span>
//             </>
//           }
//           icon={<DollarSign className="text-green-600" />}
//           value={`$${formattedNPV}`}
//           desc="Net Present Value"
//           valueColor="text-emerald-600"
//         />

//         <KpiCard
//           title="IRR"
//           icon={<DollarSign className="text-indigo-600" />}
//           value={`${kpis.irr.toFixed(1)}%`}
//           desc="Internal Rate of Return"
//           valueColor="text-indigo-600"
//         />

//         <KpiCard
//           title="EUR Oil"
//           icon={<Droplet className="text-orange-600" />}
//           value={
//             <>
//               {(kpis.eurOil / 1000).toFixed(0)}K
//               <span className="text-gray-500 text-2xl font-normal ml-2">
//                 (bbl)
//               </span>
//             </>
//           }
//           valueColor="text-orange-600"
//         />

//         <KpiCard
//           title="EUR Gas"
//           icon={<Zap className="text-purple-600" />}
//           value={
//             <>
//               {(kpis.eurGas / 1000).toFixed(0)}K
//               <span className="text-gray-500 text-2xl font-normal ml-2">
//                 (mcf)
//               </span>
//             </>
//           }
//           valueColor="text-purple-600"
//         />

//         <KpiCard
//           title="Total CO₂"
//           icon={<Zap className="text-emerald-600" />}
//           value={
//             <>
//               {kpis.totalCO2.toFixed(0)}{" "}
//               <span className="text-gray-500 text-2xl font-normal ml-1">
//                 (tons)
//               </span>
//             </>
//           }
//           valueColor="text-emerald-600"
//         />

//         <KpiCard
//           title="Carbon Emission Intensity"
//           icon={<Activity className="text-teal-600" />}
//           value={
//             <>
//               {kpis.avgIntensity.toFixed(0)}
//               <span className="text-gray-500 text-2xl font-normal ml-1">
//                 (t CO₂e/BOE)
//               </span>
//             </>
//           }
//           valueColor="text-teal-600"
//         />

//         <KpiCard
//           title="Payback"
//           icon={<Calendar className="text-sky-600" />}
//           value={kpis.paybackMonths ?? "—"}
//           desc="months"
//           valueColor="text-sky-600"
//         />
//       </div>

//       {/* =====================================================================
//       PRODUCTION DECLINE GRAPH (S3 DATA) — SEPARATE OIL, GAS & WATER
// ===================================================================== */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold mb-1">Production Forecast</h3>
//           <p className="text-xs text-slate-500 mb-4">
//             Separate decline curves for oil, gas, and water with units.
//           </p>

//           <div className="space-y-6">
//             {/* OIL CHART */}
//             <div>
//               <h4 className="text-sm font-semibold text-slate-800 mb-2">
//                 Oil Production (bbl/month)
//               </h4>
//               <ResponsiveContainer width="100%" height={140}>
//                 <LineChart data={remoteProduction}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="month"
//                     label={{
//                       value: "Month",
//                       position: "insideBottom",
//                       offset: -4,
//                     }}
//                   />
//                   <YAxis
//                     label={{
//                       value: "bbl/month",
//                       angle: -90,
//                       position: "insideLeft",
//                     }}
//                   />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="gross_production_oil_bbls"
//                     stroke="#f97316"
//                     strokeWidth={2}
//                     name="Oil (bbl/mo)"
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* GAS CHART */}
//             <div>
//               <h4 className="text-sm font-semibold text-slate-800 mb-2">
//                 Gas Production (mcf/month)
//               </h4>
//               <ResponsiveContainer width="100%" height={140}>
//                 <LineChart data={remoteProduction}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="month"
//                     label={{
//                       value: "Month",
//                       position: "insideBottom",
//                       offset: -4,
//                     }}
//                   />
//                   <YAxis
//                     label={{
//                       value: "mcf/month",
//                       angle: -90,
//                       position: "insideLeft",
//                     }}
//                   />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="gross_production_wh_gas_mcf"
//                     stroke="#8b5cf6"
//                     strokeWidth={2}
//                     name="Gas (mcf/mo)"
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* WATER CHART ✅ new */}
//             <div>
//               <h4 className="text-sm font-semibold text-slate-800 mb-2">
//                 Water Production (bbl/month)
//               </h4>
//               <ResponsiveContainer width="100%" height={140}>
//                 <LineChart data={remoteProduction}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="month"
//                     label={{
//                       value: "Month",
//                       position: "insideBottom",
//                       offset: -4,
//                     }}
//                   />
//                   <YAxis
//                     label={{
//                       value: "bbl/month",
//                       angle: -90,
//                       position: "insideLeft",
//                     }}
//                   />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="gross_production_water_bbls"
//                     stroke="#0ea5e9"
//                     strokeWidth={2}
//                     name="Water (bbl/mo)"
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* =====================================================================
//         CASHFLOW GRAPH (S3 DATA) — increased height to reduce empty space below
//   ===================================================================== */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold mb-4">Cumulative Cash Flow</h3>

//           {/* Height increased from 300 -> 420 to occupy more vertical space */}
//           <ResponsiveContainer width="100%" height={420}>
//             <AreaChart data={remoteCashflow}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="month"
//                 label={{
//                   value: "Month",
//                   position: "insideBottom",
//                   offset: -4,
//                 }}
//               />
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
//           NEW: Net Revenue & NPV Charts (using summaryRows)
//           Placed immediately after the Cumulative Cash Flow section.
//           Auto-detects likely column names in the summaryRows.
//       ===================================================================== */}
//       {(summaryRows.length > 0 && (netRevenueKey || npvKey)) && (
//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Net Revenue Chart (if key found) */}
//           {netRevenueKey && (
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-lg font-bold mb-2">Net Revenue</h3>
//               <ResponsiveContainer width="100%" height={280}>
//                 <AreaChart data={summaryRows}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="month"
//                     label={{ value: "Month", position: "insideBottom", offset: -4 }}
//                   />
//                   <YAxis
//                     tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
//                     label={{ value: "Net Revenue ($)", angle: -90, position: "insideLeft", offset: 10 }}
//                   />
//                   <Tooltip
//                     formatter={(value) => moneyFormatter(value, 2)}
//                   />
//                   <Legend />
//                   <Area
//                     type="monotone"
//                     dataKey={netRevenueKey}
//                     stroke="#2563eb"
//                     fill="#bfdbfe"
//                     fillOpacity={0.6}
//                     name="Net Revenue ($)"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           )}

//           {/* NPV Chart (if key found) */}
//           {npvKey && (
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <h3 className="text-lg font-bold mb-2">NPV </h3>
//               <ResponsiveContainer width="100%" height={280}>
//                 <LineChart data={summaryRows}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="month"
//                     label={{ value: "Month", position: "insideBottom", offset: -4 }}
//                   />
//                   <YAxis
//                     tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
//                     label={{ value: "NPV ($)", angle: -90, position: "insideLeft", offset: 10 }}
//                   />
//                   <Tooltip
//                     formatter={(value) => moneyFormatter(value, 2)}
//                   />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey={npvKey}
//                     stroke="#10b981"
//                     strokeWidth={2}
//                     dot={false}
//                     name="NPV ($)"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </div>
//       )}

//       {/* =====================================================================
//             SUMMARY REPORT TABLE (WITH PAGINATION)
//       ===================================================================== */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="text-lg font-bold text-gray-900">
//             Monthly Summary Report
//           </h3>

//           <div className="flex items-center gap-2">
//             {summaryRows.length > 0 && (
//               <span className="hidden md:inline text-[11px] text-slate-500 mr-2">
//                 Showing{" "}
//                 <span className="font-semibold">
//                   {(currentPage - 1) * rowsPerPage + 1}
//                 </span>{" "}
//                 –{" "}
//                 <span className="font-semibold">
//                   {Math.min(currentPage * rowsPerPage, summaryRows.length)}
//                 </span>{" "}
//                 of <span className="font-semibold">{summaryRows.length}</span>{" "}
//                 months
//               </span>
//             )}

//             {summaryRows.length > 0 && (
//               <button
//                 onClick={handleDownloadSummaryCsv}
//                 className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-700 transition-all"
//               >
//                 Download CSV
//               </button>
//             )}
//           </div>
//         </div>

//         {summaryLoading && (
//           <p className="text-sm text-gray-500">Loading summary report…</p>
//         )}

//         {summaryError && <p className="text-sm text-red-600">{summaryError}</p>}

//         {!summaryLoading && !summaryError && !summaryRows.length && (
//           <p className="text-sm text-gray-500">
//             Summary report is not available for this analysis run.
//           </p>
//         )}

//         {summaryRows.length > 0 && (
//           <>
//             <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 shadow-inner">
//               <table className="min-w-full text-xs md:text-sm">
//                 <thead className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-800 text-slate-50">
//                   <tr className="border-b border-slate-700/60">
//                     {Object.keys(summaryRows[0]).map((col) => (
//                       <th
//                         key={col}
//                         className="px-3 py-2 font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap text-center"
//                       >
//                         {col.replace(/_/g, " ")}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {pagedSummaryRows.map((row, idx) => (
//                     <tr
//                       key={idx}
//                       className={`transition-colors ${
//                         idx % 2 === 0 ? "bg-slate-50/40" : "bg-white"
//                       } hover:bg-sky-50/80`}
//                     >
//                       {Object.keys(summaryRows[0]).map((col) => {
//                         const raw = row[col];
//                         const numeric = isNumeric(raw);
//                         const numericVal = numeric ? Number(raw) : null;

//                         const isCashLike =
//                           col.toLowerCase().includes("cash") ||
//                           col.toLowerCase().includes("nvp") ||
//                           col.toLowerCase().includes("npv") ||
//                           col.toLowerCase().includes("revenue");

//                         let textColor = "text-slate-700";
//                         if (numeric && isCashLike && numericVal > 0) {
//                           textColor = "text-emerald-600 font-semibold";
//                         } else if (numeric && numericVal < 0) {
//                           textColor = "text-rose-600 font-semibold";
//                         }

//                         return (
//                           <td
//                             key={col}
//                             className={`px-3 py-1.5 whitespace-nowrap text-center ${textColor} ${
//                               numeric ? "tabular-nums" : ""
//                             }`}
//                           >
//                             {formatSummaryCell(col, raw)}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination controls */}
//             <div className="mt-3 flex items-center justify-between text-[11px] md:text-xs text-slate-600">
//               <div>
//                 Showing{" "}
//                 <span className="font-semibold">
//                   {(currentPage - 1) * rowsPerPage + 1}
//                 </span>{" "}
//                 –{" "}
//                 <span className="font-semibold">
//                   {Math.min(currentPage * rowsPerPage, summaryRows.length)}
//                 </span>{" "}
//                 of <span className="font-semibold">{summaryRows.length}</span>{" "}
//                 months
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={handlePrevPage}
//                   disabled={currentPage === 1}
//                   className={`px-2 py-1 rounded-lg border text-xs font-medium ${
//                     currentPage === 1
//                       ? "border-slate-200 text-slate-300 cursor-not-allowed"
//                       : "border-slate-300 text-slate-700 hover:bg-slate-50"
//                   }`}
//                 >
//                   Previous
//                 </button>
//                 <span className="text-[11px] text-slate-500">
//                   Page <span className="font-semibold">{currentPage}</span> of{" "}
//                   <span className="font-semibold">{totalPages}</span>
//                 </span>
//                 <button
//                   onClick={handleNextPage}
//                   disabled={currentPage === totalPages}
//                   className={`px-2 py-1 rounded-lg border text-xs font-medium ${
//                     currentPage === totalPages
//                       ? "border-slate-200 text-slate-300 cursor-not-allowed"
//                       : "border-slate-300 text-slate-700 hover:bg-slate-50"
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* --- WELL CHARACTERISTICS --- */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold mb-4">Well Characteristics</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Char title="Formation" value={wellParams.formation} />
//           <Char title="Trajectory" value={wellParams.trajectory} />
//           {/* <Char
//             title="TVD"
//             value={`${wellParams.tvd?.toLocaleString()} ft`}
//           />
//           <Char
//             title="Lateral Length"
//             value={`${wellParams.lateralLength?.toLocaleString()} ft`}
//           /> */}
//           <Char
//             title="CAPEX"
//             value={`$${(economicParams.totalCAPEX / 1_000_000).toFixed(2)}M`}
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

// function KpiCard({ title, value, desc, icon, valueColor = "text-slate-900" }) {
//   return (
//     <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-2">
//         {/* Top: what is being measured (large, like Production tiles) */}
//         <p className="text-xl md:text-2xl font-extrabold text-slate-900">
//           {title}
//         </p>
//         {icon && (
//           <span className="ml-2 flex items-center justify-center">{icon}</span>
//         )}
//       </div>

//       {/* Middle: numeric value (largest + colored) */}
//       <p className={`mt-1 text-3xl md:text-4xl font-extrabold ${valueColor}`}>
//         {value}
//       </p>

//       {/* Bottom: unit / description (large, <= value size) */}
//       {desc && (
//         <p className="mt-2 text-lg md:text-xl font-semibold text-slate-500">
//           {desc}
//         </p>
//       )}
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

// /* pill used in Economic Parameters panel */
// function EconPill({ label, value }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm">
//       <span className="text-slate-500 font-medium">{label}</span>
//       <span className="text-slate-900 font-semibold tabular-nums">{value}</span>
//     </div>
//   );
// }

// import React, { useMemo, useEffect, useState } from "react";
// import {
//   Activity,
//   DollarSign,
//   Droplet,
//   Zap,
//   Calendar,
//   AlertTriangle,
//   CheckCircle,
//   MapPin,
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
//       Pagination for summary table
//       20 months (rows) per page
//   ------------------------------------------*/
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 20;

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [summaryRows]);

//   const totalPages = useMemo(() => {
//     if (!summaryRows.length) return 1;
//     return Math.max(1, Math.ceil(summaryRows.length / rowsPerPage));
//   }, [summaryRows, rowsPerPage]);

//   const pagedSummaryRows = useMemo(() => {
//     if (!summaryRows.length) return [];
//     const start = (currentPage - 1) * rowsPerPage;
//     const end = start + rowsPerPage;
//     return summaryRows.slice(start, end);
//   }, [summaryRows, currentPage, rowsPerPage]);

//   const handlePrevPage = () => {
//     setCurrentPage((p) => Math.max(1, p - 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage((p) => Math.min(totalPages, p + 1));
//   };

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
//       Helper to format summary / econ numbers
//   ------------------------------------------*/
//   const formatSummaryCell = (key, value) => {
//     if (value === null || value === undefined || value === "") return "-";

//     const lowerKey = String(key).toLowerCase();

//     // --- MONTH: always show integer, no decimals ---
//     if (lowerKey === "month") {
//       const n = Number(value);
//       return Number.isNaN(n) ? value : n.toString();
//     }

//     // --- DATE: trim ---
//     if (lowerKey.includes("date")) {
//       const str = String(value);
//       return str.length > 10 ? str.slice(0, 10) : str;
//     }

//     // --- Normal Numeric fields (2 decimal places) ---
//     const num = Number(value);
//     if (!Number.isNaN(num) && value !== true && value !== false) {
//       return num.toLocaleString(undefined, {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       });
//     }

//     return String(value);
//   };

//   const isNumeric = (value) => {
//     const num = Number(value);
//     return !Number.isNaN(num) && value !== true && value !== false;
//   };

//   const formatEcon = (value, fractionDigits = 2) => {
//     if (value === null || value === undefined || value === "") return "-";
//     const num = Number(value);
//     if (Number.isNaN(num)) return String(value);
//     return num.toLocaleString(undefined, {
//       maximumFractionDigits: fractionDigits,
//       minimumFractionDigits: num % 1 === 0 ? 0 : fractionDigits,
//     });
//   };

//   /* -----------------------------------------
//       Download CSV for summary table
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

//     const blob = new Blob([csvLines.join("\n")], {
//       type: "text/csv;charset=utf-8",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `alphawell-summary-report-${wellParams.wellId || "well"}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   };

//   /* -----------------------------------------
//       NPV formatting: 2 decimal places
//   ------------------------------------------*/
//   const formattedNPV = Number(kpis.npv ?? 0).toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   /* -----------------------------------------
//       SUMMARY REPORT CHART HELPERS
//       - findSummaryKey: locate column in summaryRows (case-insensitive variants)
//       - moneyFormatter: format tooltip + axis labels
//   ------------------------------------------*/
//   const findSummaryKey = (candidates = []) => {
//     if (!summaryRows.length) return null;
//     const keys = Object.keys(summaryRows[0] || {});
//     const lowerToKey = keys.reduce((acc, k) => {
//       acc[k.toLowerCase()] = k;
//       return acc;
//     }, {});
//     for (const cand of candidates) {
//       const lower = cand.toLowerCase();
//       if (lowerToKey[lower]) return lowerToKey[lower];
//     }
//     // try fuzzy: find any key that includes candidate substring
//     for (const cand of candidates) {
//       const lower = cand.toLowerCase();
//       const found = keys.find((k) => k.toLowerCase().includes(lower));
//       if (found) return found;
//     }
//     return null;
//   };

//   const moneyFormatter = (v, decimals = 2, suffix = "") => {
//     const num = Number(v);
//     if (Number.isNaN(num)) return v;
//     // compact if large (but keep consistent): using toLocaleString with fixed decimals
//     return `$${num.toLocaleString(undefined, {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     })}${suffix}`;
//   };

//   // Detect likely column keys for Net Revenue & NPV
//   const netRevenueKey = useMemo(
//     () =>
//       findSummaryKey([
//         "net_revenue",
//         "net revenue",
//         "netrevenue",
//         "net_rev",
//         "netrevene",
//         "netrev",
//         "net revenue usd",
//         "net revenue ($)",
//       ]),
//     [summaryRows]
//   );

//   const npvKey = useMemo(
//     () =>
//       findSummaryKey([
//         "npv",
//         "nvp", // common typo
//         "net_present_value",
//         "net present value",
//         "npv_usd",
//         "npv ($)",
//       ]),
//     [summaryRows]
//   );

//   /* ========================================================================
//       RENDER
//   ========================================================================*/
//   return (
//     <div className="space-y-6" id="exec-summary">
//       {/* =====================================================================
//             WELL PARAMETERS PANEL
//       ===================================================================== */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50">
//               <MapPin className="w-4 h-4 text-sky-600" />
//             </span>
//             <h2 className="text-xl md:text-2xl font-bold text-slate-900">
//               Well Parameters
//             </h2>
//           </div>
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="cursor-pointer inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
//           >
//             Edit Parameters
//           </button>
//         </div>

//         <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
//           <EconPill label="Formation" value={wellParams.formation || "—"} />
//           <EconPill
//             label="Trajectory"
//             value={
//               wellParams.trajectory
//                 ? String(wellParams.trajectory).toUpperCase()
//                 : "—"
//             }
//           />
//           <EconPill
//             label="Latitude"
//             value={
//               wellParams.latitude != null ? wellParams.latitude.toFixed(4) : "—"
//             }
//           />
//           <EconPill
//             label="Longitude"
//             value={
//               wellParams.longitude != null
//                 ? wellParams.longitude.toFixed(4)
//                 : "—"
//             }
//           />
//           {/* <EconPill
//             label="TVD"
//             value={
//               wellParams.tvd != null
//                 ? `${Number(wellParams.tvd).toLocaleString()} ft`
//                 : "—"
//             }
//           /> */}

//           <EconPill
//             label="Radius"
//             value={`${Number(
//               wellParams.radiusMiles != null ? wellParams.radiusMiles : 15
//             ).toLocaleString()} mi`}
//           />
//           <EconPill
//             label="Prediction Horizon"
//             value={
//               wellParams.predictionHorizon
//                 ? `${wellParams.predictionHorizon} months`
//                 : "360 months"
//             }
//           />
//         </div>
//       </div>

//       {/* =====================================================================
//             ECONOMIC PARAMETERS PANEL (replaces Decision banner)
//       ===================================================================== */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
//               <DollarSign className="w-4 h-4 text-emerald-600" />
//             </span>
//             <h2 className="text-xl md:text-2xl font-bold text-slate-900">
//               Economic Parameters
//             </h2>
//           </div>
//         </div>

//         <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
//           <EconPill
//             label="Total CAPEX ($)"
//             value={formatEcon(economicParams.totalCAPEX, 0)}
//           />
//           <EconPill
//             label="Oil Price ($/bbl)"
//             value={formatEcon(economicParams.oilPrice)}
//           />
//           <EconPill
//             label="Gas Price ($/mcf)"
//             value={formatEcon(economicParams.gasPrice)}
//           />

//           <EconPill
//             label="Fixed OPEX ($/year)"
//             value={formatEcon(economicParams.fixedOPEX, 0)}
//           />
//           <EconPill
//             label="Oil OPEX"
//             value={formatEcon(economicParams.oilOPEX)}
//           />
//           <EconPill
//             label="Gas OPEX"
//             value={formatEcon(economicParams.gasOPEX)}
//           />

//           <EconPill
//             label="Water OPEX"
//             value={formatEcon(economicParams.waterOPEX)}
//           />
//           <EconPill label="Oil NRI" value={formatEcon(economicParams.oilNRI)} />
//           <EconPill label="Gas NRI" value={formatEcon(economicParams.gasNRI)} />

//           <EconPill
//             label="Discount Rate (%)"
//             value={formatEcon(economicParams.discountRate)}
//           />
//           <EconPill
//             label="Ad Valorem"
//             value={formatEcon(economicParams.adValorem)}
//           />
//           <EconPill
//             label="Oil Sev Tax"
//             value={formatEcon(economicParams.oilSeverance)}
//           />
//           <EconPill
//             label="Gas Sev Tax"
//             value={formatEcon(economicParams.gasSeverance)}
//           />
//         </div>
//       </div>

//       {/* --- KPI CARDS --- */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <KpiCard
//           title={
//             <>
//               NPV{" "}
//               <span className="text-gray-500 font-semibold">
//                 (for 1st Month)
//               </span>
//             </>
//           }
//           icon={<DollarSign className="text-green-600" />}
//           value={`$${formattedNPV}`}
//           desc="Net Present Value"
//           valueColor="text-emerald-600"
//         />

//         <KpiCard
//           title="IRR"
//           icon={<DollarSign className="text-indigo-600" />}
//           value={`${kpis.irr.toFixed(1)}%`}
//           desc="Internal Rate of Return"
//           valueColor="text-indigo-600"
//         />

//         <KpiCard
//           title="EUR Oil"
//           icon={<Droplet className="text-orange-600" />}
//           value={
//             <>
//               {(kpis.eurOil / 1000).toFixed(0)}K
//               <span className="text-gray-500 text-2xl font-normal ml-2">
//                 (bbl)
//               </span>
//             </>
//           }
//           valueColor="text-orange-600"
//         />

//         <KpiCard
//           title="EUR Gas"
//           icon={<Zap className="text-purple-600" />}
//           value={
//             <>
//               {(kpis.eurGas / 1000).toFixed(0)}K
//               <span className="text-gray-500 text-2xl font-normal ml-2">
//                 (mcf)
//               </span>
//             </>
//           }
//           valueColor="text-purple-600"
//         />

//         <KpiCard
//           title="Total CO₂"
//           icon={<Zap className="text-emerald-600" />}
//           value={
//             <>
//               {kpis.totalCO2.toFixed(0)}{" "}
//               <span className="text-gray-500 text-2xl font-normal ml-1">
//                 (tons)
//               </span>
//             </>
//           }
//           valueColor="text-emerald-600"
//         />

//         <KpiCard
//           title="Carbon Emission Intensity"
//           icon={<Activity className="text-teal-600" />}
//           value={
//             <>
//               {kpis.avgIntensity.toFixed(0)}
//               <span className="text-gray-500 text-2xl font-normal ml-1">
//                 (t CO₂e/BOE)
//               </span>
//             </>
//           }
//           valueColor="text-teal-600"
//         />

//         <KpiCard
//           title="Payback"
//           icon={<Calendar className="text-sky-600" />}
//           value={kpis.paybackMonths ?? "—"}
//           desc="months"
//           valueColor="text-sky-600"
//         />
//       </div>

//       {/* =====================================================================
//       PRODUCTION DECLINE GRAPH (S3 DATA) — SEPARATE OIL, GAS & WATER
// ===================================================================== */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold mb-1">Production Forecast</h3>
//           <p className="text-xs text-slate-500 mb-4">
//             Separate decline curves for oil, gas, and water with units.
//           </p>

//           <div className="space-y-6">
//             {/* OIL CHART */}
//             <div>
//               <h4 className="text-sm font-semibold text-slate-800 mb-2">
//                 Oil Production (bbl/month)
//               </h4>
//               <ResponsiveContainer width="100%" height={140}>
//                 <LineChart data={remoteProduction}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="gross_production_oil_bbls"
//                     stroke="#f97316"
//                     strokeWidth={2}
//                     name="Oil (bbl/mo)"
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* GAS CHART */}
//             <div>
//               <h4 className="text-sm font-semibold text-slate-800 mb-2">
//                 Gas Production (mcf/month)
//               </h4>
//               <ResponsiveContainer width="100%" height={140}>
//                 <LineChart data={remoteProduction}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="gross_production_wh_gas_mcf"
//                     stroke="#8b5cf6"
//                     strokeWidth={2}
//                     name="Gas (mcf/mo)"
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* WATER CHART ✅ new */}
//             <div>
//               <h4 className="text-sm font-semibold text-slate-800 mb-2">
//                 Water Production (bbl/month)
//               </h4>
//               <ResponsiveContainer width="100%" height={140}>
//                 <LineChart data={remoteProduction}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="month"
//                     label={{
//                       // value: "Month",
//                       position: "insideBottom",
//                       offset: -4,
//                     }}
//                   />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="gross_production_water_bbls"
//                     stroke="#0ea5e9"
//                     strokeWidth={2}
//                     name="Water (bbl/mo)"
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* =====================================================================
//         ECONOMIC FORECAST: Cumulative Cash Flow + Net Revenue + NPV (stacked)
//   ===================================================================== */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-2">
//             <div>
//               <h3 className="text-lg font-bold">Economic Forecast</h3>
//               <p className="text-xs text-slate-500">
//                 Cashflow, Net Revenue & NPV
//               </p>
//             </div>
//             {/* optional: show summary presence */}
//             <div className="text-right text-xs text-slate-400">
//               {remoteCashflow.length > 0 ? (
//                 <div>Cashflow: {remoteCashflow.length} months</div>
//               ) : (
//                 <div>Cashflow not available</div>
//               )}
//               {summaryRows.length > 0 ? (
//                 <div>Summary: {summaryRows.length} months</div>
//               ) : (
//                 <div>Summary not available</div>
//               )}
//             </div>
//           </div>

//           {/* Cumulative Cash Flow (top) */}
//           <div className="mb-6">
//             <h4 className="text-sm font-semibold text-slate-800 mb-2">
//               Cumulative Cash Flow ($/month)
//             </h4>
//             <ResponsiveContainer width="100%" height={180}>
//               <AreaChart data={remoteCashflow}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip
//                   formatter={(v) => `$${(Number(v) / 1_000_000).toFixed(2)}M`}
//                 />
//                 <Legend />
//                 <Area
//                   type="monotone"
//                   dataKey="cumulative_cash_flow"
//                   stroke="#10b981"
//                   fill="#10b981"
//                   fillOpacity={0.5}
//                   name="Cumulative CF ($)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Net Revenue (if present) */}
//           {netRevenueKey && summaryRows.length > 0 && (
//             <div className="mb-6">
//               <h4 className="text-sm font-semibold text-slate-800 mb-2">
//                 Net Revenue($/month)
//               </h4>
//               <ResponsiveContainer width="100%" height={150}>
//                 <AreaChart data={summaryRows}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis
//                     tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
//                   />
//                   <Tooltip formatter={(value) => moneyFormatter(value, 2)} />
//                   <Legend />
//                   <Area
//                     type="monotone"
//                     dataKey={netRevenueKey}
//                     stroke="#2563eb"
//                     fill="#bfdbfe"
//                     fillOpacity={0.6}
//                     name="Net Revenue ($)"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           )}

//           {/* NPV (if present) */}
//           {npvKey && summaryRows.length > 0 && (
//             <div>
//               <h4 className="text-sm font-semibold text-slate-800 mb-2">
//                 NPV($/month)
//               </h4>
//               <ResponsiveContainer width="100%" height={150}>
//                 <LineChart data={summaryRows}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis
//                     tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
//                   />
//                   <Tooltip formatter={(value) => moneyFormatter(value, 2)} />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey={npvKey}
//                     stroke="#10b981"
//                     strokeWidth={2}
//                     dot={false}
//                     name="NPV ($)"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* =====================================================================
//             SUMMARY REPORT TABLE (WITH PAGINATION)
//       ===================================================================== */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-3">
//           <h3 className="text-lg font-bold text-gray-900">
//             Monthly Summary Report
//           </h3>

//           <div className="flex items-center gap-2">
//             {summaryRows.length > 0 && (
//               <span className="hidden md:inline text-[11px] text-slate-500 mr-2">
//                 Showing{" "}
//                 <span className="font-semibold">
//                   {(currentPage - 1) * rowsPerPage + 1}
//                 </span>{" "}
//                 –{" "}
//                 <span className="font-semibold">
//                   {Math.min(currentPage * rowsPerPage, summaryRows.length)}
//                 </span>{" "}
//                 of <span className="font-semibold">{summaryRows.length}</span>{" "}
//                 months
//               </span>
//             )}

//             {summaryRows.length > 0 && (
//               <button
//                 onClick={handleDownloadSummaryCsv}
//                 className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-700 transition-all"
//               >
//                 Download CSV
//               </button>
//             )}
//           </div>
//         </div>

//         {summaryLoading && (
//           <p className="text-sm text-gray-500">Loading summary report…</p>
//         )}

//         {summaryError && <p className="text-sm text-red-600">{summaryError}</p>}

//         {!summaryLoading && !summaryError && !summaryRows.length && (
//           <p className="text-sm text-gray-500">
//             Summary report is not available for this analysis run.
//           </p>
//         )}

//         {summaryRows.length > 0 && (
//           <>
//             <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 shadow-inner">
//               <table className="min-w-full text-xs md:text-sm">
//                 {/* table */}
//                 <thead className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-800 text-slate-50">
//                   <tr className="border-b border-slate-700/60">
//                     {Object.keys(summaryRows[0]).map((col) => {
//                       const label = col.replace(/_/g, " ");
//                       const lower = col.toLowerCase();

//                       // heuristic: treat headers containing any of these substrings as numeric
//                       const numericHeaderCandidates = [
//                         "cash",
//                         "cumulative",
//                         "revenue",
//                         "net",
//                         "npv",
//                         "nvp",
//                         "production",
//                         "oil",
//                         "gas",
//                         "water",
//                         "mcf",
//                         "bbl",
//                         "usd",
//                         "amount",
//                         "value",
//                         "month", // you may want month numeric aligned — keep if desired
//                         "count",
//                         "total",
//                       ];

//                       const isNumericHeader =
//                         numericHeaderCandidates.some((c) =>
//                           lower.includes(c)
//                         ) && !lower.includes("date"); // don't treat date as numeric

//                       return (
//                         <th
//                           key={col}
//                           className={`px-3 py-2 font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap ${
//                             isNumericHeader ? "text-right" : "text-left"
//                           }`}
//                         >
//                           {label}
//                         </th>
//                       );
//                     })}
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {pagedSummaryRows.map((row, idx) => (
//                     <tr
//                       key={idx}
//                       className={`transition-colors ${
//                         idx % 2 === 0 ? "bg-slate-50/40" : "bg-white"
//                       } hover:bg-sky-50/80`}
//                     >
//                       {Object.keys(summaryRows[0]).map((col) => {
//                         const raw = row[col];
//                         const numeric = isNumeric(raw);
//                         const numericVal = numeric ? Number(raw) : null;

//                         const isCashLike =
//                           col.toLowerCase().includes("cash") ||
//                           col.toLowerCase().includes("nvp") ||
//                           col.toLowerCase().includes("npv") ||
//                           col.toLowerCase().includes("revenue") ||
//                           col.toLowerCase().includes("cumulative") ||
//                           col.toLowerCase().includes("total") ||
//                           col.toLowerCase().includes("value");

//                         let textColor = "text-slate-700";
//                         if (numeric && isCashLike && numericVal > 0) {
//                           textColor = "text-emerald-600 font-semibold";
//                         } else if (numeric && numericVal < 0) {
//                           textColor = "text-rose-600 font-semibold";
//                         }

//                         return (
//                           <td
//                             key={col}
//                             className={`px-3 py-1.5 whitespace-nowrap ${
//                               numeric ? "text-right tabular-nums" : "text-left"
//                             } ${textColor}`}
//                           >
//                             {formatSummaryCell(col, raw)}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination controls */}
//             <div className="mt-3 flex items-center justify-between text-[11px] md:text-xs text-slate-600">
//               <div>
//                 Showing{" "}
//                 <span className="font-semibold">
//                   {(currentPage - 1) * rowsPerPage + 1}
//                 </span>{" "}
//                 –{" "}
//                 <span className="font-semibold">
//                   {Math.min(currentPage * rowsPerPage, summaryRows.length)}
//                 </span>{" "}
//                 of <span className="font-semibold">{summaryRows.length}</span>{" "}
//                 months
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={handlePrevPage}
//                   disabled={currentPage === 1}
//                   className={`px-2 py-1 rounded-lg border text-xs font-medium ${
//                     currentPage === 1
//                       ? "border-slate-200 text-slate-300 cursor-not-allowed"
//                       : "border-slate-300 text-slate-700 hover:bg-slate-50"
//                   }`}
//                 >
//                   Previous
//                 </button>
//                 <span className="text-[11px] text-slate-500">
//                   Page <span className="font-semibold">{currentPage}</span> of{" "}
//                   <span className="font-semibold">{totalPages}</span>
//                 </span>
//                 <button
//                   onClick={handleNextPage}
//                   disabled={currentPage === totalPages}
//                   className={`px-2 py-1 rounded-lg border text-xs font-medium ${
//                     currentPage === totalPages
//                       ? "border-slate-200 text-slate-300 cursor-not-allowed"
//                       : "border-slate-300 text-slate-700 hover:bg-slate-50"
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
//     </div>
//   );
// }

// /* --------------------------------------------------------------------
//       Small Reusable Components
// --------------------------------------------------------------------- */

// function KpiCard({ title, value, desc, icon, valueColor = "text-slate-900" }) {
//   return (
//     <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-2">
//         {/* Top: what is being measured (large, like Production tiles) */}
//         <p className="text-xl md:text-2xl font-extrabold text-slate-900">
//           {title}
//         </p>
//         {icon && (
//           <span className="ml-2 flex items-center justify-center">{icon}</span>
//         )}
//       </div>

//       {/* Middle: numeric value (largest + colored) */}
//       <p className={`mt-1 text-3xl md:text-3xl font-extrabold ${valueColor}`}>
//         {value}
//       </p>

//       {/* Bottom: unit / description (large, <= value size) */}
//       {desc && (
//         <p className="mt-2 text-lg md:text-xl font-semibold text-slate-500">
//           {desc}
//         </p>
//       )}
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

// /* pill used in Economic Parameters panel */
// function EconPill({ label, value }) {
//   return (
//     <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm">
//       <span className="text-slate-500 font-medium">{label}</span>
//       <span className="text-slate-900 font-semibold tabular-nums">{value}</span>
//     </div>
//   );
// }

import React, { useMemo, useEffect, useState } from "react";
import {
  Activity,
  DollarSign,
  Droplet,
  Zap,
  Calendar,
  AlertTriangle,
  CheckCircle,
  MapPin,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
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
      Pie Chart Data (unchanged, still available)
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
      PDF Export Hook (unchanged)
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
      Helper to format summary / econ numbers
  ------------------------------------------*/
  const formatSummaryCell = (key, value) => {
    if (value === null || value === undefined || value === "") return "-";

    const lowerKey = String(key).toLowerCase();

    // --- MONTH: always show integer, no decimals ---
    if (lowerKey === "month") {
      const n = Number(value);
      return Number.isNaN(n) ? value : n.toString();
    }

    // --- DATE: trim ---
    if (lowerKey.includes("date")) {
      const str = String(value);
      return str.length > 10 ? str.slice(0, 10) : str;
    }

    // --- Normal Numeric fields (2 decimal places) ---
    const num = Number(value);
    if (!Number.isNaN(num) && value !== true && value !== false) {
      return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return String(value);
  };

  const isNumeric = (value) => {
    const num = Number(value);
    return !Number.isNaN(num) && value !== true && value !== false;
  };

  const formatEcon = (value, fractionDigits = 2) => {
    if (value === null || value === undefined || value === "") return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString(undefined, {
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: num % 1 === 0 ? 0 : fractionDigits,
    });
  };

  /* -----------------------------------------
      Download CSV for summary table
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

  /* -----------------------------------------
      NPV formatting: 2 decimal places
  ------------------------------------------*/
  const formattedNPV = Number(kpis.npv ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  /* -----------------------------------------
      SUMMARY REPORT CHART HELPERS
  ------------------------------------------*/
  const findSummaryKey = (candidates = []) => {
    if (!summaryRows.length) return null;
    const keys = Object.keys(summaryRows[0] || {});
    const lowerToKey = keys.reduce((acc, k) => {
      acc[k.toLowerCase()] = k;
      return acc;
    }, {});
    for (const cand of candidates) {
      const lower = cand.toLowerCase();
      if (lowerToKey[lower]) return lowerToKey[lower];
    }
    for (const cand of candidates) {
      const lower = cand.toLowerCase();
      const found = keys.find((k) => k.toLowerCase().includes(lower));
      if (found) return found;
    }
    return null;
  };

  const moneyFormatter = (v, decimals = 2, suffix = "") => {
    const num = Number(v);
    if (Number.isNaN(num)) return v;
    return `$${num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  };

  const netRevenueKey = useMemo(
    () =>
      findSummaryKey([
        "net_revenue",
        "net revenue",
        "netrevenue",
        "net_rev",
        "netrevene",
        "netrev",
        "net revenue usd",
        "net revenue ($)",
      ]),
    [summaryRows]
  );

  const npvKey = useMemo(
    () =>
      findSummaryKey([
        "npv",
        "nvp",
        "net_present_value",
        "net present value",
        "npv_usd",
        "npv ($)",
      ]),
    [summaryRows]
  );

  /* -----------------------------------------
      Total Water from production_metrics
  ------------------------------------------*/
  const totalWater = Number(
    lastApiResponse?.production_metrics?.total_water ?? 0
  );

  /* ========================================================================
      RENDER
  ========================================================================*/
  return (
    <div className="space-y-6" id="exec-summary">
      {/* =====================================================================
            PROPOSED WELL PANEL
      ===================================================================== */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-50">
              <MapPin className="w-4 h-4 text-sky-600" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Proposed Well
            </h2>
          </div>
          <button
            onClick={() => setOpenEdit(true)}
            className="cursor-pointer inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Edit Parameters
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <EconPill label="Section ID" value={wellParams.sectionId || "—"} />
          <EconPill label="Abstract ID" value={wellParams.abstractId || "—"} />
          <EconPill
            label="Latitude"
            value={
              wellParams.latitude != null ? wellParams.latitude.toFixed(4) : "—"
            }
          />
          <EconPill
            label="Longitude"
            value={
              wellParams.longitude != null
                ? wellParams.longitude.toFixed(4)
                : "—"
            }
          />
          
          <EconPill
            label="Radius"
            value={`${Number(
              wellParams.radiusMiles != null ? wellParams.radiusMiles : 15
            ).toLocaleString()} mi`}
          />
          <EconPill
            label="Trajectory"
            value={
              wellParams.trajectory
                ? String(wellParams.trajectory).toUpperCase()
                : "—"
            }
          />
          <EconPill
            label="Formation"
            value={
              wellParams.formation
                ? String(wellParams.formation).toUpperCase()
                : "—"
            }
          />
          <EconPill
            label="Prediction Horizon"
            value={
              wellParams.predictionHorizon
                ? `${wellParams.predictionHorizon} months`
                : "360 months"
            }
          />
        </div>
      </div>

      {/* =====================================================================
            ECONOMIC PARAMETERS PANEL
      ===================================================================== */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Economic Parameters
            </h2>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <EconPill
            label="Total CAPEX ($)"
            value={formatEcon(economicParams.totalCAPEX, 0)}
          />
          <EconPill
            label="Oil Price ($/bbl)"
            value={formatEcon(economicParams.oilPrice)}
          />
          <EconPill
            label="Gas Price ($/mcf)"
            value={formatEcon(economicParams.gasPrice)}
          />

          <EconPill
            label="Fixed OPEX ($/year)"
            value={formatEcon(economicParams.fixedOPEX, 0)}
          />
          <EconPill
            label="Oil OPEX"
            value={formatEcon(economicParams.oilOPEX)}
          />
          <EconPill
            label="Gas OPEX"
            value={formatEcon(economicParams.gasOPEX)}
          />

          <EconPill
            label="Water OPEX"
            value={formatEcon(economicParams.waterOPEX)}
          />
          <EconPill label="Oil NRI" value={formatEcon(economicParams.oilNRI)} />
          <EconPill label="Gas NRI" value={formatEcon(economicParams.gasNRI)} />

          <EconPill
            label="Discount Rate (%)"
            value={formatEcon(economicParams.discountRate)}
          />
          <EconPill
            label="Ad Valorem"
            value={formatEcon(economicParams.adValorem)}
          />
          <EconPill
            label="Oil Sev Tax"
            value={formatEcon(economicParams.oilSeverance)}
          />
          <EconPill
            label="Gas Sev Tax"
            value={formatEcon(economicParams.gasSeverance)}
          />
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title={
            <>
              NPV{" "}
              <span className="text-gray-500 font-semibold">
                (for 1st Month)
              </span>
            </>
          }
          icon={<DollarSign className="text-green-600" />}
          value={`$${formattedNPV}`}
          desc="Net Present Value"
          valueColor="text-emerald-600"
        />

        <KpiCard
          title="IRR"
          icon={<DollarSign className="text-indigo-600" />}
          value={`${kpis.irr.toFixed(1)}%`}
          desc="Internal Rate of Return"
          valueColor="text-indigo-600"
        />

        <KpiCard
          title="EUR Oil"
          icon={<Droplet className="text-orange-600" />}
          value={
            <>
              {(kpis.eurOil / 1000).toFixed(0)}K
              <span className="text-gray-500 text-2xl font-normal ml-2">
                (bbl)
              </span>
            </>
          }
          desc="Estimated Ultimate Recovery"
          valueColor="text-orange-600"
        />

        <KpiCard
          title="EUR Gas"
          icon={<Zap className="text-purple-600" />}
          value={
            <>
              {(kpis.eurGas / 1000).toFixed(0)}K
              <span className="text-gray-500 text-2xl font-normal ml-2">
                (mcf)
              </span>
            </>
          }
          desc="Estimated Ultimate Recovery"
          valueColor="text-purple-600"
        />

        <KpiCard
          title="Total CO₂"
          icon={<Zap className="text-emerald-600" />}
          value={
            <>
              {kpis.totalCO2.toFixed(0)}{" "}
              <span className="text-gray-500 text-2xl font-normal ml-1">
                (tons)
              </span>
            </>
          }
          valueColor="text-emerald-600"
        />

        <KpiCard
          title="Total Water"
          icon={<Droplet className="text-sky-600" />}
          value={
            <>
              {(totalWater / 1000).toFixed(0)}K
              <span className="text-gray-500 text-2xl font-normal ml-1">
                (bbl)
              </span>
            </>
          }
          // desc="Estimated Ultimate Recovery"
          valueColor="text-sky-600"
        />

        <KpiCard
          title="Payback"
          icon={<Calendar className="text-sky-600" />}
          value={kpis.paybackMonths ?? "—"}
          desc="months"
          valueColor="text-sky-600"
        />
      </div>

      {/* =====================================================================
      PRODUCTION DECLINE GRAPH (S3 DATA) — SEPARATE OIL, GAS & WATER
      ===================================================================== */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-1">Production Forecast</h3>
          <p className="text-xs text-slate-500 mb-4">
            Separate decline curves for oil, gas, and water with units.
          </p>

          <div className="space-y-6">
            {/* OIL CHART */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">
                Oil Production (bbl/month)
              </h4>
              <ResponsiveContainer width="100%" height={160}>
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
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* GAS CHART */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">
                Gas Production (mcf/month)
              </h4>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={remoteProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="gross_production_wh_gas_mcf"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Gas (mcf/mo)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* WATER CHART */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">
                Water Production (bbl/month)
              </h4>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={remoteProduction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    label={{
                      position: "insideBottom",
                      offset: -4,
                    }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="gross_production_water_bbls"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    name="Water (bbl/mo)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* =====================================================================
        ECONOMIC FORECAST: Cumulative Cash Flow + Net Revenue + NPV
        ===================================================================== */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold">Economic Forecast</h3>
              <p className="text-xs text-slate-500">
                Cashflow, Net Revenue & NPV
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              {remoteCashflow.length > 0 ? (
                <div>Cashflow: {remoteCashflow.length} months</div>
              ) : (
                <div>Cashflow not available</div>
              )}
              {summaryRows.length > 0 ? (
                <div>Summary: {summaryRows.length} months</div>
              ) : (
                <div>Summary not available</div>
              )}
            </div>
          </div>

          {/* Cumulative Cash Flow */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-800 mb-2">
              Cumulative Cash Flow ($/month)
            </h4>
            <ResponsiveContainer width="100%" height={160}>
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

          {/* Net Revenue (if present) */}
          {netRevenueKey && summaryRows.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">
                Net Revenue ($/month)
              </h4>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={summaryRows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                  />
                  <Tooltip formatter={(value) => moneyFormatter(value, 2)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey={netRevenueKey}
                    stroke="#2563eb"
                    fill="#bfdbfe"
                    fillOpacity={0.6}
                    name="Net Revenue ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* NPV (if present) */}
          {npvKey && summaryRows.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">
                NPV ($/month)
              </h4>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={summaryRows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                  />
                  <Tooltip formatter={(value) => moneyFormatter(value, 2)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={npvKey}
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="NPV ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
            SUMMARY REPORT TABLE (WITH PAGINATION)
      ===================================================================== */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">
            Monthly Summary Report
          </h3>

          <div className="flex items-center gap-2">
            {summaryRows.length > 0 && (
              <span className="hidden md:inline text-[11px] text-slate-500 mr-2">
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
                    {Object.keys(summaryRows[0]).map((col) => {
                      if (col.toLowerCase().includes("date")) return null; // hide date columns
                      const label = col.replace(/_/g, " ");
                      const lower = col.toLowerCase();

                      const numericHeaderCandidates = [
                        "cash",
                        "cumulative",
                        "revenue",
                        "net",
                        "npv",
                        "nvp",
                        "production",
                        "oil",
                        "gas",
                        "water",
                        "mcf",
                        "bbl",
                        "usd",
                        "amount",
                        "value",
                        "month",
                        "count",
                        "total",
                      ];

                      const isNumericHeader =
                        numericHeaderCandidates.some((c) =>
                          lower.includes(c)
                        ) && !lower.includes("date");

                      return (
                        <th
                          key={col}
                          className={`px-3 py-2 font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap ${
                            isNumericHeader ? "text-right" : "text-left"
                          }`}
                        >
                          {label}
                        </th>
                      );
                    })}
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
                        if (col.toLowerCase().includes("date")) return null; // hide date columns
                        const raw = row[col];
                        const numeric = isNumeric(raw);
                        const numericVal = numeric ? Number(raw) : null;

                        const isCashLike =
                          col.toLowerCase().includes("cash") ||
                          col.toLowerCase().includes("nvp") ||
                          col.toLowerCase().includes("npv") ||
                          col.toLowerCase().includes("revenue") ||
                          col.toLowerCase().includes("cumulative") ||
                          col.toLowerCase().includes("total") ||
                          col.toLowerCase().includes("value");

                        let textColor = "text-slate-700";
                        if (numeric && isCashLike && numericVal > 0) {
                          textColor = "text-emerald-600 font-semibold";
                        } else if (numeric && numericVal < 0) {
                          textColor = "text-rose-600 font-semibold";
                        }

                        return (
                          <td
                            key={col}
                            className={`px-3 py-1.5 whitespace-nowrap ${
                              numeric ? "text-right tabular-nums" : "text-left"
                            } ${textColor}`}
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

      <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
    </div>
  );
}

/* --------------------------------------------------------------------
      Small Reusable Components
--------------------------------------------------------------------- */

function KpiCard({ title, value, desc, icon, valueColor = "text-slate-900" }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xl md:text-2xl font-extrabold text-slate-900">
          {title}
        </p>
        {icon && (
          <span className="ml-2 flex items-center justify-center">{icon}</span>
        )}
      </div>

      <p className={`mt-1 text-3xl md:text-3xl font-extrabold ${valueColor}`}>
        {value}
      </p>

      {desc && (
        <p className="mt-2 text-lg md:text-xl font-semibold text-slate-500">
          {desc}
        </p>
      )}
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

/* pill used in Economic / Proposed Well panels */
function EconPill({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="text-slate-900 font-semibold tabular-nums">{value}</span>
    </div>
  );
}
