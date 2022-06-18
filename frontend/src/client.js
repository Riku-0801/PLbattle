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
    sendValue(cardValue) {
      // 2) valueをserver側へ送信
      this.socket.emit("value", cardValue);
    },
    sendRoomId(roomId) {
      this.socket.emit("login", roomId);
    },
  },
  mounted() {
    // 3) サーバの変更内容を受信
    this.socket.on("cardValue", function (cardValue) {});
  },
};
