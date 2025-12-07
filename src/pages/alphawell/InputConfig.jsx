
// import React from "react";
// import { Activity, MapPin, DollarSign, Zap } from "lucide-react";
// import { useAlphaWell } from "../../context/AlphaWellContext";
// import logo from "../../assets/logo.jpg";
// export default function InputConfig() {
//   const {
//     setActiveTab,
//     logout,
//     wellParams,
//     setWellParams,
//     economicParams,
//     setEconomicParams,
//     carbonParams,
//     setCarbonParams,
//     analyze,
//     isAnalyzing,
//   } = useAlphaWell();

//   const baseInputClasses =
//     "w-full px-3 py-2 rounded-lg border text-sm " +
//     "bg-slate-900/60 border-slate-600 text-slate-100 " +
//     "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500";

//   const smallInputClasses =
//     "w-full px-2 py-1 rounded border text-xs " +
//     "bg-slate-900/60 border-slate-600 text-slate-100 " +
//     "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500";

//   return (
//     <div className="min-h-[100vh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
//       {/* Top Branding Header */}
//       <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 shadow-lg shadow-slate-900/70">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between gap-6">
//             {/* Left: Logo + Product Stack */}
//             <div className="flex items-center gap-4">
//               <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 border border-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.35)]">
//                 <img
//                   src={logo}
//                   alt="AlphaCarbon"
//                   className="w-9 h-9 object-contain"
//                 />
//               </div>

//               <div>
//                 {/* Brand Line */}
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/95">
//                     AlphaCarbon
//                   </span>
//                   <span className="h-4 w-px bg-sky-500/50" />
//                   <span className="text-[11px] font-medium tracking-[0.16em] text-slate-300/90">
//                     AlphaWell Intelligence
//                   </span>
//                 </div>

//                 {/* Main Heading */}
//                 <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 flex items-center gap-2">
//                   <span className="inline-flex items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/40 p-1.5">
//                     <Activity className="w-5 h-5 text-sky-400" />
//                   </span>
//                   <span>Input Configuration</span>
//                 </h1>

//                 {/* Sub line + badges */}
//                 <div className="mt-1 flex flex-wrap items-center gap-2">
//                   <p className="text-xs md:text-sm text-slate-300/90">
//                     Smart well forecasting • Economics • Carbon intensity & risk
//                   </p>
//                   <span className="hidden sm:inline-flex items-center rounded-full bg-sky-500/10 border border-sky-500/40 px-3 py-0.5 text-[11px] font-medium text-sky-100">
//                     Step 1 of 3 &mdash; Configure inputs
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Controls */}
//             <div className="flex items-center gap-3">
//               <div className="hidden md:flex flex-col items-end mr-2 text-xs text-slate-300/80">
//                 <span className="font-medium">
//                   Scenario: <span className="text-sky-300">Base Case</span>
//                 </span>
//                 <span className="text-[11px] text-slate-400">
//                   Configure inputs before running analysis
//                 </span>
//               </div>

//               <button
//                 onClick={() => setActiveTab("start")}
//                 className="px-4 py-2 text-sm font-medium text-slate-100 bg-slate-900/80 border border-slate-600 rounded-lg hover:bg-slate-800 hover:border-slate-500 transition-all shadow-sm"
//               >
//                 Back to Overview
//               </button>

//               <button
//                 onClick={logout}
//                 className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold bg-red-500/10 text-red-200 border border-red-500/40 rounded-lg hover:bg-red-500/20 hover:border-red-400 transition-all shadow-sm"
//               >
//                 <span>Sign Out</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Well Parameters */}
//           <div className="rounded-xl border border-slate-700/80 bg-slate-900/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
//             <div className="p-6">
//               <h2 className="text-lg font-semibold text-slate-50 mb-1 flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/40 p-1.5">
//                   <MapPin className="w-4 h-4 text-blue-400" />
//                 </span>
//                 Well Parameters
//               </h2>
//               <p className="text-xs text-slate-400 mb-4">
//                 Define the well geometry and spatial neighborhood for offset
//                 analysis.
//               </p>

