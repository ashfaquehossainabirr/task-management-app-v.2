import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import toast from "react-hot-toast";

export default function TaskForm({ closeModal }) {
  const { addTask } = useTasks();

  const [form, setForm] = useState({
    title: "",
    assignedTo: "",
    status: "todo",
    priority: "medium",
    deadline: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await addTask(form);

      toast.success("Task added successfully ✅");

      setForm({
        title: "",
        assignedTo: "",
        status: "todo",
        priority: "medium",
      });

      closeModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create task ❌"
      );
    }
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <label>Title:</label>
      <input
        placeholder="Task title"
        value={form.title}
        required
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <label>Assign to:</label>
      <input
        placeholder="Assign to (exact username)"
        value={form.assignedTo}
        required
        onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
      />

      <label>Priority:</label>
      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <label>Deadline:</label>
      <input
        type="date"
        value={form.deadline}
        onChange={(e) =>
          setForm({ ...form, deadline: e.target.value })
        }
      />

      <button type="submit">Add Task</button>
    </form>
  );
}