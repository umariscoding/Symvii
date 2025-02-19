import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  currentLanguage: string;
}

// Safe localStorage check for SSR
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
};

const initialState: LanguageState = {
  currentLanguage: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
    initializeLanguage: (state) => {
      if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
          state.currentLanguage = savedLanguage;
        }
      }
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer; 