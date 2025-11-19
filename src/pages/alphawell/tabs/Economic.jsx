import React, { useState } from "react";
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
import ExecParamsModal from "./ExecParamsModal";

export default function Economic() {
  const { economicData, kpis, economicParams, lastApiResponse } =
    useAlphaWell();
  const [openEdit, setOpenEdit] = useState(false);

  if (!economicData?.length) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-gray-700">
        No economic data yet. Please run Analyze.
      </div>
    );
  }

  // ---- Derive metrics from API (with fallbacks) ----
  const fm = lastApiResponse?.financial_metrics || {};

  const npvRaw = fm.npv ?? kpis?.npv ?? 0; // assume USD
  const irrRaw = fm.irr ?? kpis?.irr ?? 0; // %
  const eurRaw = fm.eur ?? 0; // BOE
  const paybackMonth = fm.payback_month ?? kpis?.paybackMonths ?? null;

  const totalOpexRaw =
    fm.total_opex ?? economicData.reduce((sum, d) => sum + (d.opex || 0), 0);

  const totalTaxRaw =
    fm.total_tax ?? economicData.reduce((sum, d) => sum + (d.taxes || 0), 0);

  const netCashFlowRaw =
    fm.total_cash_flow ??
    (economicData[economicData.length - 1]?.cumulativeCashFlow || 0);

  // formatted display helpers
  const toMillions = (v) => (v || 0) / 1_000_000;
  const formatNumber = (value, decimals = 2) =>
    Number(value ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  const npvDisplay = formatNumber(npvRaw, 2);

  const irrDisplay = `${formatNumber(irrRaw, 1)}%`;

  const eurDisplay = `${formatNumber(eurRaw, 2)} MMboe`;

  const paybackDisplay = paybackMonth ? `Month ${paybackMonth}` : "N/A";

  const totalOpexDisplay = `${formatNumber((totalOpexRaw), 2)}`;

  const totalTaxDisplay = `${formatNumber((totalTaxRaw), 2)}`;

  const netCFDisplay = `${formatNumber((netCashFlowRaw), 2)}`;

  return (
    <div className="space-y-6">
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

      {/* Monthly Cash Flow */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Monthly Cash Flow Components
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={economicData.filter((_, i) => i % 6 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Legend />
            <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
            <Bar dataKey="opex" fill="#ef4444" name="OPEX ($)" />
            <Bar dataKey="taxes" fill="#f97316" name="Taxes ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* NPV Buildup */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          NPV Buildup Over Time
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={economicData.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `$${(v / 1_000_000).toFixed(2)}M`} />
            <Legend />
            <Area
              type="monotone"
              dataKey="npv"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.6}
              name="Cumulative NPV ($)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sensitivity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Sensitivity Analysis
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Oil Price Sensitivity
            </h4>
            <div className="space-y-2">
              {[-20, -10, 0, 10, 20].map((pct) => {
                const adjustedPrice = economicParams.oilPrice * (1 + pct / 100);
                const baseNpvM = toMillions(kpis ? kpis.npv : npvRaw);
                const npvImpact = baseNpvM * (1 + (pct * 0.4) / 100);
                return (
                  <div
                    key={pct}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">
                      ${adjustedPrice.toFixed(2)}/bbl ({pct > 0 ? "+" : ""}
                      {pct}%)
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        npvImpact > 8
                          ? "text-green-600"
                          : npvImpact > 5
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      NPV: ${npvImpact.toFixed(2)}M
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              CAPEX Sensitivity
            </h4>
            <div className="space-y-2">
              {[-15, -10, 0, 10, 15].map((pct) => {
                const adjustedCapex =
                  economicParams.totalCAPEX * (1 + pct / 100);
                const baseNpvM = toMillions(kpis ? kpis.npv : npvRaw);
                const npvImpact =
                  baseNpvM -
                  (economicParams.totalCAPEX * pct) / 100 / 1_000_000;
                return (
                  <div
                    key={pct}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">
                      ${(adjustedCapex / 1_000_000).toFixed(2)}M (
                      {pct > 0 ? "+" : ""}
                      {pct}%)
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        npvImpact > 8
                          ? "text-green-600"
                          : npvImpact > 5
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      NPV: ${npvImpact.toFixed(2)}M
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
    </div>
  );
}

function SumCard({ title, value, accent = "text-slate-900" }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
        {title}
      </p>
      <p className={`text-xl md:text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}
