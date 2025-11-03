import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAlphaWell } from "../../../context/AlphaWellContext";

export default function ExecParamsModal({ open, onClose }) {
  const {
    wellParams, setWellParams,
    economicParams, setEconomicParams,
    carbonParams, setCarbonParams,
    analyze
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
  }, [open]); // refresh values on open

  const onSave = async () => {
    setWellParams(localWell);
    setEconomicParams(localEco);
    setCarbonParams(localCarbon);
    // Re-run analyze using updated params
    analyze();
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
          <h3 className="text-xl font-bold text-gray-900">Edit Your Parameters</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Well */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Well</h4>
            <div className="space-y-3 text-sm">
              <TextInput label="Well ID" value={localWell.wellId} onChange={(v)=>setLocalWell({...localWell, wellId:v})}/>
              <NumberInput label="Latitude" step="0.0001" value={localWell.latitude} onChange={(v)=>setLocalWell({...localWell, latitude:parseFloat(v)||0})}/>
              <NumberInput label="Longitude" step="0.0001" value={localWell.longitude} onChange={(v)=>setLocalWell({...localWell, longitude:parseFloat(v)||0})}/>
              <TextInput label="Formation" value={localWell.formation} onChange={(v)=>setLocalWell({...localWell, formation:v})}/>
              <NumberInput label="TVD (ft)" value={localWell.tvd} onChange={(v)=>setLocalWell({...localWell, tvd:parseInt(v)||0})}/>
              <NumberInput label="Lateral Length (ft)" value={localWell.lateralLength} onChange={(v)=>setLocalWell({...localWell, lateralLength:parseInt(v)||0})}/>
              <NumberInput label="Prediction Horizon (years)" value={localWell.predictionHorizon} onChange={(v)=>setLocalWell({...localWell, predictionHorizon:parseInt(v)||10})}/>
            </div>
          </div>

          {/* Economics */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Economics</h4>
            <div className="space-y-3 text-sm">
              <NumberInput label="Total CAPEX ($)" value={localEco.totalCAPEX} onChange={(v)=>setLocalEco({...localEco, totalCAPEX:parseFloat(v)||0})}/>
              <NumberInput label="Oil Price ($/bbl)" step="0.01" value={localEco.oilPrice} onChange={(v)=>setLocalEco({...localEco, oilPrice:parseFloat(v)||0})}/>
              <NumberInput label="Gas Price ($/mcf)" step="0.01" value={localEco.gasPrice} onChange={(v)=>setLocalEco({...localEco, gasPrice:parseFloat(v)||0})}/>
              <NumberInput label="Fixed OPEX ($/yr)" value={localEco.fixedOPEX} onChange={(v)=>setLocalEco({...localEco, fixedOPEX:parseFloat(v)||0})}/>
              <NumberInput label="Oil OPEX ($/bbl)" step="0.01" value={localEco.oilOPEX} onChange={(v)=>setLocalEco({...localEco, oilOPEX:parseFloat(v)||0})}/>
              <NumberInput label="Gas OPEX ($/mcf)" step="0.01" value={localEco.gasOPEX} onChange={(v)=>setLocalEco({...localEco, gasOPEX:parseFloat(v)||0})}/>
              <NumberInput label="Water OPEX ($/bbl)" step="0.01" value={localEco.waterOPEX} onChange={(v)=>setLocalEco({...localEco, waterOPEX:parseFloat(v)||0})}/>
              <NumberInput label="Oil NRI" step="0.001" value={localEco.oilNRI} onChange={(v)=>setLocalEco({...localEco, oilNRI:parseFloat(v)||0})}/>
              <NumberInput label="Gas NRI" step="0.001" value={localEco.gasNRI} onChange={(v)=>setLocalEco({...localEco, gasNRI:parseFloat(v)||0})}/>
              <NumberInput label="Discount Rate (%)" step="0.01" value={Number((localEco.discountRate*100).toFixed(4))} onChange={(v)=>setLocalEco({...localEco, discountRate:(parseFloat(v)||0)/100})}/>
              <NumberInput label="Ad Valorem" step="0.001" value={localEco.adValorem} onChange={(v)=>setLocalEco({...localEco, adValorem:parseFloat(v)||0})}/>
              <NumberInput label="Oil Severance" step="0.001" value={localEco.oilSeverance} onChange={(v)=>setLocalEco({...localEco, oilSeverance:parseFloat(v)||0})}/>
              <NumberInput label="Gas Severance" step="0.001" value={localEco.gasSeverance} onChange={(v)=>setLocalEco({...localEco, gasSeverance:parseFloat(v)||0})}/>
            </div>
          </div>

          {/* Carbon */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Carbon</h4>
            <div className="space-y-3 text-sm">
              <NumberInput label="Processing Intensity" step="0.1" value={localCarbon.processingIntensity} onChange={(v)=>setLocalCarbon({...localCarbon, processingIntensity:parseFloat(v)||0})}/>
              <NumberInput label="Flaring (%)" step="0.01" value={Number((localCarbon.flarePercent*100).toFixed(4))} onChange={(v)=>setLocalCarbon({...localCarbon, flarePercent:(parseFloat(v)||0)/100})}/>
              <NumberInput label="Carbon Price ($/tCO₂e)" value={localCarbon.carbonPrice} onChange={(v)=>setLocalCarbon({...localCarbon, carbonPrice:parseFloat(v)||0})}/>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localCarbon.enableCarbonCredits}
                  onChange={(e)=>setLocalCarbon({...localCarbon, enableCarbonCredits: e.target.checked})}
                  className="w-4 h-4"
                />
                <span>Enable Carbon Credit Simulation</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onSave} className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-95">
            Save & Re-Analyze
          </button>
        </div>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      <input className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
             value={value} onChange={(e)=>onChange(e.target.value)} />
    </div>
  );
}
function NumberInput({ label, value, onChange, step }) {
  return (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      <input type="number" step={step||"1"} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
             value={value} onChange={(e)=>onChange(e.target.value)} />
    </div>
  );
}
