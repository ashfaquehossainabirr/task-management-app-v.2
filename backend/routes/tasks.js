import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// GET TASKS
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// CREATE TASK
router.post("/", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
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

// FULL UPDATE (EDIT TASK)
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