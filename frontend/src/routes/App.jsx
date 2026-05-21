import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Verify from "../pages/Verify";
import Dashboard from "../pages/Dashboard";
import SelectProject from "../pages/SelectProject";
import CreateTeam from "../pages/CreateTeam";
import Register from "../pages/Register";
import SearchTeam from "../pages/SearchTeam";
import UserTeams from "../pages/UserTeams";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";
import Requests from "../pages/Requests";
import AdminTeams from "../pages/AdminTeams";
import MemberTeams from "../pages/MemberTeams";
import Messages from "../pages/Messages";
import TeamInfo from "../pages/TeamInfo";

import ProtectedRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/select-project"
          element={
            <ProtectedRoute>
              <SelectProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-team"
          element={
            <ProtectedRoute>
              <CreateTeam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search-team"
          element={
            <ProtectedRoute>
              <SearchTeam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-teams"
          element={
            <ProtectedRoute>
              <UserTeams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* REQUESTS */}
        <Route path="/requests" element={<Navigate to="/requests/sent" />} />

        <Route
          path="/requests/:type"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />

        {/* TEAMS */}
        <Route
          path="/teams/admin"
          element={
            <ProtectedRoute>
              <AdminTeams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams/member"
          element={
            <ProtectedRoute>
              <MemberTeams />
            </ProtectedRoute>
          }
        />

        {/* MESSAGES */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        {/* TEAM INFO */}
        <Route
          path="/team/:teamId"
          element={
            <ProtectedRoute>
              <TeamInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
