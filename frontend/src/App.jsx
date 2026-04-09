import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Attendance from "./pages/Attendance.jsx";
import Reports from "./pages/Reports.jsx";
import api from "./api/client.js";

function LoginCard({ onLogin }) {
  const [email, setEmail] = useState("admin@school.edu");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } catch {
      setError("Login failed. Check backend and credentials.");
    }
  }

  return (
    <div className="login-card">
      <h1>Student Tracking System</h1>
      <p>Sign in to continue.</p>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button type="submit">Login</button>
      </form>
      {error && <small className="error">{error}</small>}
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  function handleLogin(nextUser) {
    setUser(nextUser);
    navigate("/");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }

  if (!user) {
    return <LoginCard onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <aside>
        <h2>STS</h2>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/students">Students</Link>
          <Link to="/attendance">Attendance</Link>
          <Link to="/reports">Reports</Link>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}
