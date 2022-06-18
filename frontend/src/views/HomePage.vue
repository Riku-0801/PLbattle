<template>
  <v-container>
    <button @click="issue">IDを発行</button>
    <br />
    <span>id：{{ number }}</span>
    <p>相手のIDを入力してください</p>
    <input v-model="id" placeholder="edit me" />
    <br />
    <router-link :to="{ name: 'field' }">スタート</router-link>
  </v-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      number: "",
      id: "",
    };
  },
  methods: {
    issue() {
      // HACK: ID作る関数入れておく
      this.number = Math.random().toString(32).substring(2);
    },
  },
};
</script>
