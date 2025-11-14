import React from "react";
import {
  Save,
  LogOut,
  BarChart3,
  Map,
  Calculator,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useAlphaWell } from "../../context/AlphaWellContext";
import StartScreen from "./StartScreen";
import InputConfig from "./InputConfig";
import Neighborhood from "./tabs/Neighborhood";
import Economic from "./tabs/Economic";
import Production from "./tabs/Production";
import ExecutiveSummary from "./tabs/ExecutiveSummary";

export default function AlphaWellPlatform() {
  const { activeTab, setActiveTab, analyzed, logout, wellParams } =
    useAlphaWell();

  if (activeTab === "start") return <StartScreen />;
  if (activeTab === "input") return <InputConfig />;

  const tabs = [
    { id: "executive", label: "Executive Summary", icon: BarChart3 },
    { id: "neighborhood", label: "Neighborhood", icon: Map },
    { id: "production", label: "Production", icon: BarChart3 },
    { id: "economic", label: "Economic", icon: Calculator },
  ];

  // Trigger ExecutiveSummary to export PDF (fires a window event the tab listens to)
  const handlePdf = () => {
    if (activeTab !== "executive") {
      setActiveTab("executive");
      setTimeout(() => window.dispatchEvent(new CustomEvent("aw-export-exec-pdf")), 250);
    } else {
      window.dispatchEvent(new CustomEvent("aw-export-exec-pdf"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-20 w-full bg-white/70 backdrop-blur-xl border-b border-blue-100 shadow-sm">
        <div className="w-full px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left: breadcrumbs + title */}
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
              <span>AlphaWell</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
              <span className="font-medium text-slate-800">Well</span>
            </div>

            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              AlphaWell Intelligence
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Well: <span className="font-medium text-slate-900">{wellParams.wellId}</span> • {wellParams.formation}
              {analyzed ? (
                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  analyzed
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                  awaiting input
                </span>
              )}
            </p>
          </div>

          {/* Right: actions */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
              onClick={() => {}}
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white font-semibold shadow hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Scenario
            </button>

            <button
              onClick={handlePdf}
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-800 font-medium hover:bg-blue-200 transition-all"
            >
              <FileText className="w-4 h-4" />
              Generate PDF
            </button>

            <button
              onClick={() => setActiveTab("input")}
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              New Analysis
            </button>

            <button
              onClick={logout}
              className="cursor-pointer inline-flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="border-t border-blue-50 bg-white/60 backdrop-blur-xl flex flex-wrap gap-2 px-6 py-2">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 border border-transparent"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* soft blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      {/* Content */}
      <main className="relative w-full px-6 py-10 space-y-10">
        {activeTab === "executive" && analyzed && <ExecutiveSummary />}
        {activeTab === "neighborhood" && <Neighborhood />}
        {activeTab === "production" && <Production />}
        {activeTab === "economic" && <Economic />}

        {!analyzed && activeTab === "executive" && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 p-10 text-center">
            <h3 className="text-lg font-semibold text-gray-900">No analysis yet</h3>
            <p className="mt-1 text-gray-600">Run Analyze from the Input screen to unlock the Executive Summary.</p>
            <button
              onClick={() => setActiveTab("input")}
              className="cursor-pointer mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Go to Input
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 12s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
