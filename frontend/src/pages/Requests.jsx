import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import SearchTeamCard from "../components/SearchTeamCard";
import ReceivedRequestCard from "../components/ReceivedRequestCard";
import { useParams, useNavigate } from "react-router-dom";

function Requests() {
  const { type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!type) {
      navigate("/requests/sent");
    }
  }, [type]);

  const activeTab = type?.toLowerCase() === "received" ? "received" : "sent";
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  // FETCH DATA
  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");

      try {
        // SENT
        const sentRes = await fetch("http://localhost:5000/api/requests/sent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sentData = await sentRes.json();
        setSentRequests(sentData.requests || []);

        // RECEIVED
        const recRes = await fetch(
          "http://localhost:5000/api/requests/received",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const recData = await recRes.json();
        setReceivedRequests(recData.requests || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRequests();
  }, []);

  // SEND / WITHDRAW
  const handleRequestAction = async (team, requestId, status) => {
    const token = localStorage.getItem("token");

    try {
      const isPending = status === "pending";

      const res = await fetch(
        `http://localhost:5000/api/requests/${team._id}`,
        {
          method: isPending ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return null;
      }

      // UPDATE UI
      setSentRequests((prev) =>
        prev.map((r) =>
          r._id === requestId
            ? {
                ...r,
                status: isPending ? "withdrawn" : "pending",
              }
            : r,
        ),
      );

      return isPending ? "withdrawn" : "requested";
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  // ACCEPT / REJECT
  const handleReceivedAction = async (req, action) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/requests/${req.team_id._id}/${req._id}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) return;

      // REMOVE FROM UI
      setReceivedRequests((prev) => prev.filter((r) => r._id !== req._id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">
        {/* TABS */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => navigate("/requests/sent")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "sent"
                ? "border-b-2 border-[#9AC0CD] text-[#7AA0A7]"
                : "text-gray-500"
            }`}
          >
            Sent
          </button>

          <button
            onClick={() => navigate("/requests/received")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "received"
                ? "border-b-2 border-[#9AC0CD] text-[#7AA0A7]"
                : "text-gray-500"
            }`}
          >
            Received
          </button>
        </div>

        {/* SENT TAB */}
        {activeTab === "sent" && (
          <>
            {sentRequests.length === 0 && (
              <p className="text-gray-400 text-sm">No sent requests</p>
            )}

            {sentRequests.map((req) => {
              console.log(req); // safe now

              return (
                <SearchTeamCard
                  key={req._id}
                  team={req.team}
                  isPending={req.status === "pending"}
                  onRequestJoin={(team) =>
                    handleRequestAction(team, req._id, req.status)
                  }
                />
              );
            })}
          </>
        )}

        {/* RECEIVED TAB */}
        {activeTab === "received" && (
          <>
            {receivedRequests.length === 0 && (
              <p className="text-gray-400 text-sm">No received requests</p>
            )}

            {receivedRequests.map((req) => {
              console.log(req); // safe

              return (
                <ReceivedRequestCard
                  key={req._id}
                  request={req}
                  onAction={(action) => handleReceivedAction(req, action)}
                />
              );
            })}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Requests;
