
// import React, { useState, useMemo, useEffect, useRef } from "react";
// import { MapPin } from "lucide-react";
// import {
//   ResponsiveContainer,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
// } from "recharts";
// import { useAlphaWell } from "../../../context/AlphaWellContext";

// // Use the same envs as AlphaWellContext / wellsApi
// const WELLS_API_BASE =
//   import.meta.env.VITE_WELLS_API_BASE || "http://54.210.165.50:8003";
// const WELLS_API_KEY =
//   import.meta.env.VITE_WELLS_API_KEY || "mqube-wells-ai-2025-access-token";

// export default function Neighborhood() {
//   const { wellParams, currentUser } = useAlphaWell();

//   // ---------- FORM (LEFT SIDEBAR) ----------
//   const [form, setForm] = useState({
//     latitude: wellParams?.latitude ?? 31.809364,
//     longitude: wellParams?.longitude ?? -104.049991,
//     radius_mi: 5,
//     initial_date: "2020-01-01",
//   });

//   const handleChange = (field) => (e) =>
//     setForm((p) => ({ ...p, [field]: e.target.value }));

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // ---------- DATA (RIGHT PANEL) ----------
//   const [kpis, setKpis] = useState(null);
//   const [wells, setWells] = useState([]);
//   const [prodMetrics, setProdMetrics] = useState(null);

//   const hasRunOnce = useRef(false);

//   const runAnalysis = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const body = {
//         // match backend expectation exactly
//         user_id: currentUser?.id ? `user_${currentUser.id}` : "user_123",
//         session_id: "session_456",
//         latitude: Number(form.latitude),
//         longitude: Number(form.longitude),
//         radius_mi: Number(form.radius_mi),
//         initial_date: form.initial_date,
//       };

//       console.log("[Neighborhood] request payload:", body);

//       const res = await fetch(`${WELLS_API_BASE}/api/neighborhood/analyze`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": WELLS_API_KEY,
//         },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) {
//         throw new Error(`API error: ${res.status}`);
//       }

//       const json = await res.json();
//       console.log("[Neighborhood] full API response:", json);

//       setKpis(json.neighborhood_kpis || null);

//       // ---- fetch wells.json ----
//       if (json.wells_url) {
//         try {
//           console.log("[Neighborhood] wells_url:", json.wells_url);
//           const wRes = await fetch(json.wells_url);
//           const wJson = await wRes.json();
//           console.log(
//             "[Neighborhood] wells.json raw (first 3 rows):",
//             Array.isArray(wJson) ? wJson.slice(0, 3) : wJson
//           );
//           setWells(Array.isArray(wJson) ? wJson : []);
//         } catch (wErr) {
//           console.error("[Neighborhood] wells.json fetch failed:", wErr);
//           setWells([]);
//         }
//       } else {
//         console.log("[Neighborhood] no wells_url in response");
//         setWells([]);
//       }

//       // ---- fetch neighborhood_production_metrics.json ----
//       if (json.neighborhood_production_metrics_url) {
//         try {
//           console.log(
//             "[Neighborhood] neighborhood_production_metrics_url:",
//             json.neighborhood_production_metrics_url
//           );
//           const mRes = await fetch(json.neighborhood_production_metrics_url);
//           const mJson = await mRes.json();
//           console.log("[Neighborhood] raw prodMetrics:", mJson);
//           setProdMetrics(mJson || null);
//         } catch (mErr) {
//           console.error(
//             "[Neighborhood] production metrics fetch failed:",
//             mErr
//           );
//           setProdMetrics(null);
//         }
//       } else {
//         console.log(
//           "[Neighborhood] no neighborhood_production_metrics_url in response"
//         );
//         setProdMetrics(null);
//       }
//     } catch (err) {
//       console.error("[Neighborhood] fetch failed:", err);
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-run once when the tab first opens
//   useEffect(() => {
//     if (!hasRunOnce.current) {
//       hasRunOnce.current = true;
//       runAnalysis();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---------- DERIVED ----------
//   const wellColumns = useMemo(
//     () => (wells.length ? Object.keys(wells[0]) : []),
//     [wells]
//   );

//   // log wells + table columns
//   useEffect(() => {
//     console.log("[Neighborhood] wells length:", wells.length);
//     if (wells.length) {
//       console.log("[Neighborhood] wellColumns:", wellColumns);
//       console.log("[Neighborhood] first well row:", wells[0]);
//     }
//   }, [wells, wellColumns]);

//   // log kpis
//   useEffect(() => {
//     if (kpis) {
//       console.log("[Neighborhood] kpis:", kpis);
//     }
//   }, [kpis]);

//   const formatCell = (key, value) => {
//     if (value == null || value === "") return "-";
//     if (typeof value === "number") {
//       return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
//     }
//     if (/date/i.test(key)) {
//       const d = new Date(value);
//       if (!isNaN(d)) return d.toLocaleDateString();
//     }
//     return String(value);
//   };

//   const prodChartData = useMemo(() => {
//     if (!prodMetrics) {
//       console.log(
//         "[Neighborhood] prodMetrics is null/undefined, chart data empty"
//       );
//       return [];
//     }

//     // make it defensive
//     const {
//       months = [],
//       oil_avg = [],
//       oil_eur = [],
//       gas_avg = [],
//       gas_eur = [],
//       water_avg = [],
//       water_eur = [],
//       avg_carbon_intensity = [],
//     } = prodMetrics;

//     if (!Array.isArray(months)) {
//       console.warn(
//         "[Neighborhood] prodMetrics.months is not an array, chart data empty",
//         months
//       );
//       return [];
//     }

