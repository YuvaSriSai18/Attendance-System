const Classroom = require("../models/Classroom");
const Attendance = require("../models/Attendance");
const redisClient = require("../utils/redisClient");
const { decryptPayload } = require("../utils/crypto");

// get all attendance reports
const getAllAttendances = async (req, res) => {
  try {
    const all_Attendance_Reports = await Attendance.find().lean(); // lean() for better performance
    return res.status(200).json(all_Attendance_Reports);
  } catch (error) {
    console.error("Error fetching attendance reports:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// Get attendance records for a student
const getAttendanceRecordForStudent = async (req, res) => {
  try {
    const user = req.user;

    if (!user?.rollNo) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const records = await Attendance.find({ rollNo: user.rollNo }).sort({
      scannedAt: -1,
    });

    return res.status(200).json(records);
  } catch (err) {
    console.error("Error in /student attendance:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const scanAttendance = async (req, res) => {
  try {
    const { encryptedPayload, scannedAt, deviceId } = req.body;
    const user = req.user;

    let payload;
    try {
      payload = decryptPayload(encryptedPayload); // ✅ Decrypt the payload
    } catch (err) {
      return res.status(400).json({
        code: "DECRYPT_FAILED",
        message: "Failed to decrypt QR",
      });
    }

    const { sessionId, classroomId, classSessionId, expiresAt } = payload;

    if (
      !user?.rollNo ||
      !sessionId ||
      !classroomId ||
      !deviceId ||
      !classSessionId ||
      !expiresAt
    ) {
      return res
        .status(400)
        .json({ code: "MISSING_FIELDS", message: "Missing required fields" });
    }

    // Continue with your existing Redis and DB logic...
    const sessionKey = `qr:session:${sessionId}`;
    const redisData = await redisClient.get(sessionKey);

    if (!redisData) {
      return res.status(410).json({
        code: "SESSION_EXPIRED",
        message: "QR session expired or invalid",
      });
    }

    let redisParsed;
    try {
      redisParsed = JSON.parse(redisData);
    } catch (err) {
      return res
        .status(500)
        .json({ code: "REDIS_PARSE_ERROR", message: "Internal server error" });
    }

    const {
      classroomId: redisClassroomId,
      classSessionId: redisSessionId,
      expiresAt: redisExpiresAt,
    } = redisParsed;

    if (classroomId !== redisClassroomId || classSessionId !== redisSessionId) {
      return res.status(403).json({
        code: "MISMATCH_DATA",
        message: "Session or classroom mismatch",
      });
    }

    if (Date.now() > redisExpiresAt) {
      return res.status(410).json({ code: "EXPIRED", message: "QR expired" });
    }

    const classroom = await Classroom.findById(classroomId).lean();
    if (!classroom || !classroom.studentRolls.includes(user.rollNo)) {
      return res.status(403).json({
        code: "NOT_ENROLLED",
        message: "Not enrolled in this classroom",
      });
    }

    const existing = await Attendance.findOne({
      classSessionId,
      rollNo: user.rollNo,
    });

    if (existing) {
      if (existing.deviceId !== deviceId) {
        return res.status(403).json({
          code: "DEVICE_MISMATCH",
          message: "Attendance already marked from another device",
        });
      }
      return res.status(409).json({
        code: "ALREADY_MARKED",
        message: "Attendance already recorded",
      });
    }

    await Attendance.create({
      rollNo: user.rollNo,
      classroomId,
      deviceId,
      classSessionId,
      classroomName: classroom.classroomName,
      scannedAt: new Date(scannedAt),
      date: new Date(new Date().setHours(0, 0, 0, 0)),
    });

    return res.status(200).json({
      code: "SUCCESS",
      message: "Attendance marked successfully",
    });
  } catch (err) {
    console.error("Error in /scan:", err);
    return res
      .status(500)
      .json({ code: "SERVER_ERROR", message: "Internal server error" });
  }
};

// Admin: get all records for a classroom
const getClassroomAttendanceRecords = async (req, res) => {
  try {
    const classroomId = req.params.classroomId;

    const records = await Attendance.find({ classroomId }).sort({
      scannedAt: -1,
    });

    return res.status(200).json(records);
  } catch (err) {
    console.error("Error in /admin/classroom attendance:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAttendanceRecordForStudent,
  scanAttendance,
  getClassroomAttendanceRecords,
  getAllAttendances,
};
