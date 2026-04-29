import { useState } from "react";
import Layout from "../components/Layout";
import SearchTeamCard from "../components/SearchTeamCard";

function SearchTeam() {
  const [type, setType] = useState("");
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({});
  const [flag, setFlag] = useState(false);
  const [msg, setMsg] = useState("");
  // FETCH TEAMS
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
    let url = "http://localhost:5000/api/discover/teams";

    try {
      const res = await fetch(url, {
        method: "POST", // REQUIRED
        headers: {
          "Content-Type": "application/json", // REQUIRED
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          type,
        }), // THIS is your JSON
      });

      const data = await res.json();

      console.log("API RESPONSE:", data);

      if (!res.ok) {
        setMsg(data.message || "Error fetching teams");
        return;
      }
      if (res.status === 400) {
        setMsg(data.message || "Error");
      }
      if (res.status === 200) {
        setFlag(true);
        setMsg("");
      }
      setTeams(data.teams);
      if (data.teams.length === 0) {
        setForm({});
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };
  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Search Teams</h2>

        {/* TYPE SELECT */}
        <select
          className="w-full p-2 border mb-4"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setTeams([]);
            setFlag(false); // reset "no teams found"
            setMsg(""); // reset error message
          }}
        >
          <option value="">Select Type</option>
          <option value="COURSE">COURSE</option>
          <option value="ECS1">ECS1</option>
          <option value="ECS2">ECS2</option>
          <option value="SDP">SDP</option>
          <option value="CAPSTONE">CAPSTONE</option>
        </select>

        {/* SEARCH BUTTON */}
        {(type == "CAPSTONE" || type == "SDP") && (
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

        {/* DISPLAY TEAMS */}
        {Array.isArray(teams) && teams.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Available Teams</h3>

            {teams.map((team) => {
              const isPending = team.canRequest === "pending";

              return (
                <SearchTeamCard
                  key={team._id}
                  team={team}
                  isPending={isPending}
                  onRequestJoin={async (team) => {
                    const token = localStorage.getItem("token");

                    try {
                      let res;

                      if (!isPending) {
                        res = await fetch(
                          `http://localhost:5000/api/requests/${team._id}`,
                          {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}` },
                          },
                        );
                      } else {
                        res = await fetch(
                          `http://localhost:5000/api/requests/${team._id}`,
                          {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${token}` },
                          },
                        );
                      }

                      const data = await res.json();

                      if (!res.ok) {
                        alert(data.message || "Action failed");
                        return null;
                      }

                      // UPDATE UI
                      setTeams((prev) =>
                        prev.map((t) =>
                          t._id === team._id
                            ? {
                                ...t,
                                canRequest: isPending ? "none" : "pending",
                              }
                            : t,
                        ),
                      );

                      // RETURN ACTION TYPE (for message)
                      return isPending ? "withdrawn" : "requested";
                    } catch (err) {
                      console.log(err);
                      alert("Server error");
                    }
                  }}
                />
              );
            })}
          </div>
        )}

        {/* NO TEAMS FOUND */}
        {type && teams.length === 0 && flag && (
          <p className="mt-4 text-red-500 text-md">
            No teams found for this category. You can be the first one to create
            a team!
          </p>
        )}
        {msg && <p className="text-red-500">{msg}</p>}
      </div>
    </Layout>
  );
}

export default SearchTeam;
