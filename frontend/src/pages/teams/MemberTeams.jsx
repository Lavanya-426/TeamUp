import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTeamCard from "../../components/teamcards/UserTeamCard";
import Layout from "../../components/common/Layout";

function MemberTeams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  // MOVE INSIDE COMPONENT
  const handleMessage = (team) => {
    navigate(`/chat/${team._id}`, {
      state: { teamName: team.teamName },
    });
  };

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("import.meta.env.VITE_API_URL/api/teams/member", {
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
