const router = require("express").Router();
const {
  getAttendanceRecordForStudent,
  scanAttendance,
  getClassroomAttendanceRecords,
  getAllAttendances,
} = require("../controllers/Attendance");
const authorizeRoles = require("../middlewares/authorizeRoles");
const verifyToken = require("../middlewares/verifyToken");

//get all students attendances
router.get("/", getAllAttendances);
// get student attendance
// Get attendance records for the logged-in student
router.get("/student", verifyToken, getAttendanceRecordForStudent);

// all attendances for admin
// Get all attendance records for a specific classroom (admin use)
router.get(
  "/admin/:classroomId",
  verifyToken,
  authorizeRoles(["Admin"]),
  getClassroomAttendanceRecords
);

// scan for attendance
router.post("/scan", verifyToken, scanAttendance);

module.exports = router;
