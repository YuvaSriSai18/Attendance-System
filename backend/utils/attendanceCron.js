const cron = require("node-cron");
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const AttendancePercentages = require("../models/Attendance_Percentage");

const BATCH_SIZE = 80;

// Run every 12 hours
cron.schedule("0 */12 * * *", async () => {
  try {
    console.log("🔁 Starting attendance percentage batch job...");

    // Step 1: Get total sessions per classroom
    const totalSessionsByClassroom = await Attendance.aggregate([
      {
        $group: {
          _id: {
            classroomId: "$classroomId",
            classSessionId: "$classSessionId",
          },
        },
      },
      {
        $group: {
          _id: "$_id.classroomId",
          totalSessions: { $sum: 1 },
        },
      },
    ]);

    const totalSessionsMap = {};
    for (const entry of totalSessionsByClassroom) {
      totalSessionsMap[entry._id.toString()] = entry.totalSessions;
    }

    // Step 2: Get all distinct student/classroom combos
    const allStudentCombos = await Attendance.aggregate([
      {
        $group: {
          _id: {
            rollNo: "$rollNo",
            classroomId: "$classroomId",
            classroomName: "$classroomName",
          },
        },
      },
    ]);

    console.log(`👥 Found ${allStudentCombos.length} student-classroom records.`);

    // Step 3: Process in batches
    for (let i = 0; i < allStudentCombos.length; i += BATCH_SIZE) {
      const batch = allStudentCombos.slice(i, i + BATCH_SIZE);
      console.log(`📦 Processing batch ${i / BATCH_SIZE + 1}`);

      await Promise.all(
        batch.map(async (record) => {
          const { rollNo, classroomId, classroomName } = record._id;

          // Get number of unique sessions attended
          const attendedSessionsData = await Attendance.aggregate([
            {
              $match: { rollNo, classroomId },
            },
            {
              $group: {
                _id: "$classSessionId",
              },
            },
            {
              $count: "attendedSessions",
            },
          ]);

          const attendedSessions =
            attendedSessionsData.length > 0
              ? attendedSessionsData[0].attendedSessions
              : 0;

          const totalSessions =
            totalSessionsMap[classroomId.toString()] || 0;

          const attendancePercentage =
            totalSessions > 0
              ? parseFloat(((attendedSessions / totalSessions) * 100).toFixed(2))
              : 0;

          // Get latest scanned attendance record for email/displayName
          const latest = await Attendance.findOne({ rollNo, classroomId })
            .sort({ scannedAt: -1 })
            .lean();

          const email =
            latest?.email || `${rollNo.toLowerCase()}@srmap.edu.in`;
          const displayName = latest?.displayName || rollNo;

          // Update or Insert into Attendance_Percentages
          await AttendancePercentages.findOneAndUpdate(
            { rollNo, classroomId },
            {
              email,
              displayName,
              rollNo,
              classroomId,
              classroomName,
              attendancePercentage,
              lastUpdatedAt: new Date(),
            },
            { upsert: true, new: true }
          );
        })
      );
    }

    console.log("✅ Attendance percentage update completed for all batches.");
  } catch (error) {
    console.error("❌ Error during attendance batch cron:", error);
  }
});
