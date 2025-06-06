const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res.status(401).json({ message: "Access denied. Token missing." });

  const token = authHeader.split(" ")[1]; // Removes 'Bearer '

  // console.log(`token: ${token}`);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(`Decoded: ${JSON.stringify(decoded)}`);
    req.user = decoded;
    console.log(req.user)
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
