import { useState } from "react";
import Layout from "../../components/common/Layout";

function AddProject() {
  const [type, setType] = useState("");
  const [form, setForm] = useState({});

  // MESSAGE STATE
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Deadline validation
    if (name === "deadline") {
      const selectedDate = new Date(value);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setMessage("Deadline cannot be in the past");
        setIsError(true);

        setTimeout(() => setMessage(""), 3000);
        return;
      }
    }

    // NESTED OBJECT SUPPORT
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

  // SUBMIT
  const handleSubmit = async () => {
    // Deadline validation
    if (!form.deadline) {
      setMessage("Please select a deadline");
      setIsError(true);

      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(form.deadline);

    if (selectedDate < today) {
      setMessage("Deadline cannot be in the past");
      setIsError(true);

      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // COMMON VALIDATION
    if (
      !type ||
      !form.teamName ||
      !form.urgency ||
      !form.max_members ||
      !form.specialization ||
      !form.deadline
    ) {
      setMessage("Please fill all required fields");
      setIsError(true);

      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // COURSE VALIDATION
    if (
      type === "COURSE" &&
      (!form.course?.course_code || !form.course?.teacher || !form.course?.slot)
    ) {
      setMessage("Please fill all course details");
      setIsError(true);

      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const token = localStorage.getItem("token");
    const payload = { ...form, type };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teams/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // ERROR
      if (!res.ok) {
        setMessage(data.message || "Error creating team");
        setIsError(true);

        setTimeout(() => setMessage(""), 3000);
        return;
      }

      // SUCCESS
      setMessage("Team created successfully");
      setIsError(false);

      setTimeout(() => setMessage(""), 3000);

      // RESET FORM
      setForm({});
      setType("");
    } catch (err) {
      console.log(err);

      setMessage("Server error");
      setIsError(true);

      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Create Team</h2>

        {/* MESSAGE */}
        {message && (
          <p
            className={`mb-3 text-sm text-center px-3 py-2 rounded ${
              isError
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* TYPE SELECT */}
        <select
          className="w-full p-2 border mb-4"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setForm({});
          }}
        >
          <option value="">Select Type</option>
          <option value="COURSE">COURSE</option>
          <option value="ECS1">ECS1</option>
          <option value="ECS2">ECS2</option>
          <option value="SDP">SDP</option>
          <option value="CAPSTONE">CAPSTONE</option>
        </select>

        {/* COMMON FIELDS */}
        {type && (
          <>
            <input
              name="teamName"
              placeholder="Team Name"
              value={form.teamName || ""}
              onChange={handleChange}
              className="input"
            />

            {/* URGENCY */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Urgency</label>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value="mild"
                    checked={form.urgency === "mild"}
                    onChange={handleChange}
                  />
                  Mild
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value="moderate"
                    checked={form.urgency === "moderate"}
                    onChange={handleChange}
                  />
                  Moderate
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value="urgent"
                    checked={form.urgency === "urgent"}
                    onChange={handleChange}
                  />
                  Urgent
                </label>
              </div>
            </div>

            <input
              type="number"
              name="max_members"
              placeholder="Maximum members"
              min="1"
              value={form.max_members || ""}
              onChange={handleChange}
              className="input"
            />

            <input
              name="specialization"
              placeholder="Specialization"
              value={form.specialization || ""}
              onChange={handleChange}
              className="input"
            />

            <input
              name="description"
              placeholder="Description"
              value={form.description || ""}
              onChange={handleChange}
              className="input"
            />

            {/* DEADLINE */}
            <label className="block mb-2 font-medium">Deadline</label>

            <input
              type="date"
              name="deadline"
              value={form.deadline || ""}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="input"
            />
          </>
        )}

        {/* COURSE FIELDS */}
        {type === "COURSE" && (
          <>
            <input
              name="course.course_code"
              placeholder="Course Code"
              value={form.course?.course_code || ""}
              onChange={handleChange}
              className="input"
            />

            <input
              name="course.teacher"
              placeholder="Faculty"
              value={form.course?.teacher || ""}
              onChange={handleChange}
              className="input"
            />

            <input
              name="course.slot"
              placeholder="Slot"
              value={form.course?.slot || ""}
              onChange={handleChange}
              className="input"
            />
          </>
        )}

        {/* SUBMIT */}
        {type && (
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-[#9AC0CD] text-white py-2 rounded hover:bg-[#7AA0A7]"
          >
            Create Team
          </button>
        )}
      </div>
    </Layout>
  );
}

export default AddProject;
