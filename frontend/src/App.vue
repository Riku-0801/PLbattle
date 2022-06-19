<template>
  <v-app>
    <header class="header-menu">
      <v-app-bar elevation="1" color="#263238">
        <!-- <v-toolbar-title color="#E8EAF6">PLbattle</v-toolbar-title>-->
        <span class="title">CODE DUEL</span>
        <v-spacer></v-spacer>
        <v-btn outlined @click="openModal" class="btn">遊び方</v-btn>
      </v-app-bar>
    </header>
    <BattleExplanation v-bind:bool="showExplanation" @from-child="closeModal" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
import BattleExplanation from ".//components/BattleExplanation.vue";

export default {
  components: {
    BattleExplanation,
  },
  data() {
    return {
      // モーダルを非表示
      showExplanation: false,
    };
  },
  methods: {
    openModal: function () {
      this.showExplanation = true;
    },
    closeModal: function () {
      this.showExplanation = false;
    },
  },
};
</script>

<style scoped>
template {
  margin: 0px;
}
#app {
  font-family: "Chakra Petch", sanserif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #ffffff;
  background: radial-gradient(#134e61, #102335);
}
.header-menu {
  background: #102335;
}
v-main {
  margin: 0;
  max-width: 1440px;
}

.title {
  color: #ffffff;
}

.btn {
  color: #ffffff;
  text-align: center;
  text-decoration: none;
  text-decoration-color: transparent;
  margin: 1rem;
  justify-content: center;
  box-shadow: 0 0 0.75rem #d3fffd;
}
</style>
