import React from "react";
import { useNavigate } from "react-router-dom"; // If you are using React Router for navigation
import { IPost } from "../../types"; // Import your IPost type if necessary

interface PostListProps {
  posts: IPost[];
  totalCount: number;
  type: "saved" | "reported";
  showViewMoreButton?: boolean;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  totalCount,
  type,
  showViewMoreButton = true,
}) => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate(`/posts/${type}`);
  };

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
          {type === "saved" ? "🔖 Saved Posts" : "🚨 Reported Posts"} (
          {totalCount})
        </h3>
        {showViewMoreButton && (
          <button
            onClick={handleViewMore}
            className="text-blue-500 hover:text-blue-700 text-sm underline"
          >
            View All
          </button>
        )}
      </div>
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">No {type} posts found.</p>
        ) : (
          posts.map((post, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl !shadow-md border border-gray-300 hover:!shadow-lg transition p-5"
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
  );
};

export default PostList;