//     const data = months.map((m, i) => ({
//       month: m,
//       oil_avg: oil_avg?.[i] ?? null,
//       gas_avg: gas_avg?.[i] ?? null,
//       water_avg: water_avg?.[i] ?? null,
//       oil_eur: oil_eur?.[i] ?? null,
//       gas_eur: gas_eur?.[i] ?? null,
//       water_eur: water_eur?.[i] ?? null,
//       avg_carbon_intensity: avg_carbon_intensity?.[i] ?? null,
//     }));

//     console.log(
//       "[Neighborhood] built prodChartData (first 10 points):",
//       data.slice(0, 10)
//     );
//     return data;
//   }, [prodMetrics]);

//   const getKpi = (k) => (kpis && Array.isArray(kpis[k]) ? kpis[k][0] : null);

//   // -------- production filter (initial / final) for offset wells --------
//   const [prodStats, setProdStats] = useState(null);
//   const [initialProdFilter, setInitialProdFilter] = useState(null);
//   const [finalProdFilter, setFinalProdFilter] = useState(null);

//   const pickNumeric = (w, keys) => {
//     for (const key of keys) {
//       if (key in w) {
//         const v = Number(w[key]);
//         if (Number.isFinite(v)) return v;
//       }
//     }
//     return null;
//   };

//   const getInitialProd = (w) =>
//     pickNumeric(w, [
//       "initial_production",
//       "initial_oil_rate",
//       "initial_rate",
//       "q_i",
//     ]);

//   const getFinalProd = (w) =>
//     pickNumeric(w, [
//       "final_production",
//       "final_oil_rate",
//       "final_rate",
//       "q_f",
//     ]);

//   useEffect(() => {
//     if (!wells.length) {
//       setProdStats(null);
//       setInitialProdFilter(null);
//       setFinalProdFilter(null);
//       return;
//     }

//     let minInit = Infinity,
//       maxInit = -Infinity,
//       minFin = Infinity,
//       maxFin = -Infinity;

//     wells.forEach((w) => {
//       const init = getInitialProd(w);
//       if (init !== null) {
//         minInit = Math.min(minInit, init);
//         maxInit = Math.max(maxInit, init);
//       }
//       const fin = getFinalProd(w);
//       if (fin !== null) {
//         minFin = Math.min(minFin, fin);
//         maxFin = Math.max(maxFin, fin);
//       }
//     });

//     if (!Number.isFinite(minInit) || !Number.isFinite(maxInit)) {
//       minInit = 0;
//       maxInit = 0;
//     }
//     if (!Number.isFinite(minFin) || !Number.isFinite(maxFin)) {
//       minFin = 0;
//       maxFin = 0;
//     }

//     setProdStats({
//       minInit,
//       maxInit,
//       minFin,
//       maxFin,
//     });

//     setInitialProdFilter(minInit);
//     setFinalProdFilter(maxFin);
//   }, [wells]);

//   const filteredWells = useMemo(() => {
//     if (!wells.length) return [];

//     return wells.filter((w) => {
//       // wells without metrics are always kept
//       const init = getInitialProd(w);
//       const fin = getFinalProd(w);

//       if (
//         initialProdFilter != null &&
//         init !== null &&
//         init < initialProdFilter
//       ) {
//         return false;
//       }
//       if (finalProdFilter != null && fin !== null && fin > finalProdFilter) {
//         return false;
//       }
//       return true;
//     });
//   }, [wells, initialProdFilter, finalProdFilter]);

//   // ================== LAYOUT ==================
//   return (
//     <div className="min-h-[70vh] w-full">
//       {/* stacked on smaller screens, side-by-side on xl+ */}
//       <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
//         {/* LEFT SIDEBAR */}
//         <aside className="w-full xl:max-w-sm xl:flex-shrink-0 bg-white rounded-2xl shadow-md border border-slate-100 p-5 xl:sticky xl:top-28">
//           <h2 className="text-lg font-semibold text-slate-900 mb-1">
//             Neighborhood Controls
//           </h2>
//           <p className="text-xs text-slate-500 mb-4">
//             Tune the search radius around your target well and pull nearby
//             offsets for benchmarking.
//           </p>

//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-3">
//               <LabeledInput
//                 label="Latitude"
//                 type="number"
//                 step="0.0001"
//                 value={form.latitude}
//                 onChange={handleChange("latitude")}
//               />
//               <LabeledInput
//                 label="Longitude"
//                 type="number"
//                 step="0.0001"
//                 value={form.longitude}
//                 onChange={handleChange("longitude")}
//               />
//             </div>

//             <LabeledInput
//               label="Radius (mi)"
//               type="number"
//               step="0.1"
//               value={form.radius_mi}
//               onChange={handleChange("radius_mi")}
//             />

//             <LabeledInput
//               label="Initial Date"
//               type="date"
//               value={form.initial_date}
//               onChange={handleChange("initial_date")}
//             />

//             {error && (
//               <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
//                 {error}
//               </p>
//             )}

//             <button
//               onClick={runAnalysis}
//               disabled={loading}
//               className="w-full cursor-pointer inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-60"
//             >
//               {loading ? "Running Neighborhood…" : "Run Neighborhood Analysis"}
//             </button>

//             <p className="text-[11px] text-slate-500">
//               Adjust inputs and re-run to refresh KPIs, offset wells, and
//               neighborhood graphs.
//             </p>
//           </div>
//         </aside>

