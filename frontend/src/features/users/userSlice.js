import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfileAPI, updateProfileAPI, searchUsersAPI, getUserByIdAPI } from '../../api/users.api';

// Thunks
export const fetchProfile = createAsyncThunk(
  'users/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getProfileAPI();
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'users/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await updateProfileAPI(profileData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

export const searchForUsers = createAsyncThunk(
  'users/search',
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await searchUsersAPI(query);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed'
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await getUserByIdAPI(userId);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'User not found'
      );
    }
  }
);

const initialState = {
  profile: null,
  searchResults: [],
  selectedUser: null,
  loading: false,
  searchLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update profile
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });

    // Search users
    builder
      .addCase(searchForUsers.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchForUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchForUsers.rejected, (state) => {
        state.searchLoading = false;
        state.searchResults = [];
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      });
  },
});

export const { clearSearchResults, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
