// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { useAlphaWell } from "../../../context/AlphaWellContext";

// export default function ExecParamsModal({ open, onClose }) {
//   const {
//     wellParams,
//     setWellParams,
//     economicParams,
//     setEconomicParams,
//     carbonParams,
//     setCarbonParams,
//     analyze,
//   } = useAlphaWell();

//   const [localWell, setLocalWell] = useState(wellParams);
//   const [localEco, setLocalEco] = useState(economicParams);
//   const [localCarbon, setLocalCarbon] = useState(carbonParams);

//   useEffect(() => {
//     if (open) {
//       setLocalWell(wellParams);
//       setLocalEco(economicParams);
//       setLocalCarbon(carbonParams);
//     }
//   }, [open, wellParams, economicParams, carbonParams]);

//   const onSave = async () => {
//     // Build the final objects we want to use in the API call
//     const newWell = { ...wellParams, ...localWell };
//     const newEco = { ...economicParams, ...localEco };
//     const newCarbon = { ...carbonParams, ...localCarbon };

//     // Update context state (for UI)
//     setWellParams(newWell);
//     setEconomicParams(newEco);
//     setCarbonParams(newCarbon);

//     // 🔥 IMPORTANT: call analyze with the overrides so the API
//     // uses these exact values, even before React finishes updating state
//     await analyze({
//       wellParams: newWell,
//       economicParams: newEco,
//       carbonParams: newCarbon,
//     });

//     onClose?.();
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* backdrop */}
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />

//       {/* modal */}
//       <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-bold text-gray-900">
//             Edit Your Parameters
//           </h3>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg hover:bg-gray-100"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2">
//           {/* WELL */}
//           <div>
//             <h4 className="font-semibold text-gray-900 mb-3">Well</h4>
//             <div className="space-y-3 text-sm">
//               <NumberInput
//                 label="Latitude"
//                 step="0.0001"
//                 value={localWell.latitude}
//                 onChange={(v) =>
//                   setLocalWell({
//                     ...localWell,
//                     latitude: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Longitude"
//                 step="0.0001"
//                 value={localWell.longitude}
//                 onChange={(v) =>
//                   setLocalWell({
//                     ...localWell,
//                     longitude: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <TextInput
//                 label="Formation"
//                 value={localWell.formation}
//                 onChange={(v) => setLocalWell({ ...localWell, formation: v })}
//               />

//               {/* Radius (Miles) – same as InputConfig */}
//               <SelectInput
//                 label="Radius (Miles)"
//                 value={
//                   localWell.radiusMiles != null ? localWell.radiusMiles : 15
//                 }
//                 onChange={(v) =>
//                   setLocalWell({
//                     ...localWell,
//                     radiusMiles: parseInt(v, 10) || 15,
//                   })
//                 }
//                 options={[
//                   { value: 30, label: "30 Miles" },
//                   { value: 15, label: "15 Miles" },
//                   { value: 10, label: "10 Miles" },
//                   { value: 5, label: "5 Miles" },
//                 ]}
//               />

//               {/* Prediction Horizon – months options */}
//               <SelectInput
//                 label="Prediction Horizon"
//                 value={localWell.predictionHorizon ?? 360}
//                 onChange={(v) =>
//                   setLocalWell({
//                     ...localWell,
//                     predictionHorizon: parseInt(v, 10) || 360,
//                   })
//                 }
//                 options={[
//                   { value: 480, label: "480 Months (40 Years)" },
//                   { value: 360, label: "360 Months (30 Years)" }, // default
//                   { value: 240, label: "240 Months (20 Years)" },
//                   { value: 120, label: "120 Months (10 Years)" },
//                   { value: 60, label: "60 Months (5 Years)" },
//                 ]}
//               />
//             </div>
//           </div>

//           {/* ECONOMICS */}
//           <div>
//             <h4 className="font-semibold text-gray-900 mb-3">Economics</h4>
//             <div className="space-y-3 text-sm">
//               <NumberInput
//                 label="Total CAPEX ($)"
//                 step="1000000"
//                 value={localEco.totalCAPEX}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     totalCAPEX: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Oil Price ($/bbl)"
//                 step="1"
//                 value={localEco.oilPrice}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     oilPrice: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Gas Price ($/mcf)"
//                 step="0.25"
//                 value={localEco.gasPrice}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     gasPrice: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Fixed OPEX ($/yr)"
//                 step="10000"
//                 value={localEco.fixedOPEX}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     fixedOPEX: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Oil OPEX ($/bbl)"
//                 step="0.05"
//                 value={localEco.oilOPEX}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     oilOPEX: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Gas OPEX ($/mcf)"
//                 step="0.05"
//                 value={localEco.gasOPEX}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     gasOPEX: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Water OPEX ($/bbl)"
//                 step="0.05"
//                 value={localEco.waterOPEX}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     waterOPEX: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Oil NRI"
//                 step="0.001"
//                 value={localEco.oilNRI}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     oilNRI: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Gas NRI"
//                 step="0.001"
//                 value={localEco.gasNRI}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     gasNRI: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Discount Rate (%)"
//                 step="0.1"
//                 value={Number((localEco.discountRate * 100).toFixed(4))}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     discountRate: (parseFloat(v) || 0) / 100,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Ad Valorem"
//                 step="0.001"
//                 value={localEco.adValorem}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     adValorem: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Oil Severance"
//                 step="0.001"
//                 value={localEco.oilSeverance}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     oilSeverance: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <NumberInput
//                 label="Gas Severance"
//                 step="0.001"
//                 value={localEco.gasSeverance}
//                 onChange={(v) =>
//                   setLocalEco({
//                     ...localEco,
//                     gasSeverance: parseFloat(v) || 0,
//                   })
//                 }
//               />
//             </div>
//           </div>

