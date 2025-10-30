import React from 'react';
import { Activity, MapPin, DollarSign, Zap } from 'lucide-react';
import { useAlphaWell } from '../../context/AlphaWellContext';

export default function InputConfig() {
  const {
    setActiveTab, logout,
    wellParams, setWellParams,
    economicParams, setEconomicParams,
    carbonParams, setCarbonParams,
    analyze
  } = useAlphaWell();

  return (
    <div className="min-h-[70vh]">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Input Configuration</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('start')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Well Parameters */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Well Parameters
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Well ID</label>
                <input
                  type="text"
                  value={wellParams.wellId}
                  onChange={(e) => setWellParams({ ...wellParams, wellId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={wellParams.latitude}
                    onChange={(e) => setWellParams({ ...wellParams, latitude: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={wellParams.longitude}
                    onChange={(e) => setWellParams({ ...wellParams, longitude: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
                <select
                  value={wellParams.formation}
                  onChange={(e) => setWellParams({ ...wellParams, formation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Wolfcamp A</option>
                  <option>Wolfcamp B</option>
                  <option>Bone Spring</option>
                  <option>Spraberry</option>
                  <option>Delaware</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TVD (ft)</label>
                  <input
                    type="number"
                    value={wellParams.tvd}
                    onChange={(e) => setWellParams({ ...wellParams, tvd: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MD (ft)</label>
                  <input
                    type="number"
                    value={wellParams.md}
                    onChange={(e) => setWellParams({ ...wellParams, md: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lateral Length (ft)</label>
                <input
                  type="number"
                  value={wellParams.lateralLength}
                  onChange={(e) => setWellParams({ ...wellParams, lateralLength: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prediction Horizon (Years)</label>
                <select
                  value={wellParams.predictionHorizon}
                  onChange={(e) => setWellParams({ ...wellParams, predictionHorizon: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 Years</option>
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Economic */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Economic Parameters
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total CAPEX ($)</label>
                <input
                  type="number"
                  value={economicParams.totalCAPEX}
                  onChange={(e) => setEconomicParams({ ...economicParams, totalCAPEX: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Oil Price ($/bbl)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={economicParams.oilPrice}
                    onChange={(e) => setEconomicParams({ ...economicParams, oilPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gas Price ($/mcf)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={economicParams.gasPrice}
                    onChange={(e) => setEconomicParams({ ...economicParams, gasPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fixed OPEX ($/year)</label>
                <input
                  type="number"
                  value={economicParams.fixedOPEX}
                  onChange={(e) => setEconomicParams({ ...economicParams, fixedOPEX: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Oil OPEX</label>
                  <input
                    type="number"
                    step="0.01"
                    value={economicParams.oilOPEX}
                    onChange={(e) => setEconomicParams({ ...economicParams, oilOPEX: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gas OPEX</label>
                  <input
                    type="number"
                    step="0.01"
                    value={economicParams.gasOPEX}
                    onChange={(e) => setEconomicParams({ ...economicParams, gasOPEX: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Water OPEX</label>
                  <input
                    type="number"
                    step="0.01"
                    value={economicParams.waterOPEX}
                    onChange={(e) => setEconomicParams({ ...economicParams, waterOPEX: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Oil NRI</label>
                  <input
                    type="number"
                    step="0.001"
                    value={economicParams.oilNRI}
                    onChange={(e) => setEconomicParams({ ...economicParams, oilNRI: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gas NRI</label>
                  <input
                    type="number"
                    step="0.001"
                    value={economicParams.gasNRI}
                    onChange={(e) => setEconomicParams({ ...economicParams, gasNRI: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={economicParams.discountRate * 100}
                  onChange={(e) => setEconomicParams({ ...economicParams, discountRate: parseFloat(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ad Valorem</label>
                  <input
                    type="number"
                    step="0.001"
                    value={economicParams.adValorem}
                    onChange={(e) => setEconomicParams({ ...economicParams, adValorem: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Oil Sev Tax</label>
                  <input
                    type="number"
                    step="0.001"
                    value={economicParams.oilSeverance}
                    onChange={(e) => setEconomicParams({ ...economicParams, oilSeverance: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gas Sev Tax</label>
                  <input
                    type="number"
                    step="0.001"
                    value={economicParams.gasSeverance}
                    onChange={(e) => setEconomicParams({ ...economicParams, gasSeverance: parseFloat(e.target.value) })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Carbon */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-emerald-600" />
              Carbon & Environmental
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processing Intensity Factor</label>
                <input
                  type="number"
                  step="0.1"
                  value={carbonParams.processingIntensity}
                  onChange={(e) => setCarbonParams({ ...carbonParams, processingIntensity: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Default: 1.0 (Standard processing)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flaring Percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={carbonParams.flarePercent * 100}
                  onChange={(e) => setCarbonParams({ ...carbonParams, flarePercent: parseFloat(e.target.value) / 100 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">% of gas production that is flared</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carbon Price ($/ton CO₂e)</label>
                <input
                  type="number"
                  value={carbonParams.carbonPrice}
                  onChange={(e) => setCarbonParams({ ...carbonParams, carbonPrice: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">For tax liability/credit simulation</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={carbonParams.enableCarbonCredits}
                  onChange={(e) => setCarbonParams({ ...carbonParams, enableCarbonCredits: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <label className="text-sm font-medium text-gray-700">Enable Carbon Credit Simulation</label>
              </div>

              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <h3 className="text-sm font-semibold text-emerald-900 mb-2">Emission Factors (Auto-Applied)</h3>
                <div className="text-xs text-emerald-700 space-y-1">
                  <p>• Oil: 0.43 kg CO₂e/bbl (combustion)</p>
                  <p>• Gas: 0.053 kg CO₂e/mcf (combustion)</p>
                  <p>• CH₄ GWP: 28x CO₂ equivalent</p>
                  <p>• Processing: Variable by intensity</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Standards Reference</h3>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• EPA Subpart W</p>
                  <p>• IPCC Tier 2/3 defaults</p>
                  <p>• OGMP 2.0 factors</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={analyze}
            className="flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Analyze Well Performance</span>
          </button>
        </div>
      </div>
    </div>
  );
}
