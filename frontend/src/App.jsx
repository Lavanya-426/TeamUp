import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import SelectProject from "./pages/SelectProject";
import CreateTeam from "./pages/CreateTeam";
import Register from "./pages/Register";
import SearchTeam from "./pages/SearchTeam";
import UserTeams from "./pages/UserTeams";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Requests from "./pages/Requests";
import AdminTeams from "./pages/AdminTeams";
import MemberTeams from "./pages/MemberTeams";
import Messages from "./pages/Messages";
import TeamInfo from "./pages/TeamInfo";
function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/select-project" element={<SelectProject />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/search-team" element={<SearchTeam />} />
        <Route path="/user-teams" element={<UserTeams />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        {/* default redirect */}
        <Route path="/requests" element={<Navigate to="/requests/sent" />} />

        {/* actual route with param */}
        <Route path="/requests/:type" element={<Requests />} />
        <Route path="/teams/admin" element={<AdminTeams />} />
        <Route path="teams/member" element={<MemberTeams />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/team/:teamId" element={<TeamInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
