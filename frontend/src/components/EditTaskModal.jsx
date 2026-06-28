import { useState } from "react";
import { createPortal } from "react-dom";
import { useTasks } from "../context/TaskContext";
import toast from "react-hot-toast";

export default function EditTaskModal({ task, closeModal }) {
  const { updateTask } = useTasks();

  const [form, setForm] = useState({
    _id: task._id,
    title: task.title,
    assignedTo: task.assignedTo,
    status: task.status,
    priority: task.priority,
    deadline: task.deadline
      ? task.deadline.split("T")[0]
      : "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await updateTask(form);

      toast.success("Task updated successfully ✨");

      closeModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update task ❌"
      );
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Edit Task</h3>
          <button className="close-btn" onClick={closeModal}>
            ✕
          </button>
        </div>

        <form className="task-form" onSubmit={submit}>
          <label>Title</label>
          <input
            value={form.title}
            required
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <label>Assigned to</label>
          <input
            value={form.assignedTo}
            required
            onChange={(e) =>
              setForm({ ...form, assignedTo: e.target.value })
            }
          />

          <label>Priority</label>
          <select
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="todo">To-Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <label>Deadline</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) =>
              setForm({ ...form, deadline: e.target.value })
            }
          />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}