const express = require('express');
const router = express.Router();
const AttendancePercentages = require('../models/Attendance_Percentage');

router.get('/', async (req, res) => {
  try {
    const allPercentages = await AttendancePercentages.find();
    return res.status(200).json(allPercentages);
  } catch (error) {
    console.error("Error fetching attendance percentages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/roll/:rollNo', async (req, res) => {
  const { rollNo } = req.params;
  try {
    const record = await AttendancePercentages.findOne({ rollNo });
    if (!record) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.status(200).json(record);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const record = await AttendancePercentages.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    return res.status(200).json(record);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put('/roll/:rollNo', async (req, res) => {
  const { rollNo } = req.params;
  const updateFields = req.body;

  try {
    const updated = await AttendancePercentages.findOneAndUpdate(
      { rollNo },
      { ...updateFields, lastUpdatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete('/roll/:rollNo', async (req, res) => {
  const { rollNo } = req.params;
  try {
    const deleted = await AttendancePercentages.findOneAndDelete({ rollNo });

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student record deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
