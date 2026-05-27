import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [toast, setToast] = useState("");

  // STEP 1 → SEND OTP
  const sendOtp = async () => {
    // show toast first
    setToast("OTP sent to your email");

    // noticeable delay before OTP page
    setTimeout(() => {
      setStep(2);
    }, 2000);

    // hide toast after 3 sec
    setTimeout(() => {
      setToast("");
    }, 3000);

    try {
      const res = await fetch(
        "import.meta.env.VITE_API_URL/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!res.ok) {
        setToast(
          res.status == 400 ? "User already registered" : "Failed to send OTP",
        );

        // stay on same page
        setStep(1);

        setTimeout(() => {
          setToast("");
        }, 3000);

        return;
      }
    } catch (err) {
      setToast("Server error");

      setStep(1);

      setTimeout(() => {
        setToast("");
      }, 3000);
    }
  };

  // STEP 2 → VERIFY OTP
  const verifyOtp = async () => {
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

    const data = await res.json();

    if (!res.ok) {
      setToast(data.message || "Failed to verify OTP");

      setTimeout(() => {
        setToast("");
      }, 3000);

      return;
    }

    if (data.tempToken) {
      localStorage.setItem("tempToken", data.tempToken);

      navigate("/register");
    } else {
      setToast("Invalid OTP");

      setTimeout(() => {
        setToast("");
      }, 3000);
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
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />

            <button onClick={sendOtp} className="btn">
              Send OTP
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              className="input"
            />

            <button onClick={verifyOtp} className="btn">
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
