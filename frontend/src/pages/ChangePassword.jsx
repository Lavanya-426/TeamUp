import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword) {
      setError("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to change password");
        return;
      }

      //  SUCCESS FLOW
      setSuccess("Password changed successfully!");

      // clear fields
      setOldPassword("");
      setNewPassword("");

      // redirect after 1.5 sec
      setTimeout(() => {
        navigate("/dashboard"); // or "/" if your home is root
      }, 1500);
    } catch (err) {
      console.log(err);
      setError("Server error");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center mt-10">
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#9AC0CD]"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#9AC0CD]"
            />

            <button
              onClick={handleChangePassword}
              className="w-full bg-[#9AC0CD] text-white py-2 rounded hover:bg-[#7AA0A7]"
            >
              Update Password
            </button>
            {/*  Error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/*  Success */}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ChangePassword;
