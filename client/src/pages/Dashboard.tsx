import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import UserDashboard from "../components/Dashboard/UserDashboard";

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <>
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "user" && <UserDashboard />}
    </>
  );
};

export default Dashboard;
