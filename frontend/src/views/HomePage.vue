<template>
  <v-container>
    <button @click="issue">IDを発行</button>
    <br />
    <span>id：{{ number }}</span>
    <p>相手のIDを入力してください</p>
    <input v-model="id" placeholder="edit me" />
    <br />
    <v-btn @click="sendRoomId(id)">
      aa
    </v-btn>
    <router-link :to="{ name: 'field' }" @click="sendRoomId(100)">スタート</router-link>
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
      turn_flag: 0
    };
  },
  mounted(){
    this.socket.on("turnflag", function (turn_flag) {
    this.turn_flag = 1;
    console.log(this.turn_flag)
    localStorage.setItem('turn_flag', 1)
  });
  },
  methods: {
    issue() {
      // HACK: ID作る関数入れておく
      this.number = Math.random().toString(32).substring(2);
    },
    sendRoomId: function(RoomId) {
      this.socket.emit("login", RoomId);
      this.turn_flag = 0;
      console.log(RoomId)
    },
    set() {
      localStorage.setItem('obj', JSON.stringify({
        turn_flag: 1,
        HP: 200
      }))
    }
  }
};
</script>