//         {/* RIGHT CONTENT */}
//         <section className="flex-1 min-w-0 w-full space-y-6">
//           {/* KPI SUMMARY */}
//           <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
//             <h3 className="text-lg font-bold text-slate-900 mb-4">
//               Neighborhood Statistical Summary
//             </h3>
//             {kpis ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
//                 <StatCard
//                   title="Avg EUR – Oil"
//                   value={
//                     getKpi("avg_eur_oil_production") != null
//                       ? `${getKpi("avg_eur_oil_production").toLocaleString(
//                           undefined,
//                           { maximumFractionDigits: 0 }
//                         )} bbl`
//                       : "0 bbl"
//                   }
//                   color="bg-blue-50"
//                   tcolor="text-blue-800"
//                   vcolor="text-blue-900"
//                 />
//                 <StatCard
//                   title="Avg EUR – Gas"
//                   value={
//                     getKpi("avg_eur_gas_production") != null
//                       ? `${getKpi("avg_eur_gas_production").toLocaleString(
//                           undefined,
//                           { maximumFractionDigits: 0 }
//                         )} mcf`
//                       : "0 mcf"
//                   }
//                   color="bg-emerald-50"
//                   tcolor="text-emerald-800"
//                   vcolor="text-emerald-900"
//                 />
//                 <StatCard
//                   title="Avg EUR – Water"
//                   value={
//                     getKpi("avg_eur_water_production") != null
//                       ? `${getKpi("avg_eur_water_production").toLocaleString(
//                           undefined,
//                           { maximumFractionDigits: 0 }
//                         )} bbl`
//                       : "0 bbl"
//                   }
//                   color="bg-teal-50"
//                   tcolor="text-teal-800"
//                   vcolor="text-teal-900"
//                 />
//                 <StatCard
//                   title="Total Offset Wells"
//                   value={
//                     getKpi("total_wells") != null
//                       ? getKpi("total_wells").toLocaleString()
//                       : wells.length.toString()
//                   }
//                   color="bg-purple-50"
//                   tcolor="text-purple-800"
//                   vcolor="text-purple-900"
//                 />
//               </div>
//             ) : (
//               <p className="text-sm text-slate-500">
//                 Run the neighborhood analysis to populate KPIs.
//               </p>
//             )}
//           </div>

//           {/* SPATIAL BENCHMARK – MAP CARD (UPDATED) */}
//           <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
//             <div className="flex items-start justify-between gap-4 mb-4">
//               <div>
//                 <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
//                   <MapPin className="w-4 h-4 text-blue-600" />
//                   <span>Neighborhood Map & Sections</span>
//                 </h3>
//                 <p className="text-xs text-slate-500 mt-1">
//                   Showing wells within {form.radius_mi} mi of the target.
//                 </p>
//               </div>

//               <div className="text-right">
//                 <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
//                   Wells Found
//                 </p>
//                 <p className="text-2xl font-bold text-slate-900">
//                   {(
//                     getKpi("total_wells") ?? wells.length ?? 0
//                   ).toLocaleString()}
//                 </p>
//               </div>
//             </div>

//             <SectionWellMap
//               wells={wells}
//               targetLat={Number(form.latitude)}
//               targetLng={Number(form.longitude)}
//               radiusMi={Number(form.radius_mi)}
//             />
//           </div>

//           {/* OFFSET WELLS TABLE + FILTER */}
//           <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
//             <h3 className="text-lg font-bold text-slate-900 mb-4">
//               Offset Wells Analysis
//             </h3>

//             {prodStats && (prodStats.maxInit > prodStats.minInit ||
//               prodStats.maxFin > prodStats.minFin) && (
//               <div className="mb-4 grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
//                     <span>Min Initial Production</span>
//                     <span className="text-slate-800">
//                       {initialProdFilter != null
//                         ? initialProdFilter.toLocaleString(undefined, {
//                             maximumFractionDigits: 0,
//                           })
//                         : "All"}
//                     </span>
//                   </label>
//                   <input
//                     type="range"
//                     min={prodStats.minInit}
//                     max={prodStats.maxInit || prodStats.minInit + 1}
//                     step={
//                       prodStats.maxInit > prodStats.minInit
//                         ? Math.max(
//                             1,
//                             Math.round(
//                               (prodStats.maxInit - prodStats.minInit) / 20
//                             )
//                           )
//                         : 1
//                     }
//                     value={
//                       initialProdFilter != null
//                         ? initialProdFilter
//                         : prodStats.minInit
//                     }
//                     onChange={(e) =>
//                       setInitialProdFilter(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>

//                 <div>
//                   <label className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
//                     <span>Max Final Production</span>
//                     <span className="text-slate-800">
//                       {finalProdFilter != null
//                         ? finalProdFilter.toLocaleString(undefined, {
//                             maximumFractionDigits: 0,
//                           })
//                         : "All"}
//                     </span>
//                   </label>
//                   <input
//                     type="range"
//                     min={prodStats.minFin}
//                     max={prodStats.maxFin || prodStats.minFin + 1}
//                     step={
//                       prodStats.maxFin > prodStats.minFin
//                         ? Math.max(
//                             1,
//                             Math.round(
//                               (prodStats.maxFin - prodStats.minFin) / 20
//                             )
//                           )
//                         : 1
//                     }
//                     value={
//                       finalProdFilter != null
//                         ? finalProdFilter
//                         : prodStats.maxFin
//                     }
//                     onChange={(e) =>
//                       setFinalProdFilter(Number(e.target.value))
//                     }
//                     className="w-full"
//                   />
//                 </div>
//               </div>
//             )}

//             {filteredWells.length ? (
//               <div className="max-h-[380px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-100">
//                 <table className="min-w-max w-full text-xs md:text-sm">
//                   <thead className="bg-slate-50 sticky top-0 z-10">
//                     <tr className="border-b border-slate-200">
//                       {wellColumns.map((c) => (
//                         <th
//                           key={c}
//                           className="px-3 py-2 text-left font-semibold text-slate-700 uppercase tracking-wide text-[11px] whitespace-nowrap"
//                         >
//                           {c.replace(/_/g, " ")}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {filteredWells.map((w, i) => (
//                       <tr
//                         key={w.well_id || i}
//                         className={`${
//                           i % 2 === 0 ? "bg-sky-50/40" : "bg-white"
//                         } hover:bg-indigo-50/60 transition-colors`}
//                       >
//                         {wellColumns.map((c) => (
//                           <td
//                             key={c}
//                             className="px-3 py-1.5 whitespace-nowrap text-slate-700"
//                           >
//                             {formatCell(c, w[c])}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-sm text-slate-500">
//                 No wells match the selected production filters. Adjust the
//                 sliders above or run the analysis to load offset wells from{" "}
//                 <code>wells.json</code>.
//               </p>
//             )}
//           </div>

