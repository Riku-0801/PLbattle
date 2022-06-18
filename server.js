var express = require("express");
var app = express();
var http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3000;
const serveStatic = require("serve-static");
const cors = require("cors");

//おまじない
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}
app.use(serveStatic(__dirname + "/dist"));

let numClients = {};
//接続時処理
io.sockets.on("connection", function (socket) {
  console.log("connected");
  //接続切断処理
  socket.on("disconnect", function () {
    console.log("disconnect");
    socket.leave(RoomId);
    numClients[RoomId]--;
  });
  //ログイン時処理
  socket.on("login", function (RoomId) {
    if (numClients[RoomId] == undefined) {
      numClients[RoomId] = 1;
    } else {
      numClients[RoomId]++;
    }
    //もしルームの人数が２人以上ならルームに入れない
    if (numClients[RoomId] >= 2) {
      console.log("This room is full");
    } else {
      socket.join(RoomId);
      io.to(RoomId).broadcast.emit("turnflag", turnflag);
    }
    //ルーム入室
  });
  socket.on("value", function (cardValue) {
    io.to(RoomId).broadcast.emit("cardValue", cardValue);
  });
});

http.listen(PORT, function () {
  console.log("server listening. Port:" + PORT);
});
