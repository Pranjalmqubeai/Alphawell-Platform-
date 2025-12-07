// // src/components/AlphaWell/tabs/Production.jsx
// import React, { useState, useEffect } from "react";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   AreaChart,
//   Area,
// } from "recharts";
// import { useAlphaWell } from "../../../context/AlphaWellContext";
// import ExecParamsModal from "./ExecParamsModal";

// export default function Production() {
//   const { productionData, wellParams, lastApiResponse } = useAlphaWell();
//   const [openEdit, setOpenEdit] = useState(false);

//   // derive metrics from latest API response
//   const productionMetrics = lastApiResponse?.production_metrics || null;

//   useEffect(() => {
//     // console.log("Production Data from context:", productionData);
//     // console.log("Well Params from context:", wellParams);
//     // console.log("Production Metrics from API:", productionMetrics);
//   }, [productionData, wellParams, productionMetrics]);

//   const formatNumber = (value, decimals = 0) => {
//     if (value === undefined || value === null || isNaN(value)) return "-";
//     return Number(value).toLocaleString(undefined, {
//       maximumFractionDigits: decimals,
//       minimumFractionDigits: decimals,
//     });
//   };

//   if (!productionData?.length || !productionMetrics) {
//     return (
//       <div className="p-6 bg-white rounded-xl shadow text-gray-700">
//         No production data yet. Please run Analyze.
//       </div>
//     );
//   }

//   const peakOil = productionMetrics.peak_oil_production;
//   const peakGas = productionMetrics.peak_gas_production;
//   const peakWater = productionMetrics.peak_water_production;

//   return (
//     <div className="space-y-6">
//       {/* KPI BOXES */}
//       <div className="bg-white/80 rounded-2xl shadow-md border border-slate-100 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">
//             Production KPIs
//           </h3>
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="px-3 py-2 cursor-pointer rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
//           >
//             Edit your parameters
//           </button>
//         </div>

//         <div className="grid gap-4 md:grid-cols-3">
//           {/* Totals */}
//           <NumberTile
//             title="Total Oil"
//             value={`${formatNumber(productionMetrics.total_oil_eur, 0)} bbl`}
//             sub="Estimated Ultimate Recovery"
//             valueColor="text-orange-600"
//             chipLabel="Oil"
//             chipColor="bg-orange-50 text-orange-700"
//           />
//           <NumberTile
//             title="Total Gas"
//             value={`${formatNumber(productionMetrics.total_gas_eur, 0)} mcf`}
//             sub="Estimated Ultimate Recovery"
//             valueColor="text-purple-600"
//             chipLabel="Gas"
//             chipColor="bg-purple-50 text-purple-700"
//           />
//           <NumberTile
//             title="Total Water"
//             value={`${formatNumber(productionMetrics.total_water, 0)} bbl`}
//             sub={`Over ${wellParams?.predictionHorizon || "-"} years`}
//             valueColor="text-sky-600"
//             chipLabel="Water"
//             chipColor="bg-sky-50 text-sky-700"
//           />

//           {/* Year 1 */}
//           <NumberTile
//             title="Year 1 Oil Production"
//             value={`${formatNumber(productionMetrics.year1_oil, 0)} bbl`}
//             sub="First 12 months"
//             valueColor="text-orange-600"
//             chipLabel="Year 1"
//             chipColor="bg-orange-50 text-orange-700"
//           />
//           <NumberTile
//             title="Year 1 Gas Production"
//             value={`${formatNumber(productionMetrics.year1_gas, 0)} mcf`}
//             sub="First 12 months"
//             valueColor="text-purple-600"
//             chipLabel="Year 1"
//             chipColor="bg-purple-50 text-purple-700"
//           />
//           <NumberTile
//             title="Year 1 Water Production"
//             value={`${formatNumber(productionMetrics.year1_water, 0)} bbl`}
//             sub="First 12 months"
//             valueColor="text-sky-600"
//             chipLabel="Year 1"
//             chipColor="bg-sky-50 text-sky-700"
//           />

//           {/* Peaks */}
//           {/* <NumberTile
//             title="Peak Oil Month"
//             value={`Month ${peakOil?.month ?? "-"}`}
//             sub={`${formatNumber(peakOil?.production, 0)} bbl/mo`}
//             valueColor="text-orange-600"
//             chipLabel="Peak"
//             chipColor="bg-orange-50 text-orange-700"
//           />
//           <NumberTile
//             title="Peak Gas Month"
//             value={`Month ${peakGas?.month ?? "-"}`}
//             sub={`${formatNumber(peakGas?.production, 0)} mcf/mo`}
//             valueColor="text-purple-600"
//             chipLabel="Peak"
//             chipColor="bg-purple-50 text-purple-700"
//           />
//           <NumberTile
//             title="Peak Water Month"
//             value={`Month ${peakWater?.month ?? "-"}`}
//             sub={`${formatNumber(peakWater?.production, 0)} bbl/mo`}
//             valueColor="text-sky-600"
//             chipLabel="Peak"
//             chipColor="bg-sky-50 text-sky-700"
//           /> */}
//         </div>
//       </div>

