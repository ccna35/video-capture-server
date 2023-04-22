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
    origin: [
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5500/",
      "https://ccna35.github.io",
      "https://video-capture-kappa.vercel.app/",
      "https://video-capture-kappa.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

let peerList = [];

io.on("connection", (socket) => {
  console.log("a user connected: ", socket.id);
  io.emit("connected", socket.id);
  socket.on("userId", (data) => {
    peerList.push(data);
    console.log(peerList);
    io.emit("userConnected", peerList);
    socket.on("disconnect", () => {
      peerList = peerList.filter((peer) => peer != data);
      io.emit("userConnected", peerList);
      console.log(peerList);
    });
  });
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
