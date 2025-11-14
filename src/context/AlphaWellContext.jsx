
// import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { NEIGHBOR_WELLS, MOCK_DECISIONS } from '../lib/mock';
// import { generateProductionData, generateEconomicData, generateCarbonData } from '../lib/simulators';

// const AlphaWellContext = createContext(null);
// export const useAlphaWell = () => useContext(AlphaWellContext);

// // ---------------- API client (axios) ----------------
// const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
// const api = axios.create({
//   baseURL: API_BASE,
// });

// // attach Authorization automatically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('aw_access');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // token refresh on 401
// let isRefreshing = false;
// let queued = [];
// api.interceptors.response.use(
//   (r) => r,
//   async (error) => {
//     const orig = error.config;
//     if (error.response?.status === 401 && !orig._retry) {
//       orig._retry = true;

//       if (isRefreshing) {
//         // queue the request until current refresh finishes
//         return new Promise((resolve, reject) => {
//           queued.push({ resolve, reject });
//         })
//           .then((token) => {
//             orig.headers.Authorization = `Bearer ${token}`;
//             return api(orig);
//           })
//           .catch(Promise.reject);
//       }

//       try {
//         isRefreshing = true;
//         const refresh = localStorage.getItem('aw_refresh');
//         if (!refresh) throw new Error('No refresh token');

//         const { data } = await axios.post(`${API_BASE}/auth/refresh/`, { refresh });
//         const newAccess = data?.access;
//         if (!newAccess) throw new Error('No access in refresh');

//         localStorage.setItem('aw_access', newAccess);
//         queued.forEach((p) => p.resolve(newAccess));
//         queued = [];
//         orig.headers.Authorization = `Bearer ${newAccess}`;
//         return api(orig);
//       } catch (e) {
//         queued.forEach((p) => p.reject(e));
//         queued = [];
//         localStorage.removeItem('aw_access');
//         localStorage.removeItem('aw_refresh');
//         return Promise.reject(e);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // ---------------- Provider ----------------
// export function AlphaWellProvider({ children }) {
//   // Auth
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const bootstrapped = useRef(false);

//   // App state
//   const [activeTab, setActiveTab] = useState('start');
//   const [showHistorical, setShowHistorical] = useState(false);

//   // Inputs
//   const [wellParams, setWellParams] = useState({
//     wellId: 'AW-2024-457',
//     latitude: 31.8467,
//     longitude: -102.3689,
//     formation: 'Wolfcamp A',
//     stateWellType: 'Horizontal',
//     trajectory: 'Horizontal',
//     tvd: 8450,
//     md: 16250,
//     lateralLength: 7500,
//     elevationKB: 2847,
//     predictionHorizon: 15,
//   });

//   const [economicParams, setEconomicParams] = useState({
//     totalCAPEX: 8_500_000,
//     drillingExpense: 4_200_000,
//     completionExpense: 4_300_000,
//     fixedOPEX: 120_000,
//     oilOPEX: 8.5,
//     gasOPEX: 0.45,
//     waterOPEX: 2.1,
//     oilWI: 0.75,
//     gasWI: 0.75,
//     waterWI: 0.75,
//     oilNRI: 0.6375,
//     gasNRI: 0.6375,
//     discountRate: 0.10,
//     oilPrice: 75,
//     gasPrice: 3.25,
//     oilDiff: 0.02,
//     gasMult: 0.95,
//     adValorem: 0.015,
//     oilSeverance: 0.046,
//     gasSeverance: 0.075,
//   });

//   const [carbonParams, setCarbonParams] = useState({
//     processingIntensity: 1.0,
//     flarePercent: 0.02,
//     carbonPrice: 50,
//     enableCarbonCredits: false,
//   });

//   // Simulation data
//   const [productionData, setProductionData] = useState([]);
//   const [economicData, setEconomicData] = useState([]);
//   const [carbonData, setCarbonData] = useState([]);
//   const [analyzed, setAnalyzed] = useState(false);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   // ---------- Auth helpers ----------
//   const storeTokens = ({ access, refresh }) => {
//     if (access) localStorage.setItem('aw_access', access);
//     if (refresh) localStorage.setItem('aw_refresh', refresh);
//   };

//   const clearTokens = () => {
//     localStorage.removeItem('aw_access');
//     localStorage.removeItem('aw_refresh');
//   };

