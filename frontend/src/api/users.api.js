import API from './axios';

export const getProfileAPI = () => {
  return API.get('/users/profile');
};

export const updateProfileAPI = ({ username, bio, profilePicture }) => {
  return API.put('/users/profile', { username, bio, profilePicture });
};

export const searchUsersAPI = (query) => {
  return API.get('/users/search', { params: { query } });
};

export const getUserByIdAPI = (id) => {
  return API.get(`/users/${id}`);
};
