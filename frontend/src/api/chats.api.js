import API from './axios';

export const createChatAPI = (participantId) => {
  return API.post('/chats', { participantId });
};

export const getChatsAPI = () => {
  return API.get('/chats');
};

export const getChatByIdAPI = (chatId) => {
  return API.get(`/chats/${chatId}`);
};

export const deleteChatAPI = (chatId) => {
  return API.delete(`/chats/${chatId}`);
};
