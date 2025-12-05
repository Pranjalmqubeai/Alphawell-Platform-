// import React, { useState } from "react";
// import {
//   ResponsiveContainer,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   AreaChart,
//   Area,
// } from "recharts";
// import { useAlphaWell } from "../../../context/AlphaWellContext";
// import ExecParamsModal from "./ExecParamsModal";

// export default function Economic() {
//   const { economicData, kpis, economicParams, lastApiResponse } =
//     useAlphaWell();
//   const [openEdit, setOpenEdit] = useState(false);

//   if (!economicData?.length) {
//     return (
//       <div className="p-6 bg-white rounded-xl shadow text-gray-700">
//         No economic data yet. Please run Analyze.
//       </div>
//     );
//   }

//   // ---- Derive metrics from API (with fallbacks) ----
//   const fm = lastApiResponse?.financial_metrics || {};

//   const npvRaw = fm.npv ?? kpis?.npv ?? 0; // assume USD
//   const irrRaw = fm.irr ?? kpis?.irr ?? 0; // %
//   const eurRaw = fm.eur ?? 0; // BOE
//   const paybackMonth = fm.payback_month ?? kpis?.paybackMonths ?? null;

//   const totalOpexRaw =
//     fm.total_opex ?? economicData.reduce((sum, d) => sum + (d.opex || 0), 0);

//   const totalTaxRaw =
//     fm.total_tax ?? economicData.reduce((sum, d) => sum + (d.taxes || 0), 0);

//   const netCashFlowRaw =
//     fm.total_cash_flow ??
//     (economicData[economicData.length - 1]?.cumulativeCashFlow || 0);

//   // formatted display helpers
//   const toMillions = (v) => (v || 0) / 1_000_000;

//   const formatNumber = (value, decimals = 2) =>
//     Number(value ?? 0).toLocaleString("en-US", {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     });

//   const npvDisplay = formatNumber(npvRaw, 2);
//   const irrDisplay = `${formatNumber(irrRaw, 1)}%`;
//   const eurDisplay = `${formatNumber(eurRaw, 2)} MMboe`;

//   const paybackDisplay = paybackMonth ? `Month ${paybackMonth}` : "N/A";

//   // 👇 US-style commas + $ + no decimals for these three
//   const totalOpexDisplay = `$${formatNumber(totalOpexRaw, 0)}`;
//   const totalTaxDisplay = `$${formatNumber(totalTaxRaw, 0)}`;
//   const netCFDisplay = `$${formatNumber(netCashFlowRaw, 0)}`;

//   return (
//     <div className="space-y-6">
//       {/* KPI Strip */}
//       <div className="bg-white/80 rounded-2xl shadow-md border border-slate-100 p-6">
//         <div className="flex items-center justify-end">
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Edit your parameters
//           </button>
//         </div>
//         <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500 mb-4">
//           Economic KPIs
//         </h3>
//         <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
//           <SumCard
//             title="NPV"
//             value={`$${npvDisplay}`}
//             accent="text-indigo-600"
//           />
//           <SumCard title="IRR" value={irrDisplay} accent="text-emerald-600" />
//           <SumCard title="EUR" value={eurDisplay} accent="text-sky-600" />
//           <SumCard
//             title="Payback Period"
//             value={paybackDisplay}
//             accent="text-amber-600"
//           />
//           <SumCard
//             title="Total OPEX"
//             value={totalOpexDisplay}
//             accent="text-rose-600"
//           />
//           <SumCard
//             title="Total Tax"
//             value={totalTaxDisplay}
//             accent="text-orange-600"
//           />
//           <SumCard
//             title="Net Cash Flow"
//             value={netCFDisplay}
//             accent="text-blue-600"
//           />
//         </div>
//       </div>

//       {/* Monthly Cash Flow */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Monthly Cash Flow Components
//         </h3>
//         <ResponsiveContainer width="100%" height={400}>
//           <BarChart data={economicData.filter((_, i) => i % 6 === 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//             <YAxis tick={{ fontSize: 12 }} />
//             <Tooltip formatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
//             <Legend />
//             <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
//             <Bar dataKey="opex" fill="#ef4444" name="OPEX ($)" />
//             <Bar dataKey="taxes" fill="#f97316" name="Taxes ($)" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* NPV Buildup */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           NPV Buildup Over Time
//         </h3>
//         <ResponsiveContainer width="100%" height={350}>
//           <AreaChart data={economicData.filter((_, i) => i % 3 === 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//             <YAxis tick={{ fontSize: 12 }} />
//             <Tooltip formatter={(v) => `$${(v / 1_000_000).toFixed(2)}M`} />
//             <Legend />
//             <Area
//               type="monotone"
//               dataKey="npv"
//               stroke="#6366f1"
//               fill="#6366f1"
//               fillOpacity={0.6}
//               name="Cumulative NPV ($)"
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Sensitivity */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Sensitivity Analysis
//         </h3>
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <h4 className="text-sm font-semibold text-gray-700 mb-3">
//               Oil Price Sensitivity
//             </h4>
//             <div className="space-y-2">
//               {[-20, -10, 0, 10, 20].map((pct) => {
//                 const adjustedPrice = economicParams.oilPrice * (1 + pct / 100);
//                 const baseNpvM = toMillions(kpis ? kpis.npv : npvRaw);
//                 const npvImpact = baseNpvM * (1 + (pct * 0.4) / 100);
//                 return (
//                   <div
//                     key={pct}
//                     className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                   >
//                     <span className="text-sm text-gray-700">
//                       ${adjustedPrice.toFixed(2)}/bbl ({pct > 0 ? "+" : ""}
//                       {pct}%)
//                     </span>
//                     <span
//                       className={`text-sm font-semibold ${
//                         npvImpact > 8
//                           ? "text-green-600"
//                           : npvImpact > 5
//                           ? "text-yellow-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       NPV: ${npvImpact.toFixed(2)}M
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <div>
//             <h4 className="text-sm font-semibold text-gray-700 mb-3">
//               CAPEX Sensitivity
//             </h4>
//             <div className="space-y-2">
//               {[-15, -10, 0, 10, 15].map((pct) => {
//                 const adjustedCapex =
//                   economicParams.totalCAPEX * (1 + pct / 100);
//                 const baseNpvM = toMillions(kpis ? kpis.npv : npvRaw);
//                 const npvImpact =
//                   baseNpvM -
//                   (economicParams.totalCAPEX * pct) / 100 / 1_000_000;
//                 return (
//                   <div
//                     key={pct}
//                     className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                   >
//                     <span className="text-sm text-gray-700">
//                       ${(adjustedCapex / 1_000_000).toFixed(2)}M (
//                       {pct > 0 ? "+" : ""}
//                       {pct}%)
//                     </span>
//                     <span
//                       className={`text-sm font-semibold ${
//                         npvImpact > 8
//                           ? "text-green-600"
//                           : npvImpact > 5
//                           ? "text-yellow-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       NPV: ${npvImpact.toFixed(2)}M
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
//     </div>
//   );
// }

