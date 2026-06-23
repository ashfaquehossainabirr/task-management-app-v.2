import { useState, useEffect } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import { useTasks } from "../context/TaskContext";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import RegisterUser from "../pages/RegisterUser";
import "./AdminDashboard.css";

const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    const { ctx, width, height } = chart;

    ctx.save();

    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
    const done = chart.data.datasets[0].data[0];
    const percent = total ? Math.round((done / total) * 100) : 0;

    // Main percentage
    ctx.font = "700 40px Inter";
    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${percent}%`, width / 2, height / 2 - 10);

    // Sub text
    ctx.font = "500 14px Inter";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Completed", width / 2, height / 2 + 22);

    // Small total text
    ctx.font = "400 12px Inter";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(`Total: ${total}`, width / 2, height / 2 + 45);

    ctx.restore();
  },
};

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const { tasks } = useTasks();
  const { logout, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const usersRes = await axios.get(
          "https://task-management-app-v-2.onrender.com/api/stats/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const tasksRes = await axios.get(
          "https://task-management-app-v-2.onrender.com/api/stats/tasks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserCount(usersRes.data.count);
        setTaskCount(tasksRes.data.count);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
  }, []);

  const todoCount = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const doneCount = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const doneTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "done"
  ).length;

  const taskChartData = {
    labels: ["Done Tasks", "Pending Tasks"],
    datasets: [
      {
        label: "Tasks",
        data: [doneTasks, pendingTasks],

        backgroundColor: ["#22c55e", "#f59e0b"],
        borderColor: ["#ffffff"],

        borderWidth: 4,
        hoverOffset: 18,
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    cutout: "75%",

    layout: {
      padding: 10,
    },

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          color: "#374151",
          font: {
            size: 13,
            weight: "600",
          },
        },
      },

      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#fff",
        bodyColor: "#e2e8f0",
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
      },
    },

    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <p>Welcome, {user.name}</p>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{userCount}</p>
        </div>

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p>{taskCount}</p>
        </div>

        <div className="stat-card todo">
          <h3>To-Do Tasks</h3>
          <p>{todoCount}</p>
        </div>

        <div className="stat-card in-progress">
          <h3>In-Progress Tasks</h3>
          <p>{inProgressCount}</p>
        </div>

        <div className="stat-card done">
          <h3>Done Tasks</h3>
          <p>{doneCount}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Task Completion</h3>
        <Doughnut
          data={taskChartData}
          options={chartOptions}
          plugins={[centerTextPlugin]}
        />
      </div>

      {/* Open Modal Button */}
      <button className="add-task-btn" onClick={() => setShowModal(true)}>
        + Add Task
      </button>

      {user.role === "manager" && (
        <button
          className="add-task-btn"
          style={{ marginLeft: "10px" }}
          onClick={() => setShowRegister(true)}
        >
          + Create User
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Create New Task</h3>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <TaskForm closeModal={() => setShowModal(false)} />
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create User</h3>
              <button className="close-btn" onClick={() => setShowRegister(false)}>
                ✕
              </button>
            </div>

            <RegisterUser closeModal={() => setShowRegister(false)} />
          </div>
        </div>
      )}


      {/* Task List */}
      { tasks.length === 0 ? (
              <div className="no-task-box">
                <h3>📭 No assigned tasks</h3>
                <p>Please wait until admin assigns you a task.</p>
              </div>
            ) : <div className="task-grid">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
        }

    </div>
  );
}