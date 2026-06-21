import { useState } from "react";
import { useTasks } from "../context/TaskContext";

export default function TaskForm({ closeModal }) {
  const { addTask } = useTasks();

  const [form, setForm] = useState({
    title: "",
    assignedTo: "",
    status: "todo",
    priority: "medium",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await addTask(form);

      setForm({
        title: "",
        assignedTo: "",
        status: "todo",
        priority: "medium",
      });

      closeModal();
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to create task");
      }
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

      <button type="submit">Add Task</button>
    </form>
  );
}