//           {/* CARBON */}
//           <div>
//             <h4 className="font-semibold text-gray-900 mb-3">Carbon</h4>
//             <div className="space-y-3 text-sm">
//               <NumberInput
//                 label="Processing Intensity Factor"
//                 step="0.1"
//                 value={localCarbon.processingIntensity}
//                 onChange={(v) =>
//                   setLocalCarbon({
//                     ...localCarbon,
//                     processingIntensity: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               {/* Flaring percentage removed to match new InputConfig */}
//               <NumberInput
//                 label="Carbon Price ($/tCO₂e)"
//                 step="1"
//                 value={localCarbon.carbonPrice}
//                 onChange={(v) =>
//                   setLocalCarbon({
//                     ...localCarbon,
//                     carbonPrice: parseFloat(v) || 0,
//                   })
//                 }
//               />
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={localCarbon.enableCarbonCredits}
//                   onChange={(e) =>
//                     setLocalCarbon({
//                       ...localCarbon,
//                       enableCarbonCredits: e.target.checked,
//                     })
//                   }
//                   className="w-4 h-4"
//                 />
//                 <span>Enable Carbon Credit Simulation</span>
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onSave}
//             className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-95"
//           >
//             Save &amp; Re-Analyze
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ------- small inputs ------- */

// function TextInput({ label, value, onChange }) {
//   return (
//     <div>
//       <label className="block text-gray-700 mb-1">{label}</label>
//       <input
//         className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//         value={value ?? ""}
//         onChange={(e) => onChange(e.target.value)}
//       />
//     </div>
//   );
// }

// function NumberInput({ label, value, onChange, step }) {
//   return (
//     <div>
//       <label className="block text-gray-700 mb-1">{label}</label>
//       <input
//         type="number"
//         step={step || "1"}
//         className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//         value={value ?? ""}
//         onChange={(e) => onChange(e.target.value)}
//       />
//     </div>
//   );
// }

// function SelectInput({ label, value, onChange, options }) {
//   return (
//     <div>
//       <label className="block text-gray-700 mb-1">{label}</label>
//       <select
//         className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         {options.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAlphaWell } from "../../../context/AlphaWellContext";

