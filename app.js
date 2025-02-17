const express = require("express");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const redisClient = require('./redis');

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const feedRoutes = require("./routes/feed");
const profileRoutes = require("./routes/profile");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);
app.use("/chat", chatRoutes);
app.use("/profile", profileRoutes);


// app.use('/', (req, res, next) => {
//    res.status(404).json({message: 'Page Not found'});
// })

app.use((error, req, res, next) => {
  console.log("here");
  console.log(error.code, error.message, error.data);
  if (!error.code || error.code == 500) {
    error.code = 500;
    error.message = "Internal server error!!";
  }

  res.status(error.code).json({ message: error.message, data: error.data });
});

function startServer() {
  const server = app.listen(3000, () => console.log("listening on port 3000"));
  const io = require("./socket").init(server);
  io.on("connection", (socket) => {
    //update redis
    const userId = socket.handshake.query.userId;
    if (!userId)
      return;
    redisClient.set(userId, socket.id);
    console.log(userId, socket.id);
    console.log(`user connected with socketid ${socket.id}`);
  });
}

startServer();