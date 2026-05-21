import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: "Please login to access that page" }}
      />
    );
  }

  return children;
}