//               <div className="space-y-4">
//                 {/* Lat / Long */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-slate-300 mb-1">
//                       Latitude
//                     </label>
//                     <input
//                       type="number"
//                       step="0.0001"
//                       value={wellParams.latitude}
//                       onChange={(e) =>
//                         setWellParams({
//                           ...wellParams,
//                           latitude: parseFloat(e.target.value),
//                         })
//                       }
//                       className={baseInputClasses}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-slate-300 mb-1">
//                       Longitude
//                     </label>
//                     <input
//                       type="number"
//                       step="0.0001"
//                       value={wellParams.longitude}
//                       onChange={(e) =>
//                         setWellParams({
//                           ...wellParams,
//                           longitude: parseFloat(e.target.value),
//                         })
//                       }
//                       className={baseInputClasses}
//                     />
//                   </div>
//                 </div>

//                 {/* Radius (Miles) */}
//                 <div>
//                   <label className="block text-xs font-medium text-slate-300 mb-1">
//                     Radius (Miles)
//                   </label>
//                   <select
//                     value={wellParams.radiusMiles ?? 15}
//                     onChange={(e) =>
//                       setWellParams({
//                         ...wellParams,
//                         radiusMiles: parseFloat(e.target.value),
//                       })
//                     }
//                     className={baseInputClasses}
//                   >
//                     <option value={30}>30 Miles</option>
//                     <option value={15}>15 Miles</option>
//                     <option value={10}>10 Miles</option>
//                     <option value={5}>5 Miles</option>
//                   </select>
//                   <p className="text-[11px] text-slate-400 mt-1">
//                     Controls neighborhood for offset wells and analog type
//                     curves.
//                   </p>
//                 </div>

//                 {/* Formation */}
//                 <div>
//                   <label className="block text-xs font-medium text-slate-300 mb-1">
//                     Formation
//                   </label>
//                   <select
//                     value={wellParams.formation}
//                     onChange={(e) =>
//                       setWellParams({
//                         ...wellParams,
//                         formation: e.target.value,
//                       })
//                     }
//                     className={baseInputClasses}
//                   >
//                     <option>Wolfcamp A</option>
//                     <option>Wolfcamp B</option>
//                     <option>Bone Spring</option>
//                     <option>Spraberry</option>
//                     <option>Delaware</option>
//                   </select>
//                 </div>

//                 {/* Prediction Horizon */}
//                 <div>
//                   <label className="block text-xs font-medium text-slate-300 mb-1">
//                     Prediction Horizon
//                   </label>
//                   <select
//                     value={wellParams.predictionHorizon}
//                     onChange={(e) =>
//                       setWellParams({
//                         ...wellParams,
//                         predictionHorizon: parseInt(e.target.value, 10),
//                       })
//                     }
//                     className={baseInputClasses}
//                   >
//                     <option value={360}>360 Months (30 Years)</option>
//                     <option value={480}>480 Months (40 Years)</option>
//                     <option value={240}>240 Months (20 Years)</option>
//                     <option value={120}>120 Months (10 Years)</option>
//                     <option value={60}>60 Months (5 Years)</option>
//                   </select>
//                   <p className="text-[11px] text-slate-400 mt-1">
//                     Defines forecast length for production and economic metrics.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Economic Parameters */}
//           <div className="rounded-xl border border-slate-700/80 bg-slate-900/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
//             <div className="p-6">
//               <h2 className="text-lg font-semibold text-slate-50 mb-1 flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/40 p-1.5">
//                   <DollarSign className="w-4 h-4 text-emerald-400" />
//                 </span>
//                 Economic Parameters
//               </h2>
//               <p className="text-xs text-slate-400 mb-4">
//                 Configure price decks, cost structure, and fiscal terms for NPV
//                 / IRR.
//               </p>

//               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scroll">
//                 {/* Total CAPEX */}
//                 <div>
//                   <label className="block text-xs font-medium text-slate-300 mb-1">
//                     Total CAPEX ($)
//                   </label>
//                   <input
//                     type="number"
//                     step={1000000}
//                     value={economicParams.totalCAPEX}
//                     onChange={(e) =>
//                       setEconomicParams({
//                         ...economicParams,
//                         totalCAPEX: parseFloat(e.target.value),
//                       })
//                     }
//                     className={baseInputClasses}
//                   />
//                 </div>

