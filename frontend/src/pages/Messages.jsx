import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import Layout from "../components/Layout";
import UserTeamCard from "../components/UserTeamCard";

function Messages() {
  const [teams, setTeams] = useState([]);
  const [unreadTeams, setUnreadTeams] = useState([]);

  const navigate = useNavigate(); // ADD THIS

  // MOVE INSIDE COMPONENT
  const handleMessage = (team) => {
    navigate(`/chat/${team._id}`, {
      state: { teamName: team.teamName },
    });
  };

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/teams/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setTeams(data.teams || []);

      // FILTER ONLY UNREAD TEAMS
      const unread = (data.teams || []).filter((team) => team.hasNewMessages);

      setUnreadTeams(unread);
    };

    fetchTeams();
  }, []);

  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">
        <h2 className="font-bold mb-4">Unread Messages</h2>

        {/* NO UNREAD */}
        {unreadTeams.length === 0 && (
          <p className="text-gray-500 text-sm">No unread messages</p>
        )}

        {/* SHOW UNREAD TEAMS */}
        <div className="grid gap-4">
          {unreadTeams.map((team) => (
            <UserTeamCard
              key={team._id}
              team={team}
              onMessage={handleMessage}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Messages;
