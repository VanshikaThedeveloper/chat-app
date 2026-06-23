import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

const LoginForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
        <p className="text-dark-400 text-sm">
          Sign in to continue your conversations
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm animate-slide-up">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-dark-300 mb-1.5">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-dark-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 pr-12 rounded-xl bg-dark-800/50 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-primary-500/25"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Sign In
          </>
        )}
      </button>

      <p className="text-center text-dark-400 text-sm">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
