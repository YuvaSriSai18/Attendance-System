const mongoose = require("mongoose");

const attendancePercentagesSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    classroomName: { type: String, required: true },
    attendancePercentage: { type: Number, default: 0 },
    lastUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Attendance_Percentages",
  attendancePercentagesSchema
);