//           {/* CHARTS — NEW ROW LAYOUT */}
//           <div className="space-y-6">
//             {/* EUR build-up */}
//             <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
//               <h3 className="text-lg font-bold text-slate-900 mb-4">
//                 EUR Build-Up – Oil / Gas / Water
//               </h3>
//               {prodChartData.length ? (
//                 <ResponsiveContainer width="100%" height={260}>
//                   <BarChart data={prodChartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar
//                       dataKey="oil_eur"
//                       name="Oil EUR"
//                       fill="#3b82f6"
//                       radius={[4, 4, 0, 0]}
//                     />
//                     <Bar
//                       dataKey="gas_eur"
//                       name="Gas EUR"
//                       fill="#22c55e"
//                       radius={[4, 4, 0, 0]}
//                     />
//                     <Bar
//                       dataKey="water_eur"
//                       name="Water EUR"
//                       fill="#f97316"
//                       radius={[4, 4, 0, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <p className="text-sm text-slate-500">
//                   Run the analysis to see{" "}
//                   <code>neighborhood_production_metrics.json</code> results.
//                 </p>
//               )}
//             </div>

//             {/* EUR by offset well — full-width new row */}
//             <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
//               <h3 className="text-lg font-bold text-slate-900 mb-4">
//                 EUR by Offset Well – Oil / Gas
//               </h3>
//               {filteredWells.length ? (
//                 <ResponsiveContainer width="100%" height={260}>
//                   <BarChart data={filteredWells.slice(0, 20)}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis
//                       dataKey="well_id"
//                       tick={{ fontSize: 10 }}
//                       interval={0}
//                     />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar
//                       dataKey="cumulative_oil"
//                       name="Cumulative Oil (bbl)"
//                       fill="#3b82f6"
//                       radius={[4, 4, 0, 0]}
//                     />
//                     <Bar
//                       dataKey="cumulative_gas"
//                       name="Cumulative Gas (mcf)"
//                       fill="#22c55e"
//                       radius={[4, 4, 0, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <p className="text-sm text-slate-500">
//                   Uses <code>cumulative_oil</code> / <code>cumulative_gas</code>{" "}
//                   vs <code>well_id</code> from <code>wells.json</code>. No wells
//                   match the current filters.
//                 </p>
//               )}
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// /* ---------- section map (square + zoom + colored dots) ---------- */

// function SectionWellMap({ wells, targetLat, targetLng, radiusMi }) {
//   const [zoom, setZoom] = useState(1);

//   // If wells don’t have lat/lng, we still render a nice map with jitter
//   const points = useMemo(() => {
//     const safeWells = Array.isArray(wells) ? wells : [];

//     // Extract lat/lng when available
//     const withCoords = safeWells.map((w, i) => {
//       const lat = Number(w.latitude ?? w.lat);
//       const lng = Number(w.longitude ?? w.lng);
//       const has = Number.isFinite(lat) && Number.isFinite(lng);
//       return { ...w, lat, lng, has, i };
//     });

//     const hasAnyCoords = withCoords.some((w) => w.has);

//     // If any coords exist, normalize to [0,1] box
//     if (hasAnyCoords) {
//       const lats = withCoords.filter((w) => w.has).map((w) => w.lat);
//       const lngs = withCoords.filter((w) => w.has).map((w) => w.lng);
//       const minLat = Math.min(...lats),
//         maxLat = Math.max(...lats);
//       const minLng = Math.min(...lngs),
//         maxLng = Math.max(...lngs);

//       const latSpan = maxLat - minLat || 1;
//       const lngSpan = maxLng - minLng || 1;

//       return withCoords.map((w) => {
//         let lat = w.lat;
//         let lng = w.lng;

//         if (!w.has) {
//           // jitter around target if missing
//           lat = targetLat + (Math.random() - 0.5) * 0.02;
//           lng = targetLng + (Math.random() - 0.5) * 0.02;
//         }
//         const x = (lng - minLng) / lngSpan;
//         const y = 1 - (lat - minLat) / latSpan;
//         return { ...w, x, y };
//       });
//     }

//     // Otherwise: scatter in a circle around target
//     return withCoords.map((w) => {
//       const angle = Math.random() * Math.PI * 2;
//       const r = Math.random() * 0.45;
//       const x = 0.5 + r * Math.cos(angle);
//       const y = 0.5 + r * Math.sin(angle);
//       return { ...w, x, y };
//     });
//   }, [wells, targetLat, targetLng]);

//   const wellCount = wells?.length ?? 0;

//   const zoomIn = () => setZoom((z) => Math.min(4, z + 0.4));
//   const zoomOut = () => setZoom((z) => Math.max(1, z - 0.4));

