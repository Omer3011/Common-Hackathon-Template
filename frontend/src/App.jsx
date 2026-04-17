import { useMemo, useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Navbar from "./components/layout/Navbar";

export default function App() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("smartCampusAuth");
    return stored ? JSON.parse(stored) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("smartCampusTheme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("smartCampusTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("smartCampusTheme", "light");
    }
  }, [darkMode]);

  const user = useMemo(() => auth, [auth]);

  const handleAuthSuccess = (data) => {
    localStorage.setItem("smartCampusAuth", JSON.stringify(data));
    setAuth(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("smartCampusAuth");
    setAuth(null);
  };

  if (!user?.token) {
    return <LoginPage onAuthSuccess={handleAuthSuccess} />;
  }

  const renderDashboard = () => {
    if (user.role === "admin") return <AdminDashboard />;
    if (user.role === "staff") return <StaffDashboard />;
    return <StudentDashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {renderDashboard()}
      </main>
    </div>
  );
}
