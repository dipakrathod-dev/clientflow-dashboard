import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const { currentUser, resetPassword, formatError, logout } = useAuth();
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handlePasswordReset = async () => {
    if (!currentUser?.email) {
      toast.error('This account does not have an email address for password reset.');
      return;
    }

    setIsSendingReset(true);
    try {
      await resetPassword(currentUser.email);
      toast.success(`Password reset link sent to ${currentUser.email}.`);
    } catch (error) {
      toast.error(formatError(error.code));
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error('Unable to sign out. Please try again.');
    }
  };

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Account';

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6 animate-fade-in text-white">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your sign-in and account session.</p>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6" aria-labelledby="account-heading">
        <h2 id="account-heading" className="text-lg font-semibold">Account</h2>
        <div className="mt-5 flex items-center gap-4">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="" className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-violet-600 text-xl font-bold">{displayName.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <p className="font-semibold">{displayName}</p>
            <p className="text-sm text-slate-400">{currentUser?.email}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6" aria-labelledby="security-heading">
        <h2 id="security-heading" className="text-lg font-semibold">Security</h2>
        <p className="mt-2 text-sm text-slate-400">Firebase will email a secure password reset link to your account address.</p>
        <button type="button" onClick={handlePasswordReset} disabled={isSendingReset} className="mt-4 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold hover:bg-slate-700 disabled:opacity-60">
          {isSendingReset ? 'Sending...' : 'Send Password Reset Link'}
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6" aria-labelledby="session-heading">
        <h2 id="session-heading" className="text-lg font-semibold">Session</h2>
        <p className="mt-2 text-sm text-slate-400">Sign out from this device.</p>
        <button type="button" onClick={handleLogout} className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/20">
          Sign Out
        </button>
      </section>
    </div>
  );
}
