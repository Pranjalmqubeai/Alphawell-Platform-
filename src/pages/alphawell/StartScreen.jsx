import React from 'react';
import { Activity, TrendingUp, Calendar } from 'lucide-react';
import { useAlphaWell } from '../../context/AlphaWellContext';

export default function StartScreen() {
  const { currentUser, setShowHistorical, showHistorical, setActiveTab, MOCK_DECISIONS } = useAlphaWell();

  return (
    <div className="min-h-[70vh]">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AlphaWell Intelligence</h1>
              <p className="text-sm text-gray-600">Welcome, {currentUser?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Select Analysis Mode</h2>
          <p className="text-xl text-gray-600">Choose how you want to proceed with your evaluation</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
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

      {/* History Modal */}
      {showHistorical && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Historical Decisions</h2>
              <button
                onClick={() => setShowHistorical(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
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
      )}
    </div>
  );
}
