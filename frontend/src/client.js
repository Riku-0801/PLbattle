import io from "socket.io-client";

export default {
  name: "room",
  data() {
    return {
      cardValue: [],
      // 1) サーバ連結
      socket: io("localhost:3000"),
    };
  },
  methods: {
    //cardValueをサーバーサイドへ送信
    sendValue(cardValue) {
      this.socket.emit("value", cardValue);
    },
    //roomIdをサーバーサイドへ送信
    sendRoomId(roomId) {
      this.socket.emit("login", roomId);
    },
  },
  mounted() {
    //cardValueを受け取った時の処理
    this.socket.on("cardValue", function (cardValue) {});
  },
};
