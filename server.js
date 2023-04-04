const express = require("express");
const app = express();
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");

app.use(express.json());

const port = process.env.PORT || 3000;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://127.0.0.1:5500/"],
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected: ", socket.id);
  io.emit("connected", socket.id);
  socket.on("userId", (data) => io.emit("userConnected", data));
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

// server.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
