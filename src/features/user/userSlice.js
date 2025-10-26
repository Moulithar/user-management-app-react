// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users?page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
    }
  }
);

// Create user (close modal only after resolved)
export const createUser = createAsyncThunk(
  'users/createUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/users', payload);
      // reqres echoes back created resource with id & createdAt
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create user');
    }
  }
);

// Optimistic update: update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      // reqres mock update
      const response = await api.put(`/users/${id}`, updates);
      return { id, updates, server: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update user');
    }
  }
);

// Optimistic delete: delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async ({ id }, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      per_page: 0,
      total: 0,
      total_pages: 0,
    },
    backup: null,
  },
  reducers: {
    clearUsers: (state) => {
      state.data = [];
      state.pagination = {
        page: 1,
        per_page: 0,
        total: 0,
        total_pages: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          total_pages: action.payload.total_pages,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateUser optimistic: apply on pending, clear on fulfilled, revert on rejected
      .addCase(updateUser.pending, (state, action) => {
        const { id, updates } = action.meta.arg;
        const idx = state.data.findIndex((u) => u.id === id);
        if (idx !== -1) {
          state.backup = { type: 'update', user: { ...state.data[idx] }, index: idx };
          state.data[idx] = { ...state.data[idx], ...updates };
        }
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.backup = null;
      })
      .addCase(updateUser.rejected, (state) => {
        if (state.backup?.type === 'update') {
          const { index, user } = state.backup;
          state.data[index] = user;
        }
        state.backup = null;
      })
      // deleteUser optimistic
      .addCase(deleteUser.pending, (state, action) => {
        const { id } = action.meta.arg;
        const idx = state.data.findIndex((u) => u.id === id);
        if (idx !== -1) {
          state.backup = { type: 'delete', user: state.data[idx], index: idx };
          state.data.splice(idx, 1);
          // adjust total counts optimistically
          if (state.pagination && typeof state.pagination.total === 'number') {
            state.pagination.total = Math.max(0, state.pagination.total - 1);
          }
        }
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.backup = null;
      })
      .addCase(deleteUser.rejected, (state) => {
        if (state.backup?.type === 'delete') {
          const { index, user } = state.backup;
          state.data.splice(index, 0, user);
          if (state.pagination && typeof state.pagination.total === 'number') {
            state.pagination.total += 1;
          }
        }
        state.backup = null;
      })
      // createUser: append/prepend new user on success
      .addCase(createUser.pending, (state) => {
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        const created = action.payload;
        const newUser = {
          id: created.id || Date.now(),
          email: created.email,
          first_name: created.first_name,
          last_name: created.last_name,
          avatar: created.avatar,
        };
        // Add to top for visibility
        state.data = [newUser, ...state.data];
        if (state.pagination && typeof state.pagination.total === 'number') {
          state.pagination.total += 1;
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create user';
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;