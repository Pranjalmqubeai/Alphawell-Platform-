
// import React, { useState, useEffect, useMemo, useRef } from "react";
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
//   AreaChart,
//   Area,
// } from "recharts";
// import { useAlphaWell } from "../../../context/AlphaWellContext";

// export default function Neighborhood() {
//   const { wellParams, currentUser } = useAlphaWell();

//   // ---------- FORM (LEFT SIDEBAR) ----------
//   const [form, setForm] = useState({
//     latitude: wellParams?.latitude ?? 31.8457,
//     longitude: wellParams?.longitude ?? -102.3676,
//     radius_mi: 5,
//     env_fluid_type: "FRESH WATER",
//     env_well_type: "OIL",
//     trajectory: "HORIZONTAL",
//     env_wellbore_type: "SINGLE BORE",
//     formation: wellParams?.formation ?? "WOLFCAMP",
//     initial_date: "2015-01-01",
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

//   const runAnalysis = async (isInitial = false) => {
//     setLoading(true);
//     if (!isInitial) setError(null);

//     try {
//       const body = {
//         user_id: currentUser?.id?.toString() || "web_user",
//         session_id: "web_session_1",
//         latitude: parseFloat(form.latitude),
//         longitude: parseFloat(form.longitude),
//         radius_mi: parseFloat(form.radius_mi),
//         env_fluid_type: form.env_fluid_type,
//         env_well_type: form.env_well_type,
//         trajectory: form.trajectory,
//         env_wellbore_type: form.env_wellbore_type,
//         formation: form.formation,
//         initial_date: form.initial_date,
//       };

//       const res = await fetch("/api/neighborhood/analyze", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) throw new Error(`API error: ${res.status}`);

//       const json = await res.json();
//       setKpis(json.neighborhood_kpis || null);

//       if (json.wells_url) {
//         const wRes = await fetch(json.wells_url);
//         const wJson = await wRes.json();
//         setWells(Array.isArray(wJson) ? wJson : []);
//       } else setWells([]);

//       if (json.neighborhood_production_metrics_url) {
//         const mRes = await fetch(json.neighborhood_production_metrics_url);
//         const mJson = await mRes.json();
//         setProdMetrics(mJson);
//       } else setProdMetrics(null);
//     } catch (err) {
//       console.error(err);
//       if (!isInitial) setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // auto-run once when tab opens
//   useEffect(() => {
//     if (!hasRunOnce.current) {
//       hasRunOnce.current = true;
//       runAnalysis(true);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---------- DERIVED ----------
//   const wellColumns = useMemo(
//     () => (wells.length ? Object.keys(wells[0]) : []),
//     [wells]
//   );

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
//     if (!prodMetrics) return [];
//     const {
//       months,
//       oil_avg,
//       oil_eur,
//       gas_avg,
//       gas_eur,
//       water_avg,
//       water_eur,
//       avg_carbon_intensity,
//     } = prodMetrics;

//     return months.map((m, i) => ({
//       month: m,
//       oil_avg: oil_avg[i],
//       gas_avg: gas_avg[i],
//       water_avg: water_avg[i],
//       oil_eur: oil_eur[i],
//       gas_eur: gas_eur[i],
//       water_eur: water_eur[i],
//       avg_carbon_intensity: avg_carbon_intensity[i],
//     }));
//   }, [prodMetrics]);

//   const getKpi = (k) =>
//     kpis && Array.isArray(kpis[k]) ? kpis[k][0] : null;

//   // ================== LAYOUT ==================
//   return (
//     <div className="min-h-[70vh]">
//       {/* THIS flex IS WHAT MAKES LEFT SIDEBAR + RIGHT CONTENT */}
//       <div className="flex flex-col lg:flex-row gap-6 items-start">
//         {/* LEFT SIDEBAR */}
//         <aside className="w-full lg:max-w-sm lg:flex-shrink-0 bg-white rounded-2xl shadow-md border border-slate-100 p-5 lg:sticky lg:top-28">
//           <h2 className="text-lg font-semibold text-slate-900 mb-1">
//             Neighborhood Controls
//           </h2>
//           <p className="text-xs text-slate-500 mb-4">
//             Tune the search radius and filters to benchmark your well against
//             nearby Permian offsets.
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

