import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log("Error fetching user");
      }
    };

    fetchUser();
  }, []);

  //  EARLY RETURN (prevents crash)
  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center mt-10 text-gray-400">
          Loading profile...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center mt-10">
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
          {/* HEADER */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-[#9AC0CD] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
              {user.name?.[0]}
            </div>

            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          {/* ACADEMIC INFO */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Academic Info
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {user.degree && (
                <div>
                  <p className="text-gray-500">Degree</p>
                  <p>{user.degree}</p>
                </div>
              )}

              {user.year && (
                <div>
                  <p className="text-gray-500">Year</p>
                  <p>{user.year}</p>
                </div>
              )}

              {user.branch && (
                <div>
                  <p className="text-gray-500">Branch</p>
                  <p>{user.branch}</p>
                </div>
              )}

              {user.specialization && (
                <div>
                  <p className="text-gray-500">Specialization</p>
                  <p>{user.specialization}</p>
                </div>
              )}
            </div>
          </div>

          {/* INSTITUTION */}
          {user.school && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">
                School
              </h3>
              <p className="text-sm">{user.school}</p>
            </div>
          )}

          {/* FOOTER */}
          <div className="text-xs text-gray-400 mb-4 border-t pt-3">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/change-password")}
              className="bg-[#9AC0CD] text-white px-2 py-2 rounded hover:bg-[#7AA0A7]"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
