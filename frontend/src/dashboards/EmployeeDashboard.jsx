import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";

export default function EmployeeDashboard() {
  const { tasks } = useTasks();
  const { logout, user } = useAuth();

  // Filter tasks assigned to logged-in employee
  const assignedTasks = tasks.filter(
    (task) => task.assignedTo === user.name
  );

  return (
    <div className="container">
      <div className="header">
        <h2>Employee Dashboard</h2>
        <p>Welcome, {user.name}</p>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* No tasks message */}
      {assignedTasks.length === 0 ? (
        <div className="no-task-box">
          <h3>📭 No assigned tasks</h3>
          <p>Please wait until admin assigns you a task.</p>
        </div>
      ) : (
        assignedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))
      )}
    </div>
  );
}