const RedisServer = require("redis-server");

// Start Redis on port 6379
const redisServer = new RedisServer(6379);

redisServer.open()
  .then(() => console.log("✅ Redis Server Started Locally"))
  .catch((err) => console.error("❌ Redis Start Error:", err));