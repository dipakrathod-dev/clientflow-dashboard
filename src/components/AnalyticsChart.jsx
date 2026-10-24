import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const chartContainerClass = 'bg-slate-900 border border-slate-800 p-5 rounded-2xl';
const tooltipStyle = { backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' };

export function RevenueChart({ data = [] }) {
  const hasRevenue = data.some((item) => item.revenue > 0);

  return (
    <div className={chartContainerClass}>
      <h3 className="text-lg font-semibold text-white mb-1">Revenue Trends</h3>
      <p className="text-xs text-slate-500 mb-4">{hasRevenue ? 'Paid invoices, last six months' : 'Add paid invoices to see revenue trends'}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ClientGrowthChart({ data = [] }) {
  const hasClients = data.some((item) => item.clients > 0);

  return (
    <div className={chartContainerClass}>
      <h3 className="text-lg font-semibold text-white mb-1">Client Growth</h3>
      <p className="text-xs text-slate-500 mb-4">{hasClients ? 'Cumulative clients, last six months' : 'Add clients to see growth trends'}</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, 'Clients']} />
            <Line type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
