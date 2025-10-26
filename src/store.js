// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/userSlice';
import userUiReducer from './features/user/userUiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    userUi: userUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});