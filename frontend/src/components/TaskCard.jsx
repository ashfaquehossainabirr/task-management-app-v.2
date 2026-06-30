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

  const getRemainingDays = (deadline) => {
    if (!deadline) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(deadline);
    due.setHours(0, 0, 0, 0);

    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "⏰ Due today";
    if (diffDays === 1) return "⏳ 1 day left";
    if (diffDays > 1) return `⏳ ${diffDays} days left`;

    return `⚠ Overdue by ${Math.abs(diffDays)} days`;
  };

  const getDeadlineUrgency = (deadline) => {
    if (!deadline) return "normal";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(deadline);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return "overdue";
    if (diffDays <= 1) return "urgent";
    if (diffDays < 3) return "warning";

    return "normal";
  };

  return (
    <div className={`task-card ${getDeadlineUrgency(task.deadline)}`}>
      <h4>{task.title}</h4>

      {user.role !== "employee" && (
        <p className="assigned-to">
          <strong>Assigned to:</strong> {task.assignedTo}
        </p>
      )}

      {task.deadline && (
        <p className="task-deadline">
          <strong>Deadline:</strong>{" "}
          {new Date(task.deadline).toLocaleDateString("en-GB")}
          <br />
          <span className="remaining-days">
            {getRemainingDays(task.deadline)}
          </span>
        </p>
      )}

      <p className={`status-${task.status}`} style={{ marginRight: "4px" }}>
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
      
      <p className={`priority-${task.priority}`} style={{ marginRight: "4px" }}>
        Priority: {task.priority}
      </p>

      {isOverdue && (
        <span className="overdue-badge" style={{ marginRight: "4px" }}>⚠ Overdue</span>
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