import API from './axios';

export const registerAPI = ({ username, email, password }) => {
  return API.post('/auth/register', { username, email, password });
};

export const loginAPI = ({ email, password }) => {
  return API.post('/auth/login', { email, password });
};

export const logoutAPI = () => {
  return API.post('/auth/logout');
};

export const refreshTokenAPI = (refreshToken) => {
  return API.post('/auth/refresh-token', { refreshToken });
};
