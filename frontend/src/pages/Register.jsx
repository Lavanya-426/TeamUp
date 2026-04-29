import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    degree: "",
    school: "",
    branch: "",
    specialization: "",
    year: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const tempToken = localStorage.getItem("tempToken");

    console.log("TEMP TOKEN:", tempToken); // debug

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempToken}` // ✅ VERY IMPORTANT
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.removeItem("tempToken");
      console.log(data.token);
      navigate("/dashboard");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#B0E0E6]">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete Profile
        </h2>

        <input name="name" placeholder="Name" onChange={handleChange} className="input" />
        <input name="mobile" placeholder="Mobile" onChange={handleChange} className="input" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input" />
        <input name="degree" placeholder="Degree" onChange={handleChange} className="input" />
        <input name="school" placeholder="School" onChange={handleChange} className="input" />
        <input name="branch" placeholder="Branch" onChange={handleChange} className="input" />
        <input name="specialization" placeholder="Specialization" onChange={handleChange} className="input" />
        <input name="year" placeholder="Year" onChange={handleChange} className="input" />

        <button onClick={handleSubmit} className="btn">
          Register
        </button>

      </div>
    </div>
  );
}