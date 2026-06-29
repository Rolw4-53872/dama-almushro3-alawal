import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import grantsReducer from './slices/grantsSlice';
import associationsReducer from './slices/associationsSlice';
import documentsReducer from './slices/documentsSlice';
import contractsReducer from './slices/contractsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    grants: grantsReducer,
    associations: associationsReducer,
    documents: documentsReducer,
    contracts: contractsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['ui/addNotification'],
        ignoredActionPaths: ['payload.timestamp'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