//   const fetchMe = async () => {
//     const { data } = await api.get('/auth/me/');
//     return data;
//   };

//   // Bootstrap session if tokens exist (on page reload)
//   useEffect(() => {
//     if (bootstrapped.current) return;
//     bootstrapped.current = true;

//     const access = localStorage.getItem('aw_access');
//     const refresh = localStorage.getItem('aw_refresh');
//     if (!access || !refresh) return;

//     (async () => {
//       try {
//         const me = await fetchMe();
//         setCurrentUser(me);
//         setIsAuthenticated(true);
//       } catch {
//         clearTokens();
//         setCurrentUser(null);
//         setIsAuthenticated(false);
//       }
//     })();
//   }, []);

//   // ---------- Auth actions exposed to UI ----------
//   const login = async (email, password) => {
//     try {
//       const { data } = await axios.post(`${API_BASE}/auth/login/`, { email, password });
//       // Expecting: { access, refresh, user: {...} }
//       storeTokens({ access: data?.access, refresh: data?.refresh });

//       const user = data?.user || (await fetchMe());
//       setCurrentUser(user);
//       setIsAuthenticated(true);
//       toast.success('Signed in successfully');
//       return true;
//     } catch (err) {
//       const msg = err.response?.data?.detail || 'Invalid credentials';
//       toast.error(msg);
//       return false;
//     }
//   };

//   const signup = async ({ name, email, password, role = 'INVESTOR' }) => {
//     try {
//       // Expect backend to accept: {name,email,password,role} and return tokens + user OR just create user
//       const { data } = await axios.post(`${API_BASE}/auth/signup/`, { name, email, password, role });
//       if (data?.access && data?.refresh) {
//         storeTokens({ access: data.access, refresh: data.refresh });
//         setIsAuthenticated(true);
//         setCurrentUser(data?.user || (await fetchMe()));
//       } else {
//         // If backend returns 201 without tokens, do a login right after
//         const ok = await login(email, password);
//         if (!ok) throw new Error('Signup succeeded, login failed');
//       }
//       toast.success('Account created');
//       return true;
//     } catch (err) {
//       const msg = err.response?.data?.detail || 'Signup failed';
//       toast.error(msg);
//       return false;
//     }
//   };

//   const logout = async () => {
//     try {
//       const refresh = localStorage.getItem('aw_refresh');
//       if (refresh) {
//         // Optional: if you implemented blacklist/rotate
//         await axios.post(`${API_BASE}/auth/logout/`, { refresh });
//       }
//     } catch {
//       /* ignore backend logout errors */
//     } finally {
//       clearTokens();
//       setIsAuthenticated(false);
//       setCurrentUser(null);
//       setActiveTab('start');
//       setAnalyzed(false);
//       setProductionData([]);
//       setEconomicData([]);
//       setCarbonData([]);
//       toast.info('Signed out');
//     }
//   };

//   // ---------- Analysis actions ----------
//   const analyze = () => {
//     if (isAnalyzing) return;
//     setIsAnalyzing(true);
//     try {
//       const horizon = Number(wellParams.predictionHorizon || 15);
//       const lateral = Number(wellParams.lateralLength || 7500);

//       const prod = generateProductionData(horizon, lateral);
//       const econ = generateEconomicData(prod, economicParams);
//       const carb = generateCarbonData(prod, carbonParams);

