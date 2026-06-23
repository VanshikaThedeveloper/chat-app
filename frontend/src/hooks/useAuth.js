import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, clearError } from '../features/auth/authSlice';
import { useCallback } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (userData) => dispatch(registerUser(userData)),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    ...auth,
    login,
    register,
    logout,
    resetError,
  };
};

export default useAuth;
