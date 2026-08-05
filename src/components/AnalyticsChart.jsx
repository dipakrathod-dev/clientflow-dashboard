import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 8000 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 9500 },
];

const clientGrowthData = [
  { month: 'Jan', clients: 5 },
  { month: 'Feb', clients: 12 },
  { month: 'Mar', clients: 18 },
  { month: 'Apr', clients: 25 },
  { month: 'May', clients: 32 },
  { month: 'Jun', clients: 45 },
];

export function RevenueChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Revenue Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ClientGrowthChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Client Growth</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={clientGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
            <Line type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}