// function SumCard({ title, value, accent = "text-slate-900" }) {
//   return (
//     <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
//       <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
//         {title}
//       </p>
//       <p className={`text-xl md:text-2xl font-bold ${accent}`}>{value}</p>
//     </div>
//   );
// }

// src/components/AlphaWell/tabs/Economic.jsx
// src/components/AlphaWell/tabs/Economic.jsx

// import React, { useEffect, useState } from "react";
// import {
//   ResponsiveContainer,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   AreaChart,
//   Area,
// } from "recharts";
// import { useAlphaWell } from "../../../context/AlphaWellContext";
// import ExecParamsModal from "./ExecParamsModal";

// export default function Economic() {
//   const { economicData, kpis, lastApiResponse } = useAlphaWell();
//   const [openEdit, setOpenEdit] = useState(false);

//   const [cashFlowRows, setCashFlowRows] = useState([]);
//   const [sensitivityRows, setSensitivityRows] = useState([]);
//   const [loadingCash, setLoadingCash] = useState(false);
//   const [loadingSens, setLoadingSens] = useState(false);

//   // =========================
//   // Fetch cash_flow_url.json
//   // =========================
//   useEffect(() => {
//     const url = lastApiResponse?.cash_flow_url;

//     // fallback to context economicData (already adapted)
//     if (!url) {
//       const fallback = (economicData || []).map((d, i) => ({
//         month: d.month ?? i + 1,
//         revenue: Number(d.revenue || 0),
//         opex: Number(d.opex || 0),
//         taxes: Number(d.taxes || 0),
//         npv: Number(d.npv ?? kpis?.npv ?? 0),
//         cumulative_cash_flow: Number(d.cumulativeCashFlow || 0),
//         date: d.date,
//       }));
//       setCashFlowRows(fallback);
//       return;
//     }

//     let cancelled = false;
//     (async () => {
//       try {
//         setLoadingCash(true);
//         const res = await fetch(url);
//         const json = await res.json();
//         if (cancelled) return;

//         const rows = Array.isArray(json) ? json : [];
//         setCashFlowRows(
//           rows.map((r, i) => ({
//             month: Number(r.month ?? i + 1),
//             date: (r.date || "").slice(0, 10),
//             revenue: Number(r.revenue || 0),
//             opex: Number(r.opex || 0),
//             taxes: Number(r.taxes || 0),
//             npv: Number(r.npv ?? r.nvp ?? 0), // handle possible typo
//             cumulative_cash_flow: Number(r.cumulative_cash_flow || 0),
//             net_cash_flow: Number(r.net_cash_flow || 0),
//           }))
//         );
//       } catch (e) {
//         console.error("[Economic] cash_flow_url fetch failed:", e);
//         const fallback = (economicData || []).map((d, i) => ({
//           month: d.month ?? i + 1,
//           revenue: Number(d.revenue || 0),
//           opex: Number(d.opex || 0),
//           taxes: Number(d.taxes || 0),
//           npv: Number(d.npv ?? kpis?.npv ?? 0),
//           cumulative_cash_flow: Number(d.cumulativeCashFlow || 0),
//           date: d.date,
//         }));
//         setCashFlowRows(fallback);
//       } finally {
//         if (!cancelled) setLoadingCash(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [lastApiResponse?.cash_flow_url, economicData, kpis]);

//   // ===================================
//   // Fetch sensitivity_analysis_url.json
//   // ===================================
//   useEffect(() => {
//     const url = lastApiResponse?.sensitivity_analysis_url;
//     if (!url) {
//       setSensitivityRows([]);
//       return;
//     }

//     let cancelled = false;
//     (async () => {
//       try {
//         setLoadingSens(true);
//         const res = await fetch(url);
//         const json = await res.json();
//         if (cancelled) return;

//         const rows = Array.isArray(json) ? json : [];
//         setSensitivityRows(
//           rows.map((r, i) => ({
//             idx: i,
//             parameter_value: Number(r.parameter_value || 0),
//             variation_percentage: Number(r.variation_percentage ?? 0),
//             npv: Number(r.npv ?? 0),
//           }))
//         );
//       } catch (e) {
//         console.error("[Economic] sensitivity_analysis_url fetch failed:", e);
//         setSensitivityRows([]);
//       } finally {
//         if (!cancelled) setLoadingSens(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [lastApiResponse?.sensitivity_analysis_url]);

//   // -------- Guards AFTER hooks --------
//   const hasCashFlow = cashFlowRows.length > 0;

