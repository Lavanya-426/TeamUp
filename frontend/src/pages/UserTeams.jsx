import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom"; //  ADD THIS
import UserTeamCard from "../components/UserTeamCard"; //  your card

const UserTeams = () => {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate(); // ADD THIS

  // navigate to chat
  const handleMessage = (team) => {
    navigate(`/chat/${team._id}`, {
      state: { teamName: team.teamName },
    });
  };

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem("token");
      let url = "http://localhost:5000/api/teams/";
      
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
