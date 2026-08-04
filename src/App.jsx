import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/projects" element={<div className="p-8 text-2xl font-bold text-white">📁 Projects Page</div>} />
          <Route path="/invoices" element={<div className="p-8 text-2xl font-bold text-white">🧾 Invoices Page</div>} />
          <Route path="/settings" element={<div className="p-8 text-2xl font-bold text-white">⚙️ Settings Page</div>} />
          <Route path="/profile" element={<div className="p-8 text-2xl font-bold text-white">👤 Profile Page</div>} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}