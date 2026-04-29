import { MessageCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserTeamCard({ team, onMessage }) {
  const navigate = useNavigate();

  const slotsLeft = team.max_members - team.current_members;

  return (
    <div
      className={`p-4 border rounded-lg mb-3 flex items-center justify-between transition
      ${
        team.hasNewMessages
          ? "bg-[#F3FAFC] border-blue-200"
          : "bg-gray-50 hover:shadow-sm"
      }`}
    >
      {/* LEFT */}
      <div className="space-y-1">
        <p className="text-lg font-semibold">{team.teamName}</p>

        <div className="flex items-center gap-2 text-xs mt-1">
          <span className="bg-gray-200 px-2 py-0.5 rounded-full">
            {team.type}
          </span>

          <span className="bg-gray-200 px-2 py-0.5 rounded-full">
            {slotsLeft > 0
              ? `${slotsLeft} spot${slotsLeft > 1 ? "s" : ""} left`
              : "Full"}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full ${
              team.role === "admin"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {team.role === "admin" ? "Admin" : "Member"}
          </span>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4">
        {/* CHAT */}
        <button
          onClick={() => onMessage?.(team)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500"
        >
          <MessageCircle size={20} />
          <span>Chat</span>

          {team.unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 rounded-full">
              {team.unreadCount}
            </span>
          )}
        </button>

        {/* VIEW TEAM */}
        <button
          onClick={() => navigate(`/team/${team._id}`)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500"
        >
          <Eye size={20} />
          <span>View</span>
        </button>
      </div>
    </div>
  );
}

export default UserTeamCard;
