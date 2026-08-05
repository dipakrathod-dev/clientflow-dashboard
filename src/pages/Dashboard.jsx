import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { RevenueChart, ClientGrowthChart } from '../components/AnalyticsChart';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ clients: 0, completedProjects: 0, pendingProjects: 0, revenue: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const clientSnap = await getDocs(collection(db, 'clients'));
        
        const projectSnap = await getDocs(collection(db, 'projects'));
        let completed = 0;
        let pending = 0;
        let totalRev = 0;

        projectSnap.forEach(doc => {
          const data = doc.data();
          if (data.status === 'Completed') completed++;
          else pending++;
          if (data.amount) totalRev += Number(data.amount);
        });

        setStats({
          clients: clientSnap.size,
          completedProjects: completed,
          pendingProjects: pending,
          revenue: totalRev || 12450 
        });

        const activityQuery = query(collection(db, 'clients'), orderBy('createdAt', 'desc'), limit(5));
        const actSnap = await getDocs(activityQuery);
        setRecentActivity(actSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return (
    <div className="p-6 space-y-8 bg-slate-950 text-white min-h-screen">
      
      <div className="p-6 bg-gradient-to-r from-blue-900/40 to-slate-900 border border-slate-800 rounded-2xl">
        <h1 className="text-3xl font-bold">{greeting}, {userName} 👋</h1>
        <p className="text-slate-400 mt-1">
          You have {stats.pendingProjects} pending projects to oversee today.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/clients" className="bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl font-medium text-sm transition">
          + Add Client
        </Link>
        <Link to="/projects" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm transition">
          + New Project
        </Link>
        <Link to="/invoices" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm transition">
          + Create Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium">Total Clients</p>
          <div className="flex justify-between items-baseline mt-2">
            <h2 className="text-3xl font-bold">{stats.clients}</h2>
            <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ +12% <span className="text-slate-400 text-[10px] font-normal">This Month</span>
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium">Revenue</p>
          <div className="flex justify-between items-baseline mt-2">
            <h2 className="text-3xl font-bold">${stats.revenue.toLocaleString()}</h2>
            <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ +8% <span className="text-slate-400 text-[10px] font-normal">This Month</span>
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium">Completed Projects</p>
          <div className="flex justify-between items-baseline mt-2">
            <h2 className="text-3xl font-bold">{stats.completedProjects}</h2>
            <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ +5% <span className="text-slate-400 text-[10px] font-normal">This Month</span>
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium">Pending Projects</p>
          <div className="flex justify-between items-baseline mt-2">
            <h2 className="text-3xl font-bold">{stats.pendingProjects}</h2>
            <span className="text-amber-400 text-xs font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↓ -2% <span className="text-slate-400 text-[10px] font-normal">This Month</span>
            </span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ClientGrowthChart />
      </div>

      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-slate-500 text-sm">No recent activity recorded.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-800/60 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-200">New Client Added: {item.name}</p>
                  <p className="text-xs text-slate-500">{item.email}</p>
                </div>
                <span className="text-xs text-slate-400">Recently</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}