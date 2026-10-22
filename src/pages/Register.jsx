import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, formatError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register(email, password, name);
      navigate('/', { replace: true });
    } catch (err) {
      setError(formatError(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-violet-500/30 bg-violet-600/20 text-2xl">⚡</div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">Start organizing your freelance work.</p>
        </div>

        {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Name
            <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-500" />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Email Address
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-500" />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Password
            <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-500" />
          </label>
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl border border-violet-500/50 bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60">
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300">Sign in</Link></p>
      </div>
    </div>
  );
}
