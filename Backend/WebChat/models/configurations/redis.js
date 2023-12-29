// Check if wanted by Client
const redis = require("redis");

let redisClient;

(async () => {

  redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
  });

  redisClient.on("error", (error) => console.error(`Error: ${error}`));

  redisClient.on("connect", () => {
    console.log("Connected to Redis server");
  });
})();

module.exports = redisClient;
