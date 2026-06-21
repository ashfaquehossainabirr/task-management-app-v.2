import express from "express";
import Task from "../models/Task.js";
import User from "../models/User.js";

const router = express.Router();

// GET TASKS
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    const { title, description, assignedTo, priority } = req.body;

    // Check if assigned user exists
    const userExists = await User.findOne({ name: assignedTo });

    if (!userExists) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Create task only if user exists
    const task = await Task.create({
      title,
      description,
      assignedTo,
      priority,
      status: "todo",
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE STATUS
router.patch("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(task);
});

// EDIT TASK
router.put("/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedTask);
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;