// // pages/alphawell/tabs/ExecutiveSummary.jsx
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
//   } = useAlphaWell();
//   const [openEdit, setOpenEdit] = useState(false);
//   // Defensive guards
//   const hasData =
//     kpis &&
//     productionData?.length > 0 &&
//     economicData?.length > 0 &&
//     carbonData?.length > 0;

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

//   // Listen to header trigger
//   useEffect(() => {
//     const handler = async () => {
//       try {
//         await exportElementToPDF(
//           "exec-summary",
//           `AlphaWell_ExecutiveSummary_${wellParams.wellId || "Well"}.pdf`
//         );
//       } catch (e) {
//         const msg = e?.message || "Unknown error";
//         console.error("PDF export failed:", e);
//         alert(`Sorry, we couldn’t generate the PDF.\n\n${msg}`);
//       }
//     };
//     window.addEventListener("aw-export-exec-pdf", handler);
//     return () => window.removeEventListener("aw-export-exec-pdf", handler);
//   }, [wellParams.wellId]);

//   if (!hasData) {
//     return (
//       <div className="bg-white rounded-xl p-8 shadow">
//         <p className="text-gray-700">
//           Run <span className="font-semibold">Analyze</span> from the Input tab
//           to see the Executive Summary.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6" id="exec-summary">
//       {/* Verdict Banner */}
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
//               Decision Recommendation: {kpis.verdict}
//             </h2>
//             <p className="text-lg opacity-90">ESG Risk Level: {kpis.esgRisk}</p>
//           </div>
//           <div className="text-right">
//             {kpis.verdict === "Drill" ? (
//               <CheckCircle className="w-16 h-16" />
//             ) : (
//               <AlertTriangle className="w-16 h-16" />
//             )}
//           </div>
//         </div>
//         <div className="mt-4 flex flex-wrap gap-3">
//           {/* <button
//             onClick={() =>
//               window.dispatchEvent(new CustomEvent("aw-export-exec-pdf"))
//             }
//             className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium"
//           >
//             Generate PDF
//           </button> */}
//           <button
//             onClick={() => setOpenEdit(true)}
//             className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100"
//           >
//             Edit your parameters
//           </button>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600">NPV</span>
//             <DollarSign className="w-5 h-5 text-green-600" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">
//             {Number(kpis.npv).toLocaleString("en-US", {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })}
//           </p>

//           <p className="text-xs text-gray-500 mt-1">
//             @ {(economicParams.discountRate * 100).toFixed(0)}% discount (USD)
//           </p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600">IRR</span>
//           </div>
//           <p className="text-3xl font-bold text-gray-900">
//             {kpis.irr.toFixed(1)}%
//           </p>
//           <p className="text-xs text-gray-500 mt-1">Internal rate of return</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600">EUR Oil</span>
//             <Droplet className="w-5 h-5 text-orange-600" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">
//             {(kpis.eurOil / 1000).toFixed(0)}K
//           </p>
//           <p className="text-xs text-gray-500 mt-1">bbls cumulative</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600">EUR Gas</span>
//             <Zap className="w-5 h-5 text-purple-600" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">
//             {(kpis.eurGas / 1000).toFixed(0)}K
//           </p>
//           <p className="text-xs text-gray-500 mt-1">mcf cumulative</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600">Total CO₂</span>
//             <Zap className="w-5 h-5 text-emerald-600" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">
//             {kpis.totalCO2.toFixed(0)}
//           </p>
//           <p className="text-xs text-gray-500 mt-1">tons over life</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600">Carbon Intensity</span>
//             <Activity className="w-5 h-5 text-teal-600" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">
//             {kpis.avgIntensity.toFixed(0)}
//           </p>
//           <p className="text-xs text-gray-500 mt-1">g CO₂e/BOE</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600">Carbon Credits</span>
//             <DollarSign className="w-5 h-5 text-green-600" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">
//             ${kpis.carbonCreditPotential.toFixed(0)}K
//           </p>
//           <p className="text-xs text-gray-500 mt-1">potential revenue</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600">Payback</span>
//             <Calendar className="w-5 h-5 text-indigo-600" />
//           </div>
//           <p className="text-3xl font-bold text-gray-900">
//             {kpis.paybackMonths ?? "—"}
//           </p>
//           <p className="text-xs text-gray-500 mt-1">months to positive CF</p>
//         </div>
//       </div>

