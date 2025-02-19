import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './features/themeSlice';
import authReducer from './features/authSlice';
import languageReducer from './features/languageSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 