import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error, resetError } = useAuth();

  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleRegister = async (userData) => {
    try {
      const result = await register(userData);
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Account created! Please sign in.');
        navigate('/login');
      }
    } catch (err) {
      // Error handled in Redux
    }
  };

  return (
    <AuthLayout>
      <RegisterForm onSubmit={handleRegister} loading={loading} error={error} />
    </AuthLayout>
  );
};

export default RegisterPage;
