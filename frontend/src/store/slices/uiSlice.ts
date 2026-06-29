import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState, Notification } from '@types/index';

const initialState: UIState = {
  isLoading: false,
  error: null,
  success: null,
  notification: null,
  sidebarOpen: true,
  theme: 'light',
  language: 'ar',
};

let notificationId = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>
    ) => {
      state.notification = {
        id: `notif-${++notificationId}`,
        ...action.payload,
        timestamp: Date.now(),
      };
    },
    removeNotification: (state) => {
      state.notification = null;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setLanguage: (state, action: PayloadAction<'ar' | 'en'>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  clearError,
  clearSuccess,
  addNotification,
  removeNotification,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLanguage,
} = uiSlice.actions;

export default uiSlice.reducer;
