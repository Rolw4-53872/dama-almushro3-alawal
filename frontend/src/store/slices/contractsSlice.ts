import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ContractsState, Contract } from '@types/index';
import axiosInstance from '@api/client';

const initialState: ContractsState = {
  contracts: [],
  selectedContract: null,
  isLoading: false,
  error: null,
  totalContracts: 0,
  currentPage: 1,
  pageSize: 10,
};

export const fetchContracts = createAsyncThunk<
  { contracts: Contract[]; total: number },
  { page?: number; pageSize?: number; status?: string },
  { rejectValue: string }
>(
  'contracts/fetchContracts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/contracts', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل جلب العقود');
    }
  }
);

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedContract: (state, action: PayloadAction<Contract | null>) => {
      state.selectedContract = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contracts = action.payload.contracts;
        state.totalContracts = action.payload.total;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'فشل جلب العقود';
      });
  },
});

export const { clearError, setSelectedContract } = contractsSlice.actions;
export default contractsSlice.reducer;
