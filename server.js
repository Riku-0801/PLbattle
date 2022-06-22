var express = require("express");
var app = express();
var http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 3000;
const serveStatic = require("serve-static");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

//おまじない
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: true,
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
}
app.use(serveStatic(__dirname + "/dist"));

let numClients = {};
/**
今は決め打ちしてるけど将来的にはルームは複数持ちたい
 */
let turn_flag = {
  hogehoge: {},
};

//接続時処理
io.sockets.on("connection", function (socket) {
  console.log("connected");
  //接続切断処理
  //ログイン時処理
  socket.on("login", function (RoomId) {
    console.log("ログインが出来ています");
    if (numClients[RoomId] == undefined) {
      numClients[RoomId] = 1;
    } else {
      numClients[RoomId]++;
    }
    //もしルームの人数が２人以上ならルームに入れない
    if (numClients[RoomId] > 2) {
      console.log("This room is full");
    } else {
      socket.join(RoomId);
      console.log("Roomに入室が完了しました");
      console.log(RoomId)
      console.log('rooms:',socket);
      console.log(numClients[RoomId]);
      
      //let userId = Math.random().toString(32).substring(2);
      //console.log(userId);
      //turn_flag[RoomId][userId] = 0;
      // if (numClients[RoomId] == 2) {
      //   turn_flag[RoomId][userId] = 1;
      // }
      //console.log(turn_flag[RoomId][userId]);
      //socket.emit("logined", userId);
    }
    //ルーム入室
  });
  // socket.on("disconnect", function () {
  //   console.log("disconnect");
  //   socket.leave(RoomId);
  //   numClients[RoomId]--;
  // });
  socket.on("cardValue", function (cardValue) {
    // var queryStr = window.location.search.slice(1);
    // console.log(queryStr)
    console.log('rooms:', socket);
    io.to(cardValue.roomId).emit("card-value", cardValue);
    console.log(cardValue.userId);
    console.log(cardValue.roomId);
    console.log(cardValue.selecteddata);
  });
  
});

http.listen(PORT, function () {
  console.log("server listening. Port:" + PORT);
});

