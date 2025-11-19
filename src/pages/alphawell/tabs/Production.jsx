// src/components/AlphaWell/tabs/Production.jsx
import React, { useState, useEffect } from "react";
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

  // derive metrics from latest API response
  const productionMetrics = lastApiResponse?.production_metrics || null;

  useEffect(() => {
    // console.log("Production Data from context:", productionData);
    // console.log("Well Params from context:", wellParams);
    // console.log("Production Metrics from API:", productionMetrics);
  }, [productionData, wellParams, productionMetrics]);

  const formatNumber = (value, decimals = 0) => {
    if (value === undefined || value === null || isNaN(value)) return "-";
    return Number(value).toLocaleString(undefined, {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    });
  };

  if (!productionData?.length || !productionMetrics) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-gray-700">
        No production data yet. Please run Analyze.
      </div>
    );
  }

  const peakOil = productionMetrics.peak_oil_production;
  const peakGas = productionMetrics.peak_gas_production;
  const peakWater = productionMetrics.peak_water_production;

  return (
    <div className="space-y-6">
      {/* KPI BOXES */}
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
            title="Total Oil"
            value={`${formatNumber(productionMetrics.total_oil_eur, 0)} bbl`}
            sub="Estimated Ultimate Recovery"
            valueColor="text-orange-600"
            chipLabel="Oil"
            chipColor="bg-orange-50 text-orange-700"
          />
          <NumberTile
            title="Total Gas"
            value={`${formatNumber(productionMetrics.total_gas_eur, 0)} mcf`}
            sub="Estimated Ultimate Recovery"
            valueColor="text-purple-600"
            chipLabel="Gas"
            chipColor="bg-purple-50 text-purple-700"
          />
          <NumberTile
            title="Total Water"
            value={`${formatNumber(productionMetrics.total_water, 0)} bbl`}
            sub={`Over ${wellParams?.predictionHorizon || "-"} years`}
            valueColor="text-sky-600"
            chipLabel="Water"
            chipColor="bg-sky-50 text-sky-700"
          />

          {/* Year 1 */}
          <NumberTile
            title="Year 1 Oil Production"
            value={`${formatNumber(productionMetrics.year1_oil, 0)} bbl`}
            sub="First 12 months"
            valueColor="text-orange-600"
            chipLabel="Year 1"
            chipColor="bg-orange-50 text-orange-700"
          />
          <NumberTile
            title="Year 1 Gas Production"
            value={`${formatNumber(productionMetrics.year1_gas, 0)} mcf`}
            sub="First 12 months"
            valueColor="text-purple-600"
            chipLabel="Year 1"
            chipColor="bg-purple-50 text-purple-700"
          />
          <NumberTile
            title="Year 1 Water Production"
            value={`${formatNumber(productionMetrics.year1_water, 0)} bbl`}
            sub="First 12 months"
            valueColor="text-sky-600"
            chipLabel="Year 1"
            chipColor="bg-sky-50 text-sky-700"
          />

          {/* Peaks */}
          {/* <NumberTile
            title="Peak Oil Month"
            value={`Month ${peakOil?.month ?? "-"}`}
            sub={`${formatNumber(peakOil?.production, 0)} bbl/mo`}
            valueColor="text-orange-600"
            chipLabel="Peak"
            chipColor="bg-orange-50 text-orange-700"
          />
          <NumberTile
            title="Peak Gas Month"
            value={`Month ${peakGas?.month ?? "-"}`}
            sub={`${formatNumber(peakGas?.production, 0)} mcf/mo`}
            valueColor="text-purple-600"
            chipLabel="Peak"
            chipColor="bg-purple-50 text-purple-700"
          />
          <NumberTile
            title="Peak Water Month"
            value={`Month ${peakWater?.month ?? "-"}`}
            sub={`${formatNumber(peakWater?.production, 0)} bbl/mo`}
            valueColor="text-sky-600"
            chipLabel="Peak"
            chipColor="bg-sky-50 text-sky-700"
          /> */}
        </div>
      </div>

      {/* Monthly production chart + title moved here */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Production Forecast Simulation
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={productionData.filter((_, i) => i % 2 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="oil"
              stroke="#f97316"
              strokeWidth={2}
              name="Oil (bbl/mo)"
            />
            <Line
              type="monotone"
              dataKey="gas"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Gas (mcf/mo)"
            />
            <Line
              type="monotone"
              dataKey="water"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Water (bbl/mo)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative production */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Cumulative Production
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={productionData.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="cumulativeOil"
              stackId="1"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.6}
              name="Cumulative Oil (bbl)"
            />
            <Area
              type="monotone"
              dataKey="cumulativeGas"
              stackId="2"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
              name="Cumulative Gas (mcf)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Water cut */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Water Cut Evolution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productionData.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="waterCut"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Water Cut (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ExecParamsModal open={openEdit} onClose={() => setOpenEdit(false)} />
    </div>
  );
}

function NumberTile({
  title,
  value,
  sub,
  valueColor = "text-slate-900",
  chipLabel,
  chipColor = "bg-slate-100 text-slate-700",
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white/90 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
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
      <p className={`mt-1 text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{sub}</p>
    </div>
  );
}
