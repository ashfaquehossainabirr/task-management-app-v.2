import { useState, useEffect } from "react";
import { useTasks } from "../context/TaskContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function TaskForm({ closeModal }) {
  const [users, setUsers] = useState([]);
    useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://task-management-app-v-2.onrender.com/api/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // console.log("USERS RESPONSE 👉", res.data);

        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Fetch users failed", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

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
      <select
        value={form.assignedTo}
        required
        onChange={(e) =>
          setForm({ ...form, assignedTo: e.target.value })
        }
      >
        <option value="">Select Employee</option>

        {users.length > 0 &&
          users.map((user) => (
            <option key={user._id} value={user.name}>
              {user.name} ({user.role})
            </option>
          ))}
      </select>

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