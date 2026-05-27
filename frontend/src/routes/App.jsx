import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Home from "../pages/dashboard/Home";
import Verify from "../pages/auth/Verify";
import Dashboard from "../pages/dashboard/Dashboard";
import SelectProject from "../pages/project/SelectProject";
import CreateTeam from "../pages/teamactions/CreateTeam";
import Register from "../pages/auth/Register";
import SearchTeam from "../pages/teamactions/SearchTeam";
import UserTeams from "../pages/teams/UserTeams";
import Chat from "../pages/chat/Chat";
import Profile from "../pages/profile/Profile";
import ChangePassword from "../pages/auth/ChangePassword";
import Requests from "../pages/requests/Requests";
import AdminTeams from "../pages/teams/AdminTeams";
import MemberTeams from "../pages/teams/MemberTeams";
import Messages from "../pages/chat/Messages";
import TeamInfo from "../pages/teamactions/TeamInfo";

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
