var express = require("express");
var app = express();
var http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 7001;

/*
room_idを自動生成してくれる関数
多分10文字のランダムな文字列を作ってくれる
*/
function createRoomId() {
  var base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  base = base.split("");
  var id = "";
  var count = base.length;
  for (var i = 0; i < 10; i++) {
    id += base[Math.floor(Math.random() * count)];
  }
  return id;
}

io.sockets.on("connection", function (socket) {
  //接続切断処理
  socket.on("disconnect", function () {
    console.log("disconnect");
  });
  //ログイン時処理
  socket.on("login", function (RoomId) {
    //ルーム入室
    socket.join(RoomId);
  });
  socket.on("value", function (cardValue) {
    io.to(RoomId).emit("cardValue", cardValue);
  });
});

http.listen(PORT, function () {
  console.log("server listening. Port:" + PORT);
});
