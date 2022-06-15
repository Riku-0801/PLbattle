<template>
<v-hover
  v-slot="{ hover }"
>
  <v-col
    cols="2"
  >
    <v-card
      height="200px"
      hover
      :img="require('../assets/logo.png')"
    >
    </v-card>
      <!-- hover時に表示 -->
      <v-expand-transition>
        <div
          v-if="hover"
          width="100"
        >
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
  props:[
    'id',
    'name',
    'type',
    'attack'
  ]
}
</script>

<style scoped>

</style>