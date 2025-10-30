import React from 'react';
import { MapPin } from 'lucide-react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { useAlphaWell } from '../../../context/AlphaWellContext';

export default function Neighborhood() {
  const { NEIGHBOR_WELLS, wellParams } = useAlphaWell();
  const avg = (arr, k) => arr.reduce((s, o) => s + o[k], 0) / arr.length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Spatial Benchmark Analysis</h2>

        {/* Map placeholder */}
        <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-8 mb-6 border-2 border-blue-200">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Well Map</h3>
            <p className="text-gray-600 mb-4">Target Well: {wellParams.latitude.toFixed(4)}, {wellParams.longitude.toFixed(4)}</p>
            <div className="flex items-center justify-center space-x-8 mt-6">
              <LegendDot color="bg-green-500" label="High Performer" />
              <LegendDot color="bg-yellow-500" label="Moderate" />
              <LegendDot color="bg-red-500" label="Underperformer" />
            </div>
          </div>
        </div>

        {/* Table */}
        <h3 className="text-lg font-bold text-gray-900 mb-4">Offset Wells Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Well ID', 'Formation', 'Distance', 'EUR (bbl)', 'NPV ($M)', 'CO₂ Intensity', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {NEIGHBOR_WELLS.map(well => (
                <tr key={well.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{well.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{well.formation}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{well.distance} mi</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{(well.eur / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-sm text-gray-700">${well.npv.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      well.carbonIntensity < 43 ? 'bg-green-100 text-green-800' :
                      well.carbonIntensity < 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {well.carbonIntensity} g/BOE
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      {well.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">EUR Distribution Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={NEIGHBOR_WELLS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="eur" fill="#3b82f6" name="EUR (bbl)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Carbon Intensity Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={NEIGHBOR_WELLS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="carbonIntensity" fill="#14b8a6" name="g CO₂e/BOE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Statistical Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Avg EUR" value={`${(avg(NEIGHBOR_WELLS, 'eur') / 1000).toFixed(0)}K bbl`} color="bg-blue-50" tcolor="text-blue-800" vcolor="text-blue-900" />
          <StatCard title="Avg NPV" value={`$${avg(NEIGHBOR_WELLS, 'npv').toFixed(1)}M`} color="bg-green-50" tcolor="text-green-800" vcolor="text-green-900" />
          <StatCard title="Avg Carbon Intensity" value={`${avg(NEIGHBOR_WELLS, 'carbonIntensity').toFixed(0)} g/BOE`} color="bg-teal-50" tcolor="text-teal-800" vcolor="text-teal-900" />
          <StatCard title="Your Well Rank" value="Top 33%" color="bg-purple-50" tcolor="text-purple-800" vcolor="text-purple-900" />
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-4 h-4 rounded-full ${color}`}></div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

function StatCard({ title, value, color, tcolor, vcolor }) {
  return (
    <div className={`p-4 ${color} rounded-lg`}>
      <p className={`text-sm font-semibold ${tcolor}`}>{title}</p>
      <p className={`text-2xl font-bold ${vcolor}`}>{value}</p>
    </div>
  );
}
