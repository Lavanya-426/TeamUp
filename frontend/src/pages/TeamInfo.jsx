import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Layout from "../components/Layout";

function TeamInfo() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const teamRes = await fetch(
          `http://localhost:5000/api/teams/${teamId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const teamData = await teamRes.json();
        setTeam(teamData.team);

        const memberRes = await fetch(
          `http://localhost:5000/api/teams/${teamId}/members`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const memberData = await memberRes.json();
        setMembers(memberData.members || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [teamId]);

  if (!team) return <Layout>Loading...</Layout>;

  const slotsLeft = team.max_members - team.current_members;

  return (
    <Layout>
      <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow space-y-6">
        {/* 🔹 HEADER WITH CHAT */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{team.teamName}</h1>

          <button
            onClick={() =>
              navigate(`/chat/${team._id}`, {
                state: { teamName: team.teamName },
              })
            }
            className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition"
          >
            <MessageCircle size={22} />
            <span className="text-sm hidden sm:inline">Chat</span>
          </button>
        </div>

        {/* 🔹 TAGS */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-gray-200 px-2 py-1 rounded-full">
            {team.scope}
          </span>

          <span
            className={`px-2 py-1 rounded-full ${
              team.urgency === "urgent"
                ? "bg-red-100 text-red-600"
                : team.urgency === "moderate"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
            }`}
          >
            {team.urgency}
          </span>

          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {team.status}
          </span>

          <span className="bg-gray-200 px-2 py-1 rounded-full">
            {slotsLeft > 0
              ? `${slotsLeft} spot${slotsLeft > 1 ? "s" : ""} left`
              : "Full"}
          </span>
        </div>

        {/* 🔹 DESCRIPTION */}
        {team.description && (
          <p className="text-sm text-gray-600">{team.description}</p>
        )}

        {/* 🔹 INFO GRID */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Members</p>
            <p>
              {team.current_members} / {team.max_members}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Deadline</p>
            <p>{new Date(team.deadline).toLocaleDateString()}</p>
          </div>

          <div>
            <p className="font-semibold text-gray-700">Created By</p>
            <p>{team.created_by?.name}</p>
          </div>
        </div>

        {/* 🔹 MEMBERS LIST */}
        <div>
          <p className="font-semibold text-gray-700 mb-2">Team Members</p>

          <div className="space-y-2">
            {members.length === 0 && (
              <p className="text-sm text-gray-500">No members found</p>
            )}

            {members.map((m, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
              >
                {/* NAME */}
                <span className="text-sm">{m.user_id?.name}</span>

                {/* ROLE */}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    m.role === "admin"
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {m.role === "admin" ? "Admin" : "Member"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default TeamInfo;
