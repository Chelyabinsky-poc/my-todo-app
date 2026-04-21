import { configureStore } from '@reduxjs/toolkit';
import todoReducer, { localStorageMiddleware } from './features/todoSlice';

export const store = configureStore({
  reducer: {
    todo: todoReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware)
});