import { useState, useEffect } from "react";
import axios from "axios";

import { useTasks } from "../context/TaskContext";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import RegisterUser from "../pages/RegisterUser";
import "./AdminDashboard.css";

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