//   return (
//     <div className="relative w-full rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50 overflow-hidden">
//       {/* header */}
//       <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/80 backdrop-blur">
//         <div className="text-xs text-slate-700 flex items-center gap-1">
//           <MapPin className="w-3 h-3 text-blue-600" />
//           <span>
//             Target: {targetLat.toFixed(4)}, {targetLng.toFixed(4)}
//           </span>
//         </div>
//         <div className="flex items-center gap-3 text-xs text-slate-600">
//           <span>
//             Radius: {radiusMi} mi • Wells: {wellCount}
//           </span>
//           <div className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-0.5">
//             <button
//               type="button"
//               onClick={zoomOut}
//               className="w-5 h-5 flex items-center justify-center text-slate-700 text-xs hover:bg-slate-100 rounded-full"
//             >
//               –
//             </button>
//             <span className="text-[10px] px-1">Zoom</span>
//             <button
//               type="button"
//               onClick={zoomIn}
//               className="w-5 h-5 flex items-center justify-center text-slate-700 text-xs hover:bg-slate-100 rounded-full"
//             >
//               +
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* square map */}
//       <div className="relative w-full aspect-square">
//         <div
//           className="absolute inset-0"
//           style={{
//             transform: `scale(${zoom})`,
//             transformOrigin: "50% 50%",
//           }}
//         >
//           {/* section grid backdrop */}
//           <div
//             className="absolute inset-0 opacity-70"
//             style={{
//               backgroundImage:
//                 "linear-gradient(to right, rgba(148,163,184,0.25) 1px, transparent 1px), " +
//                 "linear-gradient(to bottom, rgba(148,163,184,0.25) 1px, transparent 1px)",
//               backgroundSize: "60px 60px",
//             }}
//           />

//           {/* target marker */}
//           <div
//             className="absolute w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-200 shadow"
//             style={{
//               left: `50%`,
//               top: `50%`,
//               transform: "translate(-50%, -50%)",
//             }}
//             title="Target well"
//           />

//           {/* neighbor wells */}
//           {points.map((p) => {
//             const dist = Number(
//               p.distance_mi ?? p.distance ?? p.dist_mi ?? p.dist
//             );
//             const withinRadius = Number.isFinite(dist)
//               ? dist <= radiusMi
//               : true;

//             const colorClass = withinRadius
//               ? "bg-emerald-500/90"
//               : "bg-slate-400/90";

//             return (
//               <div
//                 key={p.well_id || p.id || p.i}
//                 className={`absolute w-3 h-3 rounded-full ring-2 ring-white shadow-sm hover:scale-125 transition-transform ${colorClass}`}
//                 style={{
//                   left: `${Math.max(2, Math.min(98, p.x * 100))}%`,
//                   top: `${Math.max(2, Math.min(98, p.y * 100))}%`,
//                   transform: "translate(-50%, -50%)",
//                 }}
//                 title={
//                   `${p.well_id || p.id || "Well"}\n` +
//                   `Distance: ${
//                     Number.isFinite(dist) ? dist.toFixed(2) : "N/A"
//                   } mi\n` +
//                   `Oil: ${Number(p.cumulative_oil || 0).toLocaleString()} bbl\n` +
//                   `Gas: ${Number(p.cumulative_gas || 0).toLocaleString()} mcf`
//                 }
//               />
//             );
//           })}

//           {/* corner labels to suggest "sections" */}
//           <div className="absolute left-3 top-3 text-[10px] text-slate-500 font-semibold bg-white/70 px-2 py-0.5 rounded">
//             NW Section
//           </div>
//           <div className="absolute right-3 top-3 text-[10px] text-slate-500 font-semibold bg-white/70 px-2 py-0.5 rounded">
//             NE Section
//           </div>
//           <div className="absolute left-3 bottom-3 text-[10px] text-slate-500 font-semibold bg-white/70 px-2 py-0.5 rounded">
//             SW Section
//           </div>
//           <div className="absolute right-3 bottom-3 text-[10px] text-slate-500 font-semibold bg-white/70 px-2 py-0.5 rounded">
//             SE Section
//           </div>
//         </div>
//       </div>

//       {/* small footer note */}
//       <div className="relative z-10 px-4 py-2 text-[11px] text-slate-500 bg-white/70 border-t border-slate-200">
//         Map is a relative section view (not a GIS basemap). Points use
//         <code> wells.json</code> latitude/longitude when available. Green = in
//         radius, Grey = outside radius.
//       </div>
//     </div>
//   );
// }

// /* ---------- small helpers ---------- */

// function LabeledInput({ label, ...rest }) {
//   return (
//     <label className="flex flex-col gap-1 text-xs">
//       <span className="font-medium text-slate-700">{label}</span>
//       <input
//         className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         {...rest}
//       />
//     </label>
//   );
// }

// function LegendDot({ color, label }) {
//   return (
//     <div className="flex items-center gap-2">
//       <div className={`w-3 h-3 rounded-full ${color}`} />
//       <span className="text-xs text-slate-700">{label}</span>
//     </div>
//   );
// }

// function StatCard({ title, value, color, tcolor, vcolor }) {
//   return (
//     <div className={`p-4 rounded-xl ${color}`}>
//       <p className={`text-[11px] font-semibold ${tcolor}`}>{title}</p>
//       <p className={`mt-1 text-xl font-bold ${vcolor}`}>{value}</p>
//     </div>
//   );
// }

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useAlphaWell } from "../../../context/AlphaWellContext";

// Use the same envs as AlphaWellContext / wellsApi
const WELLS_API_BASE =
  import.meta.env.VITE_WELLS_API_BASE || "http://54.210.165.50:8003";
const WELLS_API_KEY =
  import.meta.env.VITE_WELLS_API_KEY || "mqube-wells-ai-2025-access-token";

