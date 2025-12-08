// src/context/AlphaWellContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  NEIGHBOR_WELLS as STATIC_NEIGHBOR_WELLS,
  MOCK_DECISIONS,
} from "../lib/mock";
import {
  generateProductionData,
  generateEconomicData,
  generateCarbonData,
} from "../lib/simulators";

const AlphaWellContext = createContext(null);
export const useAlphaWell = () => useContext(AlphaWellContext);

/** ---------------- Primary app API (your Django JWT) ---------------- */
const APP_API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://3.236.227.108";

const appApi = axios.create({ baseURL: APP_API_BASE });

appApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("aw_access");
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
        return new Promise((resolve, reject) =>
          queued.push({ resolve, reject })
        )
          .then((token) => {
            orig.headers.Authorization = `Bearer ${token}`;
            return appApi(orig);
          })
          .catch(Promise.reject);
      }

      try {
        isRefreshing = true;
        const refresh = localStorage.getItem("aw_refresh");
        if (!refresh) throw new Error("No refresh token");
        const { data } = await axios.post(`${APP_API_BASE}/auth/refresh/`, {
          refresh,
        });
        const newAccess = data?.access;
        if (!newAccess) throw new Error("No access in refresh");
        localStorage.setItem("aw_access", newAccess);
        queued.forEach((p) => p.resolve(newAccess));
        queued = [];
        orig.headers.Authorization = `Bearer ${newAccess}`;
        return appApi(orig);
      } catch (e) {
        queued.forEach((p) => p.reject(e));
        queued = [];
        localStorage.removeItem("aw_access");
        localStorage.removeItem("aw_refresh");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

/** ---------------- Wells AI API (x-api-key) ---------------- */
const WELLS_API_BASE =
  import.meta.env.VITE_WELLS_API_BASE || "http://54.210.165.50:8003";
const WELLS_API_KEY =
  import.meta.env.VITE_WELLS_API_KEY || "mqube-wells-ai-2025-access-token";

const wellsApi = axios.create({
  baseURL: WELLS_API_BASE,
  headers: { "x-api-key": WELLS_API_KEY },
});

/** ---------------- Provider ---------------- */
export function AlphaWellProvider({ children }) {
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [lastApiResponse, setLastApiResponse] = useState(null);
  const [lastApiError, setLastApiError] = useState(null);
  const bootstrapped = useRef(false);

  // App state
  const [activeTab, setActiveTab] = useState("start");
  const [showHistorical, setShowHistorical] = useState(false);

  // Inputs
  const [wellParams, setWellParams] = useState({
    wellId: "",
    latitude: 31.809364,
    longitude: -102.049991,
    env_interval: "WOLFCAMP A LOWER",
    stateWellType: "GAS_WELL",
    env_well_type: "GAS",
    trajectory: "HORIZONTAL",
    env_wellbore_type: "SINGLE BORE",
    formation: "WOLFCAMP",
    tvd: 9579,
    md: 14650,
    env_elevation_kb_ft: 2995,
    env_elevation_gl_ft: 2995,
    elevationKB: 3019,
    elevationGL: 2995,
    env_fluid_type: "FRESH WATER",
    lateralLength: 4778,
    // predictionHorizon: 30,
  });

  const [economicParams, setEconomicParams] = useState({
    discountRate: 0.1,
    gasOPEX: 1.49,
    oilOPEX: 4.47,
    waterOPEX: 1.05,
    fixedOPEX: 14250 * 12,
    oilWI: 1.0,
    gasWI: 0.91,
    waterWI: 1.0,
    oilNRI: 0.75,
    gasNRI: 0.75,
    totalCAPEX: 10_000_000,
    adValorem: 0.05,
    oilSeverance: 0.05,
    gasSeverance: 0.05,
    oilPrice: 60,
    gasPrice: 3,
  });

  const [carbonParams, setCarbonParams] = useState({
    processingIntensity: 1,
    flarePercent: 0,
    carbonPrice: 50,
  });

  // Data
  const [productionData, setProductionData] = useState([]);
  const [economicData, setEconomicData] = useState([]);
  const [carbonData, setCarbonData] = useState([]);
  const [neighborWells, setNeighborWells] = useState(STATIC_NEIGHBOR_WELLS);

  // Neighborhood-specific raw data
  const [neighborhoodRawWells, setNeighborhoodRawWells] = useState([]);
  const [neighborhoodKpis, setNeighborhoodKpis] = useState(null);
  const [neighborhoodProdMetrics, setNeighborhoodProdMetrics] = useState(null);

  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /** ---------- Auth helpers ---------- */
  const storeTokens = ({ access, refresh }) => {
    if (access) localStorage.setItem("aw_access", access);
    if (refresh) localStorage.setItem("aw_refresh", refresh);
  };
  const clearTokens = () => {
    localStorage.removeItem("aw_access");
    localStorage.removeItem("aw_refresh");
  };
  const fetchMe = async () => (await appApi.get("/auth/me/")).data;

  // Bootstrap session if tokens exist (on page reload)
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const access = localStorage.getItem("aw_access");
    const refresh = localStorage.getItem("aw_refresh");
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

  /** ---------- Auth actions ---------- */
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${APP_API_BASE}/auth/login/`, {
        email,
        password,
      });
      storeTokens({ access: data?.access, refresh: data?.refresh });
      const user = data?.user || (await fetchMe());
      setCurrentUser(user);
      setIsAuthenticated(true);
      toast.success("Signed in successfully");
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid credentials";
      toast.error(msg);
      return false;
    }
  };

  const signup = async ({ name, email, password, role = "INVESTOR" }) => {
    try {
      const { data } = await axios.post(`${APP_API_BASE}/auth/signup/`, {
        name,
        email,
        password,
        role,
      });
      if (data?.access && data?.refresh) {
        storeTokens({ access: data.access, refresh: data.refresh });
        setCurrentUser(data?.user || (await fetchMe()));
        setIsAuthenticated(true);
      } else {
        await login(email, password);
      }
      toast.success("Account created");
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || "Signup failed";
      toast.error(msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("aw_refresh");
      if (refresh) {
        await axios.post(`${APP_API_BASE}/auth/logout/`, { refresh });
      }
    } catch {
      /* ignore backend logout errors */
    } finally {
      clearTokens();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveTab("start");
      setAnalyzed(false);
      setProductionData([]);
      setEconomicData([]);
      setCarbonData([]);
      setNeighborWells(STATIC_NEIGHBOR_WELLS);
      toast.info("Signed out");
    }
  };

  /** ---------- Helpers: map UI state -> API payload ---------- */
  // const buildAnalyzePayload = () => {
  //   const horizonYears = Number(wellParams.predictionHorizon || 15);
  //   const horizonMonths = horizonYears * 12;

  //   return {
  //     user_id: currentUser?.id ? String(currentUser.id) : "string",
  //     session_id: "string",

  //     well_params: {
  //       well_id: String(wellParams.wellId || ""),
  //       latitude: Number(wellParams.latitude),
  //       longitude: Number(wellParams.longitude),
  //       env_interval: String(wellParams.env_interval || "WOLFCAMP A LOWER"),
  //       state_well_type: String(wellParams.stateWellType || "GAS_WELL"),
  //       env_well_type: String(wellParams.env_well_type || "GAS"),
  //       trajectory: String(wellParams.trajectory || "HORIZONTAL"),
  //       env_wellbore_type: String(
  //         wellParams.env_wellbore_type || "SINGLE BORE"
  //       ),
  //       formation: String(wellParams.formation || "WOLFCAMP"),
  //       tvd_ft: Number(wellParams.tvd || 9579),
  //       md_ft: Number(wellParams.md || 14650),
  //       env_elevation_kb_ft: Number(
  //         wellParams.env_elevation_kb_ft ?? wellParams.elevationKB ?? 2995
  //       ),
  //       env_elevation_gl_ft: Number(wellParams.env_elevation_gl_ft ?? 2995),
  //       elevation_kb_ft: Number(wellParams.elevationKB ?? 3019),
  //       elevation_gl_ft: Number(wellParams.elevationGL ?? 2995),
  //       env_fluid_type: String(wellParams.env_fluid_type || "FRESH WATER"),
  //       lateral_length_ft: Number(wellParams.lateralLength || 4778),
  //       prediction_horizon: horizonMonths,
  //     },

  //     economic_params: {
  //       discount_factor: Number((economicParams.discountRate ?? 0) * 100),
  //       gas_opex: Number(economicParams.gasOPEX ?? 0),
  //       oil_opex: Number(economicParams.oilOPEX ?? 0),
  //       water_opex: Number(economicParams.waterOPEX ?? 0),
  //       fixed_opex: Number((economicParams.fixedOPEX ?? 0) / 12),
  //       working_interest_oil: Number((economicParams.oilWI ?? 0) * 100),
  //       working_interest_gas: Number((economicParams.gasWI ?? 0) * 100),
  //       working_interest_water: Number((economicParams.waterWI ?? 0) * 100),
  //       net_revenue_interest_oil: Number((economicParams.oilNRI ?? 0) * 100),
  //       net_revenue_interest_gas: Number((economicParams.gasNRI ?? 0) * 100),
  //       total_capex: Number(economicParams.totalCAPEX ?? 0),
  //       oil_price: Number(economicParams.oilPrice ?? 60),
  //       gas_price: Number(economicParams.gasPrice ?? 3),
  //     },

  //     carbon_params: {
  //       processing_intensity_factor: Number(
  //         carbonParams.processingIntensity ?? 1
  //       ),
  //       flaring_percentage: Number((carbonParams.flarePercent ?? 0) * 100),
  //       carbon_price_per_ton: Number(carbonParams.carbonPrice ?? 50),
  //     },

  //     include_confidence: true,
  //   };
  // };
  const buildAnalyzePayload = (overrides = {}) => {
    // Allow overrides from callers (ExecParamsModal) but fallback to context state
    const well = overrides.wellParams ?? wellParams;
    const econ = overrides.economicParams ?? economicParams;
    const carbon = overrides.carbonParams ?? carbonParams;

    // 👇 IMPORTANT: predictionHorizon is now in MONTHS (from InputConfig / ExecParamsModal)
    // so we no longer multiply by 12 here.
    const horizonMonths = Number(well.predictionHorizon || 360); // default 360 months

    return {
      user_id: currentUser?.id ? String(currentUser.id) : "string",
      session_id: "string",

      well_params: {
        well_id: String(well.wellId || ""),
        latitude: Number(well.latitude),
        longitude: Number(well.longitude),
        env_interval: String(well.env_interval || "WOLFCAMP A LOWER"),
        state_well_type: String(well.stateWellType || "GAS_WELL"),
        env_well_type: String(well.env_well_type || "GAS"),
        trajectory: String(well.trajectory || "HORIZONTAL"),
        env_wellbore_type: String(well.env_wellbore_type || "SINGLE BORE"),
        formation: String(well.formation || "WOLFCAMP"),
        tvd_ft: Number(well.tvd || 9579),
        md_ft: Number(well.md || 14650),
        env_elevation_kb_ft: Number(
          well.env_elevation_kb_ft ?? well.elevationKB ?? 2995
        ),
        env_elevation_gl_ft: Number(well.env_elevation_gl_ft ?? 2995),
        elevation_kb_ft: Number(well.elevationKB ?? 3019),
        elevation_gl_ft: Number(well.elevationGL ?? 2995),
        env_fluid_type: String(well.env_fluid_type || "FRESH WATER"),
        lateral_length_ft: Number(well.lateralLength || 4778),

        // 👇 send months directly
        prediction_horizon: horizonMonths,
      },

      economic_params: {
        discount_factor: Number((econ.discountRate ?? 0) * 100),
        gas_opex: Number(econ.gasOPEX ?? 0),
        oil_opex: Number(econ.oilOPEX ?? 0),
        water_opex: Number(econ.waterOPEX ?? 0),
        fixed_opex: Number((econ.fixedOPEX ?? 0) / 12),
        working_interest_oil: Number((econ.oilWI ?? 0) * 100),
        working_interest_gas: Number((econ.gasWI ?? 0) * 100),
        working_interest_water: Number((econ.waterWI ?? 0) * 100),
        net_revenue_interest_oil: Number((econ.oilNRI ?? 0) * 100),
        net_revenue_interest_gas: Number((econ.gasNRI ?? 0) * 100),
        total_capex: Number(econ.totalCAPEX ?? 0),
        oil_price: Number(econ.oilPrice ?? 60),
        gas_price: Number(econ.gasPrice ?? 3),
      },

      carbon_params: {
        processing_intensity_factor: Number(carbon.processingIntensity ?? 1),
        flaring_percentage: Number((carbon.flarePercent ?? 0) * 100),
        carbon_price_per_ton: Number(carbon.carbonPrice ?? 50),
      },

      include_confidence: true,
    };
  };
  /** ---------- Transform API -> UI state ---------- */
  const adaptAnalysis = (res) => {
    const prodArr = Array.isArray(res.production_data)
      ? res.production_data
      : [];
    const cfArr = Array.isArray(res.cash_flow) ? res.cash_flow : [];
    const ciArr = Array.isArray(res.carbon_intensity)
      ? res.carbon_intensity
      : [];

    let prod = [];
    let econ = [];
    let carbon = [];

    // --- Production timeseries ---
    if (prodArr.length && cfArr.length) {
      let cumOil = 0,
        cumGas = 0,
        cumWater = 0;

      const cfByMonth = new Map(cfArr.map((r) => [Number(r.month), r]));

      prod = prodArr.map((d) => {
        const oil = Number(d.gross_production_oil_bbls || 0);
        const gas = Number(d.gross_production_wh_gas_mcf || 0);
        const water = Number(d.gross_production_water_bbls || 0);

        cumOil += oil;
        cumGas += gas;
        cumWater += water;

        const cf = cfByMonth.get(Number(d.time)) || {};
        const date = (cf.date || "").slice(0, 10) || `M${d.time}`;

        return {
          date,
          oil,
          gas,
          water,
          cumulativeOil: cumOil,
          cumulativeGas: cumGas,
          cumulativeWater: cumWater,
          waterCut: null,
        };
      });
    } else if (res.production_metrics) {
      const pm = res.production_metrics;
      prod = [
        {
          date: "Year 1",
          oil: Number(pm.year1_oil || 0),
          gas: Number(pm.year1_gas || 0),
          water: Number(pm.year1_water || 0),
          cumulativeOil: Number(pm.total_oil_eur || 0),
          cumulativeGas: Number(pm.total_gas_eur || 0),
          cumulativeWater: Number(pm.total_water || 0),
          waterCut: null,
        },
      ];
    }

    // --- Economic / cash-flow timeseries ---
    if (cfArr.length) {
      econ = cfArr.map((m) => ({
        date: (m.date || "").slice(0, 10),
        revenue: Number(m.revenue || 0),
        opex: Number(m.opex || 0),
        taxes: Number(m.taxes || 0),
        cumulativeCashFlow: Number(m.cumulative_cash_flow || 0),
        npv: Number(res.financial_metrics?.npv ?? 0),
        irr: Number(res.financial_metrics?.irr ?? 0),
      }));
    } else if (res.financial_metrics) {
      const fm = res.financial_metrics;
      econ = [
        {
          date: "Year 1",
          revenue: 0,
          opex: Number(fm.total_opex || 0),
          taxes: Number(fm.total_tax || 0),
          cumulativeCashFlow: Number(fm.total_cash_flow || 0),
          npv: Number(fm.npv ?? 0),
          irr: Number(fm.irr ?? 0),
        },
      ];
    }

    // --- Carbon intensity timeseries ---
    if (ciArr.length) {
      carbon = ciArr.map((c) => ({
        date: (c.date || "").slice(0, 10),
        intensity: Number(c.carbon_intensity || 0),
        combustionOil: 0,
        combustionGas: 0,
        processing: 0,
        flaring: 0,
        cumulativeCO2: Number(res.carbon_metrics?.total_emitted || 0),
      }));
    } else if (res.carbon_metrics) {
      const cm = res.carbon_metrics;
      carbon = [
        {
          date: "Year 1",
          intensity: Number(cm.carbon_intensity || 0),
          combustionOil: 0,
          combustionGas: 0,
          processing: 0,
          flaring: 0,
          cumulativeCO2: Number(cm.total_emitted || 0),
        },
      ];
    }

    return { prod, econ, carbon };
  };

  /** ---------- Neighborhood API ---------- */
  const fetchNeighborhood = async (overrides = {}) => {
    try {
      const payload = {
        user_id: currentUser?.id ? `user_${currentUser.id}` : "user_123",
        session_id: "session_456",
        latitude: Number(overrides.latitude ?? wellParams.latitude),
        longitude: Number(overrides.longitude ?? wellParams.longitude),
        radius_mi: Number(overrides.radius_mi ?? 5),
        initial_date: overrides.initial_date || "2020-01-01",
        number_of_wells: Number(overrides.number_of_wells ?? 1500), // 👈 NEW
      };
      

      console.log("[Neighborhood] request payload:", payload);

      const { data } = await wellsApi.post(
        "/api/neighborhood/analyze",
        payload
      );

      console.log("[Neighborhood] full API response:", data);

      setNeighborhoodKpis(data.neighborhood_kpis || null);

      // wells.json
      if (data.wells_url) {
        const wellsRes = await fetch(data.wells_url);
        const wellsJson = await wellsRes.json();
        console.log("[Neighborhood] wells.json:", wellsJson);
        setNeighborhoodRawWells(Array.isArray(wellsJson) ? wellsJson : []);

        const simplified = wellsJson.map((w, idx) => ({
          id: String(w.well_id || `W-${idx}`),
          formation: w.formation,
          distance: Number(w.distance_mi || 0).toFixed(2),
          cumulative_oil: Number(w.cumulative_oil || 0),
          cumulative_gas: Number(w.cumulative_gas || 0),
          cumulative_water: Number(w.cumulative_water || 0),
          status: w.status || "UNKNOWN",
          latitude: w.latitude,
          longitude: w.longitude,
        }));
        setNeighborWells(simplified);
      } else {
        setNeighborhoodRawWells([]);
        setNeighborWells([]);
      }

      // neighborhood_production_metrics.json
      if (data.neighborhood_production_metrics_url) {
        const metricsRes = await fetch(
          data.neighborhood_production_metrics_url
        );
        const metricsJson = await metricsRes.json();
        console.log(
          "[Neighborhood] neighborhood_production_metrics.json:",
          metricsJson
        );
        setNeighborhoodProdMetrics(metricsJson);
      } else {
        setNeighborhoodProdMetrics(null);
      }
    } catch (e) {
      console.error(
        "[Neighborhood] fetch failed:",
        e?.response?.status,
        e?.response?.data || e?.message
      );
    }
  };

  /** ---------- Analysis (live) ---------- */
  /** ---------- Analysis (live) ---------- */
  const analyze = async (overrides = {}) => {
    if (isAnalyzing) return;

    // Use overrides if provided (ExecParamsModal) otherwise fall back to context
    const well = overrides.wellParams ?? wellParams;
    const econ = overrides.economicParams ?? economicParams;
    const carbon = overrides.carbonParams ?? carbonParams;

    if (!well.latitude || !well.longitude) {
      toast.error("Please provide latitude and longitude for the well.");
      return;
    }

    setIsAnalyzing(true);
    setLastApiError(null);

    try {
      // build payload from the *current* values we want to send
      const payload = buildAnalyzePayload({
        wellParams: well,
        economicParams: econ,
        carbonParams: carbon,
      });

      const { data } = await wellsApi.post("/api/analysis/analyze", payload);

      console.log("[AlphaWell] /api/analysis/analyze response:", data);
      setLastApiResponse(data);

      const {
        prod,
        econ: econSeries,
        carbon: carbonSeries,
      } = adaptAnalysis(data);

      const haveProd = prod.length > 0;
      const haveEcon = econSeries.length > 0;
      const haveCarb = carbonSeries.length > 0;

      if (!haveProd && !haveEcon && !haveCarb) {
        console.warn(
          "[AlphaWell] API success but no usable data – keeping as not analyzed"
        );
        setProductionData([]);
        setEconomicData([]);
        setCarbonData([]);
        setAnalyzed(false);
        return;
      }

      // 🔁 Update context state with the SAME values we analyzed with
      setWellParams(well);
      setEconomicParams(econ);
      setCarbonParams(carbon);

      setProductionData(prod);
      setEconomicData(econSeries);
      setCarbonData(carbonSeries);
      setAnalyzed(true);
      setActiveTab("executive");

      // Neighborhood should reflect new well + radius
      fetchNeighborhood({
        latitude: well.latitude,
        longitude: well.longitude,
        radius_mi: well.radiusMiles ?? 5,
      });
    } catch (e) {
      console.error(
        "[AlphaWell] analyze failed:",
        e.response?.data || e.message,
        e
      );
      setLastApiError(e.response?.data || e.message || "Unknown error");
      toast.error("Analysis failed. No results available.");

      setProductionData([]);
      setEconomicData([]);
      setCarbonData([]);
      setAnalyzed(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setProductionData([]);
    setEconomicData([]);
    setCarbonData([]);
    setAnalyzed(false);
    setActiveTab("input");
  };

  /** ---------- KPIs ---------- */
  const kpis = useMemo(() => {
    if (
      !analyzed ||
      !economicData.length ||
      !productionData.length ||
      !carbonData.length
    )
      return null;

    const lastProd = productionData[productionData.length - 1] ?? {};
    const lastEcon = economicData[economicData.length - 1] ?? {};
    const lastCarbon = carbonData[carbonData.length - 1] ?? {};

    const totalOil = Number(lastProd.cumulativeOil || 0);
    const totalGas = Number(lastProd.cumulativeGas || 0);

    const apiNpv = Number(
      lastApiResponse?.financial_metrics?.npv ?? lastEcon.npv ?? 0
    );
    const npv = apiNpv;

    const cfIrrRaw =
      lastApiResponse?.financial_metrics?.irr ?? lastEcon.irr ?? null;

    const totalCF = Number(lastEcon.cumulativeCashFlow || 0);
    const years = Number(wellParams.predictionHorizon || 1);
    const capex = Number(economicParams.totalCAPEX || 0);

    let irr;
    if (cfIrrRaw !== null && !Number.isNaN(Number(cfIrrRaw))) {
      const apiIrrNum = Number(cfIrrRaw);
      irr = Math.abs(apiIrrNum) <= 1 ? apiIrrNum * 100 : apiIrrNum;
    } else {
      irr =
        totalCF > 0 && capex > 0
          ? ((totalCF / capex) ** (1 / years) - 1) * 100
          : -100;
    }

    const totalCO2_tons = Number(lastCarbon.cumulativeCO2 || 0);
    const boeLife = totalOil + totalGas / 6;
    const avgIntensity =
      boeLife > 0 ? (totalCO2_tons * 1_000_000) / boeLife : 0;

    const carbonCreditPotentialK = carbonParams.enableCarbonCredits
      ? (totalCO2_tons * 0.15 * Number(carbonParams.carbonPrice || 0)) / 1_000
      : 0;

    let verdict = "Evaluate Further";
    let esgRisk = "Moderate";

    if (npv > 0 && irr > 25 && avgIntensity < 45) {
      verdict = "Drill";
      esgRisk = "Low";
    } else if (npv < 0 || irr < 0 || avgIntensity > 55) {
      verdict = "High Risk";
      esgRisk = "High";
    }

    let paybackMonths;
    const apiPayback = lastApiResponse?.financial_metrics?.payback_month;
    if (apiPayback !== undefined && apiPayback !== null) {
      paybackMonths = Number(apiPayback);
    } else {
      const idx = economicData.findIndex(
        (d) => (d?.cumulativeCashFlow ?? -1) > 0
      );
      paybackMonths = idx >= 0 ? idx : null;
    }

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
      paybackMonths,
    };
  }, [
    analyzed,
    productionData,
    economicData,
    carbonData,
    economicParams,
    wellParams,
    carbonParams,
    lastApiResponse,
  ]);

  /** ---------- Reports API ---------- */
  const saveReport = async (userId = currentUser?.id || 1) => {
    try {
      const payload = {
        success: true,
        production_data: productionData.map((d, i) => ({
          time: i + 1,
          gross_production_oil_bbls: d.oil,
          gross_production_wh_gas_mcf: d.gas,
          gross_production_water_bbls: d.water,
          oil_lower_ci: 0,
          oil_upper_ci: 0,
          gas_lower_ci: 0,
          gas_upper_ci: 0,
          water_lower_ci: 0,
          water_upper_ci: 0,
        })),
        cash_flow: economicData.map((d, i) => ({
          month: i + 1,
          date: d.date,
          net_cash_flow: d.revenue - d.opex - d.taxes,
          cumulative_cash_flow: d.cumulativeCashFlow,
          revenue: d.revenue,
          opex: d.opex,
          taxes: d.taxes,
          npv: d.npv,
        })),
        financial_metrics: { npv: economicData.at(-1)?.npv || 0 },
        carbon_metrics: {
          total_emitted: carbonData.at(-1)?.cumulativeCO2 || 0,
          carbon_intensity: carbonData.at(-1)?.intensity || 0,
          carbon_credits: 0,
        },
        carbon_intensity: carbonData.map((c) => ({
          date: c.date,
          carbon_intensity: c.intensity,
        })),
      };
      const { data } = await wellsApi.post(
        `/api/reports/save/${userId}`,
        payload
      );
      toast.success(`Saved: ${data?.report_id || "report"}`);
      return data;
    } catch (e) {
      toast.error("Save failed");
      return null;
    }
  };

  const listReports = async (userId = currentUser?.id || 1) => {
    const { data } = await wellsApi.get(`/api/reports/list/${userId}`);
    return data?.reports || [];
  };

  const loadReport = async (userId, reportId) => {
    const { data } = await wellsApi.get(
      `/api/reports/load/${userId}/${reportId}`
    );
    const { prod, econ, carbon } = adaptAnalysis(data);
    setProductionData(prod);
    setEconomicData(econ);
    setCarbonData(carbon);
    setAnalyzed(true);
    setActiveTab("executive");
  };

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

    // data
    productionData,
    economicData,
    carbonData,
    neighborWells,
    analyzed,
    analyze,
    isAnalyzing,
    resetAnalysis,
    kpis,

    // neighborhood API data
    fetchNeighborhood,
    neighborhoodRawWells,
    neighborhoodKpis,
    neighborhoodProdMetrics,

    // static/history
    MOCK_DECISIONS,

    // reports
    saveReport,
    listReports,
    loadReport,

    // debugging
    lastApiResponse,
    lastApiError,
  };

  return (
    <AlphaWellContext.Provider value={value}>
      {children}
    </AlphaWellContext.Provider>
  );
}
