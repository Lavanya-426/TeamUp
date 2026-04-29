import { useState, useEffect } from "react";
import { Menu, Home, MessageCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      setUser(data.name);
    };

    fetchUser();
  }, []);

  // 🔹 FETCH UNREAD TEAM COUNT (for 💬 icon)
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/teams/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();

        // ✅ COUNT TEAMS WITH UNREAD MESSAGES
        const teamUnreadCount = data.teams.filter(
          (team) => team.hasNewMessages,
        ).length;

        setUnreadCount(teamUnreadCount);
      } catch (err) {
        console.log("Error fetching unread");
      }
    };

    fetchUnread();
  }, [location.pathname]); // 🔁 refresh when route changes

  return (
    <div className="min-h-screen bg-[#B0E0E6]">
      {/* 🔹 HEADER */}
      <div className="bg-white flex justify-between items-center px-6 py-4 shadow fixed top-0 left-0 w-full z-50">
        <div className="flex items-center gap-4">
          <Menu onClick={() => setOpen(!open)} className="cursor-pointer" />
          <h1 className="font-bold text-xl">TeamUp</h1>
        </div>

        <div className="flex gap-6 text-gray-700 items-center">
          {/* HOME */}
          <Home
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer hover:text-blue-500"
          />

          {/* 💬 MESSAGES WITH BADGE */}
          <div className="relative">
            <MessageCircle
              onClick={() => navigate("/messages")}
              className="cursor-pointer hover:text-blue-500"
            />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {/* USER */}
          <div className="relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <User />
              <span className="text-sm font-medium">
                {user ? user : "Loading..."}
              </span>
            </div>

            {/* DROPDOWN */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-md border text-sm z-50">
                <div
                  onClick={() => {
                    socket.disconnect();
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                >
                  Log out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow p-4 pt-20 transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* YOUR TEAMS */}
        <div className="mb-6">
          <h2 className="font-bold mb-3">Your Teams</h2>

          <div
            onClick={() => navigate("/teams/admin")}
            className="px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded font-medium"
          >
            Admin Teams
          </div>

          <div
            onClick={() => navigate("/teams/member")}
            className="px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded font-medium mt-2"
          >
            Member Teams
          </div>

          <div
            onClick={() => navigate("/user-teams")}
            className="px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded font-medium mt-2"
          >
            All Teams
          </div>
        </div>

        {/* ACCOUNT */}
        <div>
          <h2 className="font-bold mb-3">Account</h2>

          <div
            onClick={() => navigate("/profile")}
            className="px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
          >
            Profile
          </div>

          <div
            onClick={() => navigate("/requests/sent")}
            className="px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
          >
            Requests
          </div>

          <div
            onClick={() => {
              socket.disconnect();
              localStorage.clear();
              navigate("/login");
            }}
            className="px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded text-red-500"
          >
            Log out
          </div>
        </div>
      </div>

      {/* 🔹 MAIN CONTENT */}
      <div
        className={`pt-20 transition-all duration-300 ${
          open ? "ml-64" : "ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;
