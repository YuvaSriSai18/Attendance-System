const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    deviceId: { type: String, required: true, unique: true },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      // required: true,
    },
    classroomName: {
      type: String,
      // required: true,
    },
    photoUrl: { type: String },
    role: {
      type: String,
      enum: ["Student", "Admin", "Trainer"],
      default: "Student",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
