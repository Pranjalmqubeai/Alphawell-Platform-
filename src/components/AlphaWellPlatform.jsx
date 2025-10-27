import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, Droplet, Zap, MapPin, Calendar, Users, Settings, LogOut, Save, RefreshCw, AlertTriangle, CheckCircle, BarChart3, Map, LineChart as LineChartIcon, Calculator } from 'lucide-react';

// Mockup Data
const MOCK_USERS = [
  { email: 'investor@alphawell.com', password: 'demo123', role: 'investor', name: 'John Investor' },
  { email: 'operator@alphawell.com', password: 'demo123', role: 'operator', name: 'Sarah Operator' },
  { email: 'analyst@alphawell.com', password: 'demo123', role: 'analyst', name: 'Mike Analyst' }
];

// Generate production forecast data
const generateProductionData = (horizon = 15, lateralLength = 7500) => {
  const data = [];
  const months = horizon * 12;
  
  for (let i = 0; i < months; i++) {
    const year = Math.floor(i / 12);
    const month = i % 12;
    
    // Hyperbolic decline curves
    const oilRate = (2500 * lateralLength / 7500) * Math.pow((1 + 0.8 * i / 12), -1.2);
    const gasRate = (4500 * lateralLength / 7500) * Math.pow((1 + 0.7 * i / 12), -1.1);
    const waterRate = 150 * (1 - Math.exp(-i / 24)) + (50 * i / 12);
    
    const oilCum = i === 0 ? oilRate : data[i - 1].cumulativeOil + oilRate;
    const gasCum = i === 0 ? gasRate : data[i - 1].cumulativeGas + gasRate;
    const waterCum = i === 0 ? waterRate : data[i - 1].cumulativeWater + waterRate;
    
    data.push({
      month: i + 1,
      date: `Y${year + 1}M${month + 1}`,
      oil: Math.max(0, oilRate),
      gas: Math.max(0, gasRate),
      water: Math.max(0, waterRate),
      cumulativeOil: oilCum,
      cumulativeGas: gasCum,
      cumulativeWater: waterCum,
      waterCut: waterRate / (oilRate + waterRate) * 100
    });
  }
  
  return data;
};

// Generate economic data
const generateEconomicData = (productionData, params) => {
  const data = [];
  let cumNPV = 0;
  
  productionData.forEach((prod, i) => {
    const oilRevenue = prod.oil * params.oilPrice * (1 - params.oilDiff) * params.oilNRI;
    const gasRevenue = (prod.gas / 1000) * params.gasPrice * params.gasMult * params.gasNRI;
    
    const totalRevenue = oilRevenue + gasRevenue;
    const opex = params.fixedOPEX / 12 + prod.oil * params.oilOPEX + (prod.gas / 1000) * params.gasOPEX + prod.water * params.waterOPEX;
    const severanceTax = oilRevenue * params.oilSeverance + gasRevenue * params.gasSeverance;
    const adValoremTax = totalRevenue * params.adValorem;
    
    const netCashFlow = totalRevenue - opex - severanceTax - adValoremTax;
    const capex = i === 0 ? params.totalCAPEX : 0;
    const freeCashFlow = netCashFlow - capex;
    
    const discountFactor = Math.pow(1 + params.discountRate, -i / 12);
    const discountedCF = freeCashFlow * discountFactor;
    cumNPV += discountedCF;
    
    data.push({
      month: i + 1,
      date: prod.date,
      revenue: totalRevenue,
      opex: opex,
      taxes: severanceTax + adValoremTax,
      netCashFlow: netCashFlow,
      freeCashFlow: freeCashFlow,
      cumulativeCashFlow: i === 0 ? freeCashFlow : data[i - 1].cumulativeCashFlow + freeCashFlow,
      discountedCF: discountedCF,
      npv: cumNPV
    });
  });
  
  return data;
};

