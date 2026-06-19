import { AuthProvider, useAuth } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import EmployeeDashboard from "./dashboards/EmployeeDashboard";
import Login from "./pages/Login";

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return user.role === "admin"
    ? <AdminDashboard />
    : <EmployeeDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
}