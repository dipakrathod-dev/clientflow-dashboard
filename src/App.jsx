import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import DashboardLayout from './layout/DashboardLayout';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));
const Projects = lazy(() => import('./pages/Projects'));
const Invoices = lazy(() => import('./pages/Invoice'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Profile = lazy(() => import('./pages/Profile'));

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid #334155',
            },
          }} 
        />

        <Suspense fallback={<div className="min-h-screen bg-slate-950 p-8 text-slate-400" role="status">Loading ClientFlow...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Clients />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Projects />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Invoices />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
