const router = require("express").Router();
const User = require("../models/User");
const Classroom = require("../models/Classroom");
const verifyToken = require('../middlewares/verifyToken')
const mongoose = require("mongoose");

// Create Classroom
router.post('/', async (req, res) => {
    const { classroomName, studentRolls } = req.body;
    try {
        const classroom = new Classroom({ classroomName, studentRolls });
        await classroom.save();
        return res.status(201).json({ message: "Classroom created successfully", classroom });
    } catch (error) {
        console.error("Create Classroom Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete Classroom
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Classroom.findByIdAndDelete(id);
        return res.status(200).json({ message: "Classroom deleted successfully" });
    } catch (error) {
        console.error("Delete Classroom Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update Classroom (classroomName or studentRolls)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Classroom ID" });
    }

    const { classroomName, studentRolls } = req.body;

    const classroom = await Classroom.findById(id);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    classroom.classroomName = classroomName || classroom.classroomName;
    classroom.studentRolls = studentRolls || classroom.studentRolls;

    const updated = await classroom.save();

    return res.status(200).json({ message: "Classroom updated", classroom: updated });
  } catch (error) {
    console.error("Update Classroom Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


// Read all Classrooms
router.get('/', async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        return res.status(200).json({ classrooms });
    } catch (error) {
        console.error("Get Classrooms Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Read single Classroom by ID
router.get('/:id', async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) return res.status(404).json({ message: "Classroom not found" });
        return res.status(200).json({ classroom });
    } catch (error) {
        console.error("Get Classroom Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;