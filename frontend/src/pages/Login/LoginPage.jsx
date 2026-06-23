import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, resetError } = useAuth();

  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials);
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Welcome back!');
        navigate('/chat');
      }
    } catch (err) {
      // Error handled in Redux
    }
  };

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </AuthLayout>
  );
};

export default LoginPage;
