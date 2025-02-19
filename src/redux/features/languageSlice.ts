import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  currentLanguage: string;
}

const initialState: LanguageState = {
  currentLanguage: localStorage.getItem('language') || 'en',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
      localStorage.setItem('language', action.payload);
    },
    initializeLanguage: (state) => {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        state.currentLanguage = savedLanguage;
      }
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer; 