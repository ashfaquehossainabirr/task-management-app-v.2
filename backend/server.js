import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARES (FIRST)
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

/* ======================
   TEST ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ======================
   DATABASE
====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

/* ======================
   SERVER
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);