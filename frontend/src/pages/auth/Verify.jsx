import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  // STEP 1 → SEND OTP
  const sendOtp = async () => {
    try {
      if (!email) {
        showToast("Please enter email");
        return;
      }

      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        showToast(data.message || "Failed to send OTP");
        return;
      }

      showToast("OTP sent to your email");

      setTimeout(() => {
        setStep(2);
      }, 1000);
    } catch (err) {
      console.error(err);

      showToast("Server error");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 → VERIFY OTP
  const verifyOtp = async () => {
    try {
      if (!otp) {
        showToast("Please enter OTP");
        return;
      }

      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        },
      );

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        showToast(data.message || "Failed to verify OTP");
        return;
      }

      if (!data.tempToken) {
        showToast("Invalid OTP");
        return;
      }

      localStorage.setItem("tempToken", data.tempToken);

      showToast("OTP verified");

      setTimeout(() => {
        navigate("/register");
      }, 1000);
    } catch (err) {
      console.error(err);

      showToast("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#B0E0E6]">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow w-[350px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 ? "Enter your email" : "Drop the OTP"}
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className={`btn w-full ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className={`btn w-full ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
