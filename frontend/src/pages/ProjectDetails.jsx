import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // fetch project
    fetch(`http://localhost:5000/api/projects/${id}`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then(setProject);

    // fetch teams
    fetch(`http://localhost:5000/api/teams/${id}`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then(setTeams);
  }, [id]);

  const sendRequest = async (teamId) => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/requests/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        teamId,
        projectId: id,
      }),
    });

    const data = await res.json();
    alert(data.message);
  };

  if (!project) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="p-6">

        {/* PROJECT DETAILS */}
        <h2 className="text-2xl font-bold mb-4">
          {project.courseName}
        </h2>

        <p>Code: {project.courseCode}</p>
        <p>Semester: {project.semester}</p>
        <p>Faculty: {project.faculty}</p>

        {/* CREATE TEAM */}
        <button
          className="btn mt-4"
          onClick={async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/teams/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify({ projectId: id }),
            });

            const data = await res.json();
            alert(data.message);
          }}
        >
          Create Team
        </button>

        {/* TEAMS LIST */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Available Teams
        </h3>

        {teams.length === 0 && <p>No teams yet</p>}

        {teams.map((team) => (
          <div
            key={team._id}
            className="bg-white p-4 rounded shadow mb-3"
          >
            <p><b>Leader:</b> {team.leader.username}</p>
            <p><b>Members:</b> {team.members.length}</p>

            <button
              className="btn mt-2"
              onClick={() => sendRequest(team._id)}
            >
              Send Request
            </button>
          </div>
        ))}

      </div>
    </Layout>
  );
}

export default ProjectDetails;