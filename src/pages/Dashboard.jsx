import { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { useAuth } from '../hooks/useAuth';
import { RevenueChart, ClientGrowthChart } from '../components/AnalyticsChart';
import toast from 'react-hot-toast';

const emptyStats = { clients: 0, completedProjects: 0, pendingProjects: 0, projectValue: 0 };

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(emptyStats);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser?.uid) {
      setStats(emptyStats);
      setRecentActivity([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const clientsQuery = query(collection(db, 'clients'), where('ownerUid', '==', currentUser.uid));
      const projectsQuery = query(collection(db, 'projects'), where('ownerUid', '==', currentUser.uid));
      const [clientSnap, projectSnap] = await Promise.all([getDocs(clientsQuery), getDocs(projectsQuery)]);

      let completedProjects = 0;
      let pendingProjects = 0;
      let projectValue = 0;
      projectSnap.forEach((projectDoc) => {
        const project = projectDoc.data();
        if (project.status === 'Completed') completedProjects += 1;
        else pendingProjects += 1;
        projectValue += Number(project.amount ?? project.budget ?? 0);
      });

      setStats({
        clients: clientSnap.size,
        completedProjects,
        pendingProjects,
        projectValue,
      });

      setRecentActivity(
        clientSnap.docs
          .map((clientDoc) => ({ id: clientDoc.id, ...clientDoc.data() }))
          .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
          .slice(0, 5)
      );
    } catch {
      toast.error('Could not load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  if (loading) {
    return <div className="p-8 text-sm text-slate-400" role="status">Loading your dashboard...</div>;
  }

  const statCards = [
    { label: 'Total Clients', value: stats.clients, caption: 'Your records', color: 'text-white' },
    { label: 'Project Value', value: `₹${stats.projectValue.toLocaleString('en-IN')}`, caption: 'From saved projects', color: 'text-violet-400' },
    { label: 'Completed Projects', value: stats.completedProjects, caption: 'Your records', color: 'text-emerald-400' },
    { label: 'Pending Projects', value: stats.pendingProjects, caption: 'Your records', color: 'text-amber-400' },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-950 text-white min-h-screen">
      <div className="p-6 bg-gradient-to-r from-blue-900/40 to-slate-900 border border-slate-800 rounded-2xl">
        <h1 className="text-3xl font-bold">{greeting}, {userName} 👋</h1>
        <p className="text-slate-400 mt-1">You have {stats.pendingProjects} pending projects to oversee today.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/clients" className="bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl font-medium text-sm transition">+ Add Client</Link>
        <Link to="/projects" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm transition">View Projects</Link>
        <Link to="/invoices" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm transition">View Invoices</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium">{card.label}</p>
            <div className="flex justify-between items-baseline gap-2 mt-2">
              <h2 className={`text-3xl font-bold ${card.color}`}>{card.value}</h2>
              <span className="text-xs text-slate-500">{card.caption}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ClientGrowthChart />
      </div>

      <section className="bg-slate-900 border border-slate-800 p-5 rounded-2xl" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="text-lg font-semibold mb-4">Recent Clients</h2>
        {recentActivity.length === 0 ? (
          <p className="text-slate-500 text-sm">No clients added yet.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((client) => (
              <div key={client.id} className="flex justify-between items-center py-2 border-b border-slate-800/60 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-200">{client.name}</p>
                  <p className="text-xs text-slate-500">{client.company || client.email}</p>
                </div>
                <span className="text-xs text-slate-400">{client.status || 'Active'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
