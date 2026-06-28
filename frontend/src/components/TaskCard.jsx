import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";
import EditTaskModal from "./EditTaskModal";
import ConfirmModal from "./ConfirmModal";
import "./TaskCard.css";

export default function TaskCard({ task }) {
  const { updateTaskStatus, deleteTask } = useTasks();
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "done";

  const canEdit = user.role === "admin" || user.role === "manager";

  return (
    <div className="task-card">
      <h4>{task.title}</h4>

      {user.role !== "employee" && (
        <p className="assigned-to">
          <strong>Assigned to:</strong> {task.assignedTo}
        </p>
      )}

      {task.deadline && (
        <p className="task-deadline">
          <strong>Deadline:</strong>{" "}
          {new Date(task.deadline).toLocaleDateString()}
        </p>
      )}

      <p className={`status-${task.status}`}>
        <strong>Status:</strong>{" "}
        {user.role === "employee" ? (
          <select
            value={task.status}
            onChange={(e) =>
              updateTaskStatus(task._id, e.target.value)
            }
          >
            <option value="todo">To-Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        ) : (
          task.status
        )}
      </p>
      
      <p className={`priority-${task.priority}`}>
        Priority: {task.priority}
      </p>

      {isOverdue && (
        <span className="overdue-badge">⚠ Overdue</span>
      )}

      {/* Admin + Manager only */}
      {canEdit && (
        <div className="task-actions">
          <button className="edit-btn" onClick={() => setShowEdit(true)}>
            Edit
          </button>

          <button
            className="logout-btn"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </button>
        </div>
      )}

      {showEdit && (
        <EditTaskModal
          task={task}
          closeModal={() => setShowEdit(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Task?"
          message={`Are you sure you want to delete "${task.title}"?`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={async () => {
            try {
              await deleteTask(task._id);
              toast.success("Task deleted successfully 🗑️");
            } catch (err) {
              toast.error("Failed to delete task ❌");
            } finally {
              setShowDeleteConfirm(false);
            }
          }}
        />
      )}
    </div>
  );
}