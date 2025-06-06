const mongoose = require("mongoose");

const qrTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QR_Token", qrTokenSchema);
