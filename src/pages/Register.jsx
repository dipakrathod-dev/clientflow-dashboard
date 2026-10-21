import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { validateEmail, validatePassword, validateRequired } from '../utils/validation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, formatError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nextFieldErrors = {};
    const nameError = validateRequired(name, 'Name');
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (nameError) nextFieldErrors.name = nameError;
    else if (name.trim().length > 100) nextFieldErrors.name = 'Name must be 100 characters or fewer.';
    if (emailError) nextFieldErrors.email = emailError;
    if (passwordError) nextFieldErrors.password = passwordError;
    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      setError('Please correct the highlighted fields.');
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await register(email.trim(), password, name.trim());
      navigate('/', { replace: true });
    } catch (err) {
      setError(formatError(err?.code));
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

        <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-busy={isSubmitting}>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Name
            <input id="register-name" type="text" autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); setFieldErrors((current) => ({ ...current, name: '' })); setError(''); }} required maxLength={100} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'register-name-error' : undefined} className={`mt-1.5 w-full rounded-xl border bg-slate-800/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 ${fieldErrors.name ? 'border-red-500' : 'border-slate-700'}`} />
            {fieldErrors.name && <p id="register-name-error" role="alert" className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>}
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Email Address
            <input id="register-email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors((current) => ({ ...current, email: '' })); setError(''); }} required maxLength={254} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? 'register-email-error' : undefined} className={`mt-1.5 w-full rounded-xl border bg-slate-800/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 ${fieldErrors.email ? 'border-red-500' : 'border-slate-700'}`} />
            {fieldErrors.email && <p id="register-email-error" role="alert" className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Password
            <input id="register-password" type="password" autoComplete="new-password" value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors((current) => ({ ...current, password: '' })); setError(''); }} required minLength={6} aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? 'register-password-error' : undefined} className={`mt-1.5 w-full rounded-xl border bg-slate-800/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 ${fieldErrors.password ? 'border-red-500' : 'border-slate-700'}`} />
            {fieldErrors.password && <p id="register-password-error" role="alert" className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>}
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
