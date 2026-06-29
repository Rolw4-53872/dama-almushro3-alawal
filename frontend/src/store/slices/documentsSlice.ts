import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { DocumentsState, Document } from '@types/index';
import axiosInstance from '@api/client';

const initialState: DocumentsState = {
  documents: [],
  selectedDocument: null,
  isLoading: false,
  error: null,
  totalDocuments: 0,
  currentPage: 1,
  pageSize: 10,
  uploadProgress: 0,
};

export const fetchDocuments = createAsyncThunk<
  { documents: Document[]; total: number },
  { page?: number; pageSize?: number },
  { rejectValue: string }
>(
  'documents/fetchDocuments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/documents', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل جلب الملفات');
    }
  }
);

export const uploadDocument = createAsyncThunk<
  Document,
  FormData,
  { rejectValue: string }
>(
  'documents/uploadDocument',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'فشل رفع الملف');
    }
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
      state.selectedDocument = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload.documents;
        state.totalDocuments = action.payload.total;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'فشل جلب الملفات';
      });

    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents.push(action.payload);
        state.totalDocuments += 1;
        state.uploadProgress = 100;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'فشل رفع الملف';
        state.uploadProgress = 0;
      });
  },
});

export const { clearError, setSelectedDocument, setUploadProgress } = documentsSlice.actions;
export default documentsSlice.reducer;
