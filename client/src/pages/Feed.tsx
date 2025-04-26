import { useEffect, useState } from "react";
import { IFeed } from "../types";
import axiosInstance, { CustomAxiosRequestConfig } from "../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import {
  hideGlobalLoader,
  showGlobalLoader,
} from "../store/reducers/globalLoader";
import { Check, Copy, Flag, Save } from "lucide-react";

function Feed() {
  const [feed, setFeed] = useState<IFeed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      try {
        dispatch(showGlobalLoader());
        const response = await axiosInstance.get("/feed", {
          showSuccessToast: false,
        } as CustomAxiosRequestConfig);
        setFeed(response.data.data);
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
        dispatch(hideGlobalLoader());
      }
    })();
  }, [dispatch]);

  const handleAction = async (
    post: IFeed,
    action: "save" | "report" | "share",
    showToast?: boolean
  ) => {
    if (showToast === undefined) showToast = true;
    try {
      if (showToast) dispatch(showGlobalLoader());
      await axiosInstance.post(`post/${action}`, post, {
        showSuccessToast: showToast,
      } as CustomAxiosRequestConfig);
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
    } finally {
      if (showToast) dispatch(hideGlobalLoader());
    }
  };

  const handleShare = async (post: IFeed, index: number) => {
    try {
      await navigator.clipboard.writeText(post.link);
      handleAction(post, "share", false);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">📢 Explore Feed</h2>

      {loading ? (
        <div className="text-gray-600 text-sm">Loading feed...</div>
      ) : feed.length === 0 ? (
        <div className="text-gray-500 text-sm">No posts available.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {feed.map((post, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-5 border hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.01]"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {post.title}
              </h3>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline break-words"
              >
                View on {post.source}
                {post.subreddit ? ` (r/${post.subreddit})` : ""}
              </a>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => handleAction(post, "save")}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition"
                >
                  <Save size={16} /> Save
                </button>

                <button
                  onClick={() => handleAction(post, "report")}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
                >
                  <Flag size={16} /> Report
                </button>

                <button
                  onClick={() => handleShare(post, idx)}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check size={16} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Share
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;
