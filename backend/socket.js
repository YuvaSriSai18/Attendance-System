const socketIO = require("socket.io");
const { encryptPayload } = require("./utils/crypto");
const { v4: uuidv4 } = require("uuid");
const redisClient = require("./utils/redisClient");
const cls = require("./models/Classroom");

const activeSessions = {};

function generateSessionId() {
  return uuidv4() + Math.random().toString(36).substr(2, 9) + Date.now();
}

async function getClassName(classroomId) {
  try {
    const classroom = await cls.findById(classroomId);
    if (!classroom) {
      return "UnknownClass"; // Fallback if class not found
    }
    return classroom.classroomName;
  } catch (error) {
    console.log("Error while fetching class name:", error);
    return "ErrorClass"; // Fallback in case of error
  }
}

async function generateClassSessionId(classroomId) {
  const now = new Date();
  const hours = now.getHours();
  const period = hours < 13 ? "FN" : "AN";
  const className = await getClassName(classroomId);
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  return `${classroomId}_${dateStr}_${className}_${period}`;
}

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("start-qr", async ({ classroomId }) => {
      console.log("Start QR for:", classroomId);
      if (activeSessions[classroomId]) return;

      const classSessionId = await generateClassSessionId(classroomId);

      const interval = setInterval(async () => {
        const sessionId = generateSessionId();
        const expiresAt = Date.now() + 10000;

        const payload = {
          classroomId,
          sessionId,
          classSessionId,
          expiresAt,
        };

        try {
          await redisClient.set(
            `qr:session:${sessionId}`,
            JSON.stringify(payload),
            {
              EX: 10,
            }
          );
        } catch (err) {
          console.error("Redis set error for sessionId:", sessionId, err);
        }

        const qrString = encryptPayload(payload);

        socket.emit("qr-update", { qrString });

        console.log(
          `QR Updated with sessionId ${sessionId} and classSessionId ${classSessionId} for classroom ${classroomId}`
        );
      }, 5000);

      activeSessions[classroomId] = {
        interval,
        classSessionId,
      };
    });

    socket.on("stop-qr", ({ classroomId }) => {
      const session = activeSessions[classroomId];
      if (session) {
        clearInterval(session.interval);
        delete activeSessions[classroomId];
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      // Optional: clear intervals on disconnect
    });
  });
};
