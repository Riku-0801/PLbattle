const player = require("./express-player");
const DB = require("./express-DB");
const combo_data_db = require("./DB").combo_data_db;
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 3000;
const serveStatic = require("serve-static");
const cors = require("cors");
//post時にbodyを参照できるようにする
const bodyParser = require("body-parser");
//post時にjsonファイルを扱えるようにする
app.use(express.json());
app.use(
  cors({
    //魂のtrue　いつか直したい
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
//bodyを参照できるようにする
app.use(bodyParser.urlencoded({ extended: true }));
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
let numPlayer = {};


app.post("/api/HP", (req, res) => {
  DB.getHp(req,res,playerDb)
});
app.post("/api/HP_reload", (req, res) => {
  DB.getHpOnReload(req,res,playerDb)
});
app.get("/api/get_combo_db", (req, res) => {
  DB.getComboDb(res,combo_data_db,playerDb)
});
app.post("/api/get_turn", (req, res) => {
  DB.getTurnOnReload(req,res,numClients,playerDb)
});
app.post("/api/control_turn", (req, res) => {
  DB.getControlTurn(req,res,playerDb)
});
app.post("/api/card_draw", (req, res) => {
  player.cardDrawRequest(req,res,playerDb)
});
app.post("/api/player_data", (req, res) => {
  player.addPlayerData(res,numClients,playerDb)
});



//接続時処理

io.sockets.on("connection", function (socket) {
  console.log("connected");
  //接続切断処理
  //ログイン時処理
  socket.on("login", function (RoomId) {
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
      console.log(RoomId);
      console.log("今のRoomに居る人数" + numClients[RoomId]);
    }
    //ルーム入室
  });
  socket.on("room-join", function (RoomID) {
    socket.join(RoomID);
    if (numPlayer[RoomID] == undefined) {
      numPlayer[RoomID] = 1;
    } else {
      numPlayer[RoomID]++;
    }
    io.to(RoomID).emit("num-player", numPlayer[RoomID]);
  });
  socket.on("cardValue", function (cardValue, player_Id) {
    socket.join(cardValue.roomId);
    io.to(cardValue.roomId).emit("card-value", cardValue);
    console.log("カードの使用が認められました");
  });
});

http.listen(PORT, function () {
  console.log("server listening. Port:" + PORT);
});

/* データベース */

var playerDb = [
  //初期化
  {
    RoomId: "",
    playerId: "",
    cardList: [],
    myHp: 300,
    enemyHp: 300,
    cardListNumber: [],
    turnFlag: 0,
  },
];