//             <LabeledSelect
//               label="Fluid Type"
//               value={form.env_fluid_type}
//               onChange={handleChange("env_fluid_type")}
//               options={["FRESH WATER", "BRINE", "OTHER"]}
//             />

//             <LabeledSelect
//               label="Well Type"
//               value={form.env_well_type}
//               onChange={handleChange("env_well_type")}
//               options={["OIL", "GAS", "OIL & GAS"]}
//             />

//             <LabeledSelect
//               label="Trajectory"
//               value={form.trajectory}
//               onChange={handleChange("trajectory")}
//               options={["HORIZONTAL", "VERTICAL", "DIRECTIONAL"]}
//             />

//             <LabeledSelect
//               label="Wellbore Type"
//               value={form.env_wellbore_type}
//               onChange={handleChange("env_wellbore_type")}
//               options={["SINGLE BORE", "MULTI BORE"]}
//             />

//             <LabeledInput
//               label="Formation"
//               type="text"
//               value={form.formation}
//               onChange={handleChange("formation")}
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
//               onClick={() => runAnalysis(false)}
//               disabled={loading}
//               className="w-full cursor-pointer inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 disabled:opacity-60"
//             >
//               {loading ? "Running Neighborhood…" : "Run Neighborhood Analysis"}
//             </button>

//             <p className="text-[11px] text-slate-500">
//               Adjust inputs and re-run to refresh KPIs, offset wells, and
//               production graphs in real time.
//             </p>
//           </div>
//         </aside>

//         {/* RIGHT CONTENT */}
//         <section className="flex-1 space-y-6">
//           {/* KPI SUMMARY */}
//           <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
//             <h3 className="text-lg font-bold text-slate-900 mb-4">
//               Neighborhood Statistical Summary
//             </h3>
//             {kpis ? (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <StatCard
//                   title="Avg EUR – Oil"
//                   value={
//                     getKpi("avg_eur_oil_production") != null
//                       ? `${getKpi(
//                           "avg_eur_oil_production"
//                         ).toLocaleString(undefined, {
//                           maximumFractionDigits: 0,
//                         })} bbl`
//                       : "-"
//                   }
//                   color="bg-blue-50"
//                   tcolor="text-blue-800"
//                   vcolor="text-blue-900"
//                 />
//                 <StatCard
//                   title="Avg EUR – Gas"
//                   value={
//                     getKpi("avg_eur_gas_production") != null
//                       ? `${getKpi(
//                           "avg_eur_gas_production"
//                         ).toLocaleString(undefined, {
//                           maximumFractionDigits: 0,
//                         })} mcf`
//                       : "-"
//                   }
//                   color="bg-emerald-50"
//                   tcolor="text-emerald-800"
//                   vcolor="text-emerald-900"
//                 />
//                 <StatCard
//                   title="Avg EUR – Water"
//                   value={
//                     getKpi("avg_eur_water_production") != null
//                       ? `${getKpi(
//                           "avg_eur_water_production"
//                         ).toLocaleString(undefined, {
//                           maximumFractionDigits: 0,
//                         })} bbl`
//                       : "-"
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
//                       : wells.length
//                   }
//                   color="bg-purple-50"
//                   tcolor="text-purple-800"
//                   vcolor="text-purple-900"
//                 />
//               </div>
//             ) : (
//               <p className="text-sm text-slate-500">
//                 Initial neighborhood call will populate the KPIs here.
//               </p>
//             )}
//           </div>