//       {/* Monthly production chart + title moved here */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-bold text-gray-900">
//             Production Forecast Simulation
//           </h2>
//         </div>
//         <ResponsiveContainer width="100%" height={400}>
//           <LineChart data={productionData.filter((_, i) => i % 2 === 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//             <YAxis tick={{ fontSize: 12 }} />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="oil"
//               stroke="#f97316"
//               strokeWidth={2}
//               name="Oil (bbl/mo)"
//             />
//             <Line
//               type="monotone"
//               dataKey="gas"
//               stroke="#8b5cf6"
//               strokeWidth={2}
//               name="Gas (mcf/mo)"
//             />
//             <Line
//               type="monotone"
//               dataKey="water"
//               stroke="#3b82f6"
//               strokeWidth={2}
//               name="Water (bbl/mo)"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Cumulative production */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Cumulative Production
//         </h3>
//         <ResponsiveContainer width="100%" height={350}>
//           <AreaChart data={productionData.filter((_, i) => i % 3 === 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//             <YAxis tick={{ fontSize: 12 }} />
//             <Tooltip />
//             <Legend />
//             <Area
//               type="monotone"
//               dataKey="cumulativeOil"
//               stackId="1"
//               stroke="#f97316"
//               fill="#f97316"
//               fillOpacity={0.6}
//               name="Cumulative Oil (bbl)"
//             />
//             <Area
//               type="monotone"
//               dataKey="cumulativeGas"
//               stackId="2"
//               stroke="#8b5cf6"
//               fill="#8b5cf6"
//               fillOpacity={0.6}
//               name="Cumulative Gas (mcf)"
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Water cut */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Water Cut Evolution
//         </h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={productionData.filter((_, i) => i % 3 === 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//             <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="waterCut"
//               stroke="#3b82f6"
//               strokeWidth={2}
//               name="Water Cut (%)"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
//     </div>
//   );
// }

// function NumberTile({
//   title,
//   value,
//   sub,
//   valueColor = "text-slate-900",
//   chipLabel,
//   chipColor = "bg-slate-100 text-slate-700",
// }) {
//   return (
//     <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-1">
//         <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
//           {title}
//         </p>
//         {chipLabel && (
//           <span
//             className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${chipColor}`}
//           >
//             {chipLabel}
//           </span>
//         )}
//       </div>
//       <p className={`mt-1 text-2xl font-bold ${valueColor}`}>{value}</p>
//       <p className="mt-1 text-sm text-slate-500">{sub}</p>
//     </div>
//   );
// }

// src/components/AlphaWell/tabs/Production.jsx

// import React, { useState, useEffect, useMemo } from "react";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   AreaChart,
//   Area,
// } from "recharts";
// import { useAlphaWell } from "../../../context/AlphaWellContext";
// import ExecParamsModal from "./ExecParamsModal";

// export default function Production() {
//   const { productionData, wellParams, lastApiResponse } = useAlphaWell();
//   const [openEdit, setOpenEdit] = useState(false);

//   // new: fetch production data from S3 URL
//   const [prodUrlData, setProdUrlData] = useState([]);
//   const [prodUrlLoading, setProdUrlLoading] = useState(false);
//   const [prodUrlError, setProdUrlError] = useState(null);

//   const productionMetrics = lastApiResponse?.production_metrics || null;
//   const productionDataUrl = lastApiResponse?.production_data_url || null;

//   useEffect(() => {
//     let cancelled = false;

//     const fetchProdUrl = async () => {
//       if (!productionDataUrl) {
//         setProdUrlData([]);
//         return;
//       }
//       setProdUrlLoading(true);
//       setProdUrlError(null);

//       try {
//         const res = await fetch(productionDataUrl);
//         if (!res.ok) throw new Error(`production_data_url error: ${res.status}`);
//         const json = await res.json();
//         if (!cancelled) {
//           setProdUrlData(Array.isArray(json) ? json : []);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setProdUrlError(e.message || "Failed to load production_data_url.json");
//           setProdUrlData([]);
//         }
//       } finally {
//         if (!cancelled) setProdUrlLoading(false);
//       }
//     };

//     fetchProdUrl();
//     return () => {
//       cancelled = true;
//     };
//   }, [productionDataUrl]);

//   const formatNumber = (value, decimals = 0) => {
//     if (value === undefined || value === null || Number.isNaN(Number(value)))
//       return "-";
//     return Number(value).toLocaleString(undefined, {
//       maximumFractionDigits: decimals,
//       minimumFractionDigits: decimals,
//     });
//   };

//   /**
//    * Prefer S3 URL data if available.
//    * Fallback to context productionData so UI doesn’t break.
//    */
//   const derivedSeries = useMemo(() => {
//     // --- from S3 URL ---
//     if (prodUrlData?.length) {
//       let cumCombined = 0;

//       return prodUrlData.map((d) => {
//         const month = Number(d.month ?? d.time ?? 0);
//         const oil = Number(d.gross_production_oil_bbls ?? 0);
//         const gas = Number(d.gross_production_wh_gas_mcf ?? 0);
//         const water = Number(d.gross_production_water_bbls ?? 0);
//         const water_cut =
//           d.water_cut !== undefined && d.water_cut !== null
//             ? Number(d.water_cut)
//             : null;

//         cumCombined += oil + gas;

//         return {
//           month,
//           date: d.date ? String(d.date).slice(0, 10) : `M${month}`,
//           oil,
//           gas,
//           water,
//           water_cut,
//           cumulative_combined: cumCombined,
//         };
//       });
//     }

//     // --- fallback: existing context data ---
//     if (productionData?.length) {
//       let cumCombined = 0;
//       return productionData.map((d, i) => {
//         const month = i + 1;
//         const oil = Number(d.oil ?? 0);
//         const gas = Number(d.gas ?? 0);
//         const water = Number(d.water ?? 0);
//         const water_cut =
//           d.waterCut !== undefined && d.waterCut !== null
//             ? Number(d.waterCut)
//             : null;

//         cumCombined += oil + gas;

