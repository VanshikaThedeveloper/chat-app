import API from './axios';

export const sendMessageAPI = ({ chatId, content }) => {
  return API.post('/messages', { chatId, content });
};

export const getMessagesAPI = (chatId) => {
  return API.get(`/messages/${chatId}`);
};

export const deleteMessageAPI = (messageId) => {
  return API.delete(`/messages/${messageId}`);
};