//           {/* SPATIAL BENCHMARK – PERMIAN MAP */}
//           <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
//             <h3 className="text-lg font-bold text-slate-900 mb-4">
//               Spatial Benchmark Analysis
//             </h3>
//             <div className="relative rounded-xl overflow-hidden border border-blue-200 bg-gradient-to-br from-blue-50 to-emerald-50">
//               {/* Replace with real Permian image asset */}
//               <img
//                 src="/images/permian-basin-map.png"
//                 alt="Permian Basin"
//                 className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
//               />
//               <div className="relative text-center py-10 px-4">
//                 <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-3" />
//                 <h4 className="text-xl font-bold text-slate-900 mb-1">
//                   Target Well – Permian Basin
//                 </h4>
//                 <p className="text-sm text-slate-700">
//                   {(
//                     wellParams?.latitude ??
//                     parseFloat(form.latitude)
//                   ).toFixed(4)}
//                   ,{" "}
//                   {(
//                     wellParams?.longitude ??
//                     parseFloat(form.longitude)
//                   ).toFixed(4)}{" "}
//                   • {form.radius_mi} mi radius
//                 </p>
//                 <div className="flex items-center justify-center gap-6 mt-5 text-xs">
//                   <LegendDot color="bg-green-500" label="High Performer" />
//                   <LegendDot color="bg-yellow-500" label="Moderate" />
//                   <LegendDot color="bg-red-500" label="Underperformer" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* OFFSET WELLS TABLE */}
//           <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
//             <h3 className="text-lg font-bold text-slate-900 mb-4">
//               Offset Wells Analysis
//             </h3>
//             {wells.length ? (
//               <div className="overflow-x-auto max-h-[380px]">
//                 <table className="min-w-full text-xs md:text-sm">
//                   <thead className="bg-slate-50 sticky top-0">
//                     <tr>
//                       {wellColumns.map((c) => (
//                         <th
//                           key={c}
//                           className="px-3 py-2 text-left font-semibold text-slate-700 uppercase tracking-wide"
//                         >
//                           {c.replace(/_/g, " ")}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {wells.map((w, i) => (
//                       <tr
//                         key={w.well_id || i}
//                         className="hover:bg-slate-50"
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
//                 After a successful neighborhood run, all fields from{" "}
//                 <code>wells.json</code> will be displayed as columns here.
//               </p>
//             )}
//           </div>

//           {/* PRODUCTION & CI CHARTS */}
//           <div className="grid md:grid-cols-2 gap-6">
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
//                     <Bar dataKey="oil_eur" name="Oil EUR" />
//                     <Bar dataKey="gas_eur" name="Gas EUR" />
//                     <Bar dataKey="water_eur" name="Water EUR" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <p className="text-sm text-slate-500">
//                   EUR build-up from{" "}
//                   <code>neighborhood_production_metrics.json</code> will appear
//                   here after a run.
//                 </p>
//               )}
//             </div>

//             <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
//               <h3 className="text-lg font-bold text-slate-900 mb-4">
//                 Avg Production & Carbon Intensity
//               </h3>
//               {prodChartData.length ? (
//                 <ResponsiveContainer width="100%" height={260}>
//                   <AreaChart data={prodChartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Area
//                       type="monotone"
//                       dataKey="oil_avg"
//                       name="Oil Avg"
//                       fillOpacity={0.3}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="gas_avg"
//                       name="Gas Avg"
//                       fillOpacity={0.3}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="water_avg"
//                       name="Water Avg"
//                       fillOpacity={0.3}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="avg_carbon_intensity"
//                       name="Avg CI"
//                       fillOpacity={0.15}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <p className="text-sm text-slate-500">
//                   Monthly production + CI trend will be shown here after a run.
//                 </p>
//               )}
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// /* ------ small helpers ------ */

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

// function LabeledSelect({ label, options, ...rest }) {
//   return (
//     <label className="flex flex-col gap-1 text-xs">
//       <span className="font-medium text-slate-700">{label}</span>
//       <select
//         className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         {...rest}
//       >
//         {options.map((o) => (
//           <option key={o} value={o}>
//             {o}
//           </option>
//         ))}
//       </select>
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

