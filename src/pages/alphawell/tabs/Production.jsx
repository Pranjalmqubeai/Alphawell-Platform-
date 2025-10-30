import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { useAlphaWell } from '../../../context/AlphaWellContext';

export default function Production() {
  const { productionData, wellParams } = useAlphaWell();

  const peakOilIdx = productionData.reduce((maxIdx, d, i) => d.oil > productionData[maxIdx].oil ? i : maxIdx, 0);
  const peakGasIdx = productionData.reduce((maxIdx, d, i) => d.gas > productionData[maxIdx].gas ? i : maxIdx, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Production Forecast Simulation</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <NumberTile title="Peak Oil Month" value={`Month ${peakOilIdx + 1}`} sub={`${productionData[peakOilIdx].oil.toFixed(0)} bbl/mo`} color="bg-orange-50" t="text-orange-800" v="text-orange-900" />
          <NumberTile title="Peak Gas Month" value={`Month ${peakGasIdx + 1}`} sub={`${productionData[peakGasIdx].gas.toFixed(0)} mcf/mo`} color="bg-purple-50" t="text-purple-800" v="text-purple-900" />
          <NumberTile title="Total Water Production" value={`${(productionData[productionData.length - 1].cumulativeWater / 1000).toFixed(0)}K bbl`} sub={`Over ${wellParams.predictionHorizon} years`} color="bg-blue-50" t="text-blue-800" v="text-blue-900" />
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={productionData.filter((_, i) => i % 2 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="oil" stroke="#f97316" strokeWidth={2} name="Oil (bbl/mo)" />
            <Line type="monotone" dataKey="gas" stroke="#8b5cf6" strokeWidth={2} name="Gas (mcf/mo)" />
            <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} name="Water (bbl/mo)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Cumulative Production</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={productionData.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="cumulativeOil" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} name="Cumulative Oil (bbl)" />
            <Area type="monotone" dataKey="cumulativeGas" stackId="2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Cumulative Gas (mcf)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Water Cut Evolution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productionData.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="waterCut" stroke="#3b82f6" strokeWidth={2} name="Water Cut (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function NumberTile({ title, value, sub, color, t, v }) {
  return (
    <div className={`p-4 ${color} rounded-lg`}>
      <p className={`text-sm font-semibold ${t}`}>{title}</p>
      <p className={`text-2xl font-bold ${v}`}>{value}</p>
      <p className="text-sm text-gray-700 mt-1">{sub}</p>
    </div>
  );
}
