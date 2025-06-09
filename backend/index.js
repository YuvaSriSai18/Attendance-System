// server.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketHandler = require("./socket");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
require("./utils/attendanceCron");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rbnfh5ks-5173.inc1.devtunnels.ms",
      "https://27sb0nqh-5173.inc1.devtunnels.ms/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(`Mongo Error: ${err}`));

app.use(express.json());
app.use("/auth", require("./routes/Auth"));
app.use("/classroom", require("./routes/Classroom"));
app.use("/attendance", require("./routes/Attendance"));
app.use("/api/attendance", require("./routes/Attendance_Percentage"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "utils/index.html"));
});
// Init socket with the existing HTTP server
socketHandler(server);

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
