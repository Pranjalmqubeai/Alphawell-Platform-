// pages/alphawell/tabs/ExecutiveSummary.jsx
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
  } = useAlphaWell();
  const [openEdit, setOpenEdit] = useState(false);
  // Defensive guards
  const hasData =
    kpis &&
    productionData?.length > 0 &&
    economicData?.length > 0 &&
    carbonData?.length > 0;

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

  // Listen to header trigger
  useEffect(() => {
    const handler = async () => {
      try {
        await exportElementToPDF(
          "exec-summary",
          `AlphaWell_ExecutiveSummary_${wellParams.wellId || "Well"}.pdf`
        );
      } catch (e) {
        const msg = e?.message || "Unknown error";
        console.error("PDF export failed:", e);
        alert(`Sorry, we couldn’t generate the PDF.\n\n${msg}`);
      }
    };
    window.addEventListener("aw-export-exec-pdf", handler);
    return () => window.removeEventListener("aw-export-exec-pdf", handler);
  }, [wellParams.wellId]);

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl p-8 shadow">
        <p className="text-gray-700">
          Run <span className="font-semibold">Analyze</span> from the Input tab
          to see the Executive Summary.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="exec-summary">
      {/* Verdict Banner */}
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
              Decision Recommendation: {kpis.verdict}
            </h2>
            <p className="text-lg opacity-90">ESG Risk Level: {kpis.esgRisk}</p>
          </div>
          <div className="text-right">
            {kpis.verdict === "Drill" ? (
              <CheckCircle className="w-16 h-16" />
            ) : (
              <AlertTriangle className="w-16 h-16" />
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("aw-export-exec-pdf"))
            }
            className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white font-medium"
          >
            Generate PDF
          </button>
          <button
            onClick={() => setOpenEdit(true)}
            className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100"
          >
            Edit your parameters
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">NPV</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${kpis.npv.toFixed(2)}M
          </p>
          <p className="text-xs text-gray-500 mt-1">
            @ {(economicParams.discountRate * 100).toFixed(0)}% discount
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">IRR</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {kpis.irr.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Internal rate of return</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">EUR Oil</span>
            <Droplet className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {(kpis.eurOil / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-gray-500 mt-1">bbls cumulative</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">EUR Gas</span>
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {(kpis.eurGas / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-gray-500 mt-1">mcf cumulative</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total CO₂</span>
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {kpis.totalCO2.toFixed(0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">tons over life</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Carbon Intensity</span>
            <Activity className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {kpis.avgIntensity.toFixed(0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">g CO₂e/BOE</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Carbon Credits</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${kpis.carbonCreditPotential.toFixed(0)}K
          </p>
          <p className="text-xs text-gray-500 mt-1">potential revenue</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Payback</span>
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {kpis.paybackMonths ?? "—"}
          </p>
          <p className="text-xs text-gray-500 mt-1">months to positive CF</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Production */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Production Decline Preview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData.filter((_, i) => i % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="gas"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Gas (mcf/mo)"
              />
              <Line
                type="monotone"
                dataKey="oil"
                stroke="#f97316"
                strokeWidth={2}
                name="Oil (bbl/mo)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cash Flow */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Cumulative Cash Flow
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={economicData.filter((_, i) => i % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => `$${(Number(v) / 1_000_000).toFixed(2)}M`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="cumulativeCashFlow"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Cumulative CF ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Carbon Intelligence Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Carbon Intensity Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={carbonData.filter((_, i) => i % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="intensity"
                stroke="#14b8a6"
                strokeWidth={2}
                name="g CO₂e/BOE"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Emission Sources Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={(e) => `${e.name}: ${e.value.toFixed(0)}t`}
              >
                <Cell fill="#f97316" />
                <Cell fill="#8b5cf6" />
                <Cell fill="#3b82f6" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Well Characteristics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Well Characteristics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Formation</p>
            <p className="font-semibold text-gray-900">
              {wellParams.formation}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Trajectory</p>
            <p className="font-semibold text-gray-900">
              {wellParams.trajectory}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">TVD</p>
            <p className="font-semibold text-gray-900">
              {Number(wellParams.tvd).toLocaleString()} ft
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Lateral Length</p>
            <p className="font-semibold text-gray-900">
              {Number(wellParams.lateralLength).toLocaleString()} ft
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">CAPEX</p>
            <p className="font-semibold text-gray-900">
              ${(Number(economicParams.totalCAPEX) / 1_000_000).toFixed(2)}M
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fixed OPEX</p>
            <p className="font-semibold text-gray-900">
              ${(Number(economicParams.fixedOPEX) / 1_000).toFixed(0)}K/yr
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Oil Price</p>
            <p className="font-semibold text-gray-900">
              ${economicParams.oilPrice}/bbl
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gas Price</p>
            <p className="font-semibold text-gray-900">
              ${economicParams.gasPrice}/mcf
            </p>
          </div>
        </div>
      </div>
      <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
    </div>
  );
}
