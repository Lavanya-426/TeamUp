import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // STEP 1 → SEND OTP
  const sendOtp = async () => {
    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
     if (!res.ok) {
      alert(res.status==400 ? "User already registered" : "Failed to send OTP. Please try again.");
      return;
    }
    const data =  await res.json();
    if (data.message) {
      setStep(2);
    }
  };

  // STEP 2 → VERIFY OTP
  const verifyOtp = async () => {
    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to verify OTP. Please try again.");
      return;
    }
    console.log(data);
    if (data.tempToken) {
      localStorage.setItem("tempToken", data.tempToken);
      navigate("/register");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#B0E0E6]">

      <div className="bg-white p-8 rounded-xl shadow w-[350px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign Up
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              placeholder="Enter Email"
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