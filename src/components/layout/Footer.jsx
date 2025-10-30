import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} AlphaWell Intelligence</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-gray-700" href="#">Privacy</a>
          <a className="hover:text-gray-700" href="#">Terms</a>
          <a className="hover:text-gray-700" href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}
