const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    classroomName: { type: String, required: true },
    studentRolls: { type: [String]},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classroom", classroomSchema);