//                 {/* Oil & Gas Price */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-slate-300 mb-1">
//                       Oil Price ($/bbl)
//                     </label>
//                     <input
//                       type="number"
//                       step={1}
//                       value={economicParams.oilPrice}
//                       onChange={(e) =>
//                         setEconomicParams({
//                           ...economicParams,
//                           oilPrice: parseFloat(e.target.value),
//                         })
//                       }
//                       className={baseInputClasses}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-slate-300 mb-1">
//                       Gas Price ($/mcf)
//                     </label>
//                     <input
//                       type="number"
//                       step={0.1}
//                       value={economicParams.gasPrice}
//                       onChange={(e) =>
//                         setEconomicParams({
//                           ...economicParams,
//                           gasPrice: parseFloat(e.target.value),
//                         })
//                       }
//                       className={baseInputClasses}
//                     />
//                   </div>
//                 </div>

//                 {/* Fixed OPEX */}
//                 <div>
//                   <label className="block text-xs font-medium text-slate-300 mb-1">
//                     Fixed OPEX ($/year)
//                   </label>
//                   <input
//                     type="number"
//                     step={10000}
//                     value={economicParams.fixedOPEX}
//                     onChange={(e) =>
//                       setEconomicParams({
//                         ...economicParams,
//                         fixedOPEX: parseFloat(e.target.value),
//                       })
//                     }
//                     className={baseInputClasses}
//                   />
//                 </div>

//                 {/* Variable OPEX */}
//                 <div className="grid grid-cols-3 gap-2">
//                   <div>
//                     <label className="block text-[11px] font-medium text-slate-300 mb-1">
//                       Oil OPEX
//                     </label>
//                     <input
//                       type="number"
//                       step={0.1}
//                       value={economicParams.oilOPEX}
//                       onChange={(e) =>
//                         setEconomicParams({
//                           ...economicParams,
//                           oilOPEX: parseFloat(e.target.value),
//                         })
//                       }
//                       className={smallInputClasses}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-medium text-slate-300 mb-1">
//                       Gas OPEX
//                     </label>
//                     <input
//                       type="number"
//                       step={0.1}
//                       value={economicParams.gasOPEX}
//                       onChange={(e) =>
//                         setEconomicParams({
//                           ...economicParams,
//                           gasOPEX: parseFloat(e.target.value),
//                         })
//                       }
//                       className={smallInputClasses}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-medium text-slate-300 mb-1">
//                       Water OPEX
//                     </label>
//                     <input
//                       type="number"
//                       step={0.1}
//                       value={economicParams.waterOPEX}
//                       onChange={(e) =>
//                         setEconomicParams({
//                           ...economicParams,
//                           waterOPEX: parseFloat(e.target.value),
//                         })
//                       }
//                       className={smallInputClasses}
//                     />
//                   </div>
//                 </div>

//                 {/* NRI */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium text-slate-300 mb-1">
//                       Oil NRI
//                     </label>
//                     <input
//                       type="number"
//                       step={0.01}
//                       value={economicParams.oilNRI}
//                       onChange={(e) =>
//                         setEconomicParams({
//                           ...economicParams,
//                           oilNRI: parseFloat(e.target.value),
//                         })
//                       }
//                       className={baseInputClasses}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-medium text-slate-300 mb-1">
//                       Gas NRI
//                     </label>
//                     <input
//                       type="number"
//                       step={0.01}
//                       value={economicParams.gasNRI}
//                       onChange={(e) =>
//                         setEconomicParams({
//                           ...economicParams,
//                           gasNRI: parseFloat(e.target.value),
//                         })
//                       }
//                       className={baseInputClasses}
//                     />
//                   </div>
//                 </div>

//                 {/* Discount Rate */}
//                 <div>
//                   <label className="block text-xs font-medium text-slate-300 mb-1">
//                     Discount Rate (%)
//                   </label>
//                   <input
//                     type="number"
//                     step={0.1}
//                     value={economicParams.discountRate * 100}
//                     onChange={(e) =>
//                       setEconomicParams({
//                         ...economicParams,
//                         discountRate: parseFloat(e.target.value) / 100,
//                       })
//                     }
//                     className={baseInputClasses}
//                   />
//                 </div>

