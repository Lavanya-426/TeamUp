import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import { useNavigate } from "react-router-dom";
import UserTeamCard from "../../components/teamcards/UserTeamCard";

const UserTeams = () => {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  // navigate to chat
  const handleMessage = (team) => {
    navigate(`/chat/${team._id}`, {
      state: { teamName: team.teamName },
    });
  };

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem("token");
      let url = `${import.meta.env.VITE_API_URL}/api/teams/`;

      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("API RESPONSE:", data);

        if (!res.ok) {
          alert(data.message || "Error fetching teams");
          return;
        }

        setTeams(data.teams);
      } catch (err) {
        console.log(err);
        alert("Server error");
      }
    };

    fetchTeams();
  }, []);

  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">
        {/* DISPLAY TEAMS */}
        {Array.isArray(teams) && teams.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Your Teams</h3>

            {teams.map((team) => (
              <UserTeamCard
                key={team._id}
                team={team}
                buttonText="Message"
                onMessage={handleMessage} //  PASS FUNCTION
              />
            ))}
          </div>
        )}

        {/* NO TEAMS FOUND */}
        {teams.length === 0 && (
          <p className="mt-4 text-gray-500 text-sm">
            Not a part of any team yet.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default UserTeams;
