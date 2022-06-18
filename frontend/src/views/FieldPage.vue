<template>
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
        v-for="(select) in selecteddata"
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
      <!-- 使える技を表示 -->
      <div
        v-for='able in ableattacks'
        :key="able.name"
      >
        <div>{{ able.name }}</div>
        <div>必要カード{{ able.contain }}</div>
      </div>
      <!-- 自分と相手のHPを表示 -->
      <div>
        <div>hp</div>
        <div>自分:{{ sampleHp.mine }}</div>
        <div>相手:{{ sampleHp.yours }}</div>
      </div>
      <v-btn @click="useCards">発動</v-btn>
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
        showAttack: false,
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
        ],
        specialAttack:[
          {
            name: "Cアタック",
            contain: [
              "C", "C++", "C#"
            ],
            value: 500
          },
          {
            name: "pythonアタック",
            contain: [
              "python", "django"
            ],
            value: 300
          }
        ],
        sampleHp:{
            mine: 300,
            yours: 300
        }
      }
    },
    methods: {
      // ボタンを押したらカードを削除
      useCards: function(index){
        this.showAttack = true
        // todo: 必殺技からもvalueをとってくるようにする
        this.sampleHp.yours = this.sampleHp.yours - this.selecteddata[0].value
        this.selecteddata.splice(index, this.selecteddata.length);
      },
      closeModal: function(){
        this.showAttack = false
      }
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