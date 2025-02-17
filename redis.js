const redisClient = {};

redisClient.set = async (key, value) => {
  redisClient[key] = value;
};

redisClient.get = async (key) => redisClient[key];

// redisClient.set([1, 2], "first message");
redisClient.set([2, 3], { message: "second message", senderId: 2 ,receiverId:3});

module.exports = redisClient;
