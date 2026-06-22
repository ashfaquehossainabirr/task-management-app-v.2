import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const { tasks } = useTasks();
  const { logout, user } = useAuth();

  // Filter tasks assigned to logged-in employee
  const assignedTasks = tasks.filter(
    (task) => task.assignedTo === user.name
  );

  const totalTasks = assignedTasks.length;

  const todoTasks = assignedTasks.filter(
    (task) => task.status === "todo"
  ).length;

  const inProgressTasks = assignedTasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const doneTasks = assignedTasks.filter(
    (task) => task.status === "done"
  ).length;

  return (
    <div className="container">
      <div className="header">
        <h2>Employee Dashboard</h2>
        <p>Welcome, {user.name}</p>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>

        <div className="stat-card">
          <h3>To-Do</h3>
          <p>{todoTasks}</p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{inProgressTasks}</p>
        </div>

        <div className="stat-card">
          <h3>Done</h3>
          <p>{doneTasks}</p>
        </div>
      </div>

      {/* No tasks message */}
      {assignedTasks.length === 0 ? (
        <div className="no-task-box">
          <h3>📭 No assigned tasks</h3>
          <p>Please wait until admin assigns you a task.</p>
        </div>) : (<div className="task-grid">
                    {assignedTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>)
      }
    </div>
  );
}