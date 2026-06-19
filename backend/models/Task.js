import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,
    assignedTo: String,
    status: {
      type: String,
      default: "todo",
    },
    priority: String,
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);