import React, { createContext, useContext, useMemo, useState } from 'react';
import { MOCK_USERS, NEIGHBOR_WELLS, MOCK_DECISIONS } from '../lib/mock';
import { generateProductionData, generateEconomicData, generateCarbonData } from '../lib/simulators';

const AlphaWellContext = createContext(null);
export const useAlphaWell = () => useContext(AlphaWellContext);

export function AlphaWellProvider({ children }) {
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // App state
  const [activeTab, setActiveTab] = useState('start');
  const [showHistorical, setShowHistorical] = useState(false);

  // Inputs
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
    predictionHorizon: 15,
  });

  const [economicParams, setEconomicParams] = useState({
    totalCAPEX: 8_500_000,
    drillingExpense: 4_200_000,
    completionExpense: 4_300_000,
    fixedOPEX: 120_000,
    oilOPEX: 8.5,
    gasOPEX: 0.45,
    waterOPEX: 2.1,
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
    gasSeverance: 0.075,
  });

  const [carbonParams, setCarbonParams] = useState({
    processingIntensity: 1.0,
    flarePercent: 0.02,
    carbonPrice: 50,
    enableCarbonCredits: false,
  });

  // Simulation data
  const [productionData, setProductionData] = useState([]);
  const [economicData, setEconomicData] = useState([]);
  const [carbonData, setCarbonData] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auth actions
  const login = (email, password) => {
    const u = MOCK_USERS.find((x) => x.email === email && x.password === password);
    if (!u) {
      alert('Invalid credentials. Try: investor@alphawell.com / demo123');
      return false;
    }
    setCurrentUser(u);
    setIsAuthenticated(true);
    return true;
  };

  const signup = ({ name, email, password }) => {
    const newUser = { email, password, role: 'investor', name: name || 'New User' };
    // Demo-only mutation
    MOCK_USERS.push(newUser);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('start');
    setAnalyzed(false);
    setProductionData([]);
    setEconomicData([]);
    setCarbonData([]);
  };

  // Analysis actions
  const analyze = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const horizon = Number(wellParams.predictionHorizon || 15);
      const lateral = Number(wellParams.lateralLength || 7500);

      const prod = generateProductionData(horizon, lateral);
      const econ = generateEconomicData(prod, economicParams);
      const carb = generateCarbonData(prod, carbonParams);

      setProductionData(prod);
      setEconomicData(econ);
      setCarbonData(carb);
      setAnalyzed(true);
      setActiveTab('executive');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setProductionData([]);
    setEconomicData([]);
    setCarbonData([]);
    setAnalyzed(false);
    setActiveTab('input');
  };

  // KPIs (defensive)
  const kpis = useMemo(() => {
    if (!analyzed || economicData.length === 0 || productionData.length === 0 || carbonData.length === 0) {
      return null;
    }

    const lastProd = productionData[productionData.length - 1] ?? {};
    const lastEcon = economicData[economicData.length - 1] ?? {};
    const lastCarbon = carbonData[carbonData.length - 1] ?? {};

    const totalOil = Number(lastProd.cumulativeOil || 0);
    const totalGas = Number(lastProd.cumulativeGas || 0);
    const npv = Number(lastEcon.npv || 0) / 1_000_000;

    const totalCF = Number(lastEcon.cumulativeCashFlow || 0);
    const years = Number(wellParams.predictionHorizon || 1);
    const capex = Number(economicParams.totalCAPEX || 0);
    const irr =
      totalCF > 0 && capex > 0 ? ((totalCF / capex) ** (1 / years) - 1) * 100 : -100;

    const totalCO2_tons = Number(lastCarbon.cumulativeCO2 || 0); // tons
    const boeLife = totalOil + totalGas / 6; // 6 mcf = 1 boe
    const avgIntensity = boeLife > 0 ? (totalCO2_tons * 1_000_000) / boeLife : 0; // g CO2e/BOE

    const carbonCreditPotentialK = carbonParams.enableCarbonCredits
      ? (totalCO2_tons * 0.15 * Number(carbonParams.carbonPrice || 0)) / 1_000 // show in $K
      : 0;

    let verdict = 'Evaluate Further';
    let esgRisk = 'Moderate';
    if (npv > 8 && irr > 25 && avgIntensity < 45) {
      verdict = 'Drill';
      esgRisk = 'Low';
    } else if (npv < 4 || irr < 15 || avgIntensity > 55) {
      verdict = 'High Risk';
      esgRisk = 'High';
    }

    const paybackIndex = economicData.findIndex((d) => (d?.cumulativeCashFlow ?? -1) > 0);

    return {
      eurOil: totalOil,
      eurGas: totalGas,
      npv,
      irr,
      totalCO2: totalCO2_tons,
      avgIntensity,
      carbonCreditPotential: carbonCreditPotentialK,
      verdict,
      esgRisk,
      paybackMonths: paybackIndex >= 0 ? paybackIndex : null,
    };
  }, [analyzed, productionData, economicData, carbonData, economicParams, wellParams, carbonParams]);

  const value = {
    // auth
    isAuthenticated,
    currentUser,
    login,
    logout,
    signup,

    // nav/state
    activeTab,
    setActiveTab,
    showHistorical,
    setShowHistorical,

    // inputs
    wellParams,
    setWellParams,
    economicParams,
    setEconomicParams,
    carbonParams,
    setCarbonParams,

    // analysis data
    productionData,
    economicData,
    carbonData,
    analyzed,
    analyze,
    isAnalyzing,
    resetAnalysis,
    kpis,

    // static demo data
    NEIGHBOR_WELLS,
    MOCK_DECISIONS,
  };

  return <AlphaWellContext.Provider value={value}>{children}</AlphaWellContext.Provider>;
}
