import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import Tasks from './pages/Tasks';
import About from './pages/About';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/tasks" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/tasks" replace /> : <Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen overflow-hidden">
                {isAuthenticated && <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />}
                <div className="flex flex-col flex-1 overflow-hidden">
                  {isAuthenticated && <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />}
                  <main className="flex-1 overflow-y-auto scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/tasks" replace />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/about" element={<About />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
