import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { IPost, IRecentActivity, NotificationType } from "../../types";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "../../store/reducers/globalLoader";

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
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          🔖 Saved Posts
        </h3>
        <div className="grid gap-4">
          {savedPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No saved posts found.</p>
          ) : (
            savedPosts.map((post, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md border hover:shadow-lg transition p-5"
              >
                <h4 className="text-lg font-medium text-gray-800">
                  {post.title}
                </h4>
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
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          🚨 Reported Posts
        </h3>
        <div className="grid gap-4">
          {reportedPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No reported posts found.</p>
          ) : (
            reportedPosts.map((post, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md border hover:shadow-lg transition p-5"
              >
                <h4 className="text-lg font-medium text-gray-800">
                  {post.title}
                </h4>
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
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          🕒 Recent Activity
        </h3>
        <div className="bg-white rounded-2xl shadow-md border p-6">
          {recentActivities.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity found.</p>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center">
                    {/* Activity Icon */}
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 ${
                        {
                          [NotificationType.POST_SAVE]: "bg-green-500",
                          [NotificationType.POST_REPORT]: "bg-red-500",
                          [NotificationType.POST_SHARE]: "bg-blue-500",
                          [NotificationType.LOGIN]: "bg-gray-500",
                          [NotificationType.PROFILE_UPDATED]: "bg-yellow-500",
                          [NotificationType.CREDITS_REDEEMED]: "bg-purple-500", // Example color
                          [NotificationType.CREDITS_ADDED]: "bg-teal-500", // Example color
                          [NotificationType.FEED_INTERACTION]: "bg-indigo-500", // Example color
                          [NotificationType.PASSWORD_CHANGED]: "bg-orange-500", // Example color
                          [NotificationType.PROFILE_COMPLETE]: "bg-pink-500", // Example color
                          [NotificationType.REGISTER]: "bg-amber-400",
                        }[activity.type] || "bg-gray-400"
                      }`}
                    >
                      <span className="text-white font-semibold">
                        {activity.type[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {activity.message}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(activity.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
