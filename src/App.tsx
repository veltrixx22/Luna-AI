import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import CyclePage from "./pages/Cycle";
import Symptoms from "./pages/Symptoms";
import AIChat from "./pages/AIChat";
import ProfilePage from "./pages/Profile";
import { User } from "./types";
import { Home, Calendar, PlusCircle, MessageSquare, User as UserIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Auth Context Mock/Sim ---
const AuthContext = React.createContext<{
  user: User | null;
  loading: boolean;
  checkUser: () => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  loading: true,
  checkUser: async () => {},
  logout: async () => {},
});

function AppWrapper() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkUser, logout }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

function AppRoutes() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luna-bg">
        <div className="w-12 h-12 border-4 border-luna-rose border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      
      {/* Protected Routes */}
      <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/cycle" element={user ? <CyclePage /> : <Navigate to="/login" />} />
        <Route path="/symptoms" element={user ? <Symptoms /> : <Navigate to="/login" />} />
        <Route path="/chat" element={user ? <AIChat /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Início", path: "/dashboard", activeColor: "text-luna-pink-deep" },
    { icon: Calendar, label: "Ciclo", path: "/cycle", activeColor: "text-luna-purple-light" },
    { icon: PlusCircle, label: "Sintomas", path: "/symptoms", activeColor: "text-luna-purple-light" },
    { icon: MessageSquare, label: "Luna AI", path: "/chat", activeColor: "text-luna-purple-light" },
    { icon: UserIcon, label: "Perfil", path: "/profile", activeColor: "text-luna-purple-light" },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64 flex flex-col">
      {/* Background Decorative Blobs */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-luna-pink-soft rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
      <div className="fixed top-1/2 -right-24 w-80 h-80 bg-luna-lilac-soft rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-white/60 backdrop-blur-xl border-r border-white/20 flex-col py-8 px-6 z-40">
        <div className="text-2xl font-brand mb-12 px-2">Luna AI</div>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                location.pathname === item.path 
                  ? "bg-white shadow-soft text-luna-purple-deep" 
                  : "text-gray-400 hover:bg-white/40"
              )}
            >
              <item.icon size={20} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 md:p-12 w-full flex-1">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cycle" element={<CyclePage />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-8 left-6 right-6 h-16 bg-white/80 backdrop-blur-2xl border border-luna-pink-soft rounded-full shadow-2xl flex items-center justify-around px-8 z-50">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              location.pathname === item.path ? item.activeColor : "text-luna-purple-light opacity-30"
            )}
          >
            <item.icon size={20} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default AppWrapper;
export { AuthContext };
