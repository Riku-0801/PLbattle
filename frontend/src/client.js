import io from "socket.io-client";

export default {
  name: "room",
  data() {
    return {
      cardValue: [],
      turn_flag: 0,
      recieved_cardValue: [],
      // 1) サーバ連結
      socket: io("localhost:3000"),
    };
  },
  methods: {
    //cardValueをサーバーサイドへ送信
    sendValue(cardValue) {
      this.turn_flag = 1
      this.socket.emit("value", cardValue);
    },
    //roomIdをサーバーサイドへ送信
    sendRoomId(roomId) {
      this.socket.emit("login", roomId);
    },
  },
  mounted() {
    //cardValueを受け取った時の処理
    this.socket.on("cardValue", function (cardValue) {
      //ここに処理を書く
      this.recieved_cardValue = [cardValue];
      this.turn_flag = 0
      console.log(this.turn_flag)
    });
  },
};