//                 {/* Taxes */}
//                 <div className="grid grid-cols-3 gap-2">
//                   <div>
//                     <label className="block text-[11px] font-medium text-slate-300 mb-1">
//                       Ad Valorem
//                     </label>
//                     <input
//                       type="number"
//                       step={0.01}
//                       value={economicParams.adValorem}
//                       onChange={(e) =>
//                         setEconomicParams({
//                           ...economicParams,
//                           adValorem: parseFloat(e.target.value),
//                         })
//                       }
//                       className={smallInputClasses}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-medium text-slate-300 mb-1">
//                       Oil Sev Tax
//                     </label>
//                     <input
//                       type="number"
//                       step={0.01}
//                       value={economicParams.oilSeverance}
//                       onChange={(e) =>
//                         setEconomicParams({
//                           ...economicParams,
//                           oilSeverance: parseFloat(e.target.value),
//                         })
//                       }
//                       className={smallInputClasses}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-medium text-slate-300 mb-1">
//                       Gas Sev Tax
//                     </label>
//                     <input
//                       type="number"
//                       step={0.01}
//                       value={economicParams.gasSeverance}
//                       onChange={(e) =>
//                         setEconomicParams({
//                           ...economicParams,
//                           gasSeverance: parseFloat(e.target.value),
//                         })
//                       }
//                       className={smallInputClasses}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Carbon & Environmental */}
//           <div className="rounded-xl border border-slate-700/80 bg-slate-900/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
//             <div className="p-6">
//               <h2 className="text-lg font-semibold text-slate-50 mb-1 flex items-center gap-2">
//                 <span className="inline-flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/40 p-1.5">
//                   <Zap className="w-4 h-4 text-emerald-400" />
//                 </span>
//                 Carbon & Environmental
//               </h2>
//               <p className="text-xs text-slate-400 mb-4">
//                 Layer carbon pricing, processing intensity, and credits on top
//                 of economics.
//               </p>

//               <div className="space-y-4">
//                 {/* Processing Intensity */}
//                 <div>
//                   <label className="block text-xs font-medium text-slate-300 mb-1">
//                     Processing Intensity Factor
//                   </label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     value={carbonParams.processingIntensity}
//                     onChange={(e) =>
//                       setCarbonParams({
//                         ...carbonParams,
//                         processingIntensity: parseFloat(e.target.value),
//                       })
//                     }
//                     className={baseInputClasses}
//                   />
//                   <p className="text-[11px] text-slate-400 mt-1">
//                     Default: 1.0 &mdash; scale up/down to reflect midstream /
//                     processing footprint.
//                   </p>
//                 </div>

//                 {/* Carbon Price */}
//                 <div>
//                   <label className="block text-xs font-medium text-slate-300 mb-1">
//                     Carbon Price ($/ton CO₂e)
//                   </label>
//                   <input
//                     type="number"
//                     step={5}
//                     value={carbonParams.carbonPrice}
//                     onChange={(e) =>
//                       setCarbonParams({
//                         ...carbonParams,
//                         carbonPrice: parseFloat(e.target.value),
//                       })
//                     }
//                     className={baseInputClasses}
//                   />
//                   <p className="text-[11px] text-slate-400 mt-1">
//                     Used to compute tax / credit impacts on netback and project
//                     economics.
//                   </p>
//                 </div>

//                 {/* Enable Credits */}
//                 <div className="flex items-center gap-2 mt-2">
//                   <input
//                     type="checkbox"
//                     checked={carbonParams.enableCarbonCredits}
//                     onChange={(e) =>
//                       setCarbonParams({
//                         ...carbonParams,
//                         enableCarbonCredits: e.target.checked,
//                       })
//                     }
//                     className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
//                   />
//                   <label className="text-sm font-medium text-slate-200">
//                     Enable Carbon Credit Simulation
//                   </label>
//                 </div>

//                 {/* Emission Factors */}
//                 <div className="mt-5 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/30">
//                   <h3 className="text-xs font-semibold text-emerald-200 mb-2">
//                     Emission Factors (Auto-Applied)
//                   </h3>
//                   <div className="text-[11px] text-emerald-100/90 space-y-1">
//                     <p>• Oil: 0.43 kg CO₂e/bbl (combustion)</p>
//                     <p>• Gas: 0.053 kg CO₂e/mcf (combustion)</p>
//                     <p>• CH₄ GWP: 28x CO₂ equivalent</p>
//                     <p>• Processing: Scaled by intensity factor</p>
//                   </div>
//                 </div>

