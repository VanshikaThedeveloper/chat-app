import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';

const RegisterForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) return;

    if (formData.username.length < 3) {
      setLocalError('Username must be at least 3 characters');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    onSubmit({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" id="register-form">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
        <p className="text-dark-400 text-sm">
          Join ChatterBox and start chatting
        </p>
      </div>

      {displayError && (
        <div className="px-4 py-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm animate-slide-up">
          {displayError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="register-username" className="block text-sm font-medium text-dark-300 mb-1.5">
            Username
          </label>
          <input
            id="register-username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="johndoe"
            required
            minLength={3}
            maxLength={30}
            className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-dark-300 mb-1.5">
            Email
          </label>
          <input
            id="register-email"
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
          <label htmlFor="register-password" className="block text-sm font-medium text-dark-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
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

        <div>
          <label htmlFor="register-confirm-password" className="block text-sm font-medium text-dark-300 mb-1.5">
            Confirm Password
          </label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-sm"
          />
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
            <UserPlus className="w-5 h-5" />
            Create Account
          </>
        )}
      </button>

      <p className="text-center text-dark-400 text-sm">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