//         return {
//           month,
//           date: d.date || `M${month}`,
//           oil,
//           gas,
//           water,
//           water_cut,
//           cumulative_combined: cumCombined,
//         };
//       });
//     }

//     return [];
//   }, [prodUrlData, productionData]);

//   const hasSeries = derivedSeries.length > 0;

//   // Water cut scaling helper (fraction vs %)
//   const waterCutIsFraction = useMemo(() => {
//     if (!hasSeries) return false;
//     const vals = derivedSeries
//       .map((d) => d.water_cut)
//       .filter((v) => v !== null && v !== undefined);
//     if (!vals.length) return false;
//     const maxV = Math.max(...vals);
//     return maxV <= 1.5; // heuristic: <=1 means fraction
//   }, [derivedSeries, hasSeries]);

//   if (!hasSeries || !productionMetrics) {
//     return (
//       <div className="p-6 bg-white rounded-xl shadow text-gray-700">
//         {prodUrlLoading
//           ? "Loading production data..."
//           : "No production data yet. Please run Analyze."}
//         {prodUrlError && (
//           <p className="mt-2 text-xs text-red-600">{prodUrlError}</p>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* KPI BOXES (peaks hidden) */}
//       <div className="bg-white/80 rounded-2xl shadow-md border border-slate-100 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">
//             Production KPIs
//           </h3>
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="px-3 py-2 cursor-pointer rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
//           >
//             Edit your parameters
//           </button>
//         </div>

//         <div className="grid gap-4 md:grid-cols-3">
//           {/* Totals */}
//           <NumberTile
//             title="Total Oil"
//             value={`${formatNumber(productionMetrics.total_oil_eur, 0)} bbl`}
//             sub="Estimated Ultimate Recovery"
//             valueColor="text-orange-600"
//             chipLabel="Oil"
//             chipColor="bg-orange-50 text-orange-700"
//           />
//           <NumberTile
//             title="Total Gas"
//             value={`${formatNumber(productionMetrics.total_gas_eur, 0)} mcf`}
//             sub="Estimated Ultimate Recovery"
//             valueColor="text-purple-600"
//             chipLabel="Gas"
//             chipColor="bg-purple-50 text-purple-700"
//           />
//           <NumberTile
//             title="Total Water"
//             value={`${formatNumber(productionMetrics.total_water, 0)} bbl`}
//             sub={`Over ${wellParams?.predictionHorizon || "-"} years`}
//             valueColor="text-sky-600"
//             chipLabel="Water"
//             chipColor="bg-sky-50 text-sky-700"
//           />

//           {/* Year 1 */}
//           <NumberTile
//             title="Year 1 Oil Production"
//             value={`${formatNumber(productionMetrics.year1_oil, 0)} bbl`}
//             sub="First 12 months"
//             valueColor="text-orange-600"
//             chipLabel="Year 1"
//             chipColor="bg-orange-50 text-orange-700"
//           />
//           <NumberTile
//             title="Year 1 Gas Production"
//             value={`${formatNumber(productionMetrics.year1_gas, 0)} mcf`}
//             sub="First 12 months"
//             valueColor="text-purple-600"
//             chipLabel="Year 1"
//             chipColor="bg-purple-50 text-purple-700"
//           />
//           <NumberTile
//             title="Year 1 Water Production"
//             value={`${formatNumber(productionMetrics.year1_water, 0)} bbl`}
//             sub="First 12 months"
//             valueColor="text-sky-600"
//             chipLabel="Year 1"
//             chipColor="bg-sky-50 text-sky-700"
//           />
//         </div>
//       </div>

//       {/* Production Forecast Simulation – separate charts with units */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-gray-900">
//             Production Forecast Simulation
//           </h2>
//         </div>

//         {/* Oil */}
//         <div>
//           <h3 className="text-sm font-semibold text-slate-800 mb-2">
//             Oil Rate (bbl/mo)
//           </h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={derivedSeries.filter((_, i) => i % 2 === 0)}>
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
//                   value: "Oil Rate (bbl/mo)",
//                   angle: -90,
//                   position: "insideLeft",
//                   offset: 10,
//                 }}
//               />
//               <Tooltip
//                 formatter={(v) => [formatNumber(v, 0), "Oil (bbl/mo)"]}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="oil"
//                 stroke="#f97316"
//                 strokeWidth={2}
//                 name="Oil (bbl/mo)"
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Gas */}
//         <div>
//           <h3 className="text-sm font-semibold text-slate-800 mb-2">
//             Gas Rate (mcf/mo)
//           </h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={derivedSeries.filter((_, i) => i % 2 === 0)}>
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
//                   value: "Gas Rate (mcf/mo)",
//                   angle: -90,
//                   position: "insideLeft",
//                   offset: 10,
//                 }}
//               />
//               <Tooltip
//                 formatter={(v) => [formatNumber(v, 0), "Gas (mcf/mo)"]}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="gas"
//                 stroke="#8b5cf6"
//                 strokeWidth={2}
//                 name="Gas (mcf/mo)"
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Water */}
//         <div>
//           <h3 className="text-sm font-semibold text-slate-800 mb-2">
//             Water Rate (bbl/mo)
//           </h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={derivedSeries.filter((_, i) => i % 2 === 0)}>
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
//                   value: "Water Rate (bbl/mo)",
//                   angle: -90,
//                   position: "insideLeft",
//                   offset: 10,
//                 }}
//               />
//               <Tooltip
//                 formatter={(v) => [formatNumber(v, 0), "Water (bbl/mo)"]}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="water"
//                 stroke="#3b82f6"
//                 strokeWidth={2}
//                 name="Water (bbl/mo)"
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Cumulative Production (combined oil + gas via adding monthly values) */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Cumulative Production (Oil + Gas Combined)
//         </h3>

