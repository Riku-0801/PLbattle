<template>
<v-app>
  <v-container>
    <!-- カードを出す場所 -->
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
    <!-- 自分の手札 -->
    <div class="mycards">
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
      <div
        v-for='able in ableattacks'
        :key="able.name"
      >
        <div>{{ able.name }}</div>
        <div>必要カード{{ able.contain }}</div>
      </div>
      <v-btn @click="deleteCards">発動</v-btn>
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
    deleteCards: function(index){
      this.selecteddata.splice(index, this.selecteddata.length)
    },
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
        
    },
    computed: {
      ableattacks: function(){
        // selecteddataのnameだけを集めた
        let updateddata = this.selecteddata.map(obj => obj.name)
        // 配列の完全一致を判定
        const isIncludes = (arr, target) => arr.every(el => target.includes(el))
        if(updateddata.length === 0){
          // 何も選択されていないとき空の配列を返す
          return []
        }else{
          // 完全一致した攻撃だけを返す
          return this.specialAttack.filter(attack => {
            return isIncludes(updateddata, attack.contain)
          })
        }
      }
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
  height: 300px;
}
</style>