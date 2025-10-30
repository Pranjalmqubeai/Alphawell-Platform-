import React from 'react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useAlphaWell } from '../../../context/AlphaWellContext';

export default function Economic() {
  const { economicData, kpis, economicParams } = useAlphaWell();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <SumCard title="Total Revenue" value={`$${(economicData.reduce((s, d) => s + d.revenue, 0) / 1_000_000).toFixed(2)}M`} color="text-green-600" />
        <SumCard title="Total OPEX" value={`$${(economicData.reduce((s, d) => s + d.opex, 0) / 1_000_000).toFixed(2)}M`} color="text-red-600" />
        <SumCard title="Total Taxes" value={`$${(economicData.reduce((s, d) => s + d.taxes, 0) / 1_000_000).toFixed(2)}M`} color="text-orange-600" />
        <SumCard title="Net Cash Flow" value={`$${(economicData[economicData.length - 1].cumulativeCashFlow / 1_000_000).toFixed(2)}M`} color="text-blue-600" />
      </div>

      {/* Monthly Cash Flow */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Cash Flow Components</h3>
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
        <h3 className="text-lg font-bold text-gray-900 mb-4">NPV Buildup Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={economicData.filter((_, i) => i % 3 === 0)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `$${(v / 1_000_000).toFixed(2)}M`} />
            <Legend />
            <Area type="monotone" dataKey="npv" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Cumulative NPV ($)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sensitivity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Sensitivity Analysis</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Oil Price Sensitivity</h4>
            <div className="space-y-2">
              {[-20, -10, 0, 10, 20].map(pct => {
                const adjustedPrice = economicParams.oilPrice * (1 + pct / 100);
                const npvImpact = kpis ? kpis.npv * (1 + pct * 0.4 / 100) : 0;
                return (
                  <div key={pct} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">${adjustedPrice.toFixed(2)}/bbl ({pct > 0 ? '+' : ''}{pct}%)</span>
                    <span className={`text-sm font-semibold ${npvImpact > 8 ? 'text-green-600' : npvImpact > 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                      NPV: ${npvImpact.toFixed(2)}M
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">CAPEX Sensitivity</h4>
            <div className="space-y-2">
              {[-15, -10, 0, 10, 15].map(pct => {
                const adjustedCapex = economicParams.totalCAPEX * (1 + pct / 100);
                const npvImpact = kpis ? kpis.npv - (economicParams.totalCAPEX * pct / 100 / 1_000_000) : 0;
                return (
                  <div key={pct} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">${(adjustedCapex / 1_000_000).toFixed(2)}M ({pct > 0 ? '+' : ''}{pct}%)</span>
                    <span className={`text-sm font-semibold ${npvImpact > 8 ? 'text-green-600' : npvImpact > 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                      NPV: ${npvImpact.toFixed(2)}M
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SumCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
