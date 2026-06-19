import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "employee"],
  },
});

export default mongoose.model("User", userSchema);