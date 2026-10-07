import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { currentUser } = useAuth();
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Account';

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6 animate-fade-in text-white">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Your account details from Firebase Authentication.</p>
      </div>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex items-center gap-4">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="" className="h-16 w-16 rounded-2xl object-cover" />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-violet-600 text-2xl font-bold">{displayName.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{displayName}</h2>
            <p className="text-sm text-slate-400">{currentUser?.email}</p>
          </div>
        </div>
        <dl className="mt-6 grid gap-4 border-t border-slate-800 pt-5 sm:grid-cols-2">
          <div><dt className="text-xs uppercase tracking-wide text-slate-500">Email verified</dt><dd className="mt-1 text-sm text-slate-200">{currentUser?.emailVerified ? 'Yes' : 'Not yet'}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-slate-500">Account created</dt><dd className="mt-1 text-sm text-slate-200">{currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : '—'}</dd></div>
        </dl>
      </section>
    </div>
  );
}
