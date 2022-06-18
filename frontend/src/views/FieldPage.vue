<template>
  <v-container fluid="false" class="bg">
    <v-row>
      <FieldCard
        v-for="sample in sampledata"
        :key="sample.id"
        :id="sample.id"
        :name="sample.name"
        :type="sample.type"
        :attack="sample.attack"
      />
    </v-row>
  </v-container>
</template>

<script>
import FieldCard from "../components/FieldCard.vue";

export default {
  name: "field",
  components: {
    FieldCard,
  },
  data() {
    return {
      sampledata: [
        {
          id: 1,
          name: "C",
          type: "language",
          attack: 50,
        },
        {
          id: 2,
          name: "C++",
          type: "language",
          attack: 60,
        },
        {
          id: 3,
          name: "C#",
          type: "language",
          attack: 50,
        },
        {
          id: 4,
          name: "python",
          type: "language",
          attack: 20,
        },
        {
          id: 5,
          name: "Java",
          type: "language",
          attack: 50,
        },
        {
          id: 6,
          name: "R",
          type: "language",
          attack: 20,
        },
      ],
    };
  },
};
</script>
<style scoped>
.bg {
  background-color: rgba(0, 18, 42);
  height: 100vh;
}
</style>