//         <ResponsiveContainer width="100%" height={350}>
//           <AreaChart data={derivedSeries.filter((_, i) => i % 3 === 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="month"
//               tick={{ fontSize: 12 }}
//               label={{ value: "Month", position: "insideBottom", offset: -5 }}
//             />
//             <YAxis
//               tick={{ fontSize: 12 }}
//               label={{
//                 value: "Cumulative (oil + gas)",
//                 angle: -90,
//                 position: "insideLeft",
//                 offset: 10,
//               }}
//             />
//             <Tooltip
//               formatter={(v) => [formatNumber(v, 0), "Cumulative (oil+gas)"]}
//             />
//             <Legend />
//             <Area
//               type="monotone"
//               dataKey="cumulative_combined"
//               stroke="#10b981"
//               fill="#10b981"
//               fillOpacity={0.55}
//               name="Cumulative Oil + Gas"
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Water Cut Evolution */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Water Cut Evolution
//         </h3>

//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={derivedSeries.filter((_, i) => i % 3 === 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="month"
//               tick={{ fontSize: 12 }}
//               label={{ value: "Month", position: "insideBottom", offset: -5 }}
//             />
//             <YAxis
//               tick={{ fontSize: 12 }}
//               domain={["auto", "auto"]}
//               label={{
//                 value: "Water Cut (%)",
//                 angle: -90,
//                 position: "insideLeft",
//                 offset: 10,
//               }}
//               tickFormatter={(v) =>
//                 waterCutIsFraction ? `${(v * 100).toFixed(0)}%` : `${v.toFixed(0)}%`
//               }
//             />
//             <Tooltip
//               formatter={(v) => [
//                 waterCutIsFraction
//                   ? `${(Number(v) * 100).toFixed(2)}%`
//                   : `${Number(v).toFixed(2)}%`,
//                 "Water Cut",
//               ]}
//             />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="water_cut"
//               stroke="#0ea5e9"
//               strokeWidth={2}
//               name="Water Cut"
//               dot={false}
//               connectNulls
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
//     </div>
//   );
// }

// function NumberTile({
//   title,
//   value,
//   sub,
//   valueColor = "text-slate-900",
//   chipLabel,
//   chipColor = "bg-slate-100 text-slate-700",
// }) {
//   return (
//     <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-1">
//         <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
//           {title}
//         </p>
//         {chipLabel && (
//           <span
//             className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${chipColor}`}
//           >
//             {chipLabel}
//           </span>
//         )}
//       </div>
//       <p className={`mt-1 text-2xl font-bold ${valueColor}`}>{value}</p>
//       <p className="mt-1 text-sm text-slate-500">{sub}</p>
//     </div>
//   );
// }






































// import React, { useState, useEffect, useMemo } from "react";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   AreaChart,
//   Area,
// } from "recharts";
// import { useAlphaWell } from "../../../context/AlphaWellContext";
// import ExecParamsModal from "./ExecParamsModal";

// export default function Production() {
//   const { productionData, wellParams, lastApiResponse } = useAlphaWell();
//   const [openEdit, setOpenEdit] = useState(false);

//   // new: fetch production data from S3 URL
//   const [prodUrlData, setProdUrlData] = useState([]);
//   const [prodUrlLoading, setProdUrlLoading] = useState(false);
//   const [prodUrlError, setProdUrlError] = useState(null);

//   const productionMetrics = lastApiResponse?.production_metrics || null;
//   const productionDataUrl = lastApiResponse?.production_data_url || null;

//   useEffect(() => {
//     let cancelled = false;

//     const fetchProdUrl = async () => {
//       if (!productionDataUrl) {
//         setProdUrlData([]);
//         return;
//       }
//       setProdUrlLoading(true);
//       setProdUrlError(null);

//       try {
//         const res = await fetch(productionDataUrl);
//         if (!res.ok)
//           throw new Error(`production_data_url error: ${res.status}`);
//         const json = await res.json();
//         if (!cancelled) {
//           setProdUrlData(Array.isArray(json) ? json : []);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setProdUrlError(
//             e.message || "Failed to load production_data_url.json"
//           );
//           setProdUrlData([]);
//         }
//       } finally {
//         if (!cancelled) setProdUrlLoading(false);
//       }
//     };

//     fetchProdUrl();
//     return () => {
//       cancelled = true;
//     };
//   }, [productionDataUrl]);

//   const formatNumber = (value, decimals = 0) => {
//     if (value === undefined || value === null || Number.isNaN(Number(value)))
//       return "-";
//     return Number(value).toLocaleString(undefined, {
//       maximumFractionDigits: decimals,
//       minimumFractionDigits: decimals,
//     });
//   };

//   /**
//    * Prefer S3 URL data if available.
//    * Fallback to context productionData so UI doesn’t break.
//    * NEW: compute cumulative_oil & cumulative_gas separately
//    */
//   const derivedSeries = useMemo(() => {
//     // --- from S3 URL ---
//     if (prodUrlData?.length) {
//       let cumCombined = 0;
//       let cumOil = 0;
//       let cumGas = 0;

//       return prodUrlData.map((d) => {
//         const month = Number(d.month ?? d.time ?? 0);
//         const oil = Number(d.gross_production_oil_bbls ?? 0);
//         const gas = Number(d.gross_production_wh_gas_mcf ?? 0);
//         const water = Number(d.gross_production_water_bbls ?? 0);
//         const water_cut =
//           d.water_cut !== undefined && d.water_cut !== null
//             ? Number(d.water_cut)
//             : null;

