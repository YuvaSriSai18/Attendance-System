const router = require("express").Router();
const User = require("../models/User");
const Classroom = require("../models/Classroom");
const jwt = require("jsonwebtoken");
const decodeJwt = require("jwt-decode");

router.get("/health", (req, res) => {
  res.send("User auth working");
});

router.post("/", async (req, res) => {
  const { email, displayName, photoUrl, deviceId } = req.body;

  if (!email || !displayName || !deviceId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const rollNo = displayName.split("|").pop().trim();
  const name = displayName.split(" | ")[0];

  try {
    // Find user by rollNo (to check if already registered)
    let user = await User.findOne({ rollNo });

    // Also check if device is already used by another user
    const deviceConflict = await User.findOne({
      deviceId,
      rollNo: { $ne: rollNo }, 
    });

    if (deviceConflict) {
      return res.status(403).json({
        message: `This device is already registered with another user (${deviceConflict.rollNo})`,
      });
    }

    if (user) {
      // Login flow
      if (user.deviceId !== deviceId) {
        return res
          .status(403)
          .json({ message: "Device not authorized for this user" });
      }

      const token = jwt.sign(
        {
          _id: user._id,
          rollNo: user.rollNo,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET
      );

      return res
        .status(200)
        .json({ message: "Login successful", token, user });
    }

    // Registration flow
    const classroom = await Classroom.findOne({ studentRolls: rollNo });
    if (!classroom) {
      return res
        .status(404)
        .json({ message: "Classroom not found for this roll number" });
    }

    user = new User({
      email,
      displayName: capitalizeFirstLetterOfEachWord(name),
      rollNo,
      photoUrl,
      deviceId,
      classroomId: classroom._id,
      classroomName: classroom.classroomName,
    });

    await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
        rollNo: user.rollNo,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    return res
      .status(201)
      .json({ message: "User registered and logged in", token, user });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/decode", (req, res) => {
  const { token } = req.body;

  try {
    const data = decodeJwt(token);
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Invalid or malformed token" });
  }
});

function capitalizeFirstLetterOfEachWord(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

module.exports = router;
