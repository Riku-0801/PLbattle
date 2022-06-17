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
    <v-btn
        @click = "sendDatas"
      >コンボ判定</v-btn>
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
        recent_selectdata_id: [],
        tmp: 0
      }
    },
    mounted() {
    window.onload = ()=>{
      this.$axios.get('/data')
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
		this.$axios.get('/data')
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
    },
    sendDatas: function() {
      this.$axios.get('/combo_data')
      .then(res => {
        console.log(res.data)
        this.recent_selectdata_id = []
        for (let i = 0; i < this.selecteddata.length; i++){
          this.recent_selectdata_id.push(this.selecteddata[i].id)
        }
        console.log(this.recent_selectdata_id)
        for (let i = 0; i < res.data.length; i++){
          console.log(res.data[i].id_list)
          if(JSON.stringify(res.data[i].id_list) === JSON.stringify(this.recent_selectdata_id)){
            console.log("成功です")
          }else{
            console.log("これはコンボじゃないよ")
          }
        }
      })
        //ここにwebsocketを使って通信するシステムを記述、あるいはその内容をbackendに飛ばす処理を行う
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