<template>
  <v-hover v-slot="{ hover }">
    <v-col cols="2">
      <v-card
        width="200px"
        height="232.5px"
        hover
        :img="require('../assets/cards/BootStrap.png')"
      >
      </v-card>
      <!-- hover時に表示 -->
      <v-expand-transition>
        <div v-if="hover" width="100" color="rgba(0, 18, 42)">
          <p>{{ name }}</p>
          <p>type: {{ type }}</p>
          <p>attack: {{ attack }}</p>
        </div>
      </v-expand-transition>
    </v-col>
  </v-hover>
</template>

<script>
export default {
  props: ["id", "name", "type", "attack"],
};
</script>

<style scoped></style>
