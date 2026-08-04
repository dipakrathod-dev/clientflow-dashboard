import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Invoices from './pages/Invoice';

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/settings" element={<div className="p-8 text-2xl font-bold text-white">⚙️ Settings Page</div>} />
          <Route path="/profile" element={<div className="p-8 text-2xl font-bold text-white">👤 Profile Page</div>} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}