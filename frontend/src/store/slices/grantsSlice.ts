import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { GrantsState, Grant, GrantRequest } from '@types/index';
import axiosInstance from '@api/client';

const initialState: GrantsState = {
  grants: [],
  grantRequests: [],
  selectedGrant: null,
  isLoading: false,
  error: null,
  totalGrants: 0,
  currentPage: 1,
  pageSize: 10,
};

export const fetchGrants = createAsyncThunk<
  { grants: Grant[]; total: number },
  { page?: number; pageSize?: number; status?: string },
  { rejectValue: string }
>(
  'grants/fetchGrants',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/grants', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل جلب المنح');
    }
  }
);

const grantsSlice = createSlice({
  name: 'grants',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedGrant: (state, action: PayloadAction<Grant | null>) => {
      state.selectedGrant = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGrants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.grants = action.payload.grants;
        state.totalGrants = action.payload.total;
      })
      .addCase(fetchGrants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'فشل جلب المنح';
      });
  },
});

export const { clearError, setSelectedGrant } = grantsSlice.actions;
export default grantsSlice.reducer;
