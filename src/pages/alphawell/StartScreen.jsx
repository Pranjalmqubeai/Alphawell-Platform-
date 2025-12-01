import React from 'react';
import { Activity, TrendingUp, Calendar } from 'lucide-react';
import { useAlphaWell } from '../../context/AlphaWellContext';

export default function StartScreen() {
  const {
    currentUser,
    setShowHistorical,
    showHistorical,
    setActiveTab,
    MOCK_DECISIONS,
  } = useAlphaWell();

  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Dark Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 shadow-lg shadow-slate-900/70">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Brand / Title */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/40 p-2 shadow-[0_0_25px_rgba(56,189,248,0.45)]">
                <Activity className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/95">
                    AlphaCarbon
                  </span>
                  <span className="h-4 w-px bg-sky-500/50" />
                  <span className="text-[11px] font-medium tracking-[0.16em] text-slate-300/90">
                    AlphaWell Intelligence
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">
                  Decision Workspace
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Welcome, <span className="text-sky-200">{currentUser?.name}</span>
                </p>
              </div>
            </div>

            {/* Right status chip */}
            <div className="flex flex-col items-end text-xs text-slate-300 gap-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/40 px-3 py-1 text-[11px] font-medium text-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Ready for analysis
              </span>
              <span className="text-[11px] text-slate-500">
                Choose a mode to get started
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-50 mb-3">
            Select Analysis Mode
          </h2>
          <p className="text-base md:text-lg text-slate-400">
            Start a new well evaluation or revisit prior decisions to refine your strategy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* New Evaluation Card */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-[0_18px_45px_rgba(15,23,42,0.9)] hover:border-sky-500/70 hover:shadow-[0_22px_55px_rgba(56,189,248,0.45)] transition-all">
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/40 mb-6">
                <TrendingUp className="w-8 h-8 text-sky-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-50 mb-3">
                Start New Evaluation
              </h3>
              <p className="text-sm md:text-base text-slate-400 mb-6">
                Configure a new well or prospect, run ML-driven forecasts, and
                overlay economics with carbon-aware insights.
              </p>
              <div className="mt-auto">
                <button
                  onClick={() => setActiveTab('input')}
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-3 rounded-lg font-semibold text-sm md:text-base hover:from-sky-600 hover:to-indigo-600 transition-all shadow-[0_12px_30px_rgba(56,189,248,0.45)]"
                >
                  New Evaluation
                </button>
                <p className="text-[11px] text-slate-500 mt-2">
                  Recommended when screening a fresh drilling opportunity.
                </p>
              </div>
            </div>
          </div>

          {/* History Card */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-[0_18px_45px_rgba(15,23,42,0.9)] hover:border-fuchsia-500/70 hover:shadow-[0_22px_55px_rgba(217,70,239,0.45)] transition-all">
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/40 mb-6">
                <Calendar className="w-8 h-8 text-fuchsia-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-50 mb-3">
                Review Prior Decisions
              </h3>
              <p className="text-sm md:text-base text-slate-400 mb-6">
                Compare historical scenarios, validate assumptions, and refine
                capital allocation across your portfolio.
              </p>
              <div className="mt-auto">
                <button
                  onClick={() => setShowHistorical(true)}
                  className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white py-3 rounded-lg font-semibold text-sm md:text-base hover:from-fuchsia-600 hover:to-purple-600 transition-all shadow-[0_12px_30px_rgba(217,70,239,0.45)]"
                >
                  View History
                </button>
                <p className="text-[11px] text-slate-500 mt-2">
                  Ideal for look-backs, post-mortems, and portfolio steering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistorical && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/95 shadow-[0_28px_80px_rgba(15,23,42,0.95)] max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-slate-50">
                  Historical Decisions
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  A curated log of saved scenarios, verdicts, and carbon metrics.
                </p>
              </div>
              <button
                onClick={() => setShowHistorical(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-slate-50 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {MOCK_DECISIONS.map((decision) => (
                <div
                  key={decision.id}
                  className="border border-slate-700 rounded-xl p-5 bg-slate-900/80 hover:border-sky-500/70 hover:bg-slate-900 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-50">
                        {decision.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {decision.id} • {decision.date}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold self-start md:self-center ${
                        decision.verdict === 'Drill'
                          ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/40'
                          : decision.verdict === 'Evaluate Further'
                          ? 'bg-amber-500/10 text-amber-200 border border-amber-500/40'
                          : 'bg-rose-500/10 text-rose-200 border border-rose-500/40'
                      }`}
                    >
                      {decision.verdict}
                    </span>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-[11px] text-slate-400">Formation</p>
                      <p className="font-semibold text-slate-50">
                        {decision.formation}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">NPV</p>
                      <p className="font-semibold text-slate-50">
                        ${decision.npv.toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">IRR</p>
                      <p className="font-semibold text-slate-50">
                        {decision.irr.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">EUR (bbl)</p>
                      <p className="font-semibold text-slate-50">
                        {(decision.eur / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-slate-400">
                        Carbon Intensity
                      </p>
                      <p className="font-semibold text-slate-50">
                        {decision.carbonIntensity} g CO₂e/BOE
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">
                        Total Emissions
                      </p>
                      <p className="font-semibold text-slate-50">
                        {decision.totalCO2} tons CO₂
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {MOCK_DECISIONS.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No historical decisions found. Run and save an evaluation to
                  see it appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
