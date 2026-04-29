import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 200);
  }, []);

  return (
    <div className="min-h-screen bg-[#B0E0E6]">
      {/* TOP BAR */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow">
        {/* LEFT */}
        <h1 className="text-xl font-bold">TeamUp</h1>

        {/* RIGHT */}
        <div className="flex gap-6">
          <button
            onClick={() => navigate("/login")}
            className="border px-4 py-1 rounded hover:bg-[#B0E0E6] hover:text-white transition"
          >
            Log in
          </button>

          <button
            onClick={() => navigate("/verify")}
            className="border px-4 py-1 rounded hover:bg-[#B0E0E6] hover:text-white transition"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex items-center justify-center h-[80vh] overflow-hidden">
        <h1
          className={`text-6xl white font-extrabold transition-all duration-1000
          ${show ? "translate-y-0 opacity-100" : "translate-y-40 opacity-0"}`}
        >
          TeamUp
        </h1>
      </div>
    </div>
  );
}

export default Home;
