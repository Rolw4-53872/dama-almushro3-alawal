import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  return { id: '1', email: 'user@example.com' };
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false, isLoading: false },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
  },
});

export default authSlice.reducer;
