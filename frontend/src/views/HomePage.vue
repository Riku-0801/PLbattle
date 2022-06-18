<template>
  <v-container>
    <button @click="issue">IDを発行</button>
    <br />
    <span>id：{{ number }}</span>
    <p>相手のIDを入力してください</p>
    <input v-model="id" placeholder="edit me" />
    <br />
    <v-btn @click="sendRoomId('hogehoge')">スタート</v-btn>
    <v-btn @click="push()">スタート</v-btn>
  </v-container>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "home",
  data() {
    return {
      number: "",
      id: "",
      socket: io("localhost:3000"),
      turn_flag: 0,
    };
  },
  mounted() {
    this.socket.on("logined", function (userId) {
      console.log(userId);
      localStorage.setItem("userId", userId);
      //this.push();
    });
  },
  methods: {
    issue() {
      // HACK: ID作る関数入れておく
      this.number = Math.random().toString(32).substring(2);
    },
    sendRoomId: function (RoomId) {
      this.socket.emit("login", RoomId);
      console.log(RoomId);
    },
    push() {
      this.$router.push({ name: "field", query: { room: "hogehoge" } });
    },
    set() {
      localStorage.setItem(
        "obj",
        JSON.stringify({
          turn_flag: 1,
          HP: 200,
        })
      );
    },
  },
};
</script>