// Generate carbon data
const generateCarbonData = (productionData, params) => {
  const data = [];
  let cumCO2 = 0;
  
  productionData.forEach((prod, i) => {
    // Combustion emissions (kg CO2e per bbl oil ~ 0.43, per mcf gas ~ 0.053)
    const combustionOil = prod.oil * 0.43;
    const combustionGas = prod.gas * 0.053;
    
    // Processing emissions
    const processingEmissions = (prod.oil * 2.1 + prod.gas * 0.8) * params.processingIntensity;
    
    // Flaring (CH4 has GWP of 28)
    const flaringEmissions = prod.gas * params.flarePercent * 0.053 * 28;
    
    const totalEmissions = combustionOil + combustionGas + processingEmissions + flaringEmissions;
    cumCO2 += totalEmissions / 1000; // Convert to tons
    
    const boe = prod.oil + prod.gas / 6; // 6 mcf = 1 boe
    const intensity = boe > 0 ? totalEmissions / boe : 0;
    
    data.push({
      month: i + 1,
      date: prod.date,
      combustionOil: combustionOil / 1000,
      combustionGas: combustionGas / 1000,
      processing: processingEmissions / 1000,
      flaring: flaringEmissions / 1000,
      totalEmissions: totalEmissions / 1000,
      cumulativeCO2: cumCO2,
      intensity: intensity,
      boe: boe
    });
  });
  
  return data;
};

// Neighbor wells data
const NEIGHBOR_WELLS = [
  { id: 'W-2847', lat: 31.8456, lng: -102.3678, eur: 425000, npv: 8.5, formation: 'Wolfcamp A', carbonIntensity: 42, status: 'producing', distance: 0.8 },
  { id: 'W-2901', lat: 31.8489, lng: -102.3712, eur: 380000, npv: 7.2, formation: 'Wolfcamp A', carbonIntensity: 38, status: 'producing', distance: 1.2 },
  { id: 'W-2765', lat: 31.8423, lng: -102.3645, eur: 510000, npv: 11.3, formation: 'Wolfcamp B', carbonIntensity: 45, status: 'producing', distance: 0.5 },
  { id: 'W-3012', lat: 31.8501, lng: -102.3789, eur: 295000, npv: 4.8, formation: 'Spraberry', carbonIntensity: 52, status: 'producing', distance: 2.1 },
  { id: 'W-2834', lat: 31.8445, lng: -102.3698, eur: 445000, npv: 9.8, formation: 'Wolfcamp A', carbonIntensity: 40, status: 'producing', distance: 1.0 },
  { id: 'W-2956', lat: 31.8478, lng: -102.3734, eur: 362000, npv: 6.9, formation: 'Wolfcamp B', carbonIntensity: 47, status: 'producing', distance: 1.5 },
];

// Historical decisions
const MOCK_DECISIONS = [
  {
    id: 'DEC-2024-001',
    name: 'Midland Basin - Wolfcamp A Prospect',
    date: '2024-09-15',
    formation: 'Wolfcamp A',
    verdict: 'Drill',
    npv: 9.2,
    irr: 32.5,
    eur: 445000,
    carbonIntensity: 41,
    totalCO2: 2850
  },
  {
    id: 'DEC-2024-002',
    name: 'Delaware Basin - Bone Spring',
    date: '2024-08-22',
    formation: 'Bone Spring',
    verdict: 'Evaluate Further',
    npv: 5.8,
    irr: 18.2,
    eur: 325000,
    carbonIntensity: 55,
    totalCO2: 3200
  },
  {
    id: 'DEC-2024-003',
    name: 'Permian Highway - Spraberry',
    date: '2024-07-10',
    formation: 'Spraberry',
    verdict: 'High Risk',
    npv: 3.2,
    irr: 12.8,
    eur: 285000,
    carbonIntensity: 62,
    totalCO2: 3850
  }
];

