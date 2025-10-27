import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  viewMode: 'table',
  isCreateOpen: false,
  isEditOpen: false,
  editingUser: null,
};

const userUiSlice = createSlice({
  name: 'userUi',
  initialState,
  reducers: {
    setViewMode(state, action) {
      state.viewMode = action.payload; // 'table' | 'grid'
    },
    openCreate(state) {
      state.isCreateOpen = true;
    },
    closeCreate(state) {
      state.isCreateOpen = false;
    },
    openEdit(state, action) {
      state.isEditOpen = true;
      state.editingUser = action.payload || null; 
    },
    closeEdit(state) {
      state.isEditOpen = false;
      state.editingUser = null;
    },
    setEditingUser(state, action) {
      state.editingUser = action.payload;
    },
    resetUi(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setViewMode,
  openCreate,
  closeCreate,
  openEdit,
  closeEdit,
  setEditingUser,
  resetUi,
} = userUiSlice.actions;

export default userUiSlice.reducer;
