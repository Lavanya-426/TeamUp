import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import UserTeamCard from "../components/UserTeamCard";
import Layout from "../components/Layout";

function MemberTeams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate(); // ✅ ADD THIS

  // ✅ MOVE INSIDE COMPONENT
  const handleMessage = (team) => {
    navigate(`/chat/${team._id}`, {
      state: { teamName: team.teamName },
    });
  };

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/teams/member", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTeams(data.teams || []);
    };

    fetchTeams();
  }, []);

  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">Member Teams</h1>

        {teams.length === 0 && (
          <p className="text-gray-500 text-sm">No teams found</p>
        )}

        <div className="grid gap-4">
          {teams.map((team) => (
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

export default MemberTeams;
