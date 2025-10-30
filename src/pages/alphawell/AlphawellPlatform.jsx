import React from "react";
import {
  Save,
  LogOut,
  BarChart3,
  Map,
  Calculator,
  FileText,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Left: Title */}
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AlphaWell Intelligence
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Well:{" "}
              <span className="font-medium text-gray-800">
                {wellParams.wellId}
              </span>{" "}
              • {wellParams.formation}
            </p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              <Save className="w-4 h-4" />
              <span>Save Scenario</span>
            </button>

            <button
              onClick={() => setActiveTab("input")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Generate PDF Report</span>
            </button>

            <button
              onClick={() => setActiveTab("input")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <span>New Analysis</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 border border-transparent transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="max-w-7xl mx-auto px-6 pb-3 flex flex-wrap gap-2 border-t border-blue-50 pt-3">
          {[
            { id: "executive", label: "Executive Summary", icon: BarChart3 },
            { id: "neighborhood", label: "Neighborhood Analysis", icon: Map },
            { id: "production", label: "Production Forecast" },
            { id: "economic", label: "Economic Model", icon: Calculator },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 border border-transparent"
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Animated card background effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-40 left-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* Dynamic Tabs */}
        {activeTab === "executive" && analyzed && <ExecutiveSummary />}
        {activeTab === "neighborhood" && <Neighborhood />}
        {activeTab === "production" && <Production />}
        {activeTab === "economic" && <Economic />}
      </main>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob { animation: blob 12s ease-in-out infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}
      </style>
    </div>
  );
}
