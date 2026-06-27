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

    /* =======================
       Main Percentage
    ======================= */
    ctx.font = "700 40px Inter";
    ctx.fillStyle = "#111827";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${percent}%`, centerX, centerY - 8);

    /* =======================
       Subtitle
    ======================= */
    ctx.font = "500 14px Inter";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Completed", centerX, centerY + 18);

    /* =======================
       Total Tasks
    ======================= */
    ctx.font = "400 12px Inter";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(`Total: ${total}`, centerX, centerY + 36);

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
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

  const pendingTaskList = tasks.filter(
    (task) => task.status === "todo" || task.status === "in-progress"
  );

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

  // ===============================
  // Employee-wise Task Breakdown
  // ===============================
  const employeeTaskMap = tasks.reduce((acc, task) => {
    const employee = task.assignedTo || "Unassigned";

    if (!acc[employee]) {
      acc[employee] = {
        todo: 0,
        inProgress: 0,
        done: 0,
      };
    }

    if (task.status === "todo") acc[employee].todo += 1;
    if (task.status === "in-progress") acc[employee].inProgress += 1;
    if (task.status === "done") acc[employee].done += 1;

    return acc;
  }, {});

  const employees = [
    ...new Set(tasks.map(task => task.assignedTo).filter(Boolean))
  ];

  const employeeTasks = selectedEmployee
    ? tasks.filter(task => task.assignedTo === selectedEmployee)
    : [];

  return (
    <div className="container">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <p>Welcome, {user.name}</p>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <section className="dashboard-section">
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
      </section>

      <section className="dashboard-section">
        <div className="chart-task-layout">

          {/* LEFT: Doughnut Chart */}
          <div className="chart-container">
            <h3>Task Completion</h3>

            <div className="chart-wrapper">
              <Doughnut
                data={taskChartData}
                options={chartOptions}
                plugins={[centerTextPlugin]}
              />
            </div>
          </div>

          {/* RIGHT: Pending Tasks */}
          <div className="pending-task-panel">
            <h3>Pending Tasks</h3>

            {pendingTaskList.length === 0 ? (
              <p className="empty-text">🎉 No pending tasks</p>
            ) : (
              <div className="pending-task-list">
                {pendingTaskList.map((task) => (
                  <div key={task._id} className="pending-task-item">
                    <div>
                      <h4>{task.title}</h4>
                      <span className={`badge ${task.status}`}>
                        {task.status === "todo" ? "To-Do" : "In-Progress"}
                      </span>
                    </div>

                    <span className={`priority ${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      <section className="dashboard-section">
        <div className="employee-breakdown">
          <h3>Employee-wise Task Breakdown</h3>

          {Object.keys(employeeTaskMap).length === 0 ? (
            <p className="empty-text">No task data available</p>
          ) : (
            <div className="employee-grid">
              {Object.entries(employeeTaskMap).map(
                ([employee, stats]) => (
                  <div key={employee} className="employee-card">
                    <h4>👤 {employee}</h4>

                    <div className="employee-stats">
                      <span className="todo">
                        To-Do: <b>{stats.todo}</b>
                      </span>

                      <span className="in-progress">
                        In-Progress: <b>{stats.inProgress}</b>
                      </span>

                      <span className="done">
                        Done: <b>{stats.done}</b>
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-section">
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
      </section>

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

      <div className="employee-panel">
        <h3>Employees</h3>

        <div className="employee-list">
          {employees.map(emp => (
            <button
              key={emp}
              className={`employee-btn ${selectedEmployee === emp ? "active" : ""}`}
              onClick={() => setSelectedEmployee(emp)}
            >
              👤 {emp}
            </button>
          ))}
        </div>
      </div>

      <section className="dashboard-section">
        {selectedEmployee ? (
          <>
            <h3 style={{ marginBottom: "16px" }}>Tasks for {selectedEmployee}</h3>

            {employeeTasks.length === 0 ? (
              <p className="empty-text">No tasks assigned</p>
            ) : (
              <div className="task-grid">
                {employeeTasks.map(task => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="no-task-box">
            <p className="empty-text">👆 Click an employee to view tasks</p>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h3 style={{ marginTop: "24px", marginBottom: "16px" }}>All Tasks</h3>

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
      </section>

    </div>
  );
}