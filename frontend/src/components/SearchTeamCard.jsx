import { useState } from "react";

function SearchTeamCard({ team, isPending, onRequestJoin }) {
  const [actionMsg, setActionMsg] = useState("");

  const handleClick = async () => {
    const result = await onRequestJoin?.(team);

    if (!result) return;

    // Set message based on action
    if (result === "requested") {
      setActionMsg("Request sent");
    } else if (result === "withdrawn") {
      setActionMsg("Request withdrawn");
    }

    // Auto clear after 3 sec
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

      {/* BUTTONS */}
      <div className="mt-2 flex gap-2">
        {!isPending && (
          <button
            onClick={handleClick}
            className="bg-[#9AC0CD] text-white px-3 py-1 rounded hover:bg-[#7AA0A7]"
          >
            Request to Join
          </button>
        )}

        {isPending && (
          <>
            <button
              disabled
              className="bg-gray-200 text-gray-600 px-3 py-1 rounded cursor-not-allowed"
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
      </div>
      {/* MESSAGE */}
      {actionMsg && (
        <p className="text-sm text-green-600 mt-1 text-center">{actionMsg}</p>
      )}
    </div>
  );
}

export default SearchTeamCard;