//         cumOil += oil;
//         cumGas += gas;
//         cumCombined += oil + gas;

//         return {
//           month,
//           date: d.date ? String(d.date).slice(0, 10) : `M${month}`,
//           oil,
//           gas,
//           water,
//           water_cut,
//           cumulative_oil: cumOil,
//           cumulative_gas: cumGas,
//           cumulative_combined: cumCombined,
//         };
//       });
//     }

//     // --- fallback: existing context data ---
//     if (productionData?.length) {
//       let cumCombined = 0;
//       let cumOil = 0;
//       let cumGas = 0;

//       return productionData.map((d, i) => {
//         const month = i + 1;
//         const oil = Number(d.oil ?? 0);
//         const gas = Number(d.gas ?? 0);
//         const water = Number(d.water ?? 0);
//         const water_cut =
//           d.waterCut !== undefined && d.waterCut !== null
//             ? Number(d.waterCut)
//             : null;

//         cumOil += oil;
//         cumGas += gas;
//         cumCombined += oil + gas;

//         return {
//           month,
//           date: d.date || `M${month}`,
//           oil,
//           gas,
//           water,
//           water_cut,
//           cumulative_oil: cumOil,
//           cumulative_gas: cumGas,
//           cumulative_combined: cumCombined,
//         };
//       });
//     }

//     return [];
//   }, [prodUrlData, productionData]);

//   const hasSeries = derivedSeries.length > 0;

//   // Water cut scaling helper (fraction vs %)
//   const waterCutIsFraction = useMemo(() => {
//     if (!hasSeries) return false;
//     const vals = derivedSeries
//       .map((d) => d.water_cut)
//       .filter((v) => v !== null && v !== undefined);
//     if (!vals.length) return false;
//     const maxV = Math.max(...vals);
//     return maxV <= 1.5; // heuristic: <=1 means fraction
//   }, [derivedSeries, hasSeries]);

//   if (!hasSeries || !productionMetrics) {
//     return (
//       <div className="p-6 bg-white rounded-xl shadow text-gray-700">
//         {prodUrlLoading
//           ? "Loading production data..."
//           : "No production data yet. Please run Analyze."}
//         {prodUrlError && (
//           <p className="mt-2 text-xs text-red-600">{prodUrlError}</p>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* KPI BOXES – updated layout (Title → Value → Unit, large fonts) */}
//       <div className="bg-white/80 rounded-2xl shadow-md border border-slate-100 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">
//             Production KPIs
//           </h3>
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="px-3 py-2 cursor-pointer rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
//           >
//             Edit your parameters
//           </button>
//         </div>

//         <div className="grid gap-4 md:grid-cols-3">
//           {/* Totals */}
//           <NumberTile
//             title="Total Oil EUR"
//             value={
//               <span className="text-orange-600">
//                 {formatNumber(productionMetrics.total_oil_eur, 0)}
//                 <span className="text-gray-500 text-2xl font-normal ml-2">
//                   (bbl)
//                 </span>
//               </span>
//             }
//           />

//           <NumberTile
//             title="Total Gas EUR"
//             value={
//               <span className="text-purple-600">
//                 {formatNumber(productionMetrics.total_gas_eur, 0)}
//                 <span className="text-gray-500 text-2xl font-normal ml-2">
//                   (mcf)
//                 </span>
//               </span>
//             }
//           />

//           <NumberTile
//             title="Total Water"
//             value={
//               <span className="text-sky-600">
//                 {formatNumber(productionMetrics.total_water, 0)}
//                 <span className="text-gray-500 text-2xl font-normal ml-2">
//                   (bbl)
//                 </span>
//               </span>
//             }
//           />

//           {/* Year 1 */}
//           <NumberTile
//             title="Year 1 Oil Production"
//             value={
//               <span className="text-orange-600">
//                 {formatNumber(productionMetrics.year1_oil, 0)}
//                 <span className="text-gray-500 text-2xl font-normal ml-2">
//                   (bbl)
//                 </span>
//               </span>
//             }
//           />

//           <NumberTile
//             title="Year 1 Gas Production"
//             value={
//               <span className="text-purple-600">
//                 {formatNumber(productionMetrics.year1_gas, 0)}
//                 <span className="text-gray-500 text-2xl font-normal ml-2">
//                   (mcf)
//                 </span>
//               </span>
//             }
//           />

//           <NumberTile
//             title="Year 1 Water Production"
//             value={
//               <span className="text-sky-600">
//                 {formatNumber(productionMetrics.year1_water, 0)}
//                 <span className="text-gray-500 text-2xl font-normal ml-2">
//                   (bbl)
//                 </span>
//               </span>
//             }
//           />
//         </div>
//       </div>

//       {/* Production Forecast Simulation – separate charts with units */}
//       {/* ... unchanged charts below ... */}

//       <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-bold text-gray-900">
//             Production Forecast
//           </h2>
//         </div>

//         {/* Oil */}
//         <div>
//           <h3 className="text-sm font-semibold text-slate-800 mb-2">
//             Oil  (bbl/month)
//           </h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={derivedSeries.filter((_, i) => i % 2 === 0)}>
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
//                   // value: " (bbl/mo)",
//                   angle: -90,
//                   position: "insideLeft",
//                   offset: 10,
//                 }}
//               />
//               <Tooltip
//                 formatter={(v) => [formatNumber(v, 0), "Oil (bbl/mo)"]}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="oil"
//                 stroke="#f97316"
//                 strokeWidth={2}
//                 name="Oil (bbl/mo)"
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Gas */}
//         <div>
//           <h3 className="text-sm font-semibold text-slate-800 mb-2">
//            Gas (mcf/month)
//           </h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={derivedSeries.filter((_, i) => i % 2 === 0)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="month"
//                 tick={{ fontSize: 12 }}
                
