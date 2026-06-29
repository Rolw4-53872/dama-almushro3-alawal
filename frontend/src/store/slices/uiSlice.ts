import { createSlice } from '@reduxjs/toolkit';
const uiSlice = createSlice({ name: 'ui', initialState: { theme: 'light' }, reducers: {} });
export default uiSlice.reducer;
