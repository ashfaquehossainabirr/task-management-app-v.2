import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import "./TaskCard.css";

export default function TaskCard({ task }) {
  const { updateTaskStatus, deleteTask } = useTasks();
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  const canEdit = user.role === "admin" || user.role === "manager";

  return (
    <div className="task-card">
      <h4>{task.title}</h4>

      {user.role !== "employee" && (
        <p className="assigned-to">
          <strong>Assigned to:</strong> {task.assignedTo}
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

      {/* Admin + Manager only */}
      {canEdit && (
        <div className="task-actions">
          <button className="edit-btn" onClick={() => setShowEdit(true)}>
            Edit
          </button>

          <button
            className="logout-btn"
            onClick={() => {
              if (window.confirm("Delete this task?")) {
                deleteTask(task._id);
              }
            }}
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
    </div>
  );
}