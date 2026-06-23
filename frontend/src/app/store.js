import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chats/chatSlice';
import messageReducer from '../features/messages/messageSlice';
import userReducer from '../features/users/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatReducer,
    messages: messageReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