export default function ExecParamsModal({ open, onClose }) {
  const {
    wellParams,
    setWellParams,
    economicParams,
    setEconomicParams,
    carbonParams,
    setCarbonParams,
    analyze,
    isAnalyzing, // 👈 use existing loading flag
  } = useAlphaWell();

  const [localWell, setLocalWell] = useState(wellParams);
  const [localEco, setLocalEco] = useState(economicParams);
  const [localCarbon, setLocalCarbon] = useState(carbonParams);

  useEffect(() => {
    if (open) {
      setLocalWell(wellParams);
      setLocalEco(economicParams);
      setLocalCarbon(carbonParams);
    }
  }, [open, wellParams, economicParams, carbonParams]);

  const onSave = async () => {
    // Build the final objects we want to use in the API call
    const newWell = { ...wellParams, ...localWell };
    const newEco = { ...economicParams, ...localEco };
    const newCarbon = { ...carbonParams, ...localCarbon };

    // Update context state (for UI)
    setWellParams(newWell);
    setEconomicParams(newEco);
    setCarbonParams(newCarbon);

    // Call analyze with overrides so the API uses these exact values
    await analyze({
      wellParams: newWell,
      economicParams: newEco,
      carbonParams: newCarbon,
    });

    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Edit Your Parameters
          </h3>
          <button
            onClick={onClose}
            className="  p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* WELL */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Well</h4>
            <div className="space-y-3 text-sm">
              <NumberInput
                label="Latitude"
                step="0.0001"
                value={localWell.latitude}
                onChange={(v) =>
                  setLocalWell({
                    ...localWell,
                    latitude: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Longitude"
                step="0.0001"
                value={localWell.longitude}
                onChange={(v) =>
                  setLocalWell({
                    ...localWell,
                    longitude: parseFloat(v) || 0,
                  })
                }
              />
              <TextInput
                label="Formation"
                value={localWell.formation}
                onChange={(v) => setLocalWell({ ...localWell, formation: v })}
              />

              {/* Radius (Miles) – same as InputConfig */}
              <SelectInput
                label="Radius (Miles)"
                value={
                  localWell.radiusMiles != null ? localWell.radiusMiles : 15
                }
                onChange={(v) =>
                  setLocalWell({
                    ...localWell,
                    radiusMiles: parseInt(v, 10) || 15,
                  })
                }
                options={[
                  { value: 30, label: "30 Miles" },
                  { value: 15, label: "15 Miles" },
                  { value: 10, label: "10 Miles" },
                  { value: 5, label: "5 Miles" },
                ]}
              />

              {/* Prediction Horizon – months options */}
              <SelectInput
                label="Prediction Horizon"
                value={localWell.predictionHorizon ?? 360}
                onChange={(v) =>
                  setLocalWell({
                    ...localWell,
                    predictionHorizon: parseInt(v, 10) || 360,
                  })
                }
                options={[
                  { value: 480, label: "480 Months (40 Years)" },
                  { value: 360, label: "360 Months (30 Years)" }, // default
                  { value: 240, label: "240 Months (20 Years)" },
                  { value: 120, label: "120 Months (10 Years)" },
                  { value: 60, label: "60 Months (5 Years)" },
                ]}
              />
            </div>
          </div>

          {/* ECONOMICS */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Economics</h4>
            <div className="space-y-3 text-sm">
              <NumberInput
                label="Total CAPEX ($)"
                step="1000000"
                value={localEco.totalCAPEX}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    totalCAPEX: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Oil Price ($/bbl)"
                step="1"
                value={localEco.oilPrice}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    oilPrice: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Gas Price ($/mcf)"
                step="0.25"
                value={localEco.gasPrice}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    gasPrice: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Fixed OPEX ($/yr)"
                step="10000"
                value={localEco.fixedOPEX}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    fixedOPEX: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Oil OPEX ($/bbl)"
                step="0.05"
                value={localEco.oilOPEX}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    oilOPEX: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Gas OPEX ($/mcf)"
                step="0.05"
                value={localEco.gasOPEX}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    gasOPEX: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Water OPEX ($/bbl)"
                step="0.05"
                value={localEco.waterOPEX}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    waterOPEX: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Oil NRI"
                step="0.001"
                value={localEco.oilNRI}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    oilNRI: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Gas NRI"
                step="0.001"
                value={localEco.gasNRI}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    gasNRI: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Discount Rate (%)"
                step="0.1"
                value={Number((localEco.discountRate * 100).toFixed(4))}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    discountRate: (parseFloat(v) || 0) / 100,
                  })
                }
              />
              <NumberInput
                label="Ad Valorem"
                step="0.001"
                value={localEco.adValorem}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    adValorem: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Oil Severance"
                step="0.001"
                value={localEco.oilSeverance}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    oilSeverance: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Gas Severance"
                step="0.001"
                value={localEco.gasSeverance}
                onChange={(v) =>
                  setLocalEco({
                    ...localEco,
                    gasSeverance: parseFloat(v) || 0,
                  })
                }
              />
            </div>
          </div>

          {/* CARBON */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Carbon</h4>
            <div className="space-y-3 text-sm">
              <NumberInput
                label="Processing Intensity Factor"
                step="0.1"
                value={localCarbon.processingIntensity}
                onChange={(v) =>
                  setLocalCarbon({
                    ...localCarbon,
                    processingIntensity: parseFloat(v) || 0,
                  })
                }
              />
              <NumberInput
                label="Carbon Price ($/tCO₂e)"
                step="1"
                value={localCarbon.carbonPrice}
                onChange={(v) =>
                  setLocalCarbon({
                    ...localCarbon,
                    carbonPrice: parseFloat(v) || 0,
                  })
                }
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localCarbon.enableCarbonCredits}
                  onChange={(e) =>
                    setLocalCarbon({
                      ...localCarbon,
                      enableCarbonCredits: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <span>Enable Carbon Credit Simulation</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2  cursor-pointer rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isAnalyzing}
            className={`px-5 py-2 cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-95 flex items-center gap-2 ${
              isAnalyzing ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isAnalyzing && (
              <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            )}
            <span>{isAnalyzing ? "Re-Analyzing..." : "Save & Re-Analyze"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------- small inputs ------- */

function TextInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      <input
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function NumberInput({ label, value, onChange, step }) {
  return (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        step={step || "1"}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      <select
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
