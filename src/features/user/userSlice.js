import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUsers as fetchUsersService,
  createUser as createUserService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from "../../services/userService";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page = 1, { rejectWithValue }) => {
    const response = await fetchUsersService(page);
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload, { rejectWithValue }) => {
    const response = await createUserService(payload);
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, updates }, { rejectWithValue }) => {
    const response = await updateUserService(id, updates);
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return { id, updates, server: response.data };
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async ({ id }, { rejectWithValue }) => {
    const response = await deleteUserService(id);
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return { id };
  }
);

const userSlice = createSlice({
  name: "users",
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
      //***********************************
      //  fetchUsers
      //***********************************

      //-pending
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      //-fulfilled
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
      //-rejected
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //***********************************
      //  updateUser
      //***********************************
      //-pending
      .addCase(updateUser.pending, (state, action) => {
        const { id, updates } = action.meta.arg;
        const idx = state.data.findIndex((u) => u.id === id);
        if (idx !== -1) {
          state.backup = {
            type: "update",
            user: { ...state.data[idx] },
            index: idx,
          };
          state.data[idx] = { ...state.data[idx], ...updates };
        }
      })
      //-fulfilled
      .addCase(updateUser.fulfilled, (state) => {
        state.backup = null;
      })
      //-rejected
      .addCase(updateUser.rejected, (state) => {
        if (state.backup?.type === "update") {
          const { index, user } = state.backup;
          state.data[index] = user;
        }
        state.backup = null;
      })

      //***********************************
      //  deleteUser
      //***********************************
      //-pending
      .addCase(deleteUser.pending, (state, action) => {
        const { id } = action.meta.arg;
        const idx = state.data.findIndex((u) => u.id === id);
        if (idx !== -1) {
          state.backup = { type: "delete", user: state.data[idx], index: idx };
          state.data.splice(idx, 1);
          // adjust total counts optimistically
          if (state.pagination && typeof state.pagination.total === "number") {
            state.pagination.total = Math.max(0, state.pagination.total - 1);
          }
        }
      })
      //-fulfilled
      .addCase(deleteUser.fulfilled, (state) => {
        state.backup = null;
      })
      //-rejected
      .addCase(deleteUser.rejected, (state) => {
        if (state.backup?.type === "delete") {
          const { index, user } = state.backup;
          state.data.splice(index, 0, user);
          if (state.pagination && typeof state.pagination.total === "number") {
            state.pagination.total += 1;
          }
        }
        state.backup = null;
      })

      //***********************************
      //  createUser
      //***********************************
      //-pending
      .addCase(createUser.pending, (state) => {
        state.error = null;
      })
      //-fulfilled
      .addCase(createUser.fulfilled, (state, action) => {
        const created = action.payload;
        const newUser = {
          id: created.id || Date.now(),
          email: created.email,
          first_name: created.first_name,
          last_name: created.last_name,
          avatar: created.avatar,
        };
        state.data = [newUser, ...state.data];
        if (state.pagination && typeof state.pagination.total === "number") {
          state.pagination.total += 1;
        }
      })
      //-rejected
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload || "Failed to create user";
      });
  },
});

export const { clearUsers } = userSlice.actions;
export default userSlice.reducer;
