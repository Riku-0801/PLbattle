<template>
  <v-app>
    <header>
      <v-app-bar
        elevation='1'
      >
        <v-toolbar-title>PLbattle</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- クリックしたらモーダルを表示 -->
        <v-btn>遊び方</v-btn>
      </v-app-bar>
    </header>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
    data() {
        return {

        }
    }
};
</script>

<style scoped>

</style>