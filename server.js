var express = require("express");
var app = express();
var http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 7000;

/*
room_idを自動生成してくれる関数
多分10文字のランダムな文字列を作ってくれる
*/
function createRoomId() {
  var base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  base = base.split("");
  var str = "";
  var count = base.length;
  for (var i = 0; i < 10; i++) {
    str += base[Math.floor(Math.random() * count)];
  }
  return str;
}

// 待機中フラグ
var waitPlayer = 0;

// 一時部屋ID
var tmpRoomId;

io.sockets.on("connection", function (socket) {
  //接続切断処理
  socket.on("disconnect", function () {
    console.log("disconnect");
  });
  //ログイン時処理
  socket.on("login", function (RoomId) {
    // 待機中プレイヤーが居る場合
    if (RoomId == "") {
      if (waitPlayer == 1) {
        // 待機中の部屋IDにjoin
        socket.join(tmpRoomId);
        waitPlayer = 0;
        // 待機中プレイヤーが居ない場合
      } else {
        // 待機プレイヤーに1を設定
        waitPlayer = 1;
        // 部屋IDを生成
        tmpRoomId = createRoomId();
        socket.join(tmpRoomId);
      }
    } else {
      socket.join(RoomId);
    }
  });
});

/*
room_idを発行する場合

io.sockets.on("connection", function (socket) {
  socket.on("disconnect", function () {
    console.log("disconnect");
  });
  socket.on("login", function (RoomId) {
    socket.join(RoomId);
  });
});
*/
