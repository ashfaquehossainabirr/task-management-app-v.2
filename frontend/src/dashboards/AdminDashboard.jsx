import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { tasks } = useTasks();
  const { logout, user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <p>Welcome, {user.name}</p>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Open Modal Button */}
      <button className="add-task-btn" onClick={() => setShowModal(true)}>
        + Add Task
      </button>

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


      {/* Task List */}
      { tasks.length === 0 ? (
              <div className="no-task-box">
                <h3>📭 No assigned tasks</h3>
                <p>Please wait until admin assigns you a task.</p>
              </div>
            ) : tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

    </div>
  );
}