import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (!decoded.exp || decoded.exp <= now) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace state={{ message: "Session expired. Login again." }} />;
    }
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/" replace state={{ message: "Invalid session. Login again." }} />;
  }

  return children;
}