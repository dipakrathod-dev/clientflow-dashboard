import RecentClients from "./components/RecentClients";
import RecentProjects from "./components/RecentProjects";
import ActivityFeed from "./components/ActivityFeed";

export default function App() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const userName = "Dipak";
  const activeProjectsCount = 5;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            {getGreeting()}, {userName} <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-slate-400 text-sm">
            You have <span className="text-purple-400 font-semibold">{activeProjectsCount} active projects</span> today.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentClients />
          <RecentProjects />
        </div>

        <div className="w-full">
          <ActivityFeed />
        </div>
        
      </div>
    </main>
  );
}