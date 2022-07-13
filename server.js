const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "https://code--duel.herokuapp.com/",
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
    }),
    express.static("src/public")
  );
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./src/public/index.html"));
  });
}
app.use(serveStatic(__dirname + "/dist"));
let numClients = {};
let numPlayer = {};
app.post("/api/message", (req, res) => {
  console.log(req.body.firstname);
});

//フロントエンドからHP情報を受け取る。
app.post("/api/HP", (req, res) => {
  let select_Id = player_db.findIndex(
    (e) => e.player_Id === req.body.player_Id
  );

  player_db[select_Id].my_HP = req.body.HPs.mine;
  player_db[select_Id].enemy_HP = req.body.HPs.yours;
  HP_data = {
    my_HP: player_db[select_Id].my_HP,
    enemy_HP: player_db[select_Id].enemy_HP,
  };
  res.send(HP_data);
});

//フロントエンド更新時用のHP情報共有
app.post("/api/HP_reload", (req, res) => {
  let select_Id = player_db.findIndex(
    (e) => e.player_Id === req.body.player_Id
  );
  HP_data = {
    my_HP: player_db[select_Id].my_HP,
    enemy_HP: player_db[select_Id].enemy_HP,
  };
  res.send(HP_data);
});

//ログイン時に、player_IdとRoomIdを受け取る。それをplayer_dbに格納
app.post("/api/player_data", (req, res) => {
  if (numClients[req.body.RoomId] == 1) {
    player_db.push({
      RoomId: req.body.RoomId,
      player_Id: req.body.player_Id,
      card_list: [],
      my_HP: 200,
      enemy_HP: 200,
      card_list_number: [],
      turn_flag: 1,
    });
  } else {
    player_db.push({
      RoomId: req.body.RoomId,
      player_Id: req.body.player_Id,
      card_list: [],
      my_HP: 200,
      enemy_HP: 200,
      card_list_number: [],
      turn_flag: 0,
    });
  }
  res.json(numClients[req.body.RoomId]);
});

//コンボカードリストをフロントに送信
app.get("/api/get_combo_db", (req, res) => {
  res.json(combo_data_db);
});

//カードドローリクエストがフロントから走った場合に発火
app.post("/api/card_draw", (req, res) => {
  const select_Id = player_db.findIndex(
    (e) => e.player_Id === req.body.player_Id
  );

  if (req.body.carddata.length != 0) {
    player_db[select_Id].card_list = req.body.carddata;
  }
  card_draw(select_Id);
  //フロントに新規リストを送信

  res.send(player_db[select_Id].card_list);
});

//ページリロード時のターンを決定づける。
app.post("/api/get_turn", (req, res) => {
  const select_turn_Id = player_db.findIndex(
    (e) => e.player_Id === req.body.player_Id
  );
  res.json(player_db[select_turn_Id].turn_flag);
  //覚え書き：数字を送る際はjsonにしよう。
});

app.post("/api/control_turn", (req, res) => {
  //同じRoomにいる、自分以外の人のturn_flagを+１する
  const select_turn_Id = player_db.findIndex(
    (e) => e.player_Id === req.body.player_Id
  );
  const this_RoomId = player_db[select_turn_Id].RoomId;
  const this_Room_player = player_db.filter((e) => {
    if (e.RoomId === this_RoomId && e.player_Id != req.body.player_Id) {
      return true;
    }
  });
  //同じRoomにいる、自分以外の人のturn_flagを+１する

  const select_Id = player_db.findIndex(
    (e) => e.player_Id === this_Room_player[0].player_Id
  );
  player_db[select_Id].turn_flag += 1;
  //自分のturn_flagを+１する
  player_db[select_turn_Id].turn_flag += 1;
  res.send();
});

//カードドロー機能
function card_draw(select_Id) {
  console.log("ドロー関数が発火されました");
  for (let j = player_db[select_Id].card_list.length; j < 6; ) {
    const tmp = Number(Math.floor(Math.random() * 56));
    //if (!player_db[select_Id].card_list_number.includes(tmp)) {
    //ここ修正必要
    //player_db[select_Id].card_list_number.push(tmp);
    player_db[select_Id].card_list.push(card_db[tmp]);
    j++;
    //}
  }
}

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

