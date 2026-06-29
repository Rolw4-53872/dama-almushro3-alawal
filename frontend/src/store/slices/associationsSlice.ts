import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AssociationsState, Association } from '@types/index';
import axiosInstance from '@api/client';

const initialState: AssociationsState = {
  associations: [],
  selectedAssociation: null,
  isLoading: false,
  error: null,
  totalAssociations: 0,
  currentPage: 1,
  pageSize: 10,
};

export const fetchAssociations = createAsyncThunk<
  { associations: Association[]; total: number },
  { page?: number; pageSize?: number },
  { rejectValue: string }
>(
  'associations/fetchAssociations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/associations', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل جلب الجمعيات');
    }
  }
);

const associationsSlice = createSlice({
  name: 'associations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedAssociation: (state, action: PayloadAction<Association | null>) => {
      state.selectedAssociation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssociations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssociations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.associations = action.payload.associations;
        state.totalAssociations = action.payload.total;
      })
      .addCase(fetchAssociations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'فشل جلب الجمعيات';
      });
  },
});

export const { clearError, setSelectedAssociation } = associationsSlice.actions;
export default associationsSlice.reducer;
