import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  country?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://symvii.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      debugger;
      return data.user;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    country: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://symvii.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Signup failed');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://symvii.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Logout failed');
      }

      return null;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: {
    name: string;
    phone: string;
    country: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://symvii.com/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Profile update failed');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://symvii.com/api/auth/session', {
        credentials: 'include',
      });

      if (!response.ok) {
        return rejectWithValue('Session invalid');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // UpdateProfile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CheckSession cases
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkSession.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
