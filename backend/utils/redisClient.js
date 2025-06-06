// redisClient.js
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: retries => Math.min(retries * 50, 2000),
  },
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error", err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis successfully");
  } catch (error) {
    console.error("❌ Redis connection failed", error);
  }
})();

// Graceful shutdown
process.on("SIGINT", async () => {
  await redisClient.quit();
  process.exit(0);
});

module.exports = redisClient;