//   if (!hasCashFlow && !loadingCash) {
//     return (
//       <div className="p-6 bg-white rounded-xl shadow text-gray-700">
//         No economic data yet. Please run Analyze.
//       </div>
//     );
//   }

//   // ---- KPIs from API (with fallbacks) ----
//   const fm = lastApiResponse?.financial_metrics || {};
//   const npvRaw = fm.npv ?? kpis?.npv ?? 0;
//   const irrRaw = fm.irr ?? kpis?.irr ?? 0;
//   const eurRaw = fm.eur ?? 0;
//   const paybackMonth = fm.payback_month ?? kpis?.paybackMonths ?? null;

//   const totalOpexRaw =
//     fm.total_opex ??
//     cashFlowRows.reduce((sum, r) => sum + (r.opex || 0), 0);

//   const totalTaxRaw =
//     fm.total_tax ??
//     cashFlowRows.reduce((sum, r) => sum + (r.taxes || 0), 0);

//   const netCashFlowRaw =
//     fm.total_cash_flow ??
//     (cashFlowRows[cashFlowRows.length - 1]?.cumulative_cash_flow || 0);

//   const formatNumber = (value, decimals = 2) =>
//     Number(value ?? 0).toLocaleString("en-US", {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     });

//   const npvDisplay = formatNumber(npvRaw, 2);
//   const irrDisplay = `${formatNumber(irrRaw, 1)}%`;
//   const eurDisplay = `${formatNumber(eurRaw, 2)} MMboe`;
//   const paybackDisplay = paybackMonth ? `Month ${paybackMonth}` : "N/A";
//   const totalOpexDisplay = `$${formatNumber(totalOpexRaw, 0)}`;
//   const totalTaxDisplay = `$${formatNumber(totalTaxRaw, 0)}`;
//   const netCFDisplay = `$${formatNumber(netCashFlowRaw, 0)}`;

//   // Charts data (X axis = month)
//   const monthlyCashFlowChart = cashFlowRows.map((r, i) => ({
//     month: r.month ?? i + 1,
//     revenue: r.revenue ?? 0,
//     opex: r.opex ?? 0,
//     taxes: r.taxes ?? 0,
//   }));

//   const npvChart = cashFlowRows.map((r, i) => ({
//     month: r.month ?? i + 1,
//     npv: r.npv ?? 0,
//   }));

//   // Sensitivity split
//   const capexSens = sensitivityRows.slice(0, 7);
//   const discountSens = sensitivityRows.slice(7);

//   const npvToM = (v) => (Number(v || 0) / 1_000_000).toFixed(2);
//   const baselineNpvM = Number(npvToM(npvRaw));

//   return (
//     <div className="space-y-6">
//       {/* KPI Strip */}
//       <div className="bg-white/80 rounded-2xl shadow-md border border-slate-100 p-6">
//         <div className="flex items-center justify-end">
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Edit your parameters
//           </button>
//         </div>
//         <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500 mb-4">
//           Economic KPIs
//         </h3>
//         <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
//           <SumCard title="NPV" value={`$${npvDisplay}`} accent="text-indigo-600" />
//           <SumCard title="IRR" value={irrDisplay} accent="text-emerald-600" />
//           <SumCard title="EUR" value={eurDisplay} accent="text-sky-600" />
//           <SumCard
//             title="Payback Period"
//             value={paybackDisplay}
//             accent="text-amber-600"
//           />
//           <SumCard
//             title="Total OPEX"
//             value={totalOpexDisplay}
//             accent="text-rose-600"
//           />
//           <SumCard
//             title="Total Tax"
//             value={totalTaxDisplay}
//             accent="text-orange-600"
//           />
//           <SumCard
//             title="Net Cash Flow"
//             value={netCFDisplay}
//             accent="text-blue-600"
//           />
//         </div>
//       </div>

//       {/* Monthly Cash Flow Components */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Monthly Cash Flow Components
//         </h3>

//         {loadingCash && !monthlyCashFlowChart.length ? (
//           <p className="text-sm text-slate-500">Loading cash flow…</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={monthlyCashFlowChart.filter((_, i) => i % 6 === 0)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip formatter={(v) => `$${(Number(v) / 1000).toFixed(0)}K`} />
//               <Legend />
//               <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
//               <Bar dataKey="opex" fill="#ef4444" name="OPEX ($)" />
//               <Bar dataKey="taxes" fill="#f97316" name="Taxes ($)" />
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </div>

//       {/* NPV Buildup Over Time */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           NPV Buildup Over Time
//         </h3>

//         {loadingCash && !npvChart.length ? (
//           <p className="text-sm text-slate-500">Loading NPV series…</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={350}>
//             <AreaChart data={npvChart.filter((_, i) => i % 3 === 0)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip formatter={(v) => `$${(Number(v) / 1_000_000).toFixed(2)}M`} />
//               <Legend />
//               <Area
//                 type="monotone"
//                 dataKey="npv"
//                 stroke="#6366f1"
//                 fill="#6366f1"
//                 fillOpacity={0.6}
//                 name="NPV ($)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         )}
//       </div>

//       {/* Sensitivity Analysis */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Sensitivity Analysis
//         </h3>

//         {loadingSens && !sensitivityRows.length ? (
//           <p className="text-sm text-slate-500">Loading sensitivity…</p>
//         ) : (
//           <div className="grid md:grid-cols-2 gap-6">
//             {/* CAPEX Sensitivity */}
//             <SensitivityTable
//               title="CAPEX Sensitivity"
//               rows={capexSens}
//               baselineNpvM={baselineNpvM}
//               valueFormatter={(v) => `$${(v / 1_000_000).toFixed(2)}M`}
//             />

