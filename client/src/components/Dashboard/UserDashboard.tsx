import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { IPost } from "../../types";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "../../store/reducers/globalLoader";

interface IRecentActivity {
  _id: string;
  title: string;
  link: string;
  action: "saved" | "reported" | "shared";
  source: string;
  createdAt: string;
}

function UserDashboard() {
  const [savedPosts, setSavedPosts] = useState<IPost[]>([]);
  const [reportedPosts, setReportedPosts] = useState<IPost[]>([]);
  const [recentActivities, setRecentActivities] = useState<IRecentActivity[]>(
    []
  );
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      try {
        dispatch(showGlobalLoader());
        const response = await axiosInstance.get("dashboard");
        setSavedPosts(response.data.saved);
        setReportedPosts(response.data.reported);
        setRecentActivities(response.data.recentActivities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        dispatch(hideGlobalLoader());
      }
    })();
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">🎯 My Dashboard</h2>

      {/* Credits Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg p-6 mb-8 max-w-sm">
        <h4 className="text-sm opacity-90">Total Credits</h4>
        <p className="text-3xl font-bold mt-1">{user?.credits ?? 0}</p>
      </div>

      {/* Saved Posts */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">🔖 Saved Posts</h3>
        <div className="grid gap-4">
          {savedPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No saved posts found.</p>
          ) : (
            savedPosts.map((post, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md border hover:shadow-lg transition p-5"
              >
                <h4 className="text-lg font-medium text-gray-800">{post.title}</h4>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline"
                >
                  View on {post.source}
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reported Posts */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">🚨 Reported Posts</h3>
        <div className="grid gap-4">
          {reportedPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No reported posts found.</p>
          ) : (
            reportedPosts.map((post, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md border hover:shadow-lg transition p-5"
              >
                <h4 className="text-lg font-medium text-gray-800">{post.title}</h4>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 text-sm hover:underline"
                >
                  View on {post.source}
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">🕒 Recent Activity</h3>
        <div className="bg-white rounded-2xl border shadow-md p-6">
          {recentActivities.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity found.</p>
          ) : (
            <ul className="space-y-4">
              {recentActivities.map((activity) => (
                <li
                  key={activity._id}
                  className="flex justify-between items-start border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {activity.action.toUpperCase()} - {activity.title}
                    </p>
                    <a
                      href={activity.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-xs hover:underline"
                    >
                      View on {activity.source}
                    </a>
                  </div>
                  <span className="text-gray-400 text-xs whitespace-nowrap">
                    {formatDate(activity.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