// src/components/AlphaWell/tabs/Neighborhood.jsx
// src/components/AlphaWell/tabs/Neighborhood.jsx
// src/components/AlphaWell/tabs/Neighborhood.jsx
// src/components/AlphaWell/tabs/Neighborhood.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
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

  // log wells + table columns
  useEffect(() => {
    console.log("[Neighborhood] wells length:", wells.length);
    if (wells.length) {
      console.log("[Neighborhood] wellColumns:", wellColumns);
      console.log("[Neighborhood] first well row:", wells[0]);
    }
  }, [wells, wellColumns]);

  // log kpis
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

  const getKpi = (k) =>
    kpis && Array.isArray(kpis[k]) ? kpis[k][0] : null;

  // ================== LAYOUT ==================
  return (
    <div className="min-h-[70vh]">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT SIDEBAR */}
        <aside className="w-full lg:max-w-sm lg:flex-shrink-0 bg-white rounded-2xl shadow-md border border-slate-100 p-5 lg:sticky lg:top-28">
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
        <section className="flex-1 space-y-6">
          {/* KPI SUMMARY */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Neighborhood Statistical Summary
            </h3>
            {kpis ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  title="Avg EUR – Oil"
                  value={
                    getKpi("avg_eur_oil_production") != null
                      ? `${getKpi(
                          "avg_eur_oil_production"
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })} bbl`
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
                      ? `${getKpi(
                          "avg_eur_gas_production"
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })} mcf`
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
                      ? `${getKpi(
                          "avg_eur_water_production"
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })} bbl`
                      : "0 bbl"
                  }
                  color="bg-teal-50"
                  tcolor="text-teal-800"
                  vcolor="text-teal-900"
                />
                <StatCard
                  title="Total Offset Wells"
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
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Spatial Benchmark Analysis
            </h3>
            <div className="relative rounded-xl overflow-hidden border border-blue-200 bg-gradient-to-br from-blue-50 to-emerald-50">
              <img
                src="/images/permian-basin-map.png"
                alt="Permian Basin"
                className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
              />
              <div className="relative text-center py-10 px-4">
                <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-slate-900 mb-1">
                  Target Well – Permian Basin
                </h4>
                <p className="text-sm text-slate-700">
                  {(wellParams?.latitude ?? Number(form.latitude)).toFixed(4)},{" "}
                  {(wellParams?.longitude ?? Number(form.longitude)).toFixed(
                    4
                  )}{" "}
                  • {form.radius_mi} mi radius
                </p>
                <div className="flex items-center justify-center gap-6 mt-5 text-xs">
                  <LegendDot color="bg-green-500" label="High Performer" />
                  <LegendDot color="bg-yellow-500" label="Moderate" />
                  <LegendDot color="bg-red-500" label="Underperformer" />
                </div>
              </div>
            </div>
          </div>

          {/* OFFSET WELLS TABLE */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Offset Wells Analysis
            </h3>
            {wells.length ? (
              <div className="overflow-x-auto max-h-[380px]">
                <table className="min-w-full text-xs md:text-sm">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      {wellColumns.map((c) => (
                        <th
                          key={c}
                          className="px-3 py-2 text-left font-semibold text-slate-700 uppercase tracking-wide"
                        >
                          {c.replace(/_/g, " ")}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {wells.map((w, i) => (
                      <tr key={w.well_id || i} className="hover:bg-slate-50">
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
                <code>wells.json</code>.
              </p>
            )}
          </div>

          {/* PRODUCTION & WELL EUR CHARTS */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT: EUR build-up */}
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
                    <Bar dataKey="oil_eur" name="Oil EUR" />
                    <Bar dataKey="gas_eur" name="Gas EUR" />
                    <Bar dataKey="water_eur" name="Water EUR" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-slate-500">
                  Run the analysis to see{" "}
                  <code>neighborhood_production_metrics.json</code> results.
                </p>
              )}
            </div>

            {/* RIGHT: EUR by well from wells.json */}
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
                    <Bar dataKey="cumulative_oil" name="Cumulative Oil (bbl)" />
                    <Bar dataKey="cumulative_gas" name="Cumulative Gas (mcf)" />
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

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-xs text-slate-700">{label}</span>
    </div>
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