//             {/* Discount Rate Sensitivity */}
//             <SensitivityTable
//               title="Discount Rate (%) Sensitivity"
//               rows={discountSens}
//               baselineNpvM={baselineNpvM}
//               valueFormatter={(v) => `${Number(v).toFixed(2)}%`}
//             />
//           </div>
//         )}
//       </div>

//       <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
//     </div>
//   );
// }

// function SumCard({ title, value, accent = "text-slate-900" }) {
//   return (
//     <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
//       <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
//         {title}
//       </p>
//       <p className={`text-xl md:text-2xl font-bold ${accent}`}>{value}</p>
//     </div>
//   );
// }

// function SensitivityTable({ title, rows, baselineNpvM, valueFormatter }) {
//   const npvToM = (v) => Number(v || 0) / 1_000_000;

//   return (
//     <div className="rounded-xl border border-slate-100 p-4">
//       <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>

//       {rows.length ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-slate-50">
//               <tr>
//                 <th className="px-3 py-2 text-left font-semibold text-slate-600">
//                   Variation (%)
//                 </th>
//                 <th className="px-3 py-2 text-left font-semibold text-slate-600">
//                   Parameter Value
//                 </th>
//                 <th className="px-3 py-2 text-left font-semibold text-slate-600">
//                   NPV ($M)
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {rows.map((r) => {
//                 const npvM = npvToM(r.npv);
//                 const color =
//                   npvM >= baselineNpvM
//                     ? "text-emerald-600"
//                     : npvM >= 0
//                     ? "text-amber-600"
//                     : "text-rose-600";

//                 return (
//                   <tr key={`${title}-${r.idx}`} className="hover:bg-slate-50">
//                     <td className="px-3 py-2">
//                       {r.variation_percentage > 0 ? "+" : ""}
//                       {r.variation_percentage}
//                     </td>
//                     <td className="px-3 py-2">
//                       {valueFormatter(r.parameter_value)}
//                     </td>
//                     <td className={`px-3 py-2 font-semibold ${color}`}>
//                       ${npvM.toFixed(2)}M
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-sm text-slate-500">No data.</p>
//       )}
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import {
//   ResponsiveContainer,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   AreaChart,
//   Area,
// } from "recharts";
// import { useAlphaWell } from "../../../context/AlphaWellContext";
// import ExecParamsModal from "./ExecParamsModal";

// export default function Economic() {
//   // 👇 just added wellParams here, everything else unchanged
//   const { economicData, kpis, lastApiResponse, wellParams } = useAlphaWell();
//   const [openEdit, setOpenEdit] = useState(false);

//   const [cashFlowRows, setCashFlowRows] = useState([]);
//   const [sensitivityRows, setSensitivityRows] = useState([]);
//   const [loadingCash, setLoadingCash] = useState(false);
//   const [loadingSens, setLoadingSens] = useState(false);

//   // =========================
//   // Fetch cash_flow_url.json
//   // =========================
//   useEffect(() => {
//     const url = lastApiResponse?.cash_flow_url;

//     // fallback to context economicData (already adapted)
//     if (!url) {
//       const fallback = (economicData || []).map((d, i) => ({
//         month: d.month ?? i + 1,
//         revenue: Number(d.revenue || 0),
//         opex: Number(d.opex || 0),
//         taxes: Number(d.taxes || 0),
//         npv: Number(d.npv ?? kpis?.npv ?? 0),
//         cumulative_cash_flow: Number(d.cumulativeCashFlow || 0),
//         date: d.date,
//       }));
//       setCashFlowRows(fallback);
//       return;
//     }

//     let cancelled = false;
//     (async () => {
//       try {
//         setLoadingCash(true);
//         const res = await fetch(url);
//         const json = await res.json();
//         if (cancelled) return;

//         const rows = Array.isArray(json) ? json : [];
//         setCashFlowRows(
//           rows.map((r, i) => ({
//             month: Number(r.month ?? i + 1),
//             date: (r.date || "").slice(0, 10),
//             revenue: Number(r.revenue || 0),
//             opex: Number(r.opex || 0),
//             taxes: Number(r.taxes || 0),
//             npv: Number(r.npv ?? r.nvp ?? 0), // handle possible typo
//             cumulative_cash_flow: Number(r.cumulative_cash_flow || 0),
//             net_cash_flow: Number(r.net_cash_flow || 0),
//           }))
//         );
//       } catch (e) {
//         console.error("[Economic] cash_flow_url fetch failed:", e);
//         const fallback = (economicData || []).map((d, i) => ({
//           month: d.month ?? i + 1,
//           revenue: Number(d.revenue || 0),
//           opex: Number(d.opex || 0),
//           taxes: Number(d.taxes || 0),
//           npv: Number(d.npv ?? kpis?.npv ?? 0),
//           cumulative_cash_flow: Number(d.cumulativeCashFlow || 0),
//           date: d.date,
//         }));
//         setCashFlowRows(fallback);
//       } finally {
//         if (!cancelled) setLoadingCash(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [lastApiResponse?.cash_flow_url, economicData, kpis]);

//   // ===================================
//   // Fetch sensitivity_analysis_url.json
//   // ===================================
//   useEffect(() => {
//     const url = lastApiResponse?.sensitivity_analysis_url;
//     if (!url) {
//       setSensitivityRows([]);
//       return;
//     }

//     let cancelled = false;
//     (async () => {
//       try {
//         setLoadingSens(true);
//         const res = await fetch(url);
//         const json = await res.json();
//         if (cancelled) return;

//         const rows = Array.isArray(json) ? json : [];
//         setSensitivityRows(
//           rows.map((r, i) => ({
//             idx: i,
//             parameter_value: Number(r.parameter_value || 0),
//             variation_percentage: Number(r.variation_percentage ?? 0),
//             npv: Number(r.npv ?? 0),
//           }))
//         );
//       } catch (e) {
//         console.error("[Economic] sensitivity_analysis_url fetch failed:", e);
//         setSensitivityRows([]);
//       } finally {
//         if (!cancelled) setLoadingSens(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [lastApiResponse?.sensitivity_analysis_url]);

//   // -------- Guards AFTER hooks --------
//   const hasCashFlow = cashFlowRows.length > 0;

//   if (!hasCashFlow && !loadingCash) {
//     return (
//       <div className="p-6 bg-white rounded-xl shadow text-gray-700">
//         No economic data yet. Please run Analyze.
//       </div>
//     );
//   }

//   // ---- KPIs from API (with fallbacks) ----
//   const fm = lastApiResponse?.financial_metrics || {};
//   const npvRaw = fm.npv ?? kpis?.npv ?? 0;
//   const irrRaw = fm.irr ?? kpis?.irr ?? 0;
//   const eurRaw = fm.eur ?? 0;
//   const paybackMonth = fm.payback_month ?? kpis?.paybackMonths ?? null;

//   const totalOpexRaw =
//     fm.total_opex ?? cashFlowRows.reduce((sum, r) => sum + (r.opex || 0), 0);

//   const totalTaxRaw =
//     fm.total_tax ?? cashFlowRows.reduce((sum, r) => sum + (r.taxes || 0), 0);

//   const netCashFlowRaw =
//     fm.total_cash_flow ??
//     (cashFlowRows[cashFlowRows.length - 1]?.cumulative_cash_flow || 0);

//   const formatNumber = (value, decimals = 2) =>
//     Number(value ?? 0).toLocaleString("en-US", {
//       minimumFractionDigits: decimals,
//       maximumFractionDigits: decimals,
//     });

//   const npvDisplay = formatNumber(npvRaw, 2);
//   const irrDisplay = `${formatNumber(irrRaw, 1)}%`;
//   const eurDisplay = `${formatNumber(eurRaw, 2)} MMboe`;
//   const paybackDisplay = paybackMonth ? `Month ${paybackMonth}` : "N/A";
//   const totalOpexDisplay = `$${formatNumber(totalOpexRaw, 0)}`;
//   const totalTaxDisplay = `$${formatNumber(totalTaxRaw, 0)}`;
//   const netCFDisplay = `$${formatNumber(netCashFlowRaw, 0)}`;

//   // Charts data (X axis = month)
//   const monthlyCashFlowChart = cashFlowRows.map((r, i) => ({
//     month: r.month ?? i + 1,
//     revenue: r.revenue ?? 0,
//     opex: r.opex ?? 0,
//     taxes: r.taxes ?? 0,
//   }));

//   const npvChart = cashFlowRows.map((r, i) => ({
//     month: r.month ?? i + 1,
//     npv: r.npv ?? 0,
//   }));

//   // Sensitivity split (still used if we re-enable section)
//   const capexSens = sensitivityRows.slice(0, 7);
//   const discountSens = sensitivityRows.slice(7);

//   const npvToM = (v) => (Number(v || 0) / 1_000_000).toFixed(2);
//   const baselineNpvM = Number(npvToM(npvRaw));

//   return (
//     <div className="space-y-6">
//       {/* WELL CHARACTERISTICS – on top */}
//       <div className="bg-white/90 rounded-2xl shadow-md border border-slate-100 p-6">
//         <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500 mb-3">
//           Well Characteristics
//         </h3>
//         <div className="grid gap-y-3 gap-x-8 grid-cols-2 md:grid-cols-4">
//           <WellChar label="Formation" value={wellParams?.formation || "—"} />
//           <WellChar
//             label="Trajectory"
//             value={
//               wellParams?.trajectory
//                 ? String(wellParams.trajectory).toUpperCase()
//                 : "—"
//             }
//           />
//           <WellChar
//             label="TVD"
//             value={
//               wellParams?.tvd
//                 ? `${Number(wellParams.tvd).toLocaleString()} ft`
//                 : "—"
//             }
//           />
//           <WellChar
//             label="Lateral Length"
//             value={
//               wellParams?.lateralLength
//                 ? `${Number(wellParams.lateralLength).toLocaleString()} ft`
//                 : "—"
//             }
//           />
//           <WellChar
//             label="Radius"
//             value={`${Number(
//               wellParams?.radiusMiles != null ? wellParams.radiusMiles : 15
//             ).toLocaleString()} mi`}
//           />
//         </div>
//       </div>

//       {/* KPI Strip */}
//       <div className="bg-white/80 rounded-2xl shadow-md border border-slate-100 p-6">
//         <div className="flex items-center justify-end">
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Edit your parameters
//           </button>
//         </div>
//         <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500 mb-4">
//           Economic KPIs
//         </h3>
//         <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
//           <SumCard
//             title="NPV"
//             value={`$${npvDisplay}`}
//             accent="text-indigo-600"
//           />
//           <SumCard title="IRR" value={irrDisplay} accent="text-emerald-600" />
//           <SumCard title="EUR" value={eurDisplay} accent="text-sky-600" />
//           <SumCard
//             title="Payback Period"
//             value={paybackDisplay}
//             accent="text-amber-600"
//           />
//           <SumCard
//             title="Total OPEX"
//             value={totalOpexDisplay}
//             accent="text-rose-600"
//           />
//           <SumCard
//             title="Total Tax"
//             value={totalTaxDisplay}
//             accent="text-orange-600"
//           />
//           <SumCard
//             title="Net Cash Flow"
//             value={netCFDisplay}
//             accent="text-blue-600"
//           />
//         </div>
//       </div>

//       {/* Monthly Cash Flow Components */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Monthly Cash Flow Components
//         </h3>

//         {loadingCash && !monthlyCashFlowChart.length ? (
//           <p className="text-sm text-slate-500">Loading cash flow…</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={monthlyCashFlowChart.filter((_, i) => i % 6 === 0)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="month"
//                 tick={{ fontSize: 12 }}
//                 label={{
//                   value: "Month",
//                   position: "insideBottom",
//                   offset: -5,
//                 }}
//               />
//               <YAxis
//                 tick={{ fontSize: 12 }}
//                 label={{
//                   value: "US$",
//                   angle: -90,
//                   position: "insideLeft",
//                   offset: 10,
//                 }}
//               />
//               <Tooltip
//                 formatter={(value, name) => [
//                   `$${Number(value).toLocaleString(undefined, {
//                     maximumFractionDigits: 0,
//                   })}`,
//                   name,
//                 ]}
//               />
//               <Legend />
//               <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
//               <Bar dataKey="opex" fill="#ef4444" name="OPEX ($)" />
//               <Bar dataKey="taxes" fill="#f97316" name="Taxes ($)" />
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </div>

//       {/* NPV Buildup Over Time */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           NPV Buildup Over Time
//         </h3>

//         {loadingCash && !npvChart.length ? (
//           <p className="text-sm text-slate-500">Loading NPV series…</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={350}>
//             <AreaChart data={npvChart.filter((_, i) => i % 3 === 0)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="month"
//                 tick={{ fontSize: 12 }}
//                 label={{
//                   value: "Month",
//                   position: "insideBottom",
//                   offset: -5,
//                 }}
//               />
//               <YAxis
//                 tick={{ fontSize: 12 }}
//                 label={{
//                   value: "NPV (US$)",
//                   angle: -90,
//                   position: "insideLeft",
//                   offset: 10,
//                 }}
//               />
//               <Tooltip
//                 formatter={(value) => [
//                   `$${Number(value).toLocaleString(undefined, {
//                     maximumFractionDigits: 2,
//                   })}`,
//                   "NPV ($)",
//                 ]}
//               />
//               <Legend />
//               <Area
//                 type="monotone"
//                 dataKey="npv"
//                 stroke="#6366f1"
//                 fill="#6366f1"
//                 fillOpacity={0.6}
//                 name="NPV ($)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         )}
//       </div>

//       {/* --- Sensitivity Analysis (Hidden) --- */}
//       {false && (
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">
//             Sensitivity Analysis
//           </h3>

//           {loadingSens && !sensitivityRows.length ? (
//             <p className="text-sm text-slate-500">Loading sensitivity…</p>
//           ) : (
//             <div className="grid md:grid-cols-2 gap-6">
//               <SensitivityTable
//                 title="CAPEX Sensitivity"
//                 rows={capexSens}
//                 baselineNpvM={baselineNpvM}
//                 valueFormatter={(v) => `$${(v / 1_000_000).toFixed(2)}M`}
//               />

//               <SensitivityTable
//                 title="Discount Rate (%) Sensitivity"
//                 rows={discountSens}
//                 baselineNpvM={baselineNpvM}
//                 valueFormatter={(v) => `${Number(v).toFixed(2)}%`}
//               />
//             </div>
//           )}
//         </div>
//       )}

//       <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
//     </div>
//   );
// }

// /* --- small helper components --- */

// function SumCard({ title, value, accent = "text-slate-900", desc }) {
//   return (
//     <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
//       {/* Top: what is being measured (large) */}
//       <p className="text-xl md:text-2xl font-extrabold text-slate-900">
//         {title}
//       </p>

//       {/* Middle: numeric value (largest + colored) */}
//       <p className={`mt-1 text-3xl md:text-4xl font-extrabold ${accent}`}>
//         {value}
//       </p>

//       {/* Bottom: optional subtitle/unit (large but ≤ value size) */}
//       {desc && (
//         <p className="mt-2 text-lg md:text-xl font-semibold text-slate-500">
//           {desc}
//         </p>
//       )}
//     </div>
//   );
// }

// function WellChar({ label, value }) {
//   return (
//     <div>
//       <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
//       <p className="text-sm md:text-base font-semibold text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }

// function SensitivityTable({ title, rows, baselineNpvM, valueFormatter }) {
//   const npvToM = (v) => Number(v || 0) / 1_000_000;

//   return (
//     <div className="rounded-xl border border-slate-100 p-4">
//       <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>

//       {rows.length ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-slate-50">
//               <tr>
//                 <th className="px-3 py-2 text-left font-semibold text-slate-600">
//                   Variation (%)
//                 </th>
//                 <th className="px-3 py-2 text-left font-semibold text-slate-600">
//                   Parameter Value
//                 </th>
//                 <th className="px-3 py-2 text-left font-semibold text-slate-600">
//                   NPV ($M)
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {rows.map((r) => {
//                 const npvM = npvToM(r.npv);
//                 const color =
//                   npvM >= baselineNpvM
//                     ? "text-emerald-600"
//                     : npvM >= 0
//                     ? "text-amber-600"
//                     : "text-rose-600";

//                 return (
//                   <tr key={`${title}-${r.idx}`} className="hover:bg-slate-50">
//                     <td className="px-3 py-2">
//                       {r.variation_percentage > 0 ? "+" : ""}
//                       {r.variation_percentage}
//                     </td>
//                     <td className="px-3 py-2">
//                       {valueFormatter(r.parameter_value)}
//                     </td>
//                     <td className={`px-3 py-2 font-semibold ${color}`}>
//                       ${npvM.toFixed(2)}M
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="text-sm text-slate-500">No data.</p>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { useAlphaWell } from "../../../context/AlphaWellContext";
import ExecParamsModal from "./ExecParamsModal";

export default function Economic() {
  // 👇 just added wellParams here, everything else unchanged
  const { economicData, kpis, lastApiResponse, wellParams } = useAlphaWell();
  const [openEdit, setOpenEdit] = useState(false);

  const [cashFlowRows, setCashFlowRows] = useState([]);
  const [sensitivityRows, setSensitivityRows] = useState([]);
  const [loadingCash, setLoadingCash] = useState(false);
  const [loadingSens, setLoadingSens] = useState(false);

  // =========================
  // Fetch cash_flow_url.json
  // =========================
  useEffect(() => {
    const url = lastApiResponse?.cash_flow_url;

    // fallback to context economicData (already adapted)
    if (!url) {
      const fallback = (economicData || []).map((d, i) => ({
        month: d.month ?? i + 1,
        revenue: Number(d.revenue || 0),
        opex: Number(d.opex || 0),
        taxes: Number(d.taxes || 0),
        npv: Number(d.npv ?? kpis?.npv ?? 0),
        cumulative_cash_flow: Number(d.cumulativeCashFlow || 0),
        date: d.date,
      }));
      setCashFlowRows(fallback);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoadingCash(true);
        const res = await fetch(url);
        const json = await res.json();
        if (cancelled) return;

        const rows = Array.isArray(json) ? json : [];
        setCashFlowRows(
          rows.map((r, i) => ({
            month: Number(r.month ?? i + 1),
            date: (r.date || "").slice(0, 10),
            revenue: Number(r.revenue || 0),
            opex: Number(r.opex || 0),
            taxes: Number(r.taxes || 0),
            npv: Number(r.npv ?? r.nvp ?? 0), // handle possible typo
            cumulative_cash_flow: Number(r.cumulative_cash_flow || 0),
            net_cash_flow: Number(r.net_cash_flow || 0),
          }))
        );
      } catch (e) {
        console.error("[Economic] cash_flow_url fetch failed:", e);
        const fallback = (economicData || []).map((d, i) => ({
          month: d.month ?? i + 1,
          revenue: Number(d.revenue || 0),
          opex: Number(d.opex || 0),
          taxes: Number(d.taxes || 0),
          npv: Number(d.npv ?? kpis?.npv ?? 0),
          cumulative_cash_flow: Number(d.cumulativeCashFlow || 0),
          date: d.date,
        }));
        setCashFlowRows(fallback);
      } finally {
        if (!cancelled) setLoadingCash(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lastApiResponse?.cash_flow_url, economicData, kpis]);

  // ===================================
  // Fetch sensitivity_analysis_url.json
  // ===================================
  useEffect(() => {
    const url = lastApiResponse?.sensitivity_analysis_url;
    if (!url) {
      setSensitivityRows([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoadingSens(true);
        const res = await fetch(url);
        const json = await res.json();
        if (cancelled) return;

        const rows = Array.isArray(json) ? json : [];
        setSensitivityRows(
          rows.map((r, i) => ({
            idx: i,
            parameter_value: Number(r.parameter_value || 0),
            variation_percentage: Number(r.variation_percentage ?? 0),
            npv: Number(r.npv ?? 0),
          }))
        );
      } catch (e) {
        console.error("[Economic] sensitivity_analysis_url fetch failed:", e);
        setSensitivityRows([]);
      } finally {
        if (!cancelled) setLoadingSens(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lastApiResponse?.sensitivity_analysis_url]);

  // -------- Guards AFTER hooks --------
  const hasCashFlow = cashFlowRows.length > 0;

  if (!hasCashFlow && !loadingCash) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-gray-700">
        No economic data yet. Please run Analyze.
      </div>
    );
  }

  // ---- KPIs from API (with fallbacks) ----
  const fm = lastApiResponse?.financial_metrics || {};
  const npvRaw = fm.npv ?? kpis?.npv ?? 0;
  const irrRaw = fm.irr ?? kpis?.irr ?? 0;
  const eurRaw = fm.eur ?? 0;
  const paybackMonth = fm.payback_month ?? kpis?.paybackMonths ?? null;

  const totalOpexRaw =
    fm.total_opex ?? cashFlowRows.reduce((sum, r) => sum + (r.opex || 0), 0);

  const totalTaxRaw =
    fm.total_tax ?? cashFlowRows.reduce((sum, r) => sum + (r.taxes || 0), 0);

  const netCashFlowRaw =
    fm.total_cash_flow ??
    (cashFlowRows[cashFlowRows.length - 1]?.cumulative_cash_flow || 0);

  const formatNumber = (value, decimals = 2) =>
    Number(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const npvDisplay = formatNumber(npvRaw, 2);
  const irrDisplay = `${formatNumber(irrRaw, 1)}%`;
  const eurDisplay = `${formatNumber(eurRaw, 2)} MMboe`;
  const paybackDisplay = paybackMonth ? `Month ${paybackMonth}` : "N/A";
  const totalOpexDisplay = `$${formatNumber(totalOpexRaw, 0)}`;
  const totalTaxDisplay = `$${formatNumber(totalTaxRaw, 0)}`;
  const netCFDisplay = `$${formatNumber(netCashFlowRaw, 0)}`;

  // Charts data (X axis = month)
  const monthlyCashFlowChart = cashFlowRows.map((r, i) => ({
    month: r.month ?? i + 1,
    revenue: r.revenue ?? 0,
    opex: r.opex ?? 0,
    taxes: r.taxes ?? 0,
  }));

  const npvChart = cashFlowRows.map((r, i) => ({
    month: r.month ?? i + 1,
    npv: r.npv ?? 0,
  }));

  // Sensitivity split (still used if we re-enable section)
  const capexSens = sensitivityRows.slice(0, 7);
  const discountSens = sensitivityRows.slice(7);

  const npvToM = (v) => (Number(v || 0) / 1_000_000).toFixed(2);
  const baselineNpvM = Number(npvToM(npvRaw));

  return (
    <div className="space-y-6">
      {/* WELL CHARACTERISTICS – on top */}
      <div className="bg-white/90 rounded-2xl shadow-md border border-slate-100 p-6">
        <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500 mb-3">
          Well Characteristics
        </h3>
        <div className="grid gap-y-3 gap-x-8 grid-cols-2 md:grid-cols-4">
          <WellChar label="Formation" value={wellParams?.formation || "—"} />
          <WellChar
            label="Trajectory"
            value={
              wellParams?.trajectory
                ? String(wellParams.trajectory).toUpperCase()
                : "—"
            }
          />

          <WellChar
            label="Radius"
            value={`${Number(
              wellParams?.radiusMiles != null ? wellParams.radiusMiles : 15
            ).toLocaleString()} mi`}
          />
          <WellChar
            label="Latitude"
            value={
              wellParams?.latitude != null ? String(wellParams.latitude) : "-"
            }
          />

          <WellChar
            label="Longitude"
            value={
              wellParams?.longitude != null ? String(wellParams.longitude) : "-"
            }
          />
        </div>
      </div>

      {/* KPI Strip */}
      <div className="bg-white/80 rounded-2xl shadow-md border border-slate-100 p-6">
        <div className="flex items-center justify-end">
          <button
            onClick={() => setOpenEdit(true)}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            Edit your parameters
          </button>
        </div>
        <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500 mb-4">
          Economic KPIs
        </h3>
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
          <SumCard
            title="NPV"
            value={`$${npvDisplay}`}
            accent="text-indigo-600"
          />
          <SumCard title="IRR" value={irrDisplay} accent="text-emerald-600" />
          <SumCard title="EUR" value={eurDisplay} accent="text-sky-600" />
          <SumCard
            title="Payback Period"
            value={paybackDisplay}
            accent="text-amber-600"
          />
          <SumCard
            title="Total OPEX"
            value={totalOpexDisplay}
            accent="text-rose-600"
          />
          <SumCard
            title="Total Tax"
            value={totalTaxDisplay}
            accent="text-orange-600"
          />
          <SumCard
            title="Net Cash Flow"
            value={netCFDisplay}
            accent="text-blue-600"
          />
        </div>
      </div>

      {/* Monthly Cash Flow Components */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Monthly Cash Flow Components{" "}
          <span className="font-normal">($/month)</span>
        </h3>

        {loadingCash && !monthlyCashFlowChart.length ? (
          <p className="text-sm text-slate-500">Loading cash flow…</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={monthlyCashFlowChart.filter((_, i) => i % 6 === 0)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  `$${Number(value).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}`,
                  name,
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="Revenue ($)"
              />
              <Line
                type="monotone"
                dataKey="opex"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                name="OPEX ($)"
              />
              <Line
                type="monotone"
                dataKey="taxes"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
                name="Taxes ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* NPV Buildup Over Time */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          NPV Buildup Over Time<span className="font-normal">($/month)</span>
        </h3>

        {loadingCash && !npvChart.length ? (
          <p className="text-sm text-slate-500">Loading NPV series…</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={npvChart.filter((_, i) => i % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}`,
                  "NPV ($)",
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="npv"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
                name="NPV ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* --- Sensitivity Analysis (Hidden) --- */}
      {false && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Sensitivity Analysis
          </h3>

          {loadingSens && !sensitivityRows.length ? (
            <p className="text-sm text-slate-500">Loading sensitivity…</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <SensitivityTable
                title="CAPEX Sensitivity"
                rows={capexSens}
                baselineNpvM={baselineNpvM}
                valueFormatter={(v) => `$${(v / 1_000_000).toFixed(2)}M`}
              />

              <SensitivityTable
                title="Discount Rate (%) Sensitivity"
                rows={discountSens}
                baselineNpvM={baselineNpvM}
                valueFormatter={(v) => `${Number(v).toFixed(2)}%`}
              />
            </div>
          )}
        </div>
      )}

      <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
    </div>
  );
}

/* --- small helper components --- */

function SumCard({ title, value, accent = "text-slate-900", desc }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top: what is being measured (large) */}
      <p className="text-xl md:text-2xl font-extrabold text-slate-900">
        {title}
      </p>

      {/* Middle: numeric value (largest + colored) */}
      <p className={`mt-1 text-2xl md:text-3xl font-extrabold ${accent}`}>
        {value}
      </p>

      {/* Bottom: optional subtitle/unit (large but ≤ value size) */}
      {desc && (
        <p className="mt-2 text-lg md:text-xl font-semibold text-slate-500">
          {desc}
        </p>
      )}
    </div>
  );
}

function WellChar({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm md:text-base font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function SensitivityTable({ title, rows, baselineNpvM, valueFormatter }) {
  const npvToM = (v) => Number(v || 0) / 1_000_000;

  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>

      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Variation (%)
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  Parameter Value
                </th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">
                  NPV ($M)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => {
                const npvM = npvToM(r.npv);
                const color =
                  npvM >= baselineNpvM
                    ? "text-emerald-600"
                    : npvM >= 0
                    ? "text-amber-600"
                    : "text-rose-600";

                return (
                  <tr key={`${title}-${r.idx}`} className="hover:bg-slate-50">
                    <td className="px-3 py-2">
                      {r.variation_percentage > 0 ? "+" : ""}
                      {r.variation_percentage}
                    </td>
                    <td className="px-3 py-2">
                      {valueFormatter(r.parameter_value)}
                    </td>
                    <td className={`px-3 py-2 font-semibold ${color}`}>
                      ${npvM.toFixed(2)}M
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No data.</p>
      )}
    </div>
  );
}
