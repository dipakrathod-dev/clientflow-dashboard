import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-slate-900 text-white">
      <div>Dashboard</div>
      {currentUser && (
        <div className="flex items-center gap-4">
          <span>Hi, {currentUser.displayName || currentUser.email.split('@')[0]} 👋</span>
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
        </div>
      )}
    </nav>
  );
}