var player_db = [
  //初期化
  {
    RoomId: "",
    player_Id: "",
    card_list: [],
    my_HP: 300,
    enemy_HP: 300,
    card_list_number: [],
    turn_flag: 0,
  },
];
const combo_data_db = [
  {
    combo_id: 1,
    name_en: "Royal Straight Flush",
    name_ja: "ロイヤルストレートフラッシュ",
    action_value: 500,
    id_list: [29, 41, 42, 44],
    name_list: ["Objective-C", "C", "C#", "C++"],
  },
  {
    combo_id: 2,
    name_en: "Mark Up",
    name_ja: "マークアップ",
    action_value: 40,
    id_list: [2, 3],
    name_list: ["HTML", "CSS"],
  },
  {
    combo_id: 3,
    name_en: "Rookie",
    name_ja: "ルーキー",
    action_value: 60,
    id_list: [1, 2, 3],
    name_list: ["Javascript", "HTML", "CSS"],
  },
  {
    combo_id: 4,
    name_en: "Jewelry",
    name_ja: "ジュエリー",
    action_value: 100,
    id_list: [28, 29],
    name_list: ["Perl", "Objective-C"],
  },
  {
    combo_id: 5,
    name_en: "P_combo1",
    name_ja: "Pコンボ1",
    action_value: 80,
    id_list: [27, 28],
    name_list: ["PHP", "Perl"],
  },
  {
    combo_id: 6,
    name_en: "P_combo2",
    name_ja: "Pコンボ2",
    action_value: 80,
    id_list: [10, 27],
    name_list: ["Python", "PHP"],
  },
  {
    combo_id: 7,
    name_en: "P_combo3",
    name_ja: "Pコンボ3",
    action_value: 80,
    id_list: [10, 28],
    name_list: ["Python", "Perl"],
  },
  {
    combo_id: 8,
    name_en: "P_Family",
    name_ja: "Pファミリー",
    action_value: 100,
    id_list: [10, 27, 28],
    name_list: ["Python", "PHP", "Perl"],
  },
  {
    combo_id: 9,
    name_en: "R_combo1",
    name_ja: "Rコンボ1",
    action_value: 50,
    id_list: [11, 33],
    name_list: ["R", "Rust"],
  },
  {
    combo_id: 10,
    name_en: "R_combo2",
    name_ja: "Rコンボ2",
    action_value: 60,
    id_list: [11, 39],
    name_list: ["R", "Ruby"],
  },
  {
    combo_id: 11,
    name_en: "R_combo3",
    name_ja: "Rコンボ3",
    action_value: 80,
    id_list: [33, 39],
    name_list: ["Rust", "Ruby"],
  },
  {
    combo_id: 12,
    name_en: "R_Family",
    name_ja: "Rファミリー",
    action_value: 90,
    id_list: [11, 33, 39],
    name_list: ["R", "Rust", "Ruby"],
  },
  {
    combo_id: 13,
    name_en: "Chalk & Cheese",
    name_ja: "月と鼈",
    action_value: 60,
    id_list: [1, 43],
    name_list: ["Javascript", "Java"],
  },
  {
    combo_id: 14,
    name_en: "The Script Brothers",
    name_ja: "スクリプト兄弟",
    action_value: 50,
    id_list: [1, 12],
    name_list: ["Javascript", "TypeScript"],
  },
  {
    combo_id: 15,
    name_en: "Bird",
    name_ja: "バード",
    action_value: 70,
    id_list: [30, 31],
    name_list: ["Swift", "Kotlin"],
  },
  {
    combo_id: 16,
    name_en: "Google",
    name_ja: "グーグル",
    action_value: 80,
    id_list: [32, 37],
    name_list: ["dart", "Go"],
  },
  {
    combo_id: 17,
    name_en: "Apple",
    name_ja: "アップル",
    action_value: 70,
    id_list: [29, 30],
    name_list: ["Objective-C", "Swift"],
  },
  {
    combo_id: 18,
    name_en: "Pythons1",
    name_ja: "パイソンズ1",
    action_value: 40,
    id_list: [4, 5],
    name_list: ["Django", "FastAPI"],
  },
  {
    combo_id: 19,
    name_en: "Pythons2",
    name_ja: "パイソンズ2",
    action_value: 50,
    id_list: [4, 16],
    name_list: ["Django", "Flask"],
  },
  {
    combo_id: 20,
    name_en: "Pythons3",
    name_ja: "パイソンズ3",
    action_value: 50,
    id_list: [5, 16],
    name_list: ["FastAPI", "Flask"],
  },
  {
    combo_id: 21,
    name_en: "The Python Brothers",
    name_ja: "パイソン兄弟",
    action_value: 70,
    id_list: [4, 5, 16],
    name_list: ["Django", "FastAPI", "Flask"],
  },
  {
    combo_id: 22,
    name_en: "Animals2",
    name_ja: "アニマルズ1",
    action_value: 80,
    id_list: [10, 37],
    name_list: ["Python", "Go"],
  },
  {
    combo_id: 23,
    name_en: "Animals2",
    name_ja: "アニマルズ2",
    action_value: 70,
    id_list: [10, 51],
    name_list: ["Python", "ドリトル"],
  },
  {
    combo_id: 24,
    name_en: "Animals3",
    name_ja: "アニマルズ3",
    action_value: 80,
    id_list: [37, 51],
    name_list: ["Go", "ドリトル"],
  },
  {
    combo_id: 25,
    name_en: "Japanese",
    name_ja: "ジャパニーズ",
    action_value: 90,
    id_list: [50, 51, 52],
    name_list: ["なでしこ", "ドリトル", "プロデル"],
  },
  {
    combo_id: 26,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 45,
    id_list: [1, 15],
    name_list: ["JavaScript", "Vue"],
  },
  {
    combo_id: 27,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 30,
    id_list: [1, 6],
    name_list: ["JavaScript", "jQuery"],
  },
  {
    combo_id: 28,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 45,
    id_list: [1, 18],
    name_list: ["JavaScript", "Angular"],
  },
  {
    combo_id: 29,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 75,
    id_list: [1, 36],
    name_list: ["JavaScript", "Node.js"],
  },
  {
    combo_id: 30,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 45,
    id_list: [10, 16],
    name_list: ["Python", "Flask"],
  },
  {
    combo_id: 31,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 50,
    id_list: [4, 10],
    name_list: ["Python", "Django"],
  },
  {
    combo_id: 32,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 30,
    id_list: [5, 10],
    name_list: ["Python", "FastAPI"],
  },
  {
    combo_id: 33,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 60,
    id_list: [3, 34],
    name_list: ["CSS", "tailwind"],
  },
  {
    combo_id: 34,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 90,
    id_list: [23, 27],
    name_list: ["PHP", "Laravel"],
  },
  {
    combo_id: 35,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 90,
    id_list: [8, 27],
    name_list: ["PHP", "CakePHP"],
  },
  {
    combo_id: 36,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 105,
    id_list: [17, 39],
    name_list: ["Ruby", "Rails"],
  },
  {
    combo_id: 37,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 75,
    id_list: [9, 30],
    name_list: ["Swift", "SwiftUI"],
  },
  {
    combo_id: 38,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 90,
    id_list: [20, 37],
    name_list: ["Go", "echo"],
  },
  {
    combo_id: 39,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 105,
    id_list: [19, 43],
    name_list: ["Java", "Spring"],
  },
  {
    combo_id: 40,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 75,
    id_list: [21, 33],
    name_list: ["Rust", "Rocket"],
  },
  {
    combo_id: 41,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 75,
    id_list: [22, 33],
    name_list: ["Rust", "Yew"],
  },
  {
    combo_id: 42,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 105,
    id_list: [24, 32],
    name_list: ["dart", "Flutter"],
  },
  {
    combo_id: 43,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 75,
    id_list: [7, 31],
    name_list: ["Kotlin", "Ktor"],
  },
  {
    combo_id: 44,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 75,
    id_list: [14, 33],
    name_list: ["Rust", "warp"],
  },
  {
    combo_id: 45,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 45,
    id_list: [3, 56],
    name_list: ["CSS", "Bootstrap"],
  },
  {
    combo_id: 46,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 75,
    id_list: [12, 15],
    name_list: ["TypeScript", "Vue"],
  },
  {
    combo_id: 47,
    name_en: "Pair",
    name_ja: "ペア",
    action_value: 75,
    id_list: [12, 18],
    name_list: ["TypeScript", "Angular"],
  },
];
const card_db = [
  {
    id: 1,
    name: "Javascript",
    type: "language",
    img: "../assets/cards/JavaScript.png",
    action: "attack",
    value: 10,
    field: "",
    set_id: 0,
  },
  {
    id: 1,
    name: "Javascript",
    type: "language",
    img: "../assets/cards/JavaScript.png",
    action: "attack",
    value: 10,
    field: "",
    set_id: 0,
  },
  {
    id: 1,
    name: "Javascript",
    type: "language",
    img: "../assets/cards/JavaScript.png",
    action: "attack",
    value: 10,
    field: "",
    set_id: 0,
  },
  {
    id: 2,
    name: "HTML",
    type: "language",
    img: "../assets/cards/HTML.png",
    action: "attack",
    value: 10,
    field: "",
    set_id: 0,
  },
  {
    id: 3,
    name: "CSS",
    type: "language",
    img: "../assets/cards/CSS.png",
    action: "attack",
    value: 10,
    field: "",
    set_id: 0,
  },
  {
    id: 4,
    name: "Django",
    type: "framework",
    img: "../assets/cards/Django.png",
    action: "attack",
    value: 20,
    field: "LinuxOS",
    set_id: 10,
  },
  {
    id: 5,
    name: "FastAPI",
    type: "framework",
    img: "../assets/cards/FastAPI.png",
    action: "attack",
    value: 10,
    field: "LinuxOS",
    set_id: 10,
  },
  {
    id: 6,
    name: "jQuery",
    type: "framework",
    img: "../assets/cards/jQuery.png",
    action: "attack",
    value: 10,
    field: "",
    set_id: 10,
  },
  {
    id: 7,
    name: "Ktor",
    type: "framework",
    img: "../assets/cards/Ktor.png",
    action: "attack",
    value: 20,
    field: "AndroidOS",
    set_id: 31,
  },
  {
    id: 8,
    name: "Cake PHP",
    type: "framework",
    img: "../assets/cards/CakePHP.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 27,
  },
  {
    id: 9,
    name: "SwiftUI",
    type: "framework",
    img: "../assets/cards/SwiftUI.png",
    action: "attack",
    value: 20,
    field: "iOS,macOS",
    set_id: 30,
  },
  {
    id: 10,
    name: "Python",
    type: "language",
    img: "../assets/cards/Python.png",
    action: "attack",
    value: 30,
    field: "LinuxOS",
    set_id: 0,
  },
  {
    id: 10,
    name: "Python",
    type: "language",
    img: "../assets/cards/Python.png",
    action: "attack",
    value: 30,
    field: "LinuxOS",
    set_id: 0,
  },
  {
    id: 10,
    name: "Python",
    type: "language",
    img: "../assets/cards/Python.png",
    action: "attack",
    value: 30,
    field: "LinuxOS",
    set_id: 0,
  },
  {
    id: 11,
    name: "R",
    type: "language",
    img: "../assets/cards/R.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 0,
  },
  {
    id: 12,
    name: "TypeScript",
    type: "language",
    img: "../assets/cards/TypeScript.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 13,
    name: "Julia",
    type: "language",
    img: "../assets/cards/Julia.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 0,
  },
  {
    id: 15,
    name: "Vue",
    type: "framework",
    img: "../assets/cards/Vue.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 1,
  },
  {
    id: 16,
    name: "Flask",
    type: "framework",
    img: "../assets/cards/Flask.png",
    action: "attack",
    value: 20,
    field: "LinuxOS",
    set_id: 10,
  },
  {
    id: 17,
    name: "Rails",
    type: "framework",
    img: "../assets/cards/Rails.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 39,
  },
  {
    id: 18,
    name: "Angular",
    type: "framework",
    img: "../assets/cards/Angular.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 1,
  },
  {
    id: 19,
    name: "Spring",
    type: "framework",
    img: "../assets/cards/Spring.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 43,
  },
  {
    id: 20,
    name: "echo",
    type: "framework",
    img: "../assets/cards/echo.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 37,
  },
  {
    id: 21,
    name: "Rocket",
    type: "framework",
    img: "../assets/cards/Rocket.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 33,
  },
  {
    id: 22,
    name: "Yew",
    type: "framework",
    img: "../assets/cards/Yew.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 33,
  },
  {
    id: 23,
    name: "Laravel",
    type: "framework",
    img: "../assets/cards/Laravel.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 27,
  },
  {
    id: 24,
    name: "Flutter",
    type: "framework",
    img: "../assets/cards/Flutter.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 32,
  },
  {
    id: 25,
    name: "外付けHDD",
    type: "attachment",
    img: "../assets/cards/External-HDD.png",
    action: "enhancement",
    value: 40,
    field: "",
    set_id: 0,
  },
  {
    id: 26,
    name: "外付けHDD",
    type: "attachment",
    img: "../assets/cards/External-HDD.png",
    action: "enhancement",
    value: 40,
    field: "",
    set_id: 0,
  },
  {
    id: 27,
    name: "PHP",
    type: "language",
    img: "../assets/cards/PHP.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 28,
    name: "Perl",
    type: "language",
    img: "../assets/cards/Perl.png",
    action: "attack",
    value: 40,
    field: "",
    set_id: 0,
  },
  {
    id: 29,
    name: "Objective-C",
    type: "language",
    img: "../assets/cards/Objective-C.png",
    action: "attack",
    value: 30,
    field: "iOS,macOS",
    set_id: 0,
  },
  {
    id: 30,
    name: "Swift",
    type: "language",
    img: "../assets/cards/Swift.png",
    action: "attack",
    value: 30,
    field: "iOS,macOS",
    set_id: 0,
  },
  {
    id: 31,
    name: "Kotlin",
    type: "language",
    img: "../assets/cards/Kotlin.png",
    action: "attack",
    value: 30,
    field: "AndroidOS",
    set_id: 0,
  },
  {
    id: 32,
    name: "dart",
    type: "language",
    img: "../assets/cards/dart.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 33,
    name: "Rust",
    type: "language",
    img: "../assets/cards/Rust.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 34,
    name: "tailwind",
    type: "framework",
    img: "../assets/cards/tailwind.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 3,
  },
  {
    id: 35,
    name: "冷却ファン",
    type: "attachment",
    img: "../assets/cards/Cooling-fan.png",
    action: "enhancement",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 36,
    name: "Node.js",
    type: "framework",
    img: "../assets/cards/Node.js.png",
    action: "attack",
    value: 40,
    field: "WindowsOS",
    set_id: 1,
  },
  {
    id: 37,
    name: "Go",
    type: "language",
    img: "../assets/cards/Go.png",
    action: "attack",
    value: 40,
    field: "",
    set_id: 0,
  },
  {
    id: 38,
    name: "Haskell",
    type: "language",
    img: "../assets/cards/Haskell.png",
    action: "attack",
    value: 40,
    field: "",
    set_id: 0,
  },
  {
    id: 39,
    name: "Ruby",
    type: "language",
    img: "../assets/cards/Ruby.png",
    action: "attack",
    value: 40,
    field: "",
    set_id: 0,
  },
  {
    id: 40,
    name: "外付けSSD",
    type: "attachment",
    img: "../assets/cards/External-SSD.png",
    action: "enhancement",
    value: 20,
    field: "",
    set_id: 0,
  },
  {
    id: 41,
    name: "C",
    type: "language",
    img: "../assets/cards/C.png",
    action: "attack",
    value: 50,
    field: "",
    set_id: 0,
  },
  {
    id: 42,
    name: "C#",
    type: "language",
    img: "../assets/cards/Cs.png",
    action: "attack",
    value: 50,
    field: "",
    set_id: 0,
  },
  {
    id: 43,
    name: "Java",
    type: "language",
    img: "../assets/cards/Java.png",
    action: "attack",
    value: 50,
    field: "",
    set_id: 0,
  },
  {
    id: 44,
    name: "C++",
    type: "language",
    img: "../assets/cards/C++.png",
    action: "attack",
    value: 60,
    field: "",
    set_id: 0,
  },
  {
    id: 45,
    name: "cobol",
    type: "language",
    img: "../assets/cards/cobol.png",
    action: "attack",
    value: 70,
    field: "",
    set_id: 0,
  },
  {
    id: 46,
    name: "fortran",
    type: "language",
    img: "../assets/cards/Fortran.png",
    action: "attack",
    value: 80,
    field: "",
    set_id: 0,
  },
  {
    id: 47,
    name: "セカンドディスプレイ",
    type: "attachment",
    img: "../assets/cards/PC-Monitor.png",
    action: "enhancement",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 48,
    name: "キーボード",
    type: "attachment",
    img: "../assets/cards/Keyboard.png",
    action: "enhancement",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 49,
    name: "マウス",
    type: "attachment",
    img: "../assets/cards/mouse.png",
    action: "enhancement",
    value: 10,
    field: "",
    set_id: 0,
  },
  {
    id: 50,
    name: "なでしこ",
    type: "language",
    img: "../assets/cards/Nadeshiko.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 51,
    name: "ドリトル",
    type: "language",
    img: "../assets/cards/dolittle.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 52,
    name: "プロデル",
    type: "language",
    img: "../assets/cards/Prodel.png",
    action: "attack",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 53,
    name: "Scratch",
    type: "language",
    img: "../assets/cards/Scratch.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 0,
  },
  {
    id: 55,
    name: "Hacker",
    type: "hack",
    img: "../assets/cards/hacker2.png",
    action: "steal",
    value: 30,
    field: "",
    set_id: 0,
  },
  {
    id: 56,
    name: "BootStrap",
    type: "framework",
    img: "../assets/cards/BootStrap.png",
    action: "attack",
    value: 20,
    field: "",
    set_id: 3,
  },
];
