import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Analytics from "./pages/Analytics";
import Bookmarks from "./pages/Bookmarks";
import CompanySheets from "./pages/CompanySheets";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import PatternDetail from "./pages/PatternDetail";
import Patterns from "./pages/Patterns";
import Planner from "./pages/Planner";
import ProblemDetail from "./pages/ProblemDetail";
import Problems from "./pages/Problems";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Revision from "./pages/Revision";

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center text-slate-300">Loading...</div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppLayout = ({ children }) => {
  return (
    <NotificationProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 fade-enter">{children}</main>
      </div>
    </NotificationProvider>
  );
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/problems"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Problems />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company-sheets"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CompanySheets />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/problems/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProblemDetail />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/revision"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Revision />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patterns"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Patterns />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patterns/:patternName"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PatternDetail />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookmarks"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Bookmarks />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Analytics />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Planner />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Leaderboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