//       {/* Charts Row */}
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Production */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">
//             Production Decline Preview
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={productionData.filter((_, i) => i % 3 === 0)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="gas"
//                 stroke="#8b5cf6"
//                 strokeWidth={2}
//                 name="Gas (mcf/mo)"
//               />
//               <Line
//                 type="monotone"
//                 dataKey="oil"
//                 stroke="#f97316"
//                 strokeWidth={2}
//                 name="Oil (bbl/mo)"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Cash Flow */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">
//             Cumulative Cash Flow
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={economicData.filter((_, i) => i % 3 === 0)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip
//                 formatter={(v) => `$${(Number(v) / 1_000_000).toFixed(2)}M`}
//               />
//               <Legend />
//               <Area
//                 type="monotone"
//                 dataKey="cumulativeCashFlow"
//                 stroke="#10b981"
//                 fill="#10b981"
//                 fillOpacity={0.6}
//                 name="Cumulative CF ($)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Carbon Intelligence Row */}
//       {/* <div className="grid md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">
//             Carbon Intensity Over Time
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={carbonData.filter((_, i) => i % 3 === 0)}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="intensity"
//                 stroke="#14b8a6"
//                 strokeWidth={2}
//                 name="g CO₂e/BOE"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">
//             Emission Sources Distribution
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 dataKey="value"
//                 label={(e) => `${e.name}: ${e.value.toFixed(0)}t`}
//               >
//                 <Cell fill="#f97316" />
//                 <Cell fill="#8b5cf6" />
//                 <Cell fill="#3b82f6" />
//                 <Cell fill="#ef4444" />
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div> */}

//       {/* Well Characteristics */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">
//           Well Characteristics
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div>
//             <p className="text-sm text-gray-600">Formation</p>
//             <p className="font-semibold text-gray-900">
//               {wellParams.formation}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Trajectory</p>
//             <p className="font-semibold text-gray-900">
//               {wellParams.trajectory}
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">TVD</p>
//             <p className="font-semibold text-gray-900">
//               {Number(wellParams.tvd).toLocaleString()} ft
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Lateral Length</p>
//             <p className="font-semibold text-gray-900">
//               {Number(wellParams.lateralLength).toLocaleString()} ft
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">CAPEX</p>
//             <p className="font-semibold text-gray-900">
//               ${(Number(economicParams.totalCAPEX) / 1_000_000).toFixed(2)}M
//             </p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Fixed OPEX</p>
//             <p className="font-semibold text-gray-900">
//               ${(Number(economicParams.fixedOPEX) / 1_000).toFixed(0)}K/yr
//             </p>
//           </div>
//           <div>
//             {/* <p className="text-sm text-gray-600">Oil Price</p> */}
//             {/* <p className="font-semibold text-gray-900">
//               ${economicParams.oilPrice}/bbl
//             </p> */}
//           </div>
//           <div>
//             {/* <p className="text-sm text-gray-600">Gas Price</p>
//             <p className="font-semibold text-gray-900">
//               ${economicParams.gasPrice}/mcf
//             </p> */}
//           </div>
//         </div>
//       </div>
//       <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
//     </div>
//   );
// }

/* --- FULL EXECUTIVE SUMMARY COMPONENT WITH S3 CHARTS --- */

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
      NEW: States to store S3 data
  ------------------------------------------*/
  const [remoteProduction, setRemoteProduction] = useState([]);
  const [remoteCashflow, setRemoteCashflow] = useState([]);

  /* -----------------------------------------
      Fetch Production + Cashflow S3 URLs
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
        }

        // --- Cash Flow Data ---
        if (lastApiResponse.cash_flow_url) {
          const r2 = await fetch(lastApiResponse.cash_flow_url);
          const d2 = await r2.json();
          setRemoteCashflow(Array.isArray(d2) ? d2 : []);
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
      Pie Chart Data
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
    return () =>
      window.removeEventListener("aw-export-exec-pdf", handler);
  }, [wellParams.wellId]);

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl p-8 shadow">
        <p className="text-gray-700">
          Run <span className="font-semibold">Analyze</span> to
          generate your Executive Summary.
        </p>
      </div>
    );
  }

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
            <p className="text-lg opacity-90">
              ESG Risk: {kpis.esgRisk}
            </p>
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
        <KpiCard title="NPV" icon={<DollarSign className="text-green-600"/>}
          value={kpis.npv.toLocaleString()} desc="Net Present Value" />

        <KpiCard title="IRR" value={`${kpis.irr.toFixed(1)}%`} />

        <KpiCard title="EUR Oil"
          icon={<Droplet className="text-orange-600" />}
          value={`${(kpis.eurOil/1000).toFixed(0)}K`} desc="bbl" />

        <KpiCard title="EUR Gas"
          icon={<Zap className="text-purple-600" />}
          value={`${(kpis.eurGas/1000).toFixed(0)}K`} desc="mcf" />

        <KpiCard title="Total CO₂"
          icon={<Zap className="text-emerald-600"/>}
          value={kpis.totalCO2.toFixed(0)} desc="tons" />

        <KpiCard title="Intensity"
          icon={<Activity className="text-teal-600" />}
          value={kpis.avgIntensity.toFixed(0)} desc="g CO₂e/BOE" />

        <KpiCard title="Carbon Credits"
          icon={<DollarSign className="text-green-600" />}
          value={`$${kpis.carbonCreditPotential.toFixed(0)}K`} />

        <KpiCard title="Payback"
          icon={<Calendar className="text-indigo-600" />}
          value={kpis.paybackMonths ?? "—"} desc="months" />
      </div>

      {/* =====================================================================
            UPDATED — PRODUCTION DECLINE GRAPH (S3 DATA)
      ===================================================================== */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">
            Production Decline Preview 
          </h3>

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
              UPDATED — CASHFLOW GRAPH (S3 DATA)
        ===================================================================== */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">
            Cumulative Cash Flow 
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={remoteCashflow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v)=> `$${(v/1_000_000).toFixed(2)}M`} />
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

      {/* --- WELL CHARACTERISTICS --- */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Well Characteristics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Char title="Formation" value={wellParams.formation} />
          <Char title="Trajectory" value={wellParams.trajectory} />
          <Char title="TVD" value={`${wellParams.tvd?.toLocaleString()} ft`} />
          <Char title="Lateral Length"
            value={`${wellParams.lateralLength?.toLocaleString()} ft`} />
          <Char title="CAPEX"
            value={`$${(economicParams.totalCAPEX/1_000_000).toFixed(2)}M`} />
          <Char title="Fixed OPEX"
            value={`$${(economicParams.fixedOPEX/1000).toFixed(0)}K/yr`} />
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
