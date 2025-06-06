// // utils/redisClient.js
// const { createClient } = require('redis');

// const redisClient = createClient({
//   socket: {
//     host: '3.108.65.218',
//     port: 6379,
//     reconnectStrategy: (retries) => {
//       const delay = Math.min(retries * 100, 3000);
//       console.log(`Retrying Redis in ${delay}ms`);
//       return delay;
//     },
//     connectTimeout: 15000,
//   },
//   password: 'CRCSsrmap2025',
//   disableOfflineQueue: true,
// });

// redisClient.on('error', (err) => console.error('Redis Client Error:', err));
// redisClient.connect().then(() => {
//   console.log('🔗 Redis client connected (used in socket)');
// });

// module.exports = redisClient; 
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