import { useState } from "react";

function TeamRequestCard({ team, status, onRequestJoin }) {
  const [actionMsg, setActionMsg] = useState("");

  const handleClick = async () => {
    const result = await onRequestJoin?.(team);

    if (!result) return;

    if (result === "requested") {
      setActionMsg("Request sent");
    } else if (result === "withdrawn") {
      setActionMsg("Request withdrawn");
    }

    setTimeout(() => {
      setActionMsg("");
    }, 3000);
  };

  return (
    <div className="p-3 border rounded mb-2 bg-gray-50">
      <p>
        <b>Name:</b> {team.teamName}
      </p>

      <p>
        <b>Members:</b> {team.current_members}
      </p>

      <p>
        <b>Urgency:</b> {team.urgency}
      </p>

      <p>
        <b>Status:</b> <span className="capitalize font-medium">{status}</span>
      </p>

      <div className="mt-2 flex gap-2 flex-wrap">
        {status === "pending" && (
          <>
            <button
              disabled
              className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded"
            >
              Pending
            </button>

            <button
              onClick={handleClick}
              className="border border-[#9AC0CD] text-[#7AA0A7] px-3 py-1 rounded hover:bg-[#EEF6F8]"
            >
              Withdraw Request
            </button>
          </>
        )}

        {status === "accepted" && (
          <button
            disabled
            className="bg-green-100 text-green-700 px-3 py-1 rounded"
          >
            Accepted
          </button>
        )}

        {status === "rejected" && (
          <button
            disabled
            className="bg-red-100 text-red-700 px-3 py-1 rounded"
          >
            Rejected
          </button>
        )}

        {status === "withdrawn" && (
          <button
            disabled
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
          >
            Withdrawn
          </button>
        )}
      </div>

      {actionMsg && (
        <p className="text-sm text-green-600 mt-1 text-center">{actionMsg}</p>
      )}
    </div>
  );
}

export default TeamRequestCard;
