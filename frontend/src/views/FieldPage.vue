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
        :key="able.name_en"
      >
        <div>{{ able.name_en }}</div>
        <div>必要カード{{ able.name_list }}</div>
      </div>
      <v-btn v-bind:disabled = "attack_decision" @click="deleteCards">発動</v-btn>
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
        combo_data: [],
        recent_mydata_len: [],
        recent_selectdata: [],
        tmp: 0,
        judge: false
      }
    },
    mounted() {
    window.onload = ()=>{
      //windowsリロード時に発火するコードです
      //combo_dataをバックから貰って、それをフロント側で保存します。
      this.$axios.get('/combo_data')
        .then(res => {
          for (let i = 0;i < res.data.length; i++){
            this.combo_data.push(res.data[i])
          }
          console.log(this.combo_data)
        })
      //初期ドローを行います。6枚もらいます。いえい
      this.$axios.get('/data')
        .then(res => {
          for (let i = this.mydata.length; i < 6;){
          this.tmp = Number(Math.floor(Math.random() * 57));
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
    //カードを消します。本来は、ここでデータを送信します。
    deleteCards: function(index){
      this.selecteddata.splice(index, this.selecteddata.length)
    },
    getDatas: function() {
    //ドロー機能です。
		this.$axios.get('/data')
    .then(res => {
      this.recent_mydata_len = []
      //現在の手札のidリストを初期化しています
      for(let i = 0; i < this.mydata.length; i++){
        this.recent_mydata_len.push(this.mydata[i].id-1)
        //現在の手札idをいれました。
      }
      for (let i = this.mydata.length-1; i < 5;){
        this.tmp = Number(Math.floor(Math.random() * 57));
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
  },
  computed: {
      ableattacks: function(){
        // selecteddataのidだけを集めた
        let updateddata = this.selecteddata.map(obj => obj.id)
        // 配列の完全一致を判定
        const isIncludes = (arr, target) => arr.every(el => target.includes(el))
        //recent_selectdataに、idに対応するカードの名前を入れたい
        if(updateddata.length === 0){
          // 何も選択されていないとき空の配列を返す
          return []
        }else{
          // 完全一致した攻撃だけを返す
            return this.combo_data.filter(combo_data => {
              return isIncludes(updateddata, combo_data.id_list)
            })
        }
      },
      //カードの判定をします！！ここでしてます！！読みにくくてごめんなさい！！
      attack_decision:function(){
        let updateddata = this.selecteddata.map(obj => obj.id)
        const isIncludes = (arr, target) => arr.every(el => target.includes(el))
        if(updateddata.length === 0){
          return true
        }else if(updateddata.length === 1){
          return false
        }else{
          // 完全一致した攻撃だけを返す
            this.combo_data.filter(combo_data => {
              if(isIncludes(updateddata, combo_data.id_list) === true){
                return false
              }
            })
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