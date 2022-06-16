<template>
  <v-container>
    <div class="field">
      <VueDrag
        v-model="selecteddata"
        group="myGroup"
        @start="drag=true"
        @end="drag=false"
        :options="options"
        class="area"
      >
      <div
        v-for="select in selecteddata"
        :key="select.id"
        class="item"
      >
        <v-card
          height="200px"
          hover
        >{{ select.name }}
        </v-card>
      </div>
      </VueDrag>
    </div>
      <VueDrag
        v-model="mydata"
        group="myGroup"
        @start="drag=true"
        @end="drag=false"
        :options="options"
        class="area"
      >
        <div
          v-for="mine in mydata"
          :key="mine.id"
          class="item"
        >
          <v-card
            height="200px"
            hover
          >{{ mine.name }}
          </v-card>
        </div>
      </VueDrag>
  </v-container>
</template>

<script>
import VueDrag from 'vuedraggable'

  export default {
    name: 'field',
    components: {
      VueDrag
    },
    data (){
      return {
        options: {
          group: "myGroup",
          animation: 200
        },
        selecteddata: [
        ],
        mydata: [
          {
            id: 1,
            name: "C",
            type: "language",
            value: 50
          },
          {
            id: 2,
            name: "C++",
            type: "language",
            value: 60
          },
          {
            id: 3,
            name: "C#",
            type: "language",
            value: 50
          },
          {
            id: 4,
            name: "python",
            type: "language",
            value: 20
          },
          {
            id: 5,
            name: "Java",
            type: "language",
            value: 50
          },
          {
            id: 6,
            name: "R",
            type: "language",
            value: 20
          },
        ]
      }
    }
  }
</script>

<style scoped>
.field {
  height: 300px;
  width: 100%;
  background-color: aquamarine;
}

.item {
  display: inline-block;
  margin: 10px;
  width: 12%;
}

.item:hover {
  cursor: grab;
}

.item:active{
  cursor: grabbing;
}

.area {
  width: 100%;
  height: 400px;
}
</style>