const connect = require("./configs/db");
const app = require("./index");
const port = process.env.PORT || 5656;

const redisClient = require("redis").createClient;
const redis = redisClient(6379, "localhost");

// Listing the server port
app.listen(port, async () => {
  try {
    await connect();
    redis.on("connect", () => {
      console.log("connected to Redis");
    });
    console.log(`listening on port ${port}`);
  } catch (err) {
    console.log(err.message, "err");
  }
});
