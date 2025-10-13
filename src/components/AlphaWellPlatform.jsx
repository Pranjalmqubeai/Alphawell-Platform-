import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign, Droplets, Flame, BarChart3 } from 'lucide-react';

const AlphaWellPlatform = () => {
  const [activeTab, setActiveTab] = useState('production');
  const [wellData, setWellData] = useState({
    longitude: -101.2345,
    latitude: 31.5678,
    formation: 'Formation A',
    operator: 'Alpha Energy LLC',
    leaseArea: 'West Texas Basin',
    predictionHorizon: 15
  });

  const [economicData, setEconomicData] = useState({
    gasShrinkage: 91,
    oilPriceAdj: -4.96,
    gasPriceAdj: 1.36,
    adValoremTax: 4.1,
    oilSeveranceTax: 1.06,
    gasSeveranceTax: 7.5,
    opexGas: 1.36,
    opexOil: 4.47,
    opexWater: 1.05,
    opexFixed: 14250,
    workingInterest: 100,
    nri: 75,
    capexTotal: 10.5
  });

  const [forecasted, setForecasted] = useState(false);

  // Generate mock production forecast data
  const generateProductionData = () => {
    const years = wellData.predictionHorizon;
    const data = [];
    
    for (let i = 0; i <= years; i++) {
      const declineRate = 0.85;
      const oilBase = 250 * Math.pow(declineRate, i / 2);
      const gasBase = 1200 * Math.pow(declineRate, i / 2);
      const waterBase = 80 * (1 + i * 0.15);
      
      data.push({
        year: i,
        oil: Math.round(oilBase),
        gas: Math.round(gasBase),
        water: Math.round(waterBase)
      });
    }
    return data;
  };

  // Generate mock cash flow data
  const generateCashFlowData = () => {
    const years = wellData.predictionHorizon;
    const data = [];
    const oilPrice = 75 + economicData.oilPriceAdj;
    const gasPrice = 3.5 * economicData.gasPriceAdj;
    
    for (let i = 0; i <= years; i++) {
      const declineRate = 0.85;
      const oilVol = 250 * Math.pow(declineRate, i / 2);
      const gasVol = 1200 * Math.pow(declineRate, i / 2);
      
      const revenue = (oilVol * oilPrice * 365 + gasVol * gasPrice * 365) * (economicData.nri / 100);
      const opex = (oilVol * economicData.opexOil + gasVol * economicData.opexGas) * 365 + economicData.opexFixed * 12;
      const taxes = revenue * ((economicData.adValoremTax + economicData.oilSeveranceTax + economicData.gasSeveranceTax) / 100);
      const capex = i === 0 ? economicData.capexTotal * 1000000 : 0;
      
      const cashFlow = revenue - opex - taxes - capex;
      const discountRate = 0.1;
      const dcf = cashFlow / Math.pow(1 + discountRate, i);
      
      data.push({
        year: i,
        cashFlow: Math.round(cashFlow / 1000),
        dcf: Math.round(dcf / 1000)
      });
    }
    return data;
  };

  const productionData = forecasted ? generateProductionData() : [];
  const cashFlowData = forecasted ? generateCashFlowData() : [];

  // Calculate KPIs
  const calculateKPIs = () => {
    if (!forecasted) return { totalOil: 0, totalGas: 0, totalWater: 0, eur: 0, npv: 0, irr: 0 };
    
    const totalOil = productionData.reduce((sum, d) => sum + d.oil * 365, 0);
    const totalGas = productionData.reduce((sum, d) => sum + d.gas * 365, 0);
    const totalWater = productionData.reduce((sum, d) => sum + d.water * 365, 0);
    
    const npv = cashFlowData.reduce((sum, d) => sum + d.dcf, 0);
    const eur = cashFlowData.reduce((sum, d) => sum + d.cashFlow, 0);
    
    // Simplified IRR calculation
    const irr = ((npv / (economicData.capexTotal * 1000)) * 100).toFixed(1);
    
    return {
      totalOil: Math.round(totalOil / 1000),
      totalGas: Math.round(totalGas / 1000),
      totalWater: Math.round(totalWater / 1000),
      eur: Math.round(eur),
      npv: Math.round(npv),
      irr: parseFloat(irr)
    };
  };

  const kpis = calculateKPIs();

  const runForecast = () => {
    setForecasted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                AlphaWell Intelligence Platform
              </h1>
              <p className="text-slate-400 text-sm mt-1">AI-Driven Production Forecasting & Economic Intelligence</p>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveTab('production')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'production'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Well Information & Production Forecast
          </button>
          <button
            onClick={() => setActiveTab('economic')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'economic'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Economic Model
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        {activeTab === 'production' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4 text-cyan-400">Well Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Longitude</label>
                    <input
                      type="number"
                      value={wellData.longitude}
                      onChange={(e) => setWellData({...wellData, longitude: parseFloat(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Latitude</label>
                    <input
                      type="number"
                      value={wellData.latitude}
                      onChange={(e) => setWellData({...wellData, latitude: parseFloat(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Formation Type</label>
                    <select
                      value={wellData.formation}
                      onChange={(e) => setWellData({...wellData, formation: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Formation A</option>
                      <option>Formation B</option>
                      <option>Formation C</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Operator</label>
                    <input
                      type="text"
                      value={wellData.operator}
                      onChange={(e) => setWellData({...wellData, operator: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Lease Area</label>
                    <input
                      type="text"
                      value={wellData.leaseArea}
                      onChange={(e) => setWellData({...wellData, leaseArea: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Prediction Horizon (years)</label>
                    <select
                      value={wellData.predictionHorizon}
                      onChange={(e) => setWellData({...wellData, predictionHorizon: parseInt(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={10}>10 Years</option>
                      <option value={15}>15 Years</option>
                      <option value={20}>20 Years</option>
                    </select>
                  </div>

                  <button
                    onClick={runForecast}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
                  >
                    Run Forecast
                  </button>
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* KPI Cards */}
              {forecasted && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg shadow-xl p-5 border border-orange-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Total Oil Production</p>
                        <p className="text-3xl font-bold text-white mt-1">{kpis.totalOil}K</p>
                        <p className="text-orange-200 text-xs mt-1">barrels (cumulative)</p>
                      </div>
                      <Droplets className="w-12 h-12 text-orange-200 opacity-80" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-xl p-5 border border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Gas Production</p>
                        <p className="text-3xl font-bold text-white mt-1">{kpis.totalGas}K</p>
                        <p className="text-blue-200 text-xs mt-1">mcf (cumulative)</p>
                      </div>
                      <Flame className="w-12 h-12 text-blue-200 opacity-80" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg shadow-xl p-5 border border-cyan-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cyan-100 text-sm font-medium">Total Water Production</p>
                        <p className="text-3xl font-bold text-white mt-1">{kpis.totalWater}K</p>
                        <p className="text-cyan-200 text-xs mt-1">barrels (cumulative)</p>
                      </div>
                      <Droplets className="w-12 h-12 text-cyan-200 opacity-80" />
                    </div>
                  </div>
                </div>
              )}

              {/* Production Forecast Chart */}
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Production Forecast Over Time</h3>
                {forecasted ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={productionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                      <YAxis stroke="#9CA3AF" label={{ value: 'Daily Production', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#F3F4F6' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="oil" stroke="#F97316" strokeWidth={2} name="Oil (bbl/day)" />
                      <Line type="monotone" dataKey="gas" stroke="#3B82F6" strokeWidth={2} name="Gas (mcf/day)" />
                      <Line type="monotone" dataKey="water" stroke="#06B6D4" strokeWidth={2} name="Water (bbl/day)" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-72 flex items-center justify-center text-slate-500">
                    Run forecast to view production predictions
                  </div>
                )}
              </div>

              {/* Production Distribution */}
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Cumulative Production Distribution</h3>
                {forecasted ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={productionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#F3F4F6' }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="oil" stackId="1" stroke="#F97316" fill="#F97316" fillOpacity={0.6} name="Oil" />
                      <Area type="monotone" dataKey="gas" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Gas" />
                      <Area type="monotone" dataKey="water" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} name="Water" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-72 flex items-center justify-center text-slate-500">
                    Run forecast to view distribution
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Economic Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700 max-h-[calc(100vh-200px)] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-cyan-400">Economic Parameters</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Gas Shrinkage (%)</label>
                    <input
                      type="number"
                      value={economicData.gasShrinkage}
                      onChange={(e) => setEconomicData({...economicData, gasShrinkage: parseFloat(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Oil Price Adjustment ($/bbl)</label>
                    <input
                      type="number"
                      value={economicData.oilPriceAdj}
                      onChange={(e) => setEconomicData({...economicData, oilPriceAdj: parseFloat(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Gas Price Multiplier</label>
                    <input
                      type="number"
                      value={economicData.gasPriceAdj}
                      onChange={(e) => setEconomicData({...economicData, gasPriceAdj: parseFloat(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Taxes</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Ad Valorem Tax (%)</label>
                        <input
                          type="number"
                          value={economicData.adValoremTax}
                          onChange={(e) => setEconomicData({...economicData, adValoremTax: parseFloat(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Oil Severance Tax (%)</label>
                        <input
                          type="number"
                          value={economicData.oilSeveranceTax}
                          onChange={(e) => setEconomicData({...economicData, oilSeveranceTax: parseFloat(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Gas Severance Tax (%)</label>
                        <input
                          type="number"
                          value={economicData.gasSeveranceTax}
                          onChange={(e) => setEconomicData({...economicData, gasSeveranceTax: parseFloat(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Operating Costs (OPEX)</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Gas OPEX ($/mcf)</label>
                        <input
                          type="number"
                          value={economicData.opexGas}
                          onChange={(e) => setEconomicData({...economicData, opexGas: parseFloat(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Oil OPEX ($/bbl)</label>
                        <input
                          type="number"
                          value={economicData.opexOil}
                          onChange={(e) => setEconomicData({...economicData, opexOil: parseFloat(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Water OPEX ($/bbl)</label>
                        <input
                          type="number"
                          value={economicData.opexWater}
                          onChange={(e) => setEconomicData({...economicData, opexWater: parseFloat(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Fixed OPEX ($/month)</label>
                        <input
                          type="number"
                          value={economicData.opexFixed}
                          onChange={(e) => setEconomicData({...economicData, opexFixed: parseFloat(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">Ownership</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Working Interest (%)</label>
                        <input
                          type="number"
                          value={economicData.workingInterest}
                          onChange={(e) => setEconomicData({...economicData, workingInterest: parseFloat(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Net Revenue Interest (%)</label>
                        <input
                          type="number"
                          value={economicData.nri}
                          onChange={(e) => setEconomicData({...economicData, nri: parseFloat(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Total CAPEX ($MM)</label>
                    <input
                      type="number"
                      value={economicData.capexTotal}
                      onChange={(e) => setEconomicData({...economicData, capexTotal: parseFloat(e.target.value)})}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={runForecast}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
                  >
                    Calculate Economics
                  </button>
                </div>
              </div>
            </div>

            {/* Economic Output Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Financial KPI Cards */}
              {forecasted && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-xl p-5 border border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">EUR (Cumulative CF)</p>
                        <p className="text-3xl font-bold text-white mt-1">${kpis.eur}K</p>
                        <p className="text-green-200 text-xs mt-1">Expected Ultimate Recovery</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-green-200 opacity-80" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg shadow-xl p-5 border border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">NPV @ 10%</p>
                        <p className="text-3xl font-bold text-white mt-1">${kpis.npv}K</p>
                        <p className="text-purple-200 text-xs mt-1">Net Present Value</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-purple-200 opacity-80" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-lg shadow-xl p-5 border border-pink-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-pink-100 text-sm font-medium">IRR</p>
                        <p className="text-3xl font-bold text-white mt-1">{kpis.irr}%</p>
                        <p className="text-pink-200 text-xs mt-1">Internal Rate of Return</p>
                      </div>
                      <BarChart3 className="w-12 h-12 text-pink-200 opacity-80" />
                    </div>
                  </div>
                </div>
              )}

              {/* Cash Flow Chart */}
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Cash Flow Analysis</h3>
                {forecasted ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                      <YAxis stroke="#9CA3AF" label={{ value: 'Cash Flow ($K)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#F3F4F6' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="cashFlow" stroke="#10B981" strokeWidth={2} name="Annual Cash Flow" />
                      <Line type="monotone" dataKey="dcf" stroke="#8B5CF6" strokeWidth={2} name="Discounted Cash Flow" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-72 flex items-center justify-center text-slate-500">
                    Calculate economics to view cash flow projections
                  </div>
                )}
              </div>

              {/* Cash Flow Distribution */}
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Cumulative Cash Flow Distribution</h3>
                {forecasted ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#F3F4F6' }}
                      />
                      <Legend />
                      <Bar dataKey="cashFlow" fill="#10B981" name="Annual Cash Flow ($K)" />
                      <Bar dataKey="dcf" fill="#8B5CF6" name="Discounted Cash Flow ($K)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-72 flex items-center justify-center text-slate-500">
                    Calculate economics to view distribution
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 py-6 mt-8 border-t border-slate-700">
        <p className="text-center text-slate-500 text-sm">
          AlphaWell Intelligence Platform - AI-Driven Forecasting & Economic Intelligence for Energy Sector
        </p>
      </div>
    </div>
  );
};

export default AlphaWellPlatform;