//                 {/* Standards */}
//                 <div className="mt-3 p-4 rounded-lg bg-sky-500/5 border border-sky-500/30">
//                   <h3 className="text-xs font-semibold text-sky-200 mb-2">
//                     Standards Reference
//                   </h3>
//                   <div className="text-[11px] text-sky-100/90 space-y-1">
//                     <p>• EPA Subpart W</p>
//                     <p>• IPCC Tier 2/3 defaults</p>
//                     <p>• OGMP 2.0 aligned factors</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Analyze Button */}
//         <div className="mt-10 flex justify-center">
//           <button
//             onClick={analyze}
//             disabled={isAnalyzing}
//             className={`
//               relative flex items-center gap-3 px-12 py-4
//               rounded-2xl text-lg font-semibold
//               bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500
//               shadow-[0_18px_45px_rgba(56,189,248,0.35)]
//               transition-all
//               ${
//                 isAnalyzing
//                   ? "opacity-70 cursor-not-allowed"
//                   : "hover:shadow-[0_22px_55px_rgba(129,140,248,0.55)] hover:-translate-y-[1px] cursor-pointer"
//               }
//             `}
//           >
//             {/* Glow border */}
//             <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />

//             {isAnalyzing && (
//               <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//             )}

//             <span className="flex items-center gap-1 relative z-10">
//               {isAnalyzing ? (
//                 <>
//                   <span>Analyzing</span>
//                   <span className="animate-pulse font-extrabold tracking-widest">
//                     •••
//                   </span>
//                 </>
//               ) : (
//                 <span>Analyze Well Performance</span>
//               )}
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import React from "react";
import { Activity, MapPin, DollarSign, Zap } from "lucide-react";
import { useAlphaWell } from "../../context/AlphaWellContext";
import logo from "../../assets/logo.jpg";
export default function InputConfig() {
  const {
    setActiveTab,
    logout,
    wellParams,
    setWellParams,
    economicParams,
    setEconomicParams,
    carbonParams,
    setCarbonParams,
    analyze,
    isAnalyzing,
  } = useAlphaWell();

  const baseInputClasses =
    "w-full px-3 py-2 rounded-lg border text-sm " +
    "bg-slate-900/60 border-slate-600 text-slate-100 " +
    "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500";

  const smallInputClasses =
    "w-full px-2 py-1 rounded border text-xs " +
    "bg-slate-900/60 border-slate-600 text-slate-100 " +
    "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500";

  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Top Branding Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 shadow-lg shadow-slate-900/70">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Logo + Product Stack */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 border border-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.35)]">
                <img
                  src={logo}
                  alt="AlphaCarbon"
                  className="w-9 h-9 object-contain"
                />
              </div>

              <div>
                {/* Brand Line */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/95">
                    AlphaCarbon
                  </span>
                  <span className="h-4 w-px bg-sky-500/50" />
                  <span className="text-[11px] font-medium tracking-[0.16em] text-slate-300/90">
                    AlphaWell Intelligence
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/40 p-1.5">
                    <Activity className="w-5 h-5 text-sky-400" />
                  </span>
                  <span>Input Configuration</span>
                </h1>

                {/* Sub line + badges */}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-xs md:text-sm text-slate-300/90">
                    Smart well forecasting • Economics • Carbon intensity & risk
                  </p>
                  <span className="hidden sm:inline-flex items-center rounded-full bg-sky-500/10 border border-sky-500/40 px-3 py-0.5 text-[11px] font-medium text-sky-100">
                    Step 1 of 3 &mdash; Configure inputs
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end mr-2 text-xs text-slate-300/80">
                <span className="font-medium">
                  Scenario: <span className="text-sky-300">Base Case</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Configure inputs before running analysis
                </span>
              </div>

              <button
                onClick={() => setActiveTab("start")}
                className="px-4 py-2 text-sm font-medium text-slate-100 bg-slate-900/80 border border-slate-600 rounded-lg hover:bg-slate-800 hover:border-slate-500 transition-all shadow-sm"
              >
                Back to Overview
              </button>

              <button
                onClick={logout}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-semibold bg-red-500/10 text-red-200 border border-red-500/40 rounded-lg hover:bg-red-500/20 hover:border-red-400 transition-all shadow-sm"
              >
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Well Parameters */}
          {/* Proposed Well Location */}
          <div className="rounded-xl border border-slate-700/80 bg-slate-900/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-50 mb-1 flex items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/40 p-1.5">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </span>
                Proposed Well Location
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Define the proposed surface location, identifiers, and geologic
                context for offset analysis.
              </p>

              <div className="space-y-4">
                {/* Section / Abstract IDs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Section ID
                    </label>
                    <input
                      type="text"
                      value={wellParams.sectionId || ""}
                      onChange={(e) =>
                        setWellParams({
                          ...wellParams,
                          sectionId: e.target.value,
                        })
                      }
                      className={baseInputClasses}
                      placeholder="e.g., Sec 12"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Abstract ID
                    </label>
                    <input
                      type="text"
                      value={wellParams.abstractId || ""}
                      onChange={(e) =>
                        setWellParams({
                          ...wellParams,
                          abstractId: e.target.value,
                        })
                      }
                      className={baseInputClasses}
                      placeholder="e.g., A-1234"
                    />
                  </div>
                </div>

                {/* Lat / Long */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={wellParams.latitude}
                      onChange={(e) =>
                        setWellParams({
                          ...wellParams,
                          latitude: parseFloat(e.target.value),
                        })
                      }
                      className={baseInputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={wellParams.longitude}
                      onChange={(e) =>
                        setWellParams({
                          ...wellParams,
                          longitude: parseFloat(e.target.value),
                        })
                      }
                      className={baseInputClasses}
                    />
                  </div>
                </div>

                {/* Radius (Miles) */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Radius (Miles)
                  </label>
                  <select
                    value={wellParams.radiusMiles ?? 15}
                    onChange={(e) =>
                      setWellParams({
                        ...wellParams,
                        radiusMiles: parseFloat(e.target.value),
                      })
                    }
                    className={baseInputClasses}
                  >
                    <option value={30}>30 Miles</option>
                    <option value={15}>15 Miles</option>
                    <option value={10}>10 Miles</option>
                    <option value={5}>5 Miles</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Controls neighborhood for offset wells and analog type
                    curves.
                  </p>
                </div>

                {/* Well Type + Operator */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Well Type (UI only) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Well Type
                    </label>
                    <select
                      value={wellParams.proposedWellType}
                      onChange={(e) =>
                        setWellParams({
                          ...wellParams,
                          proposedWellType: e.target.value,
                        })
                      }
                      className={baseInputClasses}
                    >
                      {/* Default & only selectable option */}
                      <option value="HORIZONTAL" className="bg-white">Horizontal</option>

                      {/* Visible but NOT selectable */}
                      <option value="VERTICAL" className="bg-white" disabled >
                        Vertical
                      </option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Only horizontal wells are supported in this release.
                    </p>
                  </div>

                  {/* Operator (UI only) */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Operator
                    </label>
                    <select
                      value={wellParams.operator || ""}
                      onChange={(e) =>
                        setWellParams({
                          ...wellParams,
                          operator: e.target.value,
                        })
                      }
                      className={baseInputClasses}
                    >
                      <option value="">Select operator</option>
                      <option value="Chevron">Chevron</option>
                      <option value="ConocoPhillips">ConocoPhillips</option>
                      <option value="Diamondback Energy">
                        Diamondback Energy
                      </option>
                      <option value="EOG Resources">EOG Resources</option>
                      <option value="Occidental Petroleum">
                        Occidental Petroleum
                      </option>
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Used for labeling only — does not affect the analysis yet.
                    </p>
                  </div>
                </div>

                {/* Formation (unchanged, still used in API) */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Formation
                  </label>
                  <select
                    value={wellParams.formation}
                    onChange={(e) =>
                      setWellParams({
                        ...wellParams,
                        formation: e.target.value,
                      })
                    }
                    className={baseInputClasses}
                  >
                    <option>Wolfcamp A</option>
                    <option>Wolfcamp B</option>
                    <option>Bone Spring</option>
                    <option>Spraberry</option>
                    <option>Delaware</option>
                  </select>
                </div>

                {/* Prediction Horizon (as you had) */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Prediction Horizon
                  </label>
                  <select
                    value={wellParams.predictionHorizon}
                    onChange={(e) =>
                      setWellParams({
                        ...wellParams,
                        predictionHorizon: parseInt(e.target.value, 10),
                      })
                    }
                    className={baseInputClasses}
                  >
                    <option value={360}>360 Months (30 Years)</option>
                    <option value={480}>480 Months (40 Years)</option>
                    <option value={240}>240 Months (20 Years)</option>
                    <option value={120}>120 Months (10 Years)</option>
                    <option value={60}>60 Months (5 Years)</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Defines forecast length for production and economic metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Economic Parameters */}
          <div className="rounded-xl border border-slate-700/80 bg-slate-900/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-50 mb-1 flex items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/40 p-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </span>
                Economic Parameters
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Configure price decks, cost structure, and fiscal terms for NPV
                / IRR.
              </p>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scroll">
                {/* Total CAPEX */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Total CAPEX ($)
                  </label>
                  <input
                    type="number"
                    step={1000000}
                    value={economicParams.totalCAPEX}
                    onChange={(e) =>
                      setEconomicParams({
                        ...economicParams,
                        totalCAPEX: parseFloat(e.target.value),
                      })
                    }
                    className={baseInputClasses}
                  />
                </div>

                {/* Oil & Gas Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Oil Price ($/bbl)
                    </label>
                    <input
                      type="number"
                      step={1}
                      value={economicParams.oilPrice}
                      onChange={(e) =>
                        setEconomicParams({
                          ...economicParams,
                          oilPrice: parseFloat(e.target.value),
                        })
                      }
                      className={baseInputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Gas Price ($/mcf)
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={economicParams.gasPrice}
                      onChange={(e) =>
                        setEconomicParams({
                          ...economicParams,
                          gasPrice: parseFloat(e.target.value),
                        })
                      }
                      className={baseInputClasses}
                    />
                  </div>
                </div>

                {/* Fixed OPEX */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Fixed OPEX ($/year)
                  </label>
                  <input
                    type="number"
                    step={10000}
                    value={economicParams.fixedOPEX}
                    onChange={(e) =>
                      setEconomicParams({
                        ...economicParams,
                        fixedOPEX: parseFloat(e.target.value),
                      })
                    }
                    className={baseInputClasses}
                  />
                </div>

                {/* Variable OPEX */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Oil OPEX
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={economicParams.oilOPEX}
                      onChange={(e) =>
                        setEconomicParams({
                          ...economicParams,
                          oilOPEX: parseFloat(e.target.value),
                        })
                      }
                      className={smallInputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Gas OPEX
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={economicParams.gasOPEX}
                      onChange={(e) =>
                        setEconomicParams({
                          ...economicParams,
                          gasOPEX: parseFloat(e.target.value),
                        })
                      }
                      className={smallInputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Water OPEX
                    </label>
                    <input
                      type="number"
                      step={0.1}
                      value={economicParams.waterOPEX}
                      onChange={(e) =>
                        setEconomicParams({
                          ...economicParams,
                          waterOPEX: parseFloat(e.target.value),
                        })
                      }
                      className={smallInputClasses}
                    />
                  </div>
                </div>

                {/* NRI */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Oil NRI
                    </label>
                    <input
                      type="number"
                      step={0.01}
                      value={economicParams.oilNRI}
                      onChange={(e) =>
                        setEconomicParams({
                          ...economicParams,
                          oilNRI: parseFloat(e.target.value),
                        })
                      }
                      className={baseInputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Gas NRI
                    </label>
                    <input
                      type="number"
                      step={0.01}
                      value={economicParams.gasNRI}
                      onChange={(e) =>
                        setEconomicParams({
                          ...economicParams,
                          gasNRI: parseFloat(e.target.value),
                        })
                      }
                      className={baseInputClasses}
                    />
                  </div>
                </div>

                {/* Discount Rate */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Discount Rate (%)
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    value={economicParams.discountRate * 100}
                    onChange={(e) =>
                      setEconomicParams({
                        ...economicParams,
                        discountRate: parseFloat(e.target.value) / 100,
                      })
                    }
                    className={baseInputClasses}
                  />
                </div>

                {/* Taxes */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Ad Valorem
                    </label>
                    <input
                      type="number"
                      step={0.01}
                      value={economicParams.adValorem}
                      onChange={(e) =>
                        setEconomicParams({
                          ...economicParams,
                          adValorem: parseFloat(e.target.value),
                        })
                      }
                      className={smallInputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Oil Sev Tax
                    </label>
                    <input
                      type="number"
                      step={0.01}
                      value={economicParams.oilSeverance}
                      onChange={(e) =>
                        setEconomicParams({
                          ...economicParams,
                          oilSeverance: parseFloat(e.target.value),
                        })
                      }
                      className={smallInputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Gas Sev Tax
                    </label>
                    <input
                      type="number"
                      step={0.01}
                      value={economicParams.gasSeverance}
                      onChange={(e) =>
                        setEconomicParams({
                          ...economicParams,
                          gasSeverance: parseFloat(e.target.value),
                        })
                      }
                      className={smallInputClasses}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carbon & Environmental */}
          <div className="rounded-xl border border-slate-700/80 bg-slate-900/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-50 mb-1 flex items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/40 p-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </span>
                Carbon & Environmental
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Layer carbon pricing, processing intensity, and credits on top
                of economics.
              </p>

              <div className="space-y-4">
                {/* Processing Intensity */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Processing Intensity Factor
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={carbonParams.processingIntensity}
                    onChange={(e) =>
                      setCarbonParams({
                        ...carbonParams,
                        processingIntensity: parseFloat(e.target.value),
                      })
                    }
                    className={baseInputClasses}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Default: 1.0 &mdash; scale up/down to reflect midstream /
                    processing footprint.
                  </p>
                </div>

                {/* Carbon Price */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Carbon Price ($/ton CO₂e)
                  </label>
                  <input
                    type="number"
                    step={5}
                    value={carbonParams.carbonPrice}
                    onChange={(e) =>
                      setCarbonParams({
                        ...carbonParams,
                        carbonPrice: parseFloat(e.target.value),
                      })
                    }
                    className={baseInputClasses}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Used to compute tax / credit impacts on netback and project
                    economics.
                  </p>
                </div>

                {/* Enable Credits */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={carbonParams.enableCarbonCredits}
                    onChange={(e) =>
                      setCarbonParams({
                        ...carbonParams,
                        enableCarbonCredits: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                  />
                  <label className="text-sm font-medium text-slate-200">
                    Enable Carbon Credit Simulation
                  </label>
                </div>

                {/* Emission Factors */}
                <div className="mt-5 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/30">
                  <h3 className="text-xs font-semibold text-emerald-200 mb-2">
                    Emission Factors (Auto-Applied)
                  </h3>
                  <div className="text-[11px] text-emerald-100/90 space-y-1">
                    <p>• Oil: 0.43 kg CO₂e/bbl (combustion)</p>
                    <p>• Gas: 0.053 kg CO₂e/mcf (combustion)</p>
                    <p>• CH₄ GWP: 28x CO₂ equivalent</p>
                    <p>• Processing: Scaled by intensity factor</p>
                  </div>
                </div>

                {/* Standards */}
                <div className="mt-3 p-4 rounded-lg bg-sky-500/5 border border-sky-500/30">
                  <h3 className="text-xs font-semibold text-sky-200 mb-2">
                    Standards Reference
                  </h3>
                  <div className="text-[11px] text-sky-100/90 space-y-1">
                    <p>• EPA Subpart W</p>
                    <p>• IPCC Tier 2/3 defaults</p>
                    <p>• OGMP 2.0 aligned factors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={analyze}
            disabled={isAnalyzing}
            className={`
              relative flex items-center gap-3 px-12 py-4
              rounded-2xl text-lg font-semibold
              bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500
              shadow-[0_18px_45px_rgba(56,189,248,0.35)]
              transition-all
              ${
                isAnalyzing
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-[0_22px_55px_rgba(129,140,248,0.55)] hover:-translate-y-[1px] cursor-pointer"
              }
            `}
          >
            {/* Glow border */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />

            {isAnalyzing && (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}

            <span className="flex items-center gap-1 relative z-10">
              {isAnalyzing ? (
                <>
                  <span>Analyzing</span>
                  <span className="animate-pulse font-extrabold tracking-widest">
                    •••
                  </span>
                </>
              ) : (
                <span>Analyze Well Performance</span>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