//               />
//               <YAxis
//                 tick={{ fontSize: 12 }}
//                 label={{
//                   // value: "(mcf/mo)",
//                   angle: -90,
//                   position: "insideLeft",
//                   offset: 10,
//                 }}
//               />
//               <Tooltip
//                 formatter={(v) => [formatNumber(v, 0), "Gas (mcf/mo)"]}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="gas"
//                 stroke="#8b5cf6"
//                 strokeWidth={2}
//                 name="Gas (mcf/mo)"
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Water */}
//         <div>
//           <h3 className="text-sm font-semibold text-slate-800 mb-2">
//             Water  (bbl/month)
//           </h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={derivedSeries.filter((_, i) => i % 2 === 0)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="month"
//                 tick={{ fontSize: 12 }}
//                 label={{
//                   // value: "Month",
//                   position: "insideBottom",
//                   offset: -5,
//                 }}
//               />
//               <YAxis
//                 tick={{ fontSize: 12 }}
//                 label={{
//                   // value: " (bbl/mo)",
//                   angle: -90,
//                   position: "insideLeft",
//                   offset: 10,
//                 }}
//               />
//               <Tooltip
//                 formatter={(v) => [formatNumber(v, 0), "Water (bbl/mo)"]}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="water"
//                 stroke="#3b82f6"
//                 strokeWidth={2}
//                 name="Water (bbl/mo)"
//                 dot={false}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* ===========================================================
//     CUMULATIVE OIL — SEPARATE CHART
// =========================================================== */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//            Oil  Cumulative  (bbl/month)
//         </h3>

//         <ResponsiveContainer width="100%" height={300}>
//           <AreaChart data={derivedSeries.filter((_, i) => i % 3 === 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="month"
//               tick={{ fontSize: 12 }}
              
//             />

//             <YAxis
//               tick={{ fontSize: 12 }}
            
//             />

//             <Tooltip formatter={(v) => [`${formatNumber(v, 0)} bbl`, "Oil"]} />
//             <Legend />

//             <Area
//               type="monotone"
//               dataKey="cumulative_oil"
//               stroke="#f97316"
//               fill="#fed7aa"
//               name="Cumulative Oil (bbl/mo)"
//               fillOpacity={0.7}
//               dot={false}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>

//       {/* ===========================================================
//     CUMULATIVE GAS — SEPARATE CHART
// =========================================================== */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//            Gas Cumulative  (mcf/month)
//         </h3>

//         <ResponsiveContainer width="100%" height={300}>
//           <AreaChart data={derivedSeries.filter((_, i) => i % 3 === 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="month"
//               tick={{ fontSize: 12 }}
              
//             />

//             <YAxis
//               tick={{ fontSize: 12 }}
              
//             />

//             <Tooltip formatter={(v) => [`${formatNumber(v, 0)} mcf`, "Gas"]} />
//             <Legend />

//             <Area
//               type="monotone"
//               dataKey="cumulative_gas"
//               stroke="#22c55e"
//               fill="#bbf7d0"
//               name="Cumulative Gas (mcf/mo)"
//               fillOpacity={0.7}
//               dot={false}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Water Cut Evolution */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Water Production Forecast (% / month)
//         </h3>

//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={derivedSeries.filter((_, i) => i % 3 === 0)}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="month"
//               tick={{ fontSize: 12 }}
              
//             />
//             <YAxis
//               tick={{ fontSize: 12 }}
//               domain={["auto", "auto"]}
              
//               tickFormatter={(v) =>
//                 waterCutIsFraction
//                   ? `${(v * 100).toFixed(0)}%`
//                   : `${v.toFixed(0)}%`
//               }
//             />
//             <Tooltip
//               formatter={(v) => [
//                 waterCutIsFraction
//                   ? `${(Number(v) * 100).toFixed(2)}%`
//                   : `${Number(v).toFixed(2)}%`,
//                 "Water Cut",
//               ]}
//             />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="water_cut"
//               stroke="#0ea5e9"
//               strokeWidth={2}
//               name="Water Production"
//               dot={false}
//               connectNulls
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
//     </div>
//   );
// }

// /** KPI tile with large Title → Value → Unit layout */
// function NumberTile({
//   title,
//   value,
//   unit,
//   valueColor = "text-slate-900",
//   chipLabel,
//   chipColor = "bg-slate-100 text-slate-700",
// }) {
//   return (
//     <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between mb-2">
//         {/* Top: what is being measured (large) */}
//         <p className="text-xl md:text-2xl font-extrabold text-slate-900">
//           {title}
//         </p>
//         {chipLabel && (
//           <span
//             className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${chipColor}`}
//           >
//             {chipLabel}
//           </span>
//         )}
//       </div>

//       {/* Middle: numeric value (largest) */}
//       <p className={`mt-1 text-3xl md:text-3xl font-extrabold ${valueColor}`}>
//         {value}
//       </p>

//       {/* Bottom: unit (large but <= value size) */}
//       <p className="mt-2 text-lg md:text-xl font-semibold text-slate-500">
//         {unit}
//       </p>
//     </div>
//   );
// }


import React, { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useAlphaWell } from "../../../context/AlphaWellContext";
import ExecParamsModal from "./ExecParamsModal";

