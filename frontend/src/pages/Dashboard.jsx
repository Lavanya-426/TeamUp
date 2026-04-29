import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Dashboard() {
  const navigate = useNavigate();
  const options = ["Create Team", "Join Team", "Your Projects"];
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    options.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, i * 300);
    });
  }, []);

  // ✅ HANDLE NAVIGATION CLEANLY
  const handleClick = (index) => {
    if (index === 0) {
      navigate("/create-team");
    } else if (index === 1) {
      navigate("/search-team");
    } else if (index === 2) {
      navigate("/user-teams");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#B0E0E6] flex flex-col items-center pt-24">

        <h2 className="text-2xl font-bold mb-6">
          Welcome to TeamUp
        </h2>

        <div className="flex flex-col gap-4">
          {options.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`w-64 p-4 bg-white rounded-xl shadow cursor-pointer transition-all text-center
              ${visible.includes(index)
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"}`}
            >
              {item}
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;