import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { IPost, IRecentActivity, NotificationType } from "../../types";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "../../store/reducers/globalLoader";
import PostList from "./PostList";

function UserDashboard() {
  const [postData, setPostData] = useState<{
    savedPosts: IPost[];
    reportedPosts: IPost[];
    recentActivities: IRecentActivity[];
    totalSavedPostCount: number;
    totalReportedPostCount: number;
  }>({
    savedPosts: [],
    reportedPosts: [],
    recentActivities: [],
    totalReportedPostCount: 0,
    totalSavedPostCount: 0,
  });
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const {
    savedPosts,
    reportedPosts,
    recentActivities,
    totalSavedPostCount,
    totalReportedPostCount,
  } = postData;

  useEffect(() => {
    (async () => {
      try {
        dispatch(showGlobalLoader());
        const response = await axiosInstance.get("dashboard");
        setPostData(response.data);
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
    <div className="md:p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">🎯 My Dashboard</h2>

      {/* Credits Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl !shadow-lg p-6 mb-8 max-w-sm">
        <h4 className="text-sm opacity-90">Total Credits</h4>
        <p className="text-3xl font-bold mt-1">{user?.credits ?? 0}</p>
      </div>

      {/* Saved Posts */}
      <PostList
        posts={savedPosts}
        totalCount={totalSavedPostCount}
        type="saved"
      />

      {/* Reported Posts */}
      <PostList
        posts={reportedPosts}
        totalCount={totalReportedPostCount}
        type="reported"
      />

      {/* Recent Activities */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          🕒 Recent Activity
        </h3>
        <div className="bg-white rounded-2xl !shadow-md border border-gray-300 p-6">
          {recentActivities.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity found.</p>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg !shadow-sm hover:!shadow-md transition-all duration-300"
                >
                  <div className="flex items-center">
                    {/* Activity Icon */}
                    <div
                      className={`w-8 h-8 flex items-center justify-center shrink-0 rounded-full mr-2 ${
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
