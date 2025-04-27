import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import GlobalLoader from "./components/ui/GlobalLoader";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useEffect } from "react";
import axiosInstance, { CustomAxiosRequestConfig } from "./utils/axiosInstance";
import { logout, setUser, updateCredits } from "./store/reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "./store/reducers/globalLoader";
import PrivateRoute from "./routing/PrivateRoute";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import {
  addNotification,
  getNotifications,
} from "./store/reducers/notification";
import { useSocket } from "./hooks/useSocket";
import { INotification } from "./types";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?._id;

  const { socket } = useSocket({
    url: import.meta.env.VITE_SOCKET_URL,
    listeners: {
      newNotification: (notification: INotification) => {
        dispatch(addNotification(notification));
      },
      updateCredit: (newCredit) => {
        dispatch(updateCredits(newCredit));
      },
    },
  });

  useEffect(() => {
    (async () => {
      try {
        dispatch(showGlobalLoader());
        const response = await axiosInstance.get("auth/auth-check", {
          showSuccessToast: false,
        } as CustomAxiosRequestConfig);
        dispatch(setUser(response.data));
        dispatch(
          getNotifications()
        );
      } catch (error) {
        dispatch(logout());
        console.error("Error during auth check:", error);
      } finally {
        dispatch(hideGlobalLoader());
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if(socket && userId){
      socket.emit("register-user", userId);
    }
  }, [userId, socket]);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
            </Route>
          </Route>
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route element={<MainLayout />}>
              <Route path="/feed" element={<Feed />} />
            </Route>
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
      <ToastContainer position="top-center" />
      <GlobalLoader />
    </>
  );
}

export default App;
