import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { hideGlobalLoader, showGlobalLoader } from "../../store/reducers/globalLoader";

interface DashboardUser {
  userId: string;
  email: string;
  saved: number;
  reported: number;
  shared: number;
  role: string;
  credits: number;
}

function AdminDashboard() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalReported, setTotalReported] = useState(0);
  const [totalShared, setTotalShared] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        dispatch(showGlobalLoader());
        const response = await axiosInstance.get("dashboard");
        const {
          totalUsers,
          totalSaved,
          totalReported,
          userStats,
          totalShared,
        } = response.data;

        setUsers(userStats);
        setTotalUsers(totalUsers);
        setTotalSaved(totalSaved);
        setTotalReported(totalReported);
        setTotalShared(totalShared);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        dispatch(hideGlobalLoader());
      }
    })();
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Stat Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-2xl shadow-md hover:scale-105 transition-transform duration-300">
          <h4 className="text-sm uppercase opacity-80">Total Users</h4>
          <p className="text-3xl font-bold mt-2">{totalUsers}</p>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transition-transform duration-300">
          <h4 className="text-sm uppercase opacity-80">Total Saved</h4>
          <p className="text-3xl font-bold mt-2">{totalSaved}</p>
        </div>

        <div className="bg-gradient-to-r from-rose-400 to-rose-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transition-transform duration-300">
          <h4 className="text-sm uppercase opacity-80">Total Reported</h4>
          <p className="text-3xl font-bold mt-2">{totalReported}</p>
        </div>

        <div className="bg-gradient-to-r from-sky-400 to-blue-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transition-transform duration-300">
          <h4 className="text-sm uppercase opacity-80">Total Shared</h4>
          <p className="text-3xl font-bold mt-2">{totalShared}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md overflow-x-auto border border-gray-200">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
              <th className="p-4 text-sm font-semibold text-green-600">Saved</th>
              <th className="p-4 text-sm font-semibold text-rose-500">Reported</th>
              <th className="p-4 text-sm font-semibold text-blue-600">Credits</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="p-4 border-t text-gray-800">{user.email}</td>
                  <td className="p-4 border-t text-gray-700">{user.saved}</td>
                  <td className="p-4 border-t text-gray-700">{user.reported}</td>
                  <td className="p-4 border-t text-gray-700">{user.credits ?? "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No user data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
