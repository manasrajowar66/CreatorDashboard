import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/reducers/user";
import { useEffect, useRef, useState } from "react";
import { CircleArrowLeftIcon, MenuSquare, Bell } from "lucide-react";
import Notifications from "../components/ui/Notifications";

const sideMenuItems = [
  {
    label: "📊 Dashboard",
    path: "/",
    hide_roles: [],
  },
  {
    label: "📰 News Feed",
    path: "/feed",
    hide_roles: ["admin"],
  },
  {
    label: "⚙️ Profile",
    path: "/profile",
    hide_roles: [],
  },
];

const MainLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveSideMenuItem = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Close notifications dropdown if click is outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement).id !== "bell-icon"
      ) {
        setIsNotificationsOpen(false); // Close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Top Navbar */}
      <header className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <MenuSquare
            className="block mr-[0.5rem] md:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <h1
            className="text-lg md:text-2xl font-extrabold text-indigo-600 cursor-pointer tracking-tight"
            onClick={() => navigate("/")}
          >
            Creator Dashboard
          </h1>
        </div>
        {user && (
          <div className="flex gap-4 text-sm text-gray-800 items-center">
            <span className="hidden md:block font-semibold bg-gray-100 px-3 py-1 rounded-full">
              👤 {user.full_name}
            </span>
            {!isAdmin && (
              <span className="hidden md:block text-green-600 bg-green-100 px-3 py-1 rounded-full">
                💰 Credits: {user.credits}
              </span>
            )}
            {/* Notification Icon */}
            <Bell
              id="bell-icon"
              className="cursor-pointer text-gray-700"
              onClick={(event) => {
                event.stopPropagation();
                setIsNotificationsOpen(!isNotificationsOpen);
              }}
            />
          </div>
        )}
      </header>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 h-0 overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white shadow-md border-r border-gray-200 p-6 md:flex flex-col gap-6 rounded-tr-3xl fixed left-0 top-0 z-20 h-full md:relative transition-transform ${
            isSidebarOpen ? "flex !translate-x-0" : "!-translate-x-64 md:!translate-x-0"
          }`}
        >
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <div className="block md:hidden">
              <CircleArrowLeftIcon
                className="cursor-pointer flex justify-self-end"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              />
            </div>
            {sideMenuItems
              .filter(
                (sideMenuItem) => !sideMenuItem.hide_roles.includes(user.role)
              )
              .map((sideMenuItem) => {
                return (
                  <Link
                    to={sideMenuItem.path}
                    key={sideMenuItem.label}
                    className={`text-gray-700 ${
                      isActiveSideMenuItem(sideMenuItem.path)
                        ? "bg-indigo-100 text-indigo-600"
                        : "hover:bg-indigo-100 hover:text-indigo-600"
                    } rounded-lg px-4 py-2 transition`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {sideMenuItem.label}
                  </Link>
                );
              })}
            <button
              onClick={() => dispatch(logout())}
              className="text-red-500 hover:bg-red-100 text-left rounded-lg px-4 py-2 transition"
            >
              🚪 Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-white rounded-tl-3xl shadow-inner bg-gradient-to-br from-blue-50 to-blue-100">
          {/* Notification Dropdown */}
          {isNotificationsOpen && (
            <div ref={notificationRef}>
              <Notifications />
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
