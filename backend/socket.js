const socketIO = require("socket.io");
const { encryptPayload } = require("./utils/crypto");
const { v4: uuidv4 } = require("uuid");
const redisClient = require("./utils/redisClient");
const activeSessions = {};

function generateSessionId() {
  return uuidv4() + Math.random().toString(36).substr(2, 9) + Date.now();
}

function generateClassSessionId(classroomId) {
  const now = new Date();
  const hours = now.getHours();
  const period = hours < 13 ? "forenoon" : "afternoon";

  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  return `${classroomId}_${dateStr}_${period}`;
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

    socket.on("start-qr", ({ classroomId }) => {
      console.log("Start QR for:", classroomId);
      if (activeSessions[classroomId]) return;

      // 🔒 Create a consistent classSessionId for this full class session
      const classSessionId = generateClassSessionId(classroomId);

      const interval = setInterval(async () => {
        const sessionId = generateSessionId();
        const expiresAt = Date.now() + 10000;

        const payload = {
          classroomId,
          sessionId,
          classSessionId, // 🔁 Include stable session
          expiresAt,
        };

        // ✅ Save session to Redis with 10s TTL
        try {
          await redisClient.set(
            `qr:session:${sessionId}`,
            JSON.stringify(payload),
            {
              EX: 10, // Redis expiry in seconds
            }
          );
        } catch (err) {
          console.error("Redis set error for sessionId:", sessionId, err);
        }

        // const qrString = JSON.stringify(payload);
        const qrString = encryptPayload(payload);

        socket.emit("qr-update", { qrString });

        console.log(
          `QR Updated with sessionId ${sessionId} and classSessionId ${classSessionId} for classroom ${classroomId}`
        );
      }, 5000);

      activeSessions[classroomId] = {
        interval,
        classSessionId, // store for later if needed
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
      // Optionally stop all sessions on disconnect
    });
  });
};
