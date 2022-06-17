<template>
<v-app>
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
        :key="`first-${select.id}`"
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
          :key="`second-${mine.id}`"
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
  
  <v-main>
    <v-btn
        @click = "getDatas"
      >ドロー</v-btn>
  </v-main>
  </v-app>
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
        selecteddata: [],
        mydata: [],
        mydata_len: [],
        recent_mydata_len: [],
        tmp: 0
      }
    },
    mounted() {
    window.onload = ()=>{
      this.$axios.get('/message')
        .then(res => {
          for (let i = this.mydata.length; i < 6;){
          this.tmp = Number(Math.floor(Math.random() * 10));
          if(!this.mydata_len.includes(this.tmp)){
            this.mydata_len.push(this.tmp);
            this.mydata.push(res.data[this.mydata_len[i]])
            i++;
          }
        }
        })
        console.log(this.mydata)
        console.log("初期データ移行完了")
      }
    },
    methods: {
    getDatas: function() {
		this.$axios.get('/message')
    .then(res => {
      this.recent_mydata_len = []
      console.log(this.mydata)
      console.log(this.selecteddata)
      for(let i = 0; i < this.mydata.length; i++){
        this.recent_mydata_len.push(this.mydata[i].id-1)
      }
      for (let i = this.mydata.length-1; i < 5;){
        this.tmp = Number(Math.floor(Math.random() * 10));
        if(!this.recent_mydata_len.includes(this.tmp)){
          this.mydata_len.push(this.tmp);
          this.mydata.push(res.data[this.mydata_len[i-this.mydata.length+this.mydata_len.length]])
          i++;
        }
        }
      console.log("ドロー完了")
		})
    .catch(err => {
        console.error(err)
      })
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