const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true },
    deviceId: { type: String, required: true },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    classroomName: { type: String, required: true },
    classSessionId: { type: String, required: true }, // NEW
    date: { type: Date, required: true },
    scannedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