export default function Production() {
  const { productionData, wellParams, lastApiResponse } = useAlphaWell();
  const [openEdit, setOpenEdit] = useState(false);

  // new: fetch production data from S3 URL
  const [prodUrlData, setProdUrlData] = useState([]);
  const [prodUrlLoading, setProdUrlLoading] = useState(false);
  const [prodUrlError, setProdUrlError] = useState(null);

  const productionMetrics = lastApiResponse?.production_metrics || null;
  const productionDataUrl = lastApiResponse?.production_data_url || null;

  useEffect(() => {
    let cancelled = false;

    const fetchProdUrl = async () => {
      if (!productionDataUrl) {
        setProdUrlData([]);
        return;
      }
      setProdUrlLoading(true);
      setProdUrlError(null);

      try {
        const res = await fetch(productionDataUrl);
        if (!res.ok)
          throw new Error(`production_data_url error: ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setProdUrlData(Array.isArray(json) ? json : []);
        }
      } catch (e) {
        if (!cancelled) {
          setProdUrlError(
            e.message || "Failed to load production_data_url.json"
          );
          setProdUrlData([]);
        }
      } finally {
        if (!cancelled) setProdUrlLoading(false);
      }
    };

    fetchProdUrl();
    return () => {
      cancelled = true;
    };
  }, [productionDataUrl]);

  const formatNumber = (value, decimals = 0) => {
    if (value === undefined || value === null || Number.isNaN(Number(value)))
      return "-";
    return Number(value).toLocaleString(undefined, {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    });
  };

  /**
   * Prefer S3 URL data if available.
   * Fallback to context productionData so UI doesn’t break.
   * NEW: compute cumulative_oil & cumulative_gas separately
   */
  const derivedSeries = useMemo(() => {
    // --- from S3 URL ---
    if (prodUrlData?.length) {
      let cumCombined = 0;
      let cumOil = 0;
      let cumGas = 0;

      return prodUrlData.map((d) => {
        const month = Number(d.month ?? d.time ?? 0);
        const oil = Number(d.gross_production_oil_bbls ?? 0);
        const gas = Number(d.gross_production_wh_gas_mcf ?? 0);
        const water = Number(d.gross_production_water_bbls ?? 0);
        const water_cut =
          d.water_cut !== undefined && d.water_cut !== null
            ? Number(d.water_cut)
            : null;

        cumOil += oil;
        cumGas += gas;
        cumCombined += oil + gas;

        return {
          month,
          date: d.date ? String(d.date).slice(0, 10) : `M${month}`,
          oil,
          gas,
          water,
          water_cut,
          cumulative_oil: cumOil,
          cumulative_gas: cumGas,
          cumulative_combined: cumCombined,
        };
      });
    }

    // --- fallback: existing context data ---
    if (productionData?.length) {
      let cumCombined = 0;
      let cumOil = 0;
      let cumGas = 0;

      return productionData.map((d, i) => {
        const month = i + 1;
        const oil = Number(d.oil ?? 0);
        const gas = Number(d.gas ?? 0);
        const water = Number(d.water ?? 0);
        const water_cut =
          d.waterCut !== undefined && d.waterCut !== null
            ? Number(d.waterCut)
            : null;

        cumOil += oil;
        cumGas += gas;
        cumCombined += oil + gas;

        return {
          month,
          date: d.date || `M${month}`,
          oil,
          gas,
          water,
          water_cut,
          cumulative_oil: cumOil,
          cumulative_gas: cumGas,
          cumulative_combined: cumCombined,
        };
      });
    }

    return [];
  }, [prodUrlData, productionData]);

  const hasSeries = derivedSeries.length > 0;

  // Water cut scaling helper (fraction vs %)
  const waterCutIsFraction = useMemo(() => {
    if (!hasSeries) return false;
    const vals = derivedSeries
      .map((d) => d.water_cut)
      .filter((v) => v !== null && v !== undefined);
    if (!vals.length) return false;
    const maxV = Math.max(...vals);
    return maxV <= 1.5; // heuristic: <=1 means fraction
  }, [derivedSeries, hasSeries]);

  if (!hasSeries || !productionMetrics) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-gray-700">
        {prodUrlLoading
          ? "Loading production data..."
          : "No production data yet. Please run Analyze."}
        {prodUrlError && (
          <p className="mt-2 text-xs text-red-600">{prodUrlError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ==========================================================
          PROPOSED WELL LOCATION (same concept as Exec Summary)
      =========================================================== */}
      <div className="bg-white/90 rounded-2xl shadow-md border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">
            Proposed Well Location
          </h3>
        </div>

        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          <LocationTile
            label="Section ID"
            value={wellParams.sectionId || "—"}
          />
          <LocationTile
            label="Abstract ID"
            value={wellParams.abstractId || "—"}
          />
          
          
          
          <LocationTile
            label="Latitude"
            value={
              wellParams.latitude != null
                ? wellParams.latitude.toFixed(4)
                : "—"
            }
          />
          <LocationTile
            label="Longitude"
            value={
              wellParams.longitude != null
                ? wellParams.longitude.toFixed(4)
                : "—"
            }
          />
          <LocationTile
            label="Radius"
            value={`${Number(
              wellParams.radiusMiles != null ? wellParams.radiusMiles : 15
            ).toLocaleString()} mi`}
          />
          <LocationTile
            label="Trajectory"
            value={
              wellParams.trajectory
                ? String(wellParams.trajectory).toUpperCase()
                : "HORIZONTAL"
            }
          />
          <LocationTile
            label="Formation"
            value={wellParams.formation || "—"}
          />
          <LocationTile
            label="Prediction Horizon"
            value={
              wellParams.predictionHorizon
                ? `${wellParams.predictionHorizon} months`
                : "360 months"
            }
          />
          
        </div>
      </div>

      {/* KPI BOXES – updated layout (Title → Value → Unit, large fonts) */}
      <div className="bg-white/80 rounded-2xl shadow-md border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500">
            Production KPIs
          </h3>
          <button
            onClick={() => setOpenEdit(true)}
            className="px-3 py-2 cursor-pointer rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
          >
            Edit your parameters
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Totals */}
          <NumberTile
            title="Total Oil EUR"
            value={
              <span className="text-orange-600">
                {formatNumber(productionMetrics.total_oil_eur, 0)}
                <span className="text-gray-500 text-2xl font-normal ml-2">
                  (bbl)
                </span>
              </span>
            }
          />

          <NumberTile
            title="Total Gas EUR"
            value={
              <span className="text-purple-600">
                {formatNumber(productionMetrics.total_gas_eur, 0)}
                <span className="text-gray-500 text-2xl font-normal ml-2">
                  (mcf)
                </span>
              </span>
            }
          />

          <NumberTile
            title="Total Water"
            value={
              <span className="text-sky-600">
                {formatNumber(productionMetrics.total_water, 0)}
                <span className="text-gray-500 text-2xl font-normal ml-2">
                  (bbl)
                </span>
              </span>
            }
          />

          {/* Year 1 */}
          <NumberTile
            title="Year 1 Oil Production"
            value={
              <span className="text-orange-600">
                {formatNumber(productionMetrics.year1_oil, 0)}
                <span className="text-gray-500 text-2xl font-normal ml-2">
                  (bbl)
                </span>
              </span>
            }
          />

          <NumberTile
            title="Year 1 Gas Production"
            value={
              <span className="text-purple-600">
                {formatNumber(productionMetrics.year1_gas, 0)}
                <span className="text-gray-500 text-2xl font-normal ml-2">
                  (mcf)
                </span>
              </span>
            }
          />

          <NumberTile
            title="Year 1 Water Production"
            value={
              <span className="text-sky-600">
                {formatNumber(productionMetrics.year1_water, 0)}
                <span className="text-gray-500 text-2xl font-normal ml-2">
                  (bbl)
                </span>
              </span>
            }
          />
        </div>
      </div>

      {/* Production Forecast Simulation – existing charts, unchanged */}
      {/* ... your existing chart blocks remain exactly the same ... */}

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Production Forecast
          </h2>
        </div>

        {/* Oil */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Oil  (bbl/month)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={derivedSeries.filter((_, i) => i % 2 === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                label={{
                  value: "Month",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  // value: " (bbl/mo)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
              />
              <Tooltip
                formatter={(v) => [formatNumber(v, 0), "Oil (bbl/mo)"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="oil"
                stroke="#f97316"
                strokeWidth={2}
                name="Oil (bbl/mo)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gas */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
           Gas (mcf/month)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={derivedSeries.filter((_, i) => i % 2 === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  // value: "(mcf/mo)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
              />
              <Tooltip
                formatter={(v) => [formatNumber(v, 0), "Gas (mcf/mo)"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="gas"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Gas (mcf/mo)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Water */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            Water  (bbl/month)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={derivedSeries.filter((_, i) => i % 2 === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                label={{
                  // value: "Month",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  // value: " (bbl/mo)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                }}
              />
              <Tooltip
                formatter={(v) => [formatNumber(v, 0), "Water (bbl/mo)"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="water"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Water (bbl/mo)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Oil */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
           Oil  Cumulative  (bbl/month)
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={derivedSeries.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(v) => [`${formatNumber(v, 0)} bbl`, "Oil"]} />
            <Legend />
            <Area
              type="monotone"
              dataKey="cumulative_oil"
              stroke="#f97316"
              fill="#fed7aa"
              name="Cumulative Oil (bbl/mo)"
              fillOpacity={0.7}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative Gas */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
           Gas Cumulative  (mcf/month)
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={derivedSeries.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(v) => [`${formatNumber(v, 0)} mcf`, "Gas"]} />
            <Legend />
            <Area
              type="monotone"
              dataKey="cumulative_gas"
              stroke="#22c55e"
              fill="#bbf7d0"
              name="Cumulative Gas (mcf/mo)"
              fillOpacity={0.7}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Water Cut */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Water Production Forecast (% / month)
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={derivedSeries.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={["auto", "auto"]}
              tickFormatter={(v) =>
                waterCutIsFraction
                  ? `${(v * 100).toFixed(0)}%`
                  : `${v.toFixed(0)}%`
              }
            />
            <Tooltip
              formatter={(v) => [
                waterCutIsFraction
                  ? `${(Number(v) * 100).toFixed(2)}%`
                  : `${Number(v).toFixed(2)}%`,
                "Water Cut",
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="water_cut"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Water Production"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
    </div>
  );
}

/** KPI tile with large Title → Value → Unit layout */
function NumberTile({
  title,
  value,
  unit,
  valueColor = "text-slate-900",
  chipLabel,
  chipColor = "bg-slate-100 text-slate-700",
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xl md:text-2xl font-extrabold text-slate-900">
          {title}
        </p>
        {chipLabel && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${chipColor}`}
          >
            {chipLabel}
          </span>
        )}
      </div>
      <p className={`mt-1 text-3xl md:text-3xl font-extrabold ${valueColor}`}>
        {value}
      </p>
      {unit && (
        <p className="mt-2 text-lg md:text-xl font-semibold text-slate-500">
          {unit}
        </p>
      )}
    </div>
  );
}

/** Small pill-style tile for location metadata */
function LocationTile({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="text-slate-900 font-semibold tabular-nums">
        {value}
      </span>
    </div>
  );
}
