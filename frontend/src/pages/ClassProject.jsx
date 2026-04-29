import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
function ClassProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    courseCode: "",
    courseName: "",
    semester: "",
    slot: "",
    faculty: "",
    type:"Class Project",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/projects/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(form),
});

if (!res.ok) {
  setMessage("Error adding project");
  return;
}

const data = await res.json();
setMessage(data.message);
};

  return (
    <Layout>
    <div className="min-h-screen bg-[#B0E0E6] flex flex-col items-center pt-10">

      <div className="bg-white p-6 rounded-xl shadow w-[400px]">

        <h2 className="text-xl font-bold mb-4">Add Class Project</h2>

        <input name="courseCode" placeholder="Course Code" onChange={handleChange} className="input" />
        <input name="courseName" placeholder="Course Name" onChange={handleChange} className="input" />
        <input name="semester" placeholder="Semester" onChange={handleChange} className="input" />
        <input name="slot" placeholder="Slot" onChange={handleChange} className="input" />
        <input name="faculty" placeholder="Faculty" onChange={handleChange} className="input" />

        <button onClick={handleSubmit} className="btn mt-3">
          Add Project
        </button>

        <p className="mt-3 text-center">{message}</p>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-sm text-blue-600"
        >
          ← Back to Dashboard
        </button>

      </div>
    </div>
    </Layout>
  );
}

export default ClassProject;