const AlphaWellPlatform = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('start');
  const [showHistorical, setShowHistorical] = useState(false);
  
  // Input parameters
  const [wellParams, setWellParams] = useState({
    wellId: 'AW-2024-457',
    latitude: 31.8467,
    longitude: -102.3689,
    formation: 'Wolfcamp A',
    stateWellType: 'Horizontal',
    trajectory: 'Horizontal',
    tvd: 8450,
    md: 16250,
    lateralLength: 7500,
    elevationKB: 2847,
    predictionHorizon: 15
  });
  
  const [economicParams, setEconomicParams] = useState({
    totalCAPEX: 8500000,
    drillingExpense: 4200000,
    completionExpense: 4300000,
    fixedOPEX: 120000,
    oilOPEX: 8.50,
    gasOPEX: 0.45,
    waterOPEX: 2.10,
    oilWI: 0.75,
    gasWI: 0.75,
    waterWI: 0.75,
    oilNRI: 0.6375,
    gasNRI: 0.6375,
    discountRate: 0.10,
    oilPrice: 75,
    gasPrice: 3.25,
    oilDiff: 0.02,
    gasMult: 0.95,
    adValorem: 0.015,
    oilSeverance: 0.046,
    gasSeverance: 0.075
  });
  
  const [carbonParams, setCarbonParams] = useState({
    processingIntensity: 1.0,
    flarePercent: 0.02,
    carbonPrice: 50,
    enableCarbonCredits: false
  });
  
  const [productionData, setProductionData] = useState([]);
  const [economicData, setEconomicData] = useState([]);
  const [carbonData, setCarbonData] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);
  
  // Login handler
  const handleLogin = (email, password) => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Try: investor@alphawell.com / demo123');
    }
  };
  
  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('start');
    setAnalyzed(false);
  };
  
  // Analyze handler
  const handleAnalyze = () => {
    const prodData = generateProductionData(wellParams.predictionHorizon, wellParams.lateralLength);
    const econData = generateEconomicData(prodData, economicParams);
    const carbData = generateCarbonData(prodData, carbonParams);
    
    setProductionData(prodData);
    setEconomicData(econData);
    setCarbonData(carbData);
    setAnalyzed(true);
    setActiveTab('executive');
  };
  
  // Calculate KPIs
  const calculateKPIs = () => {
    if (!analyzed || economicData.length === 0) return null;
    
    const lastProd = productionData[productionData.length - 1];
    const lastEcon = economicData[economicData.length - 1];
    const lastCarbon = carbonData[carbonData.length - 1];
    
    const totalOil = lastProd.cumulativeOil;
    const totalGas = lastProd.cumulativeGas;
    const npv = lastEcon.npv / 1000000; // In millions
    
    // Calculate IRR (simplified)
    const totalCF = lastEcon.cumulativeCashFlow;
    const irr = totalCF > 0 ? ((totalCF / economicParams.totalCAPEX) ** (1 / wellParams.predictionHorizon) - 1) * 100 : -100;
    
    const totalCO2 = lastCarbon.cumulativeCO2;
    const avgIntensity = totalCO2 > 0 ? (totalCO2 * 1000000) / (totalOil + totalGas / 6) : 0;
    
    const carbonCreditPotential = carbonParams.enableCarbonCredits ? totalCO2 * 0.15 * carbonParams.carbonPrice / 1000 : 0;
    
    let verdict = 'Evaluate Further';
    let esgRisk = 'Moderate';
    
    if (npv > 8 && irr > 25 && avgIntensity < 45) {
      verdict = 'Drill';
      esgRisk = 'Low';
    } else if (npv < 4 || irr < 15 || avgIntensity > 55) {
      verdict = 'High Risk';
      esgRisk = 'High';
    }
    
    return {
      eurOil: totalOil,
      eurGas: totalGas,
      npv,
      irr,
      totalCO2,
      avgIntensity,
      carbonCreditPotential,
      verdict,
      esgRisk,
      paybackMonths: economicData.findIndex(d => d.cumulativeCashFlow > 0)
    };
  };
  
  const kpis = calculateKPIs();
  
  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Activity className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AlphaWell Intelligence</h1>
            <p className="text-gray-600">AI-Driven Production Forecasting & Decision Intelligence</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleLogin(formData.get('email'), formData.get('password'));
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="investor@alphawell.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="demo123"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold mb-2">Demo Credentials:</p>
            <div className="text-xs text-blue-600 space-y-1">
              <p>Investor: investor@alphawell.com / demo123</p>
              <p>Operator: operator@alphawell.com / demo123</p>
              <p>Analyst: analyst@alphawell.com / demo123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Start Screen
  if (activeTab === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AlphaWell Intelligence</h1>
                <p className="text-sm text-gray-600">Welcome, {currentUser.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Select Analysis Mode</h2>
            <p className="text-xl text-gray-600">Choose how you want to proceed with your evaluation</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* New Evaluation Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Start New Evaluation</h3>
              <p className="text-gray-600 mb-6">
                Initiate a fresh evaluation for a new or prospective well. Configure inputs, run forecasts, and analyze economics with carbon intelligence.
              </p>
              <button
                onClick={() => setActiveTab('input')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                New Evaluation
              </button>
            </div>
            
            {/* Historical Decisions Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Review Prior Decisions</h3>
              <p className="text-gray-600 mb-6">
                Review, compare, or revisit previously saved decision scenarios. Track your investment strategy over time.
              </p>
              <button
                onClick={() => setShowHistorical(true)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                View History
              </button>
            </div>
          </div>
        </div>
        
        {/* Historical Decisions Modal */}
        {showHistorical && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Historical Decisions</h2>
                  <button
                    onClick={() => setShowHistorical(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {MOCK_DECISIONS.map(decision => (
                    <div key={decision.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{decision.name}</h3>
                          <p className="text-sm text-gray-600">{decision.id} • {decision.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          decision.verdict === 'Drill' ? 'bg-green-100 text-green-800' :
                          decision.verdict === 'Evaluate Further' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {decision.verdict}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-600">Formation</p>
                          <p className="font-semibold text-gray-900">{decision.formation}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">NPV</p>
                          <p className="font-semibold text-gray-900">${decision.npv.toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">IRR</p>
                          <p className="font-semibold text-gray-900">{decision.irr.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">EUR (bbl)</p>
                          <p className="font-semibold text-gray-900">{(decision.eur / 1000).toFixed(0)}K</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Carbon Intensity</p>
                          <p className="font-semibold text-gray-900">{decision.carbonIntensity} g CO₂e/BOE</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total Emissions</p>
                          <p className="font-semibold text-gray-900">{decision.totalCO2} tons CO₂</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Input Configuration Screen
  if (activeTab === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
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
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Input Form */}
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
                    onChange={(e) => setWellParams({...wellParams, wellId: e.target.value})}
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
                      onChange={(e) => setWellParams({...wellParams, latitude: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={wellParams.longitude}
                      onChange={(e) => setWellParams({...wellParams, longitude: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
                  <select
                    value={wellParams.formation}
                    onChange={(e) => setWellParams({...wellParams, formation: e.target.value})}
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
                      onChange={(e) => setWellParams({...wellParams, tvd: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MD (ft)</label>
                    <input
                      type="number"
                      value={wellParams.md}
                      onChange={(e) => setWellParams({...wellParams, md: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lateral Length (ft)</label>
                  <input
                    type="number"
                    value={wellParams.lateralLength}
                    onChange={(e) => setWellParams({...wellParams, lateralLength: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prediction Horizon (Years)</label>
                  <select
                    value={wellParams.predictionHorizon}
                    onChange={(e) => setWellParams({...wellParams, predictionHorizon: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10 Years</option>
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Economic Parameters */}
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
                    onChange={(e) => setEconomicParams({...economicParams, totalCAPEX: parseFloat(e.target.value)})}
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
                      onChange={(e) => setEconomicParams({...economicParams, oilPrice: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gas Price ($/mcf)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={economicParams.gasPrice}
                      onChange={(e) => setEconomicParams({...economicParams, gasPrice: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fixed OPEX ($/year)</label>
                  <input
                    type="number"
                    value={economicParams.fixedOPEX}
                    onChange={(e) => setEconomicParams({...economicParams, fixedOPEX: parseFloat(e.target.value)})}
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
                      onChange={(e) => setEconomicParams({...economicParams, oilOPEX: parseFloat(e.target.value)})}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Gas OPEX</label>
                    <input
                      type="number"
                      step="0.01"
                      value={economicParams.gasOPEX}
                      onChange={(e) => setEconomicParams({...economicParams, gasOPEX: parseFloat(e.target.value)})}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Water OPEX</label>
                    <input
                      type="number"
                      step="0.01"
                      value={economicParams.waterOPEX}
                      onChange={(e) => setEconomicParams({...economicParams, waterOPEX: parseFloat(e.target.value)})}
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
                      onChange={(e) => setEconomicParams({...economicParams, oilNRI: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gas NRI</label>
                    <input
                      type="number"
                      step="0.001"
                      value={economicParams.gasNRI}
                      onChange={(e) => setEconomicParams({...economicParams, gasNRI: parseFloat(e.target.value)})}
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
                    onChange={(e) => setEconomicParams({...economicParams, discountRate: parseFloat(e.target.value) / 100})}
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
                      onChange={(e) => setEconomicParams({...economicParams, adValorem: parseFloat(e.target.value)})}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Oil Sev Tax</label>
                    <input
                      type="number"
                      step="0.001"
                      value={economicParams.oilSeverance}
                      onChange={(e) => setEconomicParams({...economicParams, oilSeverance: parseFloat(e.target.value)})}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Gas Sev Tax</label>
                    <input
                      type="number"
                      step="0.001"
                      value={economicParams.gasSeverance}
                      onChange={(e) => setEconomicParams({...economicParams, gasSeverance: parseFloat(e.target.value)})}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Carbon Parameters */}
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
                    onChange={(e) => setCarbonParams({...carbonParams, processingIntensity: parseFloat(e.target.value)})}
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
                    onChange={(e) => setCarbonParams({...carbonParams, flarePercent: parseFloat(e.target.value) / 100})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">% of gas production that is flared</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carbon Price ($/ton CO₂e)</label>
                  <input
                    type="number"
                    value={carbonParams.carbonPrice}
                    onChange={(e) => setCarbonParams({...carbonParams, carbonPrice: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">For tax liability/credit simulation</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={carbonParams.enableCarbonCredits}
                    onChange={(e) => setCarbonParams({...carbonParams, enableCarbonCredits: e.target.checked})}
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
              onClick={handleAnalyze}
              className="flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Activity className="w-6 h-6" />
              <span>Analyze Well Performance</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Main Analysis Interface with Tabs
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto mb-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AlphaWell Intelligence</h1>
              <p className="text-sm text-gray-600">Well: {wellParams.wellId} • {wellParams.formation}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4" />
              <span>Save Scenario</span>
            </button>
            <button
              onClick={() => {
                setAnalyzed(false);
                setActiveTab('input');
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              New Analysis
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-2 max-w-7xl mx-auto">
          <button
            onClick={() => setActiveTab('executive')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'executive' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Executive Summary</span>
          </button>
          <button
            onClick={() => setActiveTab('neighborhood')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'neighborhood' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Neighborhood Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('production')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'production' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LineChartIcon className="w-4 h-4" />
            <span>Production Forecast</span>
          </button>
          <button
            onClick={() => setActiveTab('economic')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'economic' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Economic Model</span>
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Executive Summary Tab */}
        {activeTab === 'executive' && kpis && (
          <div className="space-y-6">
            {/* Decision Verdict Banner */}
            <div className={`rounded-xl p-6 ${
              kpis.verdict === 'Drill' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
              kpis.verdict === 'Evaluate Further' ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
              'bg-gradient-to-r from-red-500 to-pink-600'
            } text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Decision Recommendation: {kpis.verdict}</h2>
                  <p className="text-lg opacity-90">ESG Risk Level: {kpis.esgRisk}</p>
                </div>
                <div className="text-right">
                  {kpis.verdict === 'Drill' ? (
                    <CheckCircle className="w-16 h-16" />
                  ) : (
                    <AlertTriangle className="w-16 h-16" />
                  )}
                </div>
              </div>
            </div>
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">NPV</span>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">${kpis.npv.toFixed(2)}M</p>
                <p className="text-xs text-gray-500 mt-1">@ {(economicParams.discountRate * 100).toFixed(0)}% discount</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">IRR</span>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{kpis.irr.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Internal rate of return</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">EUR Oil</span>
                  <Droplet className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{(kpis.eurOil / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-500 mt-1">bbls cumulative</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">EUR Gas</span>
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{(kpis.eurGas / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-500 mt-1">mcf cumulative</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total CO₂</span>
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{kpis.totalCO2.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">tons over life</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Carbon Intensity</span>
                  <Activity className="w-5 h-5 text-teal-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{kpis.avgIntensity.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">g CO₂e/BOE</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Carbon Credits</span>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">${kpis.carbonCreditPotential.toFixed(0)}K</p>
                <p className="text-xs text-gray-500 mt-1">potential revenue</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Payback</span>
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{kpis.paybackMonths}</p>
                <p className="text-xs text-gray-500 mt-1">months to positive CF</p>
              </div>
            </div>
            
            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Production Preview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Production Decline Preview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productionData.filter((_, i) => i % 3 === 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="oil" stroke="#f97316" strokeWidth={2} name="Oil (bbl/mo)" />
                    <Line type="monotone" dataKey="gas" stroke="#8b5cf6" strokeWidth={2} name="Gas (mcf/mo)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Cashflow Preview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cumulative Cash Flow</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={economicData.filter((_, i) => i % 3 === 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(2)}M`} />
                    <Legend />
                    <Area type="monotone" dataKey="cumulativeCashFlow" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Cumulative CF ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Carbon Intelligence Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Carbon Intensity Timeline */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Carbon Intensity Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={carbonData.filter((_, i) => i % 3 === 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="intensity" stroke="#14b8a6" strokeWidth={2} name="g CO₂e/BOE" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Emission Sources */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Emission Sources Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Oil Combustion', value: carbonData.reduce((sum, d) => sum + d.combustionOil, 0) },
                        { name: 'Gas Combustion', value: carbonData.reduce((sum, d) => sum + d.combustionGas, 0) },
                        { name: 'Processing', value: carbonData.reduce((sum, d) => sum + d.processing, 0) },
                        { name: 'Flaring', value: carbonData.reduce((sum, d) => sum + d.flaring, 0) }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value.toFixed(0)}t`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
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
            
            {/* Formation Descriptors */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Well Characteristics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Formation</p>
                  <p className="font-semibold text-gray-900">{wellParams.formation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trajectory</p>
                  <p className="font-semibold text-gray-900">{wellParams.trajectory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">TVD</p>
                  <p className="font-semibold text-gray-900">{wellParams.tvd.toLocaleString()} ft</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lateral Length</p>
                  <p className="font-semibold text-gray-900">{wellParams.lateralLength.toLocaleString()} ft</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CAPEX</p>
                  <p className="font-semibold text-gray-900">${(economicParams.totalCAPEX / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fixed OPEX</p>
                  <p className="font-semibold text-gray-900">${(economicParams.fixedOPEX / 1000).toFixed(0)}K/yr</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Oil Price</p>
                  <p className="font-semibold text-gray-900">${economicParams.oilPrice}/bbl</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gas Price</p>
                  <p className="font-semibold text-gray-900">${economicParams.gasPrice}/mcf</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Neighborhood Analysis Tab */}
        {activeTab === 'neighborhood' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Spatial Benchmark Analysis</h2>
              
              {/* Map Placeholder */}
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-8 mb-6 border-2 border-blue-200">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Well Map</h3>
                  <p className="text-gray-600 mb-4">Target Well: {wellParams.latitude.toFixed(4)}, {wellParams.longitude.toFixed(4)}</p>
                  <div className="flex items-center justify-center space-x-8 mt-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-700">High Performer</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-gray-700">Moderate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span className="text-sm text-gray-700">Underperformer</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Neighbor Wells Table */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">Offset Wells Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Well ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Formation</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Distance</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">EUR (bbl)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">NPV ($M)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">CO₂ Intensity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
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
            
            {/* Benchmarking Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">EUR Distribution Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={NEIGHBOR_WELLS}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="id" tick={{fontSize: 10}} />
                    <YAxis tick={{fontSize: 12}} />
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
                    <XAxis dataKey="id" tick={{fontSize: 10}} />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="carbonIntensity" fill="#14b8a6" name="g CO₂e/BOE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Statistical Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistical Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold">Avg EUR</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {(NEIGHBOR_WELLS.reduce((sum, w) => sum + w.eur, 0) / NEIGHBOR_WELLS.length / 1000).toFixed(0)}K bbl
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-semibold">Avg NPV</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${(NEIGHBOR_WELLS.reduce((sum, w) => sum + w.npv, 0) / NEIGHBOR_WELLS.length).toFixed(1)}M
                  </p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <p className="text-sm text-teal-800 font-semibold">Avg Carbon Intensity</p>
                  <p className="text-2xl font-bold text-teal-900">
                    {(NEIGHBOR_WELLS.reduce((sum, w) => sum + w.carbonIntensity, 0) / NEIGHBOR_WELLS.length).toFixed(0)} g/BOE
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800 font-semibold">Your Well Rank</p>
                  <p className="text-2xl font-bold text-purple-900">Top 33%</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Production Forecast Tab */}
        {activeTab === 'production' && (
          <div className="space-y-6">
            {/* Production Charts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Production Forecast Simulation</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800 font-semibold">Peak Oil Month</p>
                  <p className="text-2xl font-bold text-orange-900">
                    Month {productionData.reduce((max, d, i) => d.oil > productionData[max].oil ? i : max, 0) + 1}
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    {productionData.reduce((max, d) => d.oil > max ? d.oil : max, 0).toFixed(0)} bbl/mo
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800 font-semibold">Peak Gas Month</p>
                  <p className="text-2xl font-bold text-purple-900">
                    Month {productionData.reduce((max, d, i) => d.gas > productionData[max].gas ? i : max, 0) + 1}
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    {productionData.reduce((max, d) => d.gas > max ? d.gas : max, 0).toFixed(0)} mcf/mo
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold">Total Water Production</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {(productionData[productionData.length - 1].cumulativeWater / 1000).toFixed(0)}K bbl
                  </p>
                  <p className="text-sm text-blue-700 mt-1">Over {wellParams.predictionHorizon} years</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={productionData.filter((_, i) => i % 2 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="oil" stroke="#f97316" strokeWidth={2} name="Oil (bbl/mo)" />
                  <Line type="monotone" dataKey="gas" stroke="#8b5cf6" strokeWidth={2} name="Gas (mcf/mo)" />
                  <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={2} name="Water (bbl/mo)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Cumulative Production */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cumulative Production</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={productionData.filter((_, i) => i % 3 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="cumulativeOil" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} name="Cumulative Oil (bbl)" />
                  <Area type="monotone" dataKey="cumulativeGas" stackId="2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Cumulative Gas (mcf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Water Cut */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Water Cut Evolution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productionData.filter((_, i) => i % 3 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="waterCut" stroke="#3b82f6" strokeWidth={2} name="Water Cut (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Economic Modeling Tab */}
        {activeTab === 'economic' && (
          <div className="space-y-6">
            {/* Economic Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  ${(economicData.reduce((sum, d) => sum + d.revenue, 0) / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Total OPEX</p>
                <p className="text-3xl font-bold text-red-600">
                  ${(economicData.reduce((sum, d) => sum + d.opex, 0) / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Total Taxes</p>
                <p className="text-3xl font-bold text-orange-600">
                  ${(economicData.reduce((sum, d) => sum + d.taxes, 0) / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Net Cash Flow</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${(economicData[economicData.length - 1].cumulativeCashFlow / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
            
            {/* Monthly Cash Flow */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Cash Flow Components</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={economicData.filter((_, i) => i % 6 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
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
                  <XAxis dataKey="date" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(2)}M`} />
                  <Legend />
                  <Area type="monotone" dataKey="npv" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Cumulative NPV ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Sensitivity Analysis */}
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
                      const npvImpact = kpis ? kpis.npv - (economicParams.totalCAPEX * pct / 100 / 1000000) : 0;
                      return (
                        <div key={pct} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">${(adjustedCapex / 1000000).toFixed(2)}M ({pct > 0 ? '+' : ''}{pct}%)</span>
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
        )}
      </div>
    </div>
  );
};

export default AlphaWellPlatform;