//       setProductionData(prod);
//       setEconomicData(econ);
//       setCarbonData(carb);
//       setAnalyzed(true);
//       setActiveTab('executive');
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const resetAnalysis = () => {
//     setProductionData([]);
//     setEconomicData([]);
//     setCarbonData([]);
//     setAnalyzed(false);
//     setActiveTab('input');
//   };

//   // ---------- KPIs (defensive) ----------
//   const kpis = useMemo(() => {
//     if (!analyzed || economicData.length === 0 || productionData.length === 0 || carbonData.length === 0) {
//       return null;
//     }

//     const lastProd = productionData[productionData.length - 1] ?? {};
//     const lastEcon = economicData[economicData.length - 1] ?? {};
//     const lastCarbon = carbonData[carbonData.length - 1] ?? {};

//     const totalOil = Number(lastProd.cumulativeOil || 0);
//     const totalGas = Number(lastProd.cumulativeGas || 0);
//     const npv = Number(lastEcon.npv || 0) / 1_000_000;

//     const totalCF = Number(lastEcon.cumulativeCashFlow || 0);
//     const years = Number(wellParams.predictionHorizon || 1);
//     const capex = Number(economicParams.totalCAPEX || 0);
//     const irr =
//       totalCF > 0 && capex > 0 ? ((totalCF / capex) ** (1 / years) - 1) * 100 : -100;

//     const totalCO2_tons = Number(lastCarbon.cumulativeCO2 || 0); // tons
//     const boeLife = totalOil + totalGas / 6; // 6 mcf = 1 boe
//     const avgIntensity = boeLife > 0 ? (totalCO2_tons * 1_000_000) / boeLife : 0; // g CO2e/BOE

//     const carbonCreditPotentialK = carbonParams.enableCarbonCredits
//       ? (totalCO2_tons * 0.15 * Number(carbonParams.carbonPrice || 0)) / 1_000 // show in $K
//       : 0;

//     let verdict = 'Evaluate Further';
//     let esgRisk = 'Moderate';
//     if (npv > 8 && irr > 25 && avgIntensity < 45) {
//       verdict = 'Drill';
//       esgRisk = 'Low';
//     } else if (npv < 4 || irr < 15 || avgIntensity > 55) {
//       verdict = 'High Risk';
//       esgRisk = 'High';
//     }

//     const paybackIndex = economicData.findIndex((d) => (d?.cumulativeCashFlow ?? -1) > 0);

//     return {
//       eurOil: totalOil,
//       eurGas: totalGas,
//       npv,
//       irr,
//       totalCO2: totalCO2_tons,
//       avgIntensity,
//       carbonCreditPotential: carbonCreditPotentialK,
//       verdict,
//       esgRisk,
//       paybackMonths: paybackIndex >= 0 ? paybackIndex : null,
//     };
//   }, [analyzed, productionData, economicData, carbonData, economicParams, wellParams, carbonParams]);

//   const value = {
//     // auth
//     isAuthenticated,
//     currentUser,
//     login,
//     logout,
//     signup,

//     // nav/state
//     activeTab,
//     setActiveTab,
//     showHistorical,
//     setShowHistorical,

//     // inputs
//     wellParams,
//     setWellParams,
//     economicParams,
//     setEconomicParams,
//     carbonParams,
//     setCarbonParams,

//     // analysis data
//     productionData,
//     economicData,
//     carbonData,
//     analyzed,
//     analyze,
//     isAnalyzing,
//     resetAnalysis,
//     kpis,

//     // static demo data
//     NEIGHBOR_WELLS,
//     MOCK_DECISIONS,
//   };

//   return <AlphaWellContext.Provider value={value}>{children}</AlphaWellContext.Provider>;
// }
// src/context/AlphaWellContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NEIGHBOR_WELLS as STATIC_NEIGHBOR_WELLS, MOCK_DECISIONS } from '../lib/mock';
import { generateProductionData, generateEconomicData, generateCarbonData } from '../lib/simulators';

const AlphaWellContext = createContext(null);
export const useAlphaWell = () => useContext(AlphaWellContext);

/** ---------------- Primary app API (your Django JWT) ---------------- */
const APP_API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://3.236.227.108';
const appApi = axios.create({ baseURL: APP_API_BASE });
appApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('aw_access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Auto refresh JWT access on 401 */
let isRefreshing = false;
let queued = [];
appApi.interceptors.response.use(
  (r) => r,
  async (error) => {
    const orig = error.config;
    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => queued.push({ resolve, reject }))
          .then((token) => {
            orig.headers.Authorization = `Bearer ${token}`;
            return appApi(orig);
          })
          .catch(Promise.reject);
      }

      try {
        isRefreshing = true;
        const refresh = localStorage.getItem('aw_refresh');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post(`${APP_API_BASE}/auth/refresh/`, { refresh });
        const newAccess = data?.access;
        if (!newAccess) throw new Error('No access in refresh');
        localStorage.setItem('aw_access', newAccess);
        queued.forEach((p) => p.resolve(newAccess));
        queued = [];
        orig.headers.Authorization = `Bearer ${newAccess}`;
        return appApi(orig);
      } catch (e) {
        queued.forEach((p) => p.reject(e));
        queued = [];
        localStorage.removeItem('aw_access');
        localStorage.removeItem('aw_refresh');
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

/** ---------------- Wells AI API (x-api-key) ---------------- */
const WELLS_API_BASE = import.meta.env.VITE_WELLS_API_BASE || 'http://54.210.165.50:8003';
const WELLS_API_KEY  = import.meta.env.VITE_WELLS_API_KEY  || 'mqube-wells-ai-2025-access-token';

const wellsApi = axios.create({
  baseURL: WELLS_API_BASE,
  headers: { 'x-api-key': WELLS_API_KEY },
});

/** ---------------- Provider ---------------- */
export function AlphaWellProvider({ children }) {
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const bootstrapped = useRef(false);

  // App state
  const [activeTab, setActiveTab] = useState('start');
  const [showHistorical, setShowHistorical] = useState(false);

  // Inputs
  const [wellParams, setWellParams] = useState({
    wellId: 'AW-2024-457',
    latitude: 31.8467,
    longitude: -102.3689,
    formation: 'WOLFCAMP',
    env_interval: 'WOLFCAMP A LOWER',
    stateWellType: 'OIL_WELL',
    trajectory: 'HORIZONTAL',
    tvd: 8450,
    md: 16250,
    lateralLength: 7500,
    elevationKB: 2847,
    predictionHorizon: 15, // years (API expects months)
  });

  const [economicParams, setEconomicParams] = useState({
    totalCAPEX: 8_500_000,
    drillingExpense: 4_200_000,
    completionExpense: 4_300_000,
    fixedOPEX: 120_000,      // per year (we convert to /month for the API)
    oilOPEX: 8.5,            // $/bbl
    gasOPEX: 0.45,           // $/mcf
    waterOPEX: 2.1,          // $/bbl
    oilWI: 0.75,
    gasWI: 0.75,
    waterWI: 0.75,
    oilNRI: 0.6375,
    gasNRI: 0.6375,
    discountRate: 0.10,      // 10% (API uses percent)
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

  // Data
  const [productionData, setProductionData] = useState([]);
  const [economicData, setEconomicData] = useState([]);
  const [carbonData, setCarbonData] = useState([]);
  const [neighborWells, setNeighborWells] = useState(STATIC_NEIGHBOR_WELLS);
  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /** ---------- Auth helpers ---------- */
  const storeTokens = ({ access, refresh }) => {
    if (access) localStorage.setItem('aw_access', access);
    if (refresh) localStorage.setItem('aw_refresh', refresh);
  };
  const clearTokens = () => {
    localStorage.removeItem('aw_access');
    localStorage.removeItem('aw_refresh');
  };
  const fetchMe = async () => (await appApi.get('/auth/me/')).data;

  // Bootstrap session if tokens exist (on page reload)
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const access = localStorage.getItem('aw_access');
    const refresh = localStorage.getItem('aw_refresh');
    if (!access || !refresh) return;

    (async () => {
      try {
        const me = await fetchMe();
        setCurrentUser(me);
        setIsAuthenticated(true);
      } catch {
        clearTokens();
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    })();
  }, []);

  /** ---------- Auth actions exposed to UI ---------- */
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${APP_API_BASE}/auth/login/`, { email, password });
      storeTokens({ access: data?.access, refresh: data?.refresh });
      const user = data?.user || (await fetchMe());
      setCurrentUser(user);
      setIsAuthenticated(true);
      toast.success('Signed in successfully');
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid credentials';
      toast.error(msg);
      return false;
    }
  };

  const signup = async ({ name, email, password, role = 'INVESTOR' }) => {
    try {
      const { data } = await axios.post(`${APP_API_BASE}/auth/signup/`, { name, email, password, role });
      if (data?.access && data?.refresh) {
        storeTokens({ access: data.access, refresh: data.refresh });
        setCurrentUser(data?.user || (await fetchMe()));
        setIsAuthenticated(true);
      } else {
        await login(email, password);
      }
      toast.success('Account created');
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Signup failed';
      toast.error(msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('aw_refresh');
      if (refresh) {
        await axios.post(`${APP_API_BASE}/auth/logout/`, { refresh });
      }
    } catch {
      /* ignore backend logout errors */
    } finally {
      clearTokens();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveTab('start');
      setAnalyzed(false);
      setProductionData([]);
      setEconomicData([]);
      setCarbonData([]);
      setNeighborWells(STATIC_NEIGHBOR_WELLS);
      toast.info('Signed out');
    }
  };

  /** ---------- Helpers: map UI state -> API payload ---------- */
  const buildAnalyzePayload = () => {
    const horizonMonths = Number(wellParams.predictionHorizon || 15) * 12;
    return {
      well_params: {
        well_id: String(wellParams.wellId || ''),
        latitude: Number(wellParams.latitude),
        longitude: Number(wellParams.longitude),
        env_interval: String(wellParams.env_interval || 'WOLFCAMP A LOWER'),
        state_well_type: String(wellParams.stateWellType || 'OIL_WELL'),
        env_well_type: String(wellParams.env_well_type || 'OIL'),
        trajectory: String(wellParams.trajectory || 'HORIZONTAL'),
        env_wellbore_type: String(wellParams.env_wellbore_type || 'SINGLE BORE'),
        formation: String(wellParams.formation || 'WOLFCAMP'),
        tvd_ft: Number(wellParams.tvd || 9000),
        md_ft: Number(wellParams.md || 15000),
        env_elevation_kb_ft: Number(wellParams.env_elevation_kb_ft || wellParams.elevationKB || 3000),
        env_elevation_gl_ft: Number(wellParams.env_elevation_gl_ft || 2995),
        elevation_kb_ft: Number(wellParams.elevationKB || 3019),
        elevation_gl_ft: Number(wellParams.elevationGL || 2995),
        env_fluid_type: String(wellParams.env_fluid_type || 'FRESH WATER'),
        lateral_length_ft: Number(wellParams.lateralLength || 7000),
        prediction_horizon: horizonMonths,
      },
      economic_params: {
        discount_factor: Number((economicParams.discountRate ?? 0) * 100),   // % for API
        gas_opex: Number(economicParams.gasOPEX ?? 0),
        oil_opex: Number(economicParams.oilOPEX ?? 0),
        water_opex: Number(economicParams.waterOPEX ?? 0),
        fixed_opex: Number((economicParams.fixedOPEX ?? 0) / 12),           // convert to /month
        working_interest_oil: Number((economicParams.oilWI ?? 0) * 100),
        working_interest_gas: Number((economicParams.gasWI ?? 0) * 100),
        working_interest_water: Number((economicParams.waterWI ?? 0) * 100),
        net_revenue_interest_oil: Number((economicParams.oilNRI ?? 0) * 100),
        net_revenue_interest_gas: Number((economicParams.gasNRI ?? 0) * 100),
        total_capex: Number(economicParams.totalCAPEX ?? 0),
        ad_valorem: Number((economicParams.adValorem ?? 0) * 100),
        oil_sev_tax: Number((economicParams.oilSeverance ?? 0) * 100),
        gas_sev_tax: Number((economicParams.gasSeverance ?? 0) * 100),
      },
      carbon_params: {
        processing_intensity_factor: Number(carbonParams.processingIntensity ?? 1),
        flaring_percentage: Number((carbonParams.flarePercent ?? 0) * 100),
        carbon_price_per_ton: Number(carbonParams.carbonPrice ?? 50),
      },
      include_confidence: true,
    };
  };

  /** ---------- Transform API -> UI state ---------- */
  const adaptAnalysis = (res) => {
    // Production
    let cumOil = 0, cumGas = 0, cumWater = 0;
    const cfByMonth = new Map((res.cash_flow || []).map((r) => [Number(r.month), r]));

    const prod = (res.production_data || []).map((d) => {
      cumOil  += Number(d.gross_production_oil_bbls || 0);
      cumGas  += Number(d.gross_production_wh_gas_mcf || 0);
      cumWater+= Number(d.gross_production_water_bbls || 0);
      const cf = cfByMonth.get(Number(d.time)) || {};
      const date = (cf.date || '').slice(0, 10) || `M${d.time}`;
      return {
        date,
        oil: Number(d.gross_production_oil_bbls || 0),
        gas: Number(d.gross_production_wh_gas_mcf || 0),
        water: Number(d.gross_production_water_bbls || 0),
        cumulativeOil: cumOil,
        cumulativeGas: cumGas,
        cumulativeWater: cumWater,
        waterCut: null,
      };
    });

    // Economic (monthly)
    const econ = (res.cash_flow || []).map((m) => ({
      date: (m.date || '').slice(0, 10),
      revenue: Number(m.revenue || 0),
      opex: Number(m.opex || 0),
      taxes: Number(m.taxes || 0),
      cumulativeCashFlow: Number(m.cumulative_cash_flow || 0),
      npv: Number(res.financial_metrics?.npv || 0),
    }));

    // Carbon series (intensity only)
    const carbon = (res.carbon_intensity || []).map((c) => ({
      date: (c.date || '').slice(0, 10),
      intensity: Number(c.carbon_intensity || 0),
      combustionOil: 0,
      combustionGas: 0,
      processing: 0,
      flaring: 0,
      cumulativeCO2: Number(res.carbon_metrics?.total_emitted || 0),
    }));

    return { prod, econ, carbon };
  };

  const fetchNeighborhood = async () => {
    try {
      const payload = {
        latitude: Number(wellParams.latitude),
        longitude: Number(wellParams.longitude),
        radius_mi: 5,
        formation: String(wellParams.formation || 'WOLFCAMP'),
        trajectory: String(wellParams.trajectory || 'HORIZONTAL'),
        env_well_type: String(wellParams.env_well_type || 'OIL'),
        env_wellbore_type: String(wellParams.env_wellbore_type || 'SINGLE BORE'),
        env_fluid_type: String(wellParams.env_fluid_type || 'FRESH WATER'),
      };
      const { data } = await wellsApi.post('/api/neighborhood/analyze', payload);
      const avgCI = Array.isArray(data?.neighborhood_production_metrics?.avg_carbon_intensity)
        ? data.neighborhood_production_metrics.avg_carbon_intensity.reduce((a, b) => a + b, 0) /
          (data.neighborhood_production_metrics.avg_carbon_intensity.length || 1)
        : null;

      const mapped = (data?.wells || []).map((w, idx) => ({
        id: String(w.well_id || `W-${idx}`),
        formation: w.formation || payload.formation,
        distance: Number(w.distance_mi || 0).toFixed(2),
        eur: Number(w.cumulative_oil || 0), // proxy for chart
        npv: 0,
        carbonIntensity: avgCI ? Number(avgCI).toFixed(0) : 0,
        status: w.status || 'ACTIVE',
      }));
      if (mapped.length) setNeighborWells(mapped);
    } catch (e) {
      console.warn('Neighborhood fetch failed:', e?.message);
    }
  };

  /** ---------- Analysis (live first, sim fallback) ---------- */
  const analyze = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const payload = buildAnalyzePayload();
      const { data } = await wellsApi.post('/api/analysis/analyze', payload);

      const { prod, econ, carbon } = adaptAnalysis(data);
      const haveProd = Array.isArray(prod) && prod.length;
      const haveEcon = Array.isArray(econ) && econ.length;
      const haveCarb = Array.isArray(carbon) && carbon.length;

      const horizonYears = Number(wellParams.predictionHorizon || 15);
      const lateral = Number(wellParams.lateralLength || 7500);

      const prodUse = haveProd ? prod : generateProductionData(horizonYears, lateral);
      const econUse = haveEcon ? econ : generateEconomicData(prodUse, economicParams);
      const carbUse = haveCarb ? carbon : generateCarbonData(prodUse, carbonParams);

      setProductionData(prodUse);
      setEconomicData(econUse);
      setCarbonData(carbUse);
      setAnalyzed(true);
      setActiveTab('executive');

      // fetch neighbors in background
      fetchNeighborhood();
    } catch (e) {
      console.error(e);
      toast.error('Analysis failed. Falling back to simulator.');
      const horizonYears = Number(wellParams.predictionHorizon || 15);
      const lateral = Number(wellParams.lateralLength || 7500);
      const prod = generateProductionData(horizonYears, lateral);
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

  /** ---------- KPIs (defensive) ---------- */
  const kpis = useMemo(() => {
    if (!analyzed || !economicData.length || !productionData.length || !carbonData.length) return null;

    const lastProd = productionData[productionData.length - 1] ?? {};
    const lastEcon = economicData[economicData.length - 1] ?? {};
    const lastCarbon = carbonData[carbonData.length - 1] ?? {};

    const totalOil = Number(lastProd.cumulativeOil || 0);
    const totalGas = Number(lastProd.cumulativeGas || 0);
    const npv = Number(lastEcon.npv || 0) / 1_000_000;

    const totalCF = Number(lastEcon.cumulativeCashFlow || 0);
    const years = Number(wellParams.predictionHorizon || 1);
    const capex = Number(economicParams.totalCAPEX || 0);
    const irr = totalCF > 0 && capex > 0 ? ((totalCF / capex) ** (1 / years) - 1) * 100 : -100;

    const totalCO2_tons = Number(lastCarbon.cumulativeCO2 || 0);
    const boeLife = totalOil + totalGas / 6;
    const avgIntensity = boeLife > 0 ? (totalCO2_tons * 1_000_000) / boeLife : 0;

    const carbonCreditPotentialK = carbonParams.enableCarbonCredits
      ? (totalCO2_tons * 0.15 * Number(carbonParams.carbonPrice || 0)) / 1_000
      : 0;

    let verdict = 'Evaluate Further';
    let esgRisk = 'Moderate';
    if (npv > 8 && irr > 25 && avgIntensity < 45) { verdict = 'Drill'; esgRisk = 'Low'; }
    else if (npv < 4 || irr < 15 || avgIntensity > 55) { verdict = 'High Risk'; esgRisk = 'High'; }

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

  /** ---------- Optional: Reports API (save/list/load) ---------- */
  const saveReport = async (userId = currentUser?.id || 1) => {
    try {
      const payload = {
        success: true,
        production_data: productionData.map((d, i) => ({
          time: i + 1,
          gross_production_oil_bbls: d.oil,
          gross_production_wh_gas_mcf: d.gas,
          gross_production_water_bbls: d.water,
          oil_lower_ci: 0, oil_upper_ci: 0,
          gas_lower_ci: 0, gas_upper_ci: 0,
          water_lower_ci: 0, water_upper_ci: 0,
        })),
        cash_flow: economicData.map((d, i) => ({
          month: i + 1,
          date: d.date,
          net_cash_flow: (d.revenue - d.opex - d.taxes),
          cumulative_cash_flow: d.cumulativeCashFlow,
          revenue: d.revenue,
          opex: d.opex,
          taxes: d.taxes,
          nvp: d.npv,
        })),
        financial_metrics: { npv: economicData.at(-1)?.npv || 0 },
        carbon_metrics: { total_emitted: carbonData.at(-1)?.cumulativeCO2 || 0, carbon_intensity: carbonData.at(-1)?.intensity || 0, carbon_credits: 0 },
        carbon_intensity: carbonData.map((c) => ({ date: c.date, carbon_intensity: c.intensity })),
      };
      const { data } = await wellsApi.post(`/api/reports/save/${userId}`, payload);
      toast.success(`Saved: ${data?.report_id || 'report'}`);
      return data;
    } catch (e) {
      toast.error('Save failed');
      return null;
    }
  };

  const listReports = async (userId = currentUser?.id || 1) => {
    const { data } = await wellsApi.get(`/api/reports/list/${userId}`);
    return data?.reports || [];
  };

  const loadReport = async (userId, reportId) => {
    const { data } = await wellsApi.get(`/api/reports/load/${userId}/${reportId}`);
    const { prod, econ, carbon } = adaptAnalysis(data);
    setProductionData(prod);
    setEconomicData(econ);
    setCarbonData(carbon);
    setAnalyzed(true);
    setActiveTab('executive');
  };

  const value = {
    // auth
    isAuthenticated, currentUser, login, logout, signup,

    // nav/state
    activeTab, setActiveTab, showHistorical, setShowHistorical,

    // inputs
    wellParams, setWellParams,
    economicParams, setEconomicParams,
    carbonParams, setCarbonParams,

    // data
    productionData, economicData, carbonData,
    neighborWells, // live neighborhood for the tab
    analyzed, analyze, isAnalyzing, resetAnalysis, kpis,

    // static/history
    MOCK_DECISIONS,

    // reports
    saveReport, listReports, loadReport,
  };

  return <AlphaWellContext.Provider value={value}>{children}</AlphaWellContext.Provider>;
}
