import { createPortal } from "react-dom";
import "./TaskDetailsModal.css";

export default function TaskDetailsModal({ task, closeModal }) {
  const getRemainingDays = (deadline) => {
    if (!deadline) return "No deadline";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(deadline);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "⏰ Due today";
    if (diffDays === 1) return "⏳ 1 day left";
    if (diffDays > 1) return `⏳ ${diffDays} days left`;

    return `⚠ Overdue by ${Math.abs(diffDays)} days`;
  };

  return createPortal(
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 style={{ 
            fontWeight: "bold", 
            padding: "10px 30px", 
            background: "#2563eb", 
            color: "#fff", 
            borderRadius: "6px" }             
            }>Task Details</h3>
          <button className="close-btn" onClick={closeModal}>
            ✕
          </button>
        </div>

        <div className="task-details">
          <p><strong>Title:</strong> {task.title}</p>
          <p><strong>Assigned To:</strong> {task.assignedTo}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <p><strong>Priority:</strong> {task.priority}</p>

          {task.deadline && (
            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(task.deadline).toLocaleDateString("en-GB")}
              <br />
              <span className="remaining-days" style={{ marginTop: "12px" }}>
                {getRemainingDays(task.deadline)}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}