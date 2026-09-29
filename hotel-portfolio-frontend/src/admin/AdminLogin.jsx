import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HotelIcon, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-800 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600">
            <HotelIcon size={28} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal-800">Admin Login</h1>
          <p className="mt-1 text-sm text-charcoal-500">Sign in to manage your hotel portfolio</p>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Username or Email</label>
            <input className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={16} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-charcoal-400">
          Default demo account: <span className="font-mono">admin</span> / <span className="font-mono">Admin@123</span>
        </p>
      </div>
    </div>
  );
}
