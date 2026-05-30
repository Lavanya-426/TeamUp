import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    password: "",
    email: "",
    degree: "",
    school: "",
    branch: "",
    specialization: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (
      !form.name ||
      !form.password ||
      !form.email ||
      !form.specialization ||
      !form.degree ||
      !form.school ||
      !form.branch ||
      !form.year
    ) {
      return "Please fill all required fields";
    }

    // if (form.password.length < 6) {
    //   return "Password must be at least 6 characters";
    //}

    return null;
  };

  const handleSubmit = async () => {
    try {
      setError("");

      const validationError = validateForm();

      if (validationError) {
        setError(validationError);
        return;
      }

      const tempToken = localStorage.getItem("tempToken");

      if (!tempToken) {
        setError("Session expired. Please verify OTP again.");
        return;
      }

      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tempToken}`,
          },
          body: JSON.stringify(form),
        },
      );

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.removeItem("tempToken");

        navigate("/dashboard");
      } else {
        setError("Token missing from server response");
      }
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#B0E0E6]">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete Profile
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        <form autoComplete="off">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={form.name}
            className="input"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            autoComplete="new-email"
            value={form.email}
            className="input"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            autoComplete="new-password"
            value={form.password}
            className="input"
          />

          <input
            name="degree"
            placeholder="Degree"
            onChange={handleChange}
            value={form.degree}
            className="input"
          />

          <input
            name="school"
            placeholder="School"
            onChange={handleChange}
            value={form.school}
            className="input"
          />

          <input
            name="branch"
            placeholder="Branch"
            onChange={handleChange}
            value={form.branch}
            className="input"
          />

          <input
            name="specialization"
            placeholder="Specialization"
            onChange={handleChange}
            value={form.specialization}
            className="input"
          />

          <input
            name="year"
            placeholder="Year"
            onChange={handleChange}
            value={form.year}
            className="input"
          />
        </form>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`btn w-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
