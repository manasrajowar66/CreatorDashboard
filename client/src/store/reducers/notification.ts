import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { INotification } from "../../types";
import { hideGlobalLoader, showGlobalLoader } from "./globalLoader";
import axiosInstance, {
  CustomAxiosRequestConfig,
} from "../../utils/axiosInstance";

interface NotificationState {
  notifications: INotification[];
  loading: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
};

export const getNotifications = createAsyncThunk<void>(
  "user/getNotifications",
  async (_, { dispatch }) => {
    dispatch(showGlobalLoader());
    try {
      const response = await axiosInstance.get("notification", {
        showSuccessToast: false,
      } as CustomAxiosRequestConfig);
      dispatch(setNotification(response.data.notifications));
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      dispatch(hideGlobalLoader());
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Add a new notification
    setNotification: (state, action) => {
      state.notifications = action.payload;
    },

    // Add a new notification
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },

    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Remove a specific notification
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification !== action.payload
      );
    },
  },
});

// Export actions and the reducer
export const {
  addNotification,
  clearNotifications,
  setLoading,
  removeNotification,
  setNotification,
} = notificationSlice.actions;
export default notificationSlice.reducer;
