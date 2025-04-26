import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types";

interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}

const initialState: UserState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      }
      state.loading = false;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
    },
    authError: (state)=>{
      localStorage.removeItem("token");
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
    }
  },
});

// Export actions and the reducer
export const { setUser, logout, authError } = userSlice.actions;
export default userSlice.reducer;