export default function Neighborhood() {
  const { wellParams, currentUser } = useAlphaWell();

  // ---------- FORM (LEFT SIDEBAR) ----------
  const [form, setForm] = useState({
    latitude: wellParams?.latitude ?? 31.809364,
    longitude: wellParams?.longitude ?? -104.049991,
    radius_mi: 5,
    initial_date: "2020-01-01",
  });

  const handleChange = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------- DATA (RIGHT PANEL) ----------
  const [kpis, setKpis] = useState(null);
  const [wells, setWells] = useState([]);
  const [prodMetrics, setProdMetrics] = useState(null);

  const hasRunOnce = useRef(false);

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const body = {
        // match backend expectation exactly
        user_id: currentUser?.id ? `user_${currentUser.id}` : "user_123",
        session_id: "session_456",
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        radius_mi: Number(form.radius_mi),
        initial_date: form.initial_date,
      };

      console.log("[Neighborhood] request payload:", body);

      const res = await fetch(`${WELLS_API_BASE}/api/neighborhood/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": WELLS_API_KEY,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const json = await res.json();
      console.log("[Neighborhood] full API response:", json);

      setKpis(json.neighborhood_kpis || null);

      // ---- fetch wells.json ----
      if (json.wells_url) {
        try {
          console.log("[Neighborhood] wells_url:", json.wells_url);
          const wRes = await fetch(json.wells_url);
          const wJson = await wRes.json();
          console.log(
            "[Neighborhood] wells.json raw (first 3 rows):",
            Array.isArray(wJson) ? wJson.slice(0, 3) : wJson
          );
          setWells(Array.isArray(wJson) ? wJson : []);
        } catch (wErr) {
          console.error("[Neighborhood] wells.json fetch failed:", wErr);
          setWells([]);
        }
      } else {
        console.log("[Neighborhood] no wells_url in response");
        setWells([]);
      }

      // ---- fetch neighborhood_production_metrics.json ----
      if (json.neighborhood_production_metrics_url) {
        try {
          console.log(
            "[Neighborhood] neighborhood_production_metrics_url:",
            json.neighborhood_production_metrics_url
          );
          const mRes = await fetch(json.neighborhood_production_metrics_url);
          const mJson = await mRes.json();
          console.log("[Neighborhood] raw prodMetrics:", mJson);
          setProdMetrics(mJson || null);
        } catch (mErr) {
          console.error(
            "[Neighborhood] production metrics fetch failed:",
            mErr
          );
          setProdMetrics(null);
        }
      } else {
        console.log(
          "[Neighborhood] no neighborhood_production_metrics_url in response"
        );
        setProdMetrics(null);
      }
    } catch (err) {
      console.error("[Neighborhood] fetch failed:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-run once when the tab first opens
  useEffect(() => {
    if (!hasRunOnce.current) {
      hasRunOnce.current = true;
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- DERIVED ----------
  const wellColumns = useMemo(
    () => (wells.length ? Object.keys(wells[0]) : []),
    [wells]
  );

  // logs
  useEffect(() => {
    console.log("[Neighborhood] wells length:", wells.length);
    if (wells.length) {
      console.log("[Neighborhood] wellColumns:", wellColumns);
      console.log("[Neighborhood] first well row:", wells[0]);
    }
  }, [wells, wellColumns]);

  useEffect(() => {
    if (kpis) {
      console.log("[Neighborhood] kpis:", kpis);
    }
  }, [kpis]);

  const formatCell = (key, value) => {
    if (value == null || value === "") return "-";
    if (typeof value === "number") {
      return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    if (/date/i.test(key)) {
      const d = new Date(value);
      if (!isNaN(d)) return d.toLocaleDateString();
    }
    return String(value);
  };

  const prodChartData = useMemo(() => {
    if (!prodMetrics) {
      console.log(
        "[Neighborhood] prodMetrics is null/undefined, chart data empty"
      );
      return [];
    }

    // make it defensive
    const {
      months = [],
      oil_avg = [],
      oil_eur = [],
      gas_avg = [],
      gas_eur = [],
      water_avg = [],
      water_eur = [],
      avg_carbon_intensity = [],
    } = prodMetrics;

    if (!Array.isArray(months)) {
      console.warn(
        "[Neighborhood] prodMetrics.months is not an array, chart data empty",
        months
      );
      return [];
    }

    const data = months.map((m, i) => ({
      month: m,
      oil_avg: oil_avg?.[i] ?? null,
      gas_avg: gas_avg?.[i] ?? null,
      water_avg: water_avg?.[i] ?? null,
      oil_eur: oil_eur?.[i] ?? null,
      gas_eur: gas_eur?.[i] ?? null,
      water_eur: water_eur?.[i] ?? null,
      avg_carbon_intensity: avg_carbon_intensity?.[i] ?? null,
    }));

    console.log(
      "[Neighborhood] built prodChartData (first 10 points):",
      data.slice(0, 10)
    );
    return data;
  }, [prodMetrics]);

  const getKpi = (k) => (kpis && Array.isArray(kpis[k]) ? kpis[k][0] : null);

  /* ---------- SECTION WELL MAP ---------- */
  function SectionWellMap({ wells, targetLat, targetLng, radiusMi }) {
    const points = useMemo(() => {
      const safeWells = Array.isArray(wells) ? wells : [];

      const withCoords = safeWells.map((w, i) => {
        const lat = Number(w.latitude ?? w.lat);
        const lng = Number(w.longitude ?? w.lng);
        const has = Number.isFinite(lat) && Number.isFinite(lng);
        const distanceMi = Number(w.distance_mi ?? w.distance ?? w.distance_miles);
        return { ...w, lat, lng, has, i, distanceMi };
      });

      const hasAnyCoords = withCoords.some((w) => w.has);

      if (hasAnyCoords) {
        const lats = withCoords.filter((w) => w.has).map((w) => w.lat);
        const lngs = withCoords.filter((w) => w.has).map((w) => w.lng);
        const minLat = Math.min(...lats),
          maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs),
          maxLng = Math.max(...lngs);

        const latSpan = maxLat - minLat || 1;
        const lngSpan = maxLng - minLng || 1;

        return withCoords.map((w) => {
          let x;
          let y;
          if (!w.has) {
            // jitter around target if missing
            const jLat = targetLat + (Math.random() - 0.5) * 0.02;
            const jLng = targetLng + (Math.random() - 0.5) * 0.02;
            x = (jLng - minLng) / lngSpan;
            y = 1 - (jLat - minLat) / latSpan;
          } else {
            x = (w.lng - minLng) / lngSpan;
            y = 1 - (w.lat - minLat) / latSpan;
          }
          const inRadius = Number.isFinite(w.distanceMi)
            ? w.distanceMi <= radiusMi
            : true;
          return { ...w, x, y, inRadius };
        });
      }

      // no coords: scatter around center
      return withCoords.map((w) => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.45;
        const x = 0.5 + r * Math.cos(angle);
        const y = 0.5 + r * Math.sin(angle);
        const inRadius = true;
        return { ...w, x, y, inRadius };
      });
    }, [wells, targetLat, targetLng, radiusMi]);

    const wellCount = wells?.length ?? 0;

    return (
      <div className="relative w-full rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-sky-50 overflow-hidden">
        {/* section grid backdrop */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.25) 1px, transparent 1px), " +
              "linear-gradient(to bottom, rgba(148,163,184,0.25) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* header band */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="text-xs text-slate-700">
            Target: {targetLat.toFixed(4)}, {targetLng.toFixed(4)}
          </div>
          <div className="text-xs text-slate-600">
            Radius: {radiusMi} mi • Wells: {wellCount}
          </div>
        </div>

        {/* square map area */}
        <div className="relative w-full aspect-square">
          {/* target marker */}
          <div
            className="absolute w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-200 shadow"
            style={{
              left: `50%`,
              top: `50%`,
              transform: "translate(-50%, -50%)",
            }}
            title="Target well"
          />

          {points.map((p) => (
            <div
              key={p.well_id || p.id || p.i}
              className={`absolute w-3 h-3 rounded-full ring-2 ring-white shadow-sm hover:scale-125 transition-transform ${
                p.inRadius ? "bg-emerald-500/90" : "bg-slate-400/80"
              }`}
              style={{
                left: `${Math.max(2, Math.min(98, p.x * 100))}%`,
                top: `${Math.max(2, Math.min(98, p.y * 100))}%`,
                transform: "translate(-50%, -50%)",
              }}
              title={
                `${p.well_id || p.id || "Well"}\n` +
                `Distance: ${
                  Number.isFinite(p.distanceMi) ? `${p.distanceMi.toFixed(2)} mi` : "N/A"
                }\n` +
                `Oil: ${Number(p.cumulative_oil || 0).toLocaleString()} bbl\n` +
                `Gas: ${Number(p.cumulative_gas || 0).toLocaleString()} mcf`
              }
            />
          ))}

          {/* “section” labels */}
          <div className="absolute left-3 top-3 text-[10px] text-slate-500 font-semibold bg-white/70 px-2 py-0.5 rounded">
            NW Section
          </div>
          <div className="absolute right-3 top-3 text-[10px] text-slate-500 font-semibold bg-white/70 px-2 py-0.5 rounded">
            NE Section
          </div>
          <div className="absolute left-3 bottom-3 text-[10px] text-slate-500 font-semibold bg-white/70 px-2 py-0.5 rounded">
            SW Section
          </div>
          <div className="absolute right-3 bottom-3 text-[10px] text-slate-500 font-semibold bg-white/70 px-2 py-0.5 rounded">
            SE Section
          </div>
        </div>

        {/* footer note */}
        <div className="relative z-10 px-4 py-2 text-[11px] text-slate-500 bg-white/70 border-t border-slate-200">
          Map is a relative section view (not a GIS basemap). Points use
          wells.json latitude/longitude when available. Green wells are within
          the selected radius; grey wells are outside.
        </div>
      </div>
    );
  }

  /* ---------- FILTERS: INITIAL / FINAL PRODUCTION DATE ---------- */

  const [initialProdFilter, setInitialProdFilter] = useState("");
  const [finalProdFilter, setFinalProdFilter] = useState("");

  const parseDateSafe = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d) ? null : d;
  };

  const getInitialProdDate = (w) =>
    w.initial_production_date ||
    w.initial_production_data ||
    w.initial_production;

  const getFinalProdDate = (w) =>
    w.final_production_date ||
    w.final_production_data ||
    w.final_production;

  const filteredWells = useMemo(() => {
    if (!wells.length) return [];

    const minDate = parseDateSafe(initialProdFilter);
    const maxDate = parseDateSafe(finalProdFilter);

    return wells.filter((w) => {
      const initDate = parseDateSafe(getInitialProdDate(w));
      const finDate = parseDateSafe(getFinalProdDate(w));

      let ok = true;

      if (minDate && initDate) {
        ok = ok && initDate >= minDate;
      }
      if (maxDate && finDate) {
        ok = ok && finDate <= maxDate;
      }

      return ok;
    });
  }, [wells, initialProdFilter, finalProdFilter]);

  // ================== LAYOUT ==================
  return (
    <div className="min-h-[70vh] w-full">
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
        {/* LEFT SIDEBAR */}
        <aside className="w-full xl:max-w-sm xl:flex-shrink-0 bg-white rounded-2xl shadow-md border border-slate-100 p-5 xl:sticky xl:top-28">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Neighborhood Controls
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Tune the search radius around your target well and pull nearby
            offsets for benchmarking.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput
                label="Latitude"
                type="number"
                step="0.0001"
                value={form.latitude}
                onChange={handleChange("latitude")}
              />
              <LabeledInput
                label="Longitude"
                type="number"
                step="0.0001"
                value={form.longitude}
                onChange={handleChange("longitude")}
              />
            </div>

            <LabeledInput
              label="Radius (mi)"
              type="number"
              step="0.1"
              value={form.radius_mi}
              onChange={handleChange("radius_mi")}
            />

            <LabeledInput
              label="Initial Date"
              type="date"
              value={form.initial_date}
              onChange={handleChange("initial_date")}
            />

            {error && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={runAnalysis}
              disabled={loading}
              className="w-full cursor-pointer inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Running Neighborhood…" : "Run Neighborhood Analysis"}
            </button>

            <p className="text-[11px] text-slate-500">
              Adjust inputs and re-run to refresh KPIs, offset wells, and
              neighborhood graphs.
            </p>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <section className="flex-1 min-w-0 w-full space-y-6">
          {/* KPI SUMMARY */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Neighborhood Statistical Summary
            </h3>
            {kpis ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                  title="Avg EUR – Oil"
                  value={
                    getKpi("avg_eur_oil_production") != null
                      ? `${getKpi("avg_eur_oil_production").toLocaleString(
                          undefined,
                          { maximumFractionDigits: 0 }
                        )} bbl`
                      : "0 bbl"
                  }
                  color="bg-blue-50"
                  tcolor="text-blue-800"
                  vcolor="text-blue-900"
                />
                <StatCard
                  title="Avg EUR – Gas"
                  value={
                    getKpi("avg_eur_gas_production") != null
                      ? `${getKpi("avg_eur_gas_production").toLocaleString(
                          undefined,
                          { maximumFractionDigits: 0 }
                        )} mcf`
                      : "0 mcf"
                  }
                  color="bg-emerald-50"
                  tcolor="text-emerald-800"
                  vcolor="text-emerald-900"
                />
                <StatCard
                  title="Avg EUR – Water"
                  value={
                    getKpi("avg_eur_water_production") != null
                      ? `${getKpi("avg_eur_water_production").toLocaleString(
                          undefined,
                          { maximumFractionDigits: 0 }
                        )} bbl`
                      : "0 bbl"
                  }
                  color="bg-teal-50"
                  tcolor="text-teal-800"
                  vcolor="text-teal-900"
                />
                <StatCard
                  title="Neighbor Wells"
                  value={
                    getKpi("total_wells") != null
                      ? getKpi("total_wells").toLocaleString()
                      : wells.length.toString()
                  }
                  color="bg-purple-50"
                  tcolor="text-purple-800"
                  vcolor="text-purple-900"
                />
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Run the neighborhood analysis to populate KPIs.
              </p>
            )}
          </div>

          {/* SPATIAL BENCHMARK – MAP CARD */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Neighborhood Map & Sections
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Showing wells within {form.radius_mi} mi of the target.
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                  Neighbor Wells
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {(
                    getKpi("total_wells") ??
                    wells.length ??
                    0
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <SectionWellMap
              wells={wells}
              targetLat={Number(form.latitude)}
              targetLng={Number(form.longitude)}
              radiusMi={Number(form.radius_mi)}
            />
          </div>

          {/* OFFSET WELLS TABLE + DATE FILTERS */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Neighbor Wells
            </h3>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput
                label="Initial Production Date ≥"
                type="date"
                value={initialProdFilter}
                onChange={(e) => setInitialProdFilter(e.target.value)}
              />
              <LabeledInput
                label="Final Production Date ≤"
                type="date"
                value={finalProdFilter}
                onChange={(e) => setFinalProdFilter(e.target.value)}
              />
            </div>

            {filteredWells.length ? (
              <div className="max-h-[380px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-100">
                <table className="min-w-max w-full text-xs md:text-sm">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr className="border-b border-slate-200">
                      {wellColumns.map((c) => (
                        <th
                          key={c}
                          className="px-3 py-2 text-left font-semibold text-slate-700 uppercase tracking-wide text-[11px] whitespace-nowrap"
                        >
                          {c.replace(/_/g, " ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWells.map((w, i) => (
                      <tr
                        key={w.well_id || i}
                        className={`${
                          i % 2 === 0 ? "bg-sky-50/40" : "bg-white"
                        } hover:bg-indigo-50/60 transition-colors`}
                      >
                        {wellColumns.map((c) => (
                          <td
                            key={c}
                            className="px-3 py-1.5 whitespace-nowrap text-slate-700"
                          >
                            {formatCell(c, w[c])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Run the analysis to load offset wells from{" "}
                <code>wells.json</code>, or relax your date filters.
              </p>
            )}
          </div>

          {/* CHARTS — NEW ROW LAYOUT */}
          <div className="space-y-6">
            {/* EUR build-up */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                EUR Build-Up – Oil / Gas / Water
              </h3>
              {prodChartData.length ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={prodChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="oil_eur"
                      name="Oil EUR"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="gas_eur"
                      name="Gas EUR"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="water_eur"
                      name="Water EUR"
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-slate-500">
                  Run the analysis to see{" "}
                  <code>neighborhood_production_metrics.json</code> results.
                </p>
              )}
            </div>

            {/* EUR by offset well — full-width new row */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                EUR by Offset Well – Oil / Gas
              </h3>
              {wells.length ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={wells.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="well_id"
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="cumulative_oil"
                      name="Cumulative Oil (bbl)"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="cumulative_gas"
                      name="Cumulative Gas (mcf)"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-slate-500">
                  Uses <code>cumulative_oil</code> /{" "}
                  <code>cumulative_gas</code> vs <code>well_id</code> from{" "}
                  <code>wells.json</code>.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- small helpers ---------- */

function LabeledInput({ label, ...rest }) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        {...rest}
      />
    </label>
  );
}

function StatCard({ title, value, color, tcolor, vcolor }) {
  return (
    <div className={`p-4 rounded-xl ${color}`}>
      <p className={`text-[11px] font-semibold ${tcolor}`}>{title}</p>
      <p className={`mt-1 text-xl font-bold ${vcolor}`}>{value}</p>
    </div>
  );
}
