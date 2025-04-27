import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Notifications = () => {
  const notifications = useSelector(
    (state: RootState) => state.notification.notifications
  );

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
    <div className="absolute right-[1rem] top-[0.5rem] w-80 max-h-[20rem] overflow-y-auto z-10 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification, index) => (
            <li
              key={index}
              className="flex flex-col bg-blue-50 p-3 rounded-md shadow-sm transition-all hover:bg-blue-100 hover:shadow-md"
            >
              <div className="font-medium text-sm text-gray-700">
                {notification.message}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDate(notification.timestamp)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
