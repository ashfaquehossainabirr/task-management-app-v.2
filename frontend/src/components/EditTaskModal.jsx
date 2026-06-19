import { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function EditTaskModal({ task, closeModal }) {
  const { updateTask } = useTasks();

  const [form, setForm] = useState({
    _id: task._id,
    title: task.title,
    assignedTo: task.assignedTo,
    status: task.status,
    priority: task.priority,
  });

  const submit = async (e) => {
    e.preventDefault();

    await updateTask(form);
    closeModal();
  };

  return (
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
          <label>Title:</label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <label>Assigned to:</label>
          <input
            value={form.assignedTo}
            onChange={(e) =>
              setForm({ ...form, assignedTo: e.target.value })
            }
            required
          />

          <label>Priority:</label>
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

          <label>Status:</label>
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

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}