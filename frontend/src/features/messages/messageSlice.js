import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMessagesAPI, sendMessageAPI, deleteMessageAPI } from '../../api/messages.api';

// Thunks
export const fetchMessages = createAsyncThunk(
  'messages/fetchAll',
  async (chatId, { rejectWithValue }) => {
    try {
      const { data } = await getMessagesAPI(chatId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch messages'
      );
    }
  }
);

export const sendNewMessage = createAsyncThunk(
  'messages/send',
  async ({ chatId, content }, { rejectWithValue }) => {
    try {
      const { data } = await sendMessageAPI({ chatId, content });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);

export const removeMessage = createAsyncThunk(
  'messages/delete',
  async (messageId, { rejectWithValue }) => {
    try {
      await deleteMessageAPI(messageId);
      return messageId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete message'
      );
    }
  }
);

const initialState = {
  messages: [],
  loading: false,
  error: null,
  sending: false,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const exists = state.messages.find((m) => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const message = state.messages.find((m) => m._id === messageId);
      if (message) {
        message.status = status;
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Send message
    builder
      .addCase(sendNewMessage.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        state.sending = false;
        const exists = state.messages.find((m) => m._id === action.payload._id);
        if (!exists) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendNewMessage.rejected, (state) => {
        state.sending = false;
      });

    // Delete message
    builder
      .addCase(removeMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (m) => m._id !== action.payload
        );
      });
  },
});

export const { addMessage, updateMessageStatus, clearMessages } =
  messageSlice.actions;
export default messageSlice.reducer;
