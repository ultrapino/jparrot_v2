require("dotenv").config();
const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
global.io = new Server(server);

const terms = require("./routes/terms.js");
app.use("/terms", terms.router);

const streaming = require("./routes/streaming.js");
app.use("/stream", streaming);

const maps = require("./routes/maps.js");
app.use("/map", maps.router);

const index = require("./routes/index.js");
app.use("/index", index);

server.listen(8000, ()=>{console.log("listening on 8000")});

// io.on("connection", (socket) => {
//   console.log("user connected");

//   socket.on("start-stream", () => {
//     console.log("stream starting");
//     startStream(socket);
//   });
//   socket.on("end-stream", () => {
//     console.log("stream closing");
//     stream.close();
//   });
// });
