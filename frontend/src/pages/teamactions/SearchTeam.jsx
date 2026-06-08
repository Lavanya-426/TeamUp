import { useState } from "react";
import Layout from "../../components/common/Layout";
import TeamRequestCard from "../../components/teamcards/TeamRequestCard";

function SearchTeam() {
  const [type, setType] = useState("");
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({});
  const [flag, setFlag] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSearch = async () => {
    const token = localStorage.getItem("token");

    setTeams([]);
    setFlag(false);
    setMsg("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/discover/teams`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            type,
          }),
        },
      );

      const data = await res.json();

      console.log("API RESPONSE:", data);

      if (!res.ok) {
        setMsg(data.message || "Error fetching teams");
        return;
      }

      setTeams(data.teams || []);
      setFlag(true);
      setMsg("");

      if ((data.teams || []).length === 0) {
        setForm({});
      }
    } catch (err) {
      console.log(err);
      setMsg("Unable to connect to server");
    }
  };

  const handleRequestAction = async (team, status) => {
    const token = localStorage.getItem("token");

    try {
      const isPending = status === "pending";

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/requests/${team._id}`,
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

      setTeams((prev) =>
        prev.map((t) =>
          t._id === team._id
            ? {
                ...t,
                canRequest: isPending ? "withdrawn" : "pending",
              }
            : t,
        ),
      );

      return isPending ? "withdrawn" : "requested";
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Search Teams</h2>

        <select
          className="w-full p-2 border mb-4"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setTeams([]);
            setFlag(false);
            setMsg("");
          }}
        >
          <option value="">Select Type</option>
          <option value="COURSE">COURSE</option>
          <option value="ECS1">ECS1</option>
          <option value="ECS2">ECS2</option>
          <option value="SDP">SDP</option>
          <option value="CAPSTONE">CAPSTONE</option>
        </select>

        {(type === "CAPSTONE" || type === "SDP") && (
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={form.specialization || ""}
            onChange={handleChange}
            className="input"
          />
        )}

        {type === "COURSE" && (
          <>
            <input
              type="text"
              name="course.course_code"
              placeholder="Course Code"
              value={form.course?.course_code || ""}
              onChange={handleChange}
              className="input"
            />

            <input
              type="text"
              name="course.slot"
              placeholder="Slot"
              value={form.course?.slot || ""}
              onChange={handleChange}
              className="input"
            />

            <input
              type="text"
              name="course.teacher"
              placeholder="Teacher"
              value={form.course?.teacher || ""}
              onChange={handleChange}
              className="input"
            />
          </>
        )}

        {type && (
          <button
            onClick={handleSearch}
            className="w-full bg-[#9AC0CD] text-white py-2 rounded hover:bg-[#7AA0A7]"
          >
            Search Teams
          </button>
        )}

        {teams.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Available Teams</h3>

            {teams.map((team) => (
              <TeamRequestCard
                key={team._id}
                team={team}
                status={team.canRequest}
                onRequestJoin={(selectedTeam) =>
                  handleRequestAction(selectedTeam, team.canRequest)
                }
              />
            ))}
          </div>
        )}

        {type && teams.length === 0 && flag && (
          <p className="mt-4 text-red-500 text-md">
            No teams found for this category. You can be the first one to create
            a team!
          </p>
        )}

        {msg && <p className="mt-4 text-red-500">{msg}</p>}
      </div>
    </Layout>
  );
}

export default SearchTeam;
