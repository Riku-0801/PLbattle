<template>
<v-app>
  <v-container>
    <!-- 攻撃エフェクト -->
    <div
     v-show="showAttack"
     class="overlay"
     @click="closeModal"
    >
      <div class="effect">卍解 天鎖斬月</div>
    </div>
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
            img="../assets/logo.png"
          >
            <!-- <v-img
              height="200px"
              :src="mine.png"
            >{{ mine.name }}
            </v-img> -->
          </v-card>
        </div>
      </VueDrag>
      <!-- 使える技を表示 -->
      <div
        v-for='able in ableattacks'
        :key="able.name_en"
      >
        <div>{{ able.name_en }}</div>
        <div>必要カード{{ }}</div>
      </div>
      <!-- 自分と相手のHPを表示 -->
      <div>
        <div>hp</div>
        <div>自分:{{ sampleHp.mine }}</div>
        <div>相手:{{ sampleHp.yours }}</div>
      </div>
      <v-btn @click="useCards">発動</v-btn>
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
      showAttack: false,
      options: {
        group: "myGroup",
        animation: 200
      },
      selecteddata: [],
      mydata: [],
      mydata_len: [],
      combo_data: [],
      recent_mydata_len: [],
      recent_selectdata_id: [],
      tmp: 0,
      sampleHp:{
          mine: 300,
          yours: 300
      }
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
        this.tmp = Number(Math.floor(Math.random() * 2));
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
    useCards: function(index){
        this.showAttack = true
        // todo: 必殺技からもvalueをとってくるようにする
        this.sampleHp.yours = this.sampleHp.yours - this.selecteddata[0].value
        this.selecteddata.splice(index, this.selecteddata.length);
    },
    closeModal: function(){
      this.showAttack = false
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
          this.tmp = Number(Math.floor(Math.random() * 2));
          if(!this.recent_mydata_len.includes(this.tmp)){
            this.mydata_len.push(this.tmp);
            let pushdata = res.data[this.mydata_len[i-this.mydata.length+this.mydata_len.length]]
            // let aaa = pushdata.img
            // let bbb = require(aaa)
            // pushdata.name = '変更したぜ'
            // pushdata.img = bbb
            console.log(pushdata.img)
            this.mydata.push(pushdata)
            i++;
          }
        }
      console.log("ドロー完了")
      console.log(this.mydata)
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
      }
    }
  }

</script>

<style scoped>
.overlay{
  /*　要素を重ねた時の順番　*/
  z-index:1;

  /*　画面全体を覆う設定　*/
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);

  /*　画面の中央に要素を表示させる設定　*/
  display: flex;
  align-items: center;
  justify-content: center;
}

.effect {
  width: 50%;
  height: 50%;
  background-color: brown;
}

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