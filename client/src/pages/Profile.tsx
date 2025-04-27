import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";

function Profile() {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  if (!user) return <div>Loading...</div>;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex justify-center items-center min-h-[80dvh] md:bg-gray-50 p-4 rounded-2xl">
      <div className="max-w-md w-full bg-white rounded-2xl !shadow-lg p-6 relative">
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 text-blue-600 w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
            {user.full_name.charAt(0)}
          </div>

          <h2 className="text-2xl font-bold mb-1">{user.full_name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
              Role: {user.role}
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-semibold rounded-full">
              Credits: {user.credits}
            </span>
            <span
              className={`px-3 py-1 ${
                user.profileCompleted
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              } text-xs font-semibold rounded-full`}
            >
              {user.profileCompleted ? "Profile Completed" : "Incomplete Profile"}
            </span>
          </div>
        </div>

        <div className="mt-6 border-t pt-4 text-sm text-gray-600">
          <p className="flex justify-between">
            <span>Account Created:</span>
            <span>{formatDate(user.createdAt)}</span>
          </p>
        </div>

        <button className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 text-sm underline flex items-center gap-2" onClick={()=> navigate("edit")}>
          <Edit2 size={16} /> Edit
        </button>
      </div>
    </div>
  );
}

export default Profile;
