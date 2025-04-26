// src/redux/slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState: { loading: boolean } = {
  loading: false,
};

const globalLoaderSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setGlobalLoader: (state, action) => {
      state.loading = action.payload;
    },
    showGlobalLoader: (state) => {
      state.loading = true;
    },
    hideGlobalLoader: (state) => {
      state.loading = false;
    },
  },
});

// Export actions and the reducer
export const { setGlobalLoader, showGlobalLoader, hideGlobalLoader } =
  globalLoaderSlice.actions;
export default globalLoaderSlice.reducer;
