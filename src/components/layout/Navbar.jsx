import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LogOut } from 'lucide-react';
import { useAlphaWell } from '../../context/AlphaWellContext';

export default function Navbar() {
  const { isAuthenticated, currentUser, logout } = useAlphaWell();
  const { pathname } = useLocation();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Activity className="w-7 h-7 text-blue-600" />
          <span className="font-bold text-lg text-gray-900">AlphaWell Intelligence</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg ${pathname==='/' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Home
          </Link>
          {isAuthenticated && (
            <Link
              to="/app"
              className={`px-3 py-2 rounded-lg ${pathname.startsWith('/app') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              App
            </Link>
          )}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Login</Link>
              <Link to="/signup" className="px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Sign Up</Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out ({currentUser?.name?.split(' ')[0]})</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
