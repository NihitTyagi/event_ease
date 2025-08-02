import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import jwt_decode from 'jwt-decode';

// Get token from localStorage
const token = JSON.parse(localStorage.getItem('token'));

// Decode token to get user info and check expiration
let user = null;
let isAdmin = false;
if (token) {
  const decodedToken = jwt_decode(token);
  // Note: A real app should also verify the token signature on the server
  if (decodedToken.exp * 1000 > Date.now()) {
    user = decodedToken.user;
    isAdmin = user.role === 'admin';
  }
}

const initialState = {
  user: user,
  token: token ? token : null,
  isAdmin: isAdmin,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Register user (async thunk)
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Login user (async thunk)
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // A reducer to reset the state back to initial values
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const decodedToken = jwt_decode(action.payload.token);
        state.user = decodedToken.user;
        state.token = action.payload.token;
        state.isAdmin = state.user.role === 'admin';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        state.isAdmin = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const decodedToken = jwt_decode(action.payload.token);
        state.user = decodedToken.user;
        state.token = action.payload.token;
        state.isAdmin = state.user.role === 'admin';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        state.isAdmin = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAdmin = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
