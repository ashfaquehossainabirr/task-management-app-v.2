import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./EmployeeDashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart) {
    const { ctx, chartArea, data } = chart;
    if (!chartArea) return;

    const { left, right, top, bottom } = chartArea;

    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    const dataset = data.datasets[0];
    const total = dataset.data.reduce((a, b) => a + b, 0);
    const done = dataset.data[0];
    const percent = total ? Math.round((done / total) * 100) : 0;

    ctx.save();

    /* Percentage */
    ctx.font = "700 36px Inter";
    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${percent}%`, centerX, centerY - 8);

    /* Label */
    ctx.font = "500 14px Inter";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Completed", centerX, centerY + 18);

    ctx.restore();
  },
};

export default function EmployeeDashboard() {
  const { tasks } = useTasks();
  const { logout, user } = useAuth();

  const assignedTasks = tasks.filter(
    (task) => task.assignedTo === user.name
  );

  const todoTasks = assignedTasks.filter(
    (task) => task.status === "todo"
  );

  const inProgressTasks = assignedTasks.filter(
    (task) => task.status === "in-progress"
  );

  const doneTasks = assignedTasks.filter(
    (task) => task.status === "done"
  );

  const chartData = {
    labels: ["Done", "Pending"],
    datasets: [
      {
        data: [doneTasks.length, todoTasks.length + inProgressTasks.length],
        backgroundColor: ["#22c55e", "#f59e0b"],
        borderWidth: 4,
      },
    ],
  };

  const chartOptions = {
    cutout: "75%",
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Employee Dashboard</h2>
        <p>Welcome, {user.name}</p>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* ===== Chart + Task Section ===== */}
      <section className="employee-chart-layout">
        {/* LEFT: Doughnut Chart */}
        <div className="employee-chart">
          <h3>Task Progress</h3>
          <div className="chart-box">
            <Doughnut
              data={chartData}
              options={chartOptions}
              plugins={[centerTextPlugin]}
            />
          </div>
        </div>

        {/* RIGHT: Todo & In Progress */}
        <div className="employee-task-panel">
          <h3>Pending Tasks</h3>

          {[...todoTasks, ...inProgressTasks].length === 0 ? (
            <p className="empty-text">🎉 No pending tasks</p>
          ) : (
            <div className="employee-task-list">
              {[...todoTasks, ...inProgressTasks].map((task) => (
                <div key={task._id} className="employee-task-item">
                  <div>
                    <h4>{task.title}</h4>
                    <span className={`badge ${task.status}`}>
                      {task.status === "todo" ? "To-Do" : "In-Progress"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== All Tasks ===== */}
      {assignedTasks.length === 0 ? (
        <div className="no-task-box">
          <h3>📭 No assigned tasks</h3>
          <p>Please wait until admin assigns you a task.</p>
        </div>
      ) : (
        <div className="task-grid">
          {assignedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}