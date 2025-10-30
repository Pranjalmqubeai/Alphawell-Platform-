import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Homepage from './pages/Homepage';

import AlphaWellPlatform from './pages/alphawell/AlphawellPlatform';
import { AlphaWellProvider, useAlphaWell } from './context/AlphaWellContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AlphaWell from './components/AlphaWellPlatform.jsx';
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAlphaWell();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AlphaWellProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/test" element={<AlphaWell />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AlphaWellPlatform />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AlphaWellProvider>
  );
}
