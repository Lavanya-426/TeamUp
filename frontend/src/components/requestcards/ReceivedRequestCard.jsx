import { useState } from "react";

function ReceivedRequestCard({ request, onAction }) {
  const [loading, setLoading] = useState(false);

  const user = request.user_id;
  const team = request.team_id;

  const formatTimeAgo = (date) => {
    if (!date) return "Recently";

    const diff = Math.floor((new Date() - new Date(date)) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const handleAction = async (action) => {
    setLoading(true);
    await onAction(action);
    setLoading(false);
  };

  return (
    <div className="p-4 border-2 border-gray-200 rounded-xl mb-3 bg-white shadow-sm">
      {/* TEAM NAME */}
      <p className="text-sm text-gray-500 mb-1">
        Team:{" "}
        <span className="font-medium text-gray-700">
          {team?.teamName || "Unknown"}
        </span>
      </p>

      {/* USER NAME */}
      <p className="font-semibold text-gray-800 mb-1">
        {user?.name || "Unknown User"}
      </p>

      {/* REQUEST TIME */}
      <p className="text-xs text-gray-400 mb-1">
        Requested {formatTimeAgo(request.createdAt || request.requestedAt)}
      </p>

      {/* EMAIL */}
      <p className="text-xs text-gray-500 mb-3">{user?.email || "No email"}</p>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <button
          disabled={loading}
          onClick={() => handleAction("approve")}
          className="bg-[#9AC0CD] text-white px-3 py-1.5 rounded hover:bg-[#7AA0A7]"
        >
          Accept
        </button>

        <button
          disabled={loading}
          onClick={() => handleAction("reject")}
          className="border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default ReceivedRequestCard;
