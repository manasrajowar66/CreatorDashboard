import { configureStore } from "@reduxjs/toolkit";
import globalLoaderReducer from "./reducers/globalLoader";
import userReducer from "./reducers/user";
import notificationReducer from "./reducers/notification";

const store = configureStore({
  reducer: {
    globalLoader: globalLoaderReducer,
    user: userReducer,
    notification: notificationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
