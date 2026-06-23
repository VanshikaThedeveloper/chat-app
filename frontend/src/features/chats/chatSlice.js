import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getChatsAPI, getChatByIdAPI, createChatAPI, deleteChatAPI } from '../../api/chats.api';

// Thunks
export const fetchChats = createAsyncThunk(
  'chats/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getChatsAPI();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch chats'
      );
    }
  }
);

export const fetchChatById = createAsyncThunk(
  'chats/fetchById',
  async (chatId, { rejectWithValue }) => {
    try {
      const { data } = await getChatByIdAPI(chatId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch chat'
      );
    }
  }
);

export const createNewChat = createAsyncThunk(
  'chats/create',
  async (participantId, { rejectWithValue }) => {
    try {
      const { data } = await createChatAPI(participantId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create chat'
      );
    }
  }
);

export const removeChat = createAsyncThunk(
  'chats/delete',
  async (chatId, { rejectWithValue }) => {
    try {
      await deleteChatAPI(chatId);
      return chatId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete chat'
      );
    }
  }
);

const initialState = {
  chats: [],
  activeChat: null,
  loading: false,
  error: null,
  typingUsers: {}, // { chatId: userId }
  onlineUsers: {}, // { userId: boolean }
};

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    clearActiveChat: (state) => {
      state.activeChat = null;
    },
    updateLastMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chatIndex = state.chats.findIndex((c) => c._id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = message;
        state.chats[chatIndex].lastMessageAt = message.createdAt;
        // Move chat to top
        const [chat] = state.chats.splice(chatIndex, 1);
        state.chats.unshift(chat);
      }
    },
    setTypingUser: (state, action) => {
      const { chatId, userId } = action.payload;
      state.typingUsers[chatId] = userId;
    },
    clearTypingUser: (state, action) => {
      const { chatId } = action.payload;
      delete state.typingUsers[chatId];
    },
    setUserOnline: (state, action) => {
      const { userId } = action.payload;
      state.onlineUsers[userId] = true;
      // Update participants in chats
      state.chats.forEach((chat) => {
        chat.participants?.forEach((p) => {
          if (p._id === userId) {
            p.isOnline = true;
          }
        });
      });
      if (state.activeChat) {
        state.activeChat.participants?.forEach((p) => {
          if (p._id === userId) {
            p.isOnline = true;
          }
        });
      }
    },
    setUserOffline: (state, action) => {
      const { userId } = action.payload;
      state.onlineUsers[userId] = false;
      state.chats.forEach((chat) => {
        chat.participants?.forEach((p) => {
          if (p._id === userId) {
            p.isOnline = false;
          }
        });
      });
      if (state.activeChat) {
        state.activeChat.participants?.forEach((p) => {
          if (p._id === userId) {
            p.isOnline = false;
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch all chats
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch chat by ID
    builder
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.activeChat = action.payload;
      });

    // Create new chat
    builder
      .addCase(createNewChat.fulfilled, (state, action) => {
        const existingIndex = state.chats.findIndex(
          (c) => c._id === action.payload._id
        );
        if (existingIndex === -1) {
          state.chats.unshift(action.payload);
        }
        state.activeChat = action.payload;
      });

    // Delete chat
    builder
      .addCase(removeChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter((c) => c._id !== action.payload);
        if (state.activeChat?._id === action.payload) {
          state.activeChat = null;
        }
      });
  },
});

export const {
  setActiveChat,
  clearActiveChat,
  updateLastMessage,
  setTypingUser,
  clearTypingUser,
  setUserOnline,
  setUserOffline,
} = chatSlice.actions;

export default chatSlice.reducer;
