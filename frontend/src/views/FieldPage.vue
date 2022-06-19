<template>
  <v-app>
    <v-container>
      <div v-show="oponentTurn" class="overlay">
        <v-card class="caution">相手のターン</v-card>
      </div>
      <v-btn @click="oponentAttack">相手の攻撃</v-btn>
      <!-- 相手の攻撃エフェクト -->
      <div v-show="showOponent" class="overlay" @click="closeOponent">
        <!-- 相手の攻撃情報をここに持ってくる -->
        <v-card height="475px" width="400px" class="black">
          <v-img src="../assets/cards/Angular.png"></v-img>
        </v-card>
        <div class="dalayEffect">Mark Up</div>
      </div>
      <!-- 自分の攻撃エフェクト -->
      <div v-show="showAttack" class="overlay" @click="getCardValue">
        <div class="dalayEffect">{{ effect }}</div>
      </div>
      <!-- カードを出す場所 -->
      <v-row class="field-row"
        ><div>
          <h4 class="text">HP</h4>
          <h2 class="text">自分：{{ sampleHp.mine }}</h2>
          <h4 class="text">相手：{{ sampleHp.yours }}</h4>
        </div>
        <div>
          <v-btn @click="useCards" class="btn action" v-if="attack_decision"
            >発動</v-btn
          >
          <p v-else>発動可能なカードを選択してください</p>
        </div>
      </v-row>
      <v-row class="field-row">
        <v-col cols="3">
          <div class="action-list">
            <div>></div>
            <div v-for="able in ableattacks" :key="able.name_en">
              <div>>　action：{{ able.name_en }}</div>
              <div>>　必要なカード：{{ able.name_list }}</div>
            </div>
          </div>
        </v-col>
        <v-col cols="9">
          <div class="field">
            <VueDrag
              v-model="selecteddata"
              group="myGroup"
              @start="drag = true"
              @end="drag = false"
              :options="options"
              class="area"
            >
              <div
                v-for="select in selecteddata"
                :key="`first-${select.id}`"
                class="item"
              >
                <v-card height="242px" max-width="200px" hover class="black">
                  <v-img
                    aspect-ratio="475/400"
                    height="242px"
                    :src="select.img"
                  >
                  </v-img>
                </v-card>
              </div>
            </VueDrag>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <VueDrag
          v-model="mydata"
          group="myGroup"
          @start="drag = true"
          @end="drag = false"
          :options="options"
          class="area"
        >
          <div v-for="mine in mydata" :key="`second-${mine.id}`" class="item">
            <v-card hover>
              <v-img :src="mine.img"> </v-img>
            </v-card>
          </div>
        </VueDrag>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import VueDrag from "vuedraggable";
import io from "socket.io-client";

export default {
  name: "field",
  components: {
    VueDrag,
  },
  data() {
    return {
      effect: "action",
      cardValue: [
        {
          value: 0,
          name_list: "",
        },
      ],
      turn_flag: 0,
      recieved_cardValue: [],
      // 1) サーバ連結
      socket: io("localhost:3000"),
      combo_data_db: [
        {
          combo_id: 1,
          name_en: "Royal Straight Flush",
          name_ja: "ロイヤルストレートフラッシュ",
          action_value: 500,
          id_list: [29, 41, 42, 44],
          name_list: ["Objective-C", "C", "C#", "C++"],
        },
        {
          combo_id: 2,
          name_en: "Mark Up",
          name_ja: "マークアップ",
          action_value: 40,
          id_list: [2, 3],
          name_list: ["HTML", "CSS"],
        },
        {
          combo_id: 3,
          name_en: "Rookie",
          name_ja: "ルーキー",
          action_value: 60,
          id_list: [1, 2, 3],
          name_list: ["Javascript", "HTML", "CSS"],
        },
        {
          combo_id: 4,
          name_en: "Jewelry",
          name_ja: "ジュエリー",
          action_value: 100,
          id_list: [28, 29],
          name_list: ["Perl", "Objective-C"],
        },
        {
          combo_id: 5,
          name_en: "P_combo1",
          name_ja: "Pコンボ1",
          action_value: 80,
          id_list: [27, 28],
          name_list: ["PHP", "Perl"],
        },
        {
          combo_id: 6,
          name_en: "P_combo2",
          name_ja: "Pコンボ2",
          action_value: 80,
          id_list: [10, 27],
          name_list: ["Python", "PHP"],
        },
        {
          combo_id: 7,
          name_en: "P_combo3",
          name_ja: "Pコンボ3",
          action_value: 80,
          id_list: [10, 28],
          name_list: ["Python", "Perl"],
        },
        {
          combo_id: 8,
          name_en: "P_Family",
          name_ja: "Pファミリー",
          action_value: 100,
          id_list: [10, 27, 28],
          name_list: ["Python", "PHP", "Perl"],
        },
        {
          combo_id: 9,
          name_en: "R_combo1",
          name_ja: "Rコンボ1",
          action_value: 50,
          id_list: [11, 33],
          name_list: ["R", "Rust"],
        },
        {
          combo_id: 10,
          name_en: "R_combo2",
          name_ja: "Rコンボ2",
          action_value: 60,
          id_list: [11, 39],
          name_list: ["R", "Ruby"],
        },
        {
          combo_id: 11,
          name_en: "R_combo3",
          name_ja: "Rコンボ3",
          action_value: 80,
          id_list: [33, 39],
          name_list: ["Rust", "Ruby"],
        },
        {
          combo_id: 12,
          name_en: "R_Family",
          name_ja: "Rファミリー",
          action_value: 90,
          id_list: [11, 33, 39],
          name_list: ["R", "Rust", "Ruby"],
        },
        {
          combo_id: 13,
          name_en: "Chalk & Cheese",
          name_ja: "月と鼈",
          action_value: 60,
          id_list: [1, 43],
          name_list: ["Javascript", "Java"],
        },
        {
          combo_id: 14,
          name_en: "The Script Brothers",
          name_ja: "スクリプト兄弟",
          action_value: 50,
          id_list: [1, 12],
          name_list: ["Javascript", "TypeScript"],
        },
        {
          combo_id: 15,
          name_en: "Bird",
          name_ja: "バード",
          action_value: 70,
          id_list: [30, 31],
        },
        {
          combo_id: 16,
          name_en: "Google",
          name_ja: "グーグル",
          action_value: 80,
          id_list: [32, 37],
        },
        {
          combo_id: 17,
          name_en: "Apple",
          name_ja: "アップル",
          action_value: 70,
          id_list: [29, 30],
        },
        {
          combo_id: 18,
          name_en: "Pythons1",
          name_ja: "パイソンズ1",
          action_value: 40,
          id_list: [4, 5],
        },
        {
          combo_id: 19,
          name_en: "Pythons2",
          name_ja: "パイソンズ2",
          action_value: 50,
          id_list: [4, 16],
        },
        {
          combo_id: 20,
          name_en: "Pythons3",
          name_ja: "パイソンズ3",
          action_value: 50,
          id_list: [5, 16],
        },
        {
          combo_id: 21,
          name_en: "The Python Brothers",
          name_ja: "パイソン兄弟",
          action_value: 70,
          id_list: [4, 5, 16],
          name_list: ["Django", "FastAPI", "Flask"],
        },
        {
          combo_id: 22,
          name_en: "Animals2",
          name_ja: "アニマルズ1",
          action_value: 80,
          id_list: [10, 37],
          name_list: ["Python", "Go"],
        },
        {
          combo_id: 23,
          name_en: "Animals2",
          name_ja: "アニマルズ2",
          action_value: 70,
          id_list: [10, 51],
          name_list: ["Python", "ドリトル"],
        },
        {
          combo_id: 24,
          name_en: "Animals3",
          name_ja: "アニマルズ3",
          action_value: 80,
          id_list: [37, 51],
          name_list: ["Go", "ドリトル"],
        },
        {
          combo_id: 25,
          name_en: "Japanese",
          name_ja: "ジャパニーズ",
          action_value: 90,
          id_list: [50, 51, 52],
          name_list: ["なでしこ", "ドリトル", "プロデル"],
        },
        {
          combo_id: 26,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 45,
          id_list: [1, 15],
          name_list: ["JavaScript", "Vue"],
        },
        {
          combo_id: 27,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 30,
          id_list: [1, 6],
          name_list: ["JavaScript", "jQuery"],
        },
        {
          combo_id: 28,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 45,
          id_list: [1, 18],
          name_list: ["JavaScript", "Angular"],
        },
        {
          combo_id: 29,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 75,
          id_list: [1, 36],
          name_list: ["JavaScript", "Node.js"],
        },
        {
          combo_id: 30,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 45,
          id_list: [10, 16],
          name_list: ["Python", "Flask"],
        },
        {
          combo_id: 31,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 30,
          id_list: [10, 4],
          name_list: ["Python", "Django"],
        },
        {
          combo_id: 32,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 30,
          id_list: [10, 5],
          name_list: ["Python", "FastAPI"],
        },
        {
          combo_id: 33,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 60,
          id_list: [3, 34],
          name_list: ["CSS", "tailwind"],
        },
        {
          combo_id: 34,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 90,
          id_list: [27, 23],
          name_list: ["PHP", "Laravel"],
        },
        {
          combo_id: 35,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 90,
          id_list: [27, 8],
          name_list: ["PHP", "CakePHP"],
        },
        {
          combo_id: 36,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 105,
          id_list: [39, 17],
          name_list: ["Ruby", "Rails"],
        },
        {
          combo_id: 37,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 75,
          id_list: [30, 9],
          name_list: ["Swift", "SwiftUI"],
        },
        {
          combo_id: 38,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 90,
          id_list: [37, 20],
          name_list: ["Go", "echo"],
        },
        {
          combo_id: 39,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 105,
          id_list: [43, 19],
          name_list: ["Java", "Spring"],
        },
        {
          combo_id: 40,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 75,
          id_list: [33, 21],
          name_list: ["Rust", "Rocket"],
        },
        {
          combo_id: 41,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 75,
          id_list: [33, 22],
          name_list: ["Rust", "Yew"],
        },
        {
          combo_id: 42,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 105,
          id_list: [32, 24],
          name_list: ["dart", "Flutter"],
        },
        {
          combo_id: 43,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 75,
          id_list: [31, 7],
          name_list: ["Kotlin", "Ktor"],
        },
        {
          combo_id: 44,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 75,
          id_list: [33, 14],
          name_list: ["Rust", "warp"],
        },
        {
          combo_id: 45,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 45,
          id_list: [3, 56],
          name_list: ["CSS", "Bootstrap"],
        },
        {
          combo_id: 46,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 75,
          id_list: [12, 15],
          name_list: ["TypeScript", "Vue"],
        },
        {
          combo_id: 47,
          name_en: "Pair",
          name_ja: "ペア",
          action_value: 75,
          id_list: [12, 18],
          name_list: ["TypeScript", "Angular"],
        },
      ],
      data_db: [
        {
          id: 1,
          name: "Javascript",
          type: "language",
          img: require("../assets/cards/JavaScript.png"),
          action: "attack",
          value: 10,
          field: "",
          set_id: 0,
        },
        {
          id: 1,
          name: "Javascript",
          type: "language",
          img: require("../assets/cards/JavaScript.png"),
          action: "attack",
          value: 10,
          field: "",
          set_id: 0,
        },
        {
          id: 1,
          name: "Javascript",
          type: "language",
          img: require("../assets/cards/JavaScript.png"),
          action: "attack",
          value: 10,
          field: "",
          set_id: 0,
        },
        {
          id: 2,
          name: "HTML",
          type: "language",
          img: require("../assets/cards/HTML.png"),
          action: "attack",
          value: 10,
          field: "",
          set_id: 0,
        },
        {
          id: 3,
          name: "CSS",
          type: "language",
          img: require("../assets/cards/CSS.png"),
          action: "attack",
          value: 10,
          field: "",
          set_id: 0,
        },
        {
          id: 4,
          name: "Django",
          type: "framework",
          img: require("../assets/cards/Django.png"),
          action: "attack",
          value: 20,
          field: "LinuxOS",
          set_id: 10,
        },
        {
          id: 5,
          name: "FastAPI",
          type: "framework",
          img: require("../assets/cards/FastAPI.png"),
          action: "attack",
          value: 10,
          field: "LinuxOS",
          set_id: 10,
        },
        {
          id: 6,
          name: "jQuery",
          type: "framework",
          img: require("../assets/cards/jQuery.png"),
          action: "attack",
          value: 10,
          field: "",
          set_id: 10,
        },
        {
          id: 7,
          name: "Ktor",
          type: "framework",
          img: require("../assets/cards/Ktor.png"),
          action: "attack",
          value: 20,
          field: "AndroidOS",
          set_id: 31,
        },
        {
          id: 8,
          name: "Cake PHP",
          type: "framework",
          img: require("../assets/cards/CakePHP.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 27,
        },
        {
          id: 9,
          name: "SwiftUI",
          type: "framework",
          img: require("../assets/cards/SwiftUI.png"),
          action: "attack",
          value: 20,
          field: "iOS,macOS",
          set_id: 30,
        },
        {
          id: 10,
          name: "Python",
          type: "language",
          img: require("../assets/cards/Python.png"),
          action: "attack",
          value: 30,
          field: "LinuxOS",
          set_id: 0,
        },
        {
          id: 10,
          name: "Python",
          type: "language",
          img: require("../assets/cards/Python.png"),
          action: "attack",
          value: 30,
          field: "LinuxOS",
          set_id: 0,
        },
        {
          id: 10,
          name: "Python",
          type: "language",
          img: require("../assets/cards/Python.png"),
          action: "attack",
          value: 30,
          field: "LinuxOS",
          set_id: 0,
        },
        {
          id: 11,
          name: "R",
          type: "language",
          img: require("../assets/cards/R.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 0,
        },
        {
          id: 12,
          name: "TypeScript",
          type: "language",
          img: require("../assets/cards/TypeScript.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 13,
          name: "Julia",
          type: "language",
          img: require("../assets/cards/Julia.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 0,
        },
        {
          id: 15,
          name: "Vue",
          type: "framework",
          img: require("../assets/cards/Vue.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 1,
        },
        {
          id: 16,
          name: "Flask",
          type: "framework",
          img: require("../assets/cards/Flask.png"),
          action: "attack",
          value: 20,
          field: "LinuxOS",
          set_id: 10,
        },
        {
          id: 17,
          name: "Rails",
          type: "framework",
          img: require("../assets/cards/Rails.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 39,
        },
        {
          id: 18,
          name: "Angular",
          type: "framework",
          img: require("../assets/cards/Angular.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 1,
        },
        {
          id: 19,
          name: "Spring",
          type: "framework",
          img: require("../assets/cards/Spring.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 43,
        },
        {
          id: 20,
          name: "echo",
          type: "framework",
          img: require("../assets/cards/echo.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 37,
        },
        {
          id: 21,
          name: "Rocket",
          type: "framework",
          img: require("../assets/cards/Rocket.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 33,
        },
        {
          id: 22,
          name: "Yew",
          type: "framework",
          img: require("../assets/cards/Yew.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 33,
        },
        {
          id: 23,
          name: "Laravel",
          type: "framework",
          img: require("../assets/cards/Laravel.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 27,
        },
        {
          id: 24,
          name: "Flutter",
          type: "framework",
          img: require("../assets/cards/Flutter.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 32,
        },
        {
          id: 25,
          name: "外付けHDD",
          type: "attachment",
          img: require("../assets/cards/External-HDD.png"),
          action: "enhancement",
          value: 20,
          field: "",
          set_id: 0,
        },
        {
          id: 26,
          name: "外付けHDD",
          type: "attachment",
          img: require("../assets/cards/External-HDD.png"),
          action: "enhancement",
          value: 40,
          field: "",
          set_id: 0,
        },
        {
          id: 27,
          name: "PHP",
          type: "language",
          img: require("../assets/cards/PHP.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 28,
          name: "Perl",
          type: "language",
          img: require("../assets/cards/Perl.png"),
          action: "attack",
          value: 40,
          field: "",
          set_id: 0,
        },
        {
          id: 29,
          name: "Objective-C",
          type: "language",
          img: require("../assets/cards/Objective-C.png"),
          action: "attack",
          value: 30,
          field: "iOS,macOS",
          set_id: 0,
        },
        {
          id: 30,
          name: "Swift",
          type: "language",
          img: require("../assets/cards/Swift.png"),
          action: "attack",
          value: 30,
          field: "iOS,macOS",
          set_id: 0,
        },
        {
          id: 31,
          name: "Kotlin",
          type: "language",
          img: require("../assets/cards/Kotlin.png"),
          action: "attack",
          value: 30,
          field: "AndroidOS",
          set_id: 0,
        },
        {
          id: 32,
          name: "dart",
          type: "language",
          img: require("../assets/cards/dart.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 33,
          name: "Rust",
          type: "language",
          img: require("../assets/cards/Rust.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 34,
          name: "tailwind",
          type: "framework",
          img: require("../assets/cards/tailwind.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 3,
        },
        {
          id: 35,
          name: "冷却ファン",
          type: "attachment",
          img: require("../assets/cards/Cooling-fan.png"),
          action: "enhancement",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 36,
          name: "Node.js",
          type: "framework",
          img: require("../assets/cards/Node.js.png"),
          action: "attack",
          value: 40,
          field: "WindowsOS",
          set_id: 1,
        },
        {
          id: 37,
          name: "Go",
          type: "language",
          img: require("../assets/cards/Go.png"),
          action: "attack",
          value: 40,
          field: "",
          set_id: 0,
        },
        {
          id: 38,
          name: "Haskell",
          type: "language",
          img: require("../assets/cards/Haskell.png"),
          action: "attack",
          value: 40,
          field: "",
          set_id: 0,
        },
        {
          id: 39,
          name: "Ruby",
          type: "language",
          img: require("../assets/cards/Ruby.png"),
          action: "attack",
          value: 40,
          field: "",
          set_id: 0,
        },
        {
          id: 40,
          name: "外付けSSD",
          type: "attachment",
          img: require("../assets/cards/External-SSD.png"),
          action: "enhancement",
          value: 20,
          field: "",
          set_id: 0,
        },
        {
          id: 41,
          name: "C",
          type: "language",
          img: require("../assets/cards/C.png"),
          action: "attack",
          value: 50,
          field: "",
          set_id: 0,
        },
        {
          id: 42,
          name: "C#",
          type: "language",
          img: require("../assets/cards/Cs.png"),
          action: "attack",
          value: 50,
          field: "",
          set_id: 0,
        },
        {
          id: 43,
          name: "Java",
          type: "language",
          img: require("../assets/cards/Java.png"),
          action: "attack",
          value: 50,
          field: "",
          set_id: 0,
        },
        {
          id: 44,
          name: "C++",
          type: "language",
          img: require("../assets/cards/C++.png"),
          action: "attack",
          value: 60,
          field: "",
          set_id: 0,
        },
        {
          id: 45,
          name: "cobol",
          type: "language",
          img: require("../assets/cards/cobol.png"),
          action: "attack",
          value: 70,
          field: "",
          set_id: 0,
        },
        {
          id: 46,
          name: "fortran",
          type: "language",
          img: require("../assets/cards/Fortran.png"),
          action: "attack",
          value: 80,
          field: "",
          set_id: 0,
        },
        {
          id: 47,
          name: "セカンドディスプレイ",
          type: "attachment",
          img: require("../assets/cards/PC-Monitor.png"),
          action: "enhancement",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 48,
          name: "キーボード",
          type: "attachment",
          img: require("../assets/cards/Keyboard.png"),
          action: "enhancement",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 49,
          name: "マウス",
          type: "attachment",
          img: require("../assets/cards/mouse.png"),
          action: "enhancement",
          value: 10,
          field: "",
          set_id: 0,
        },
        {
          id: 50,
          name: "なでしこ",
          type: "language",
          img: require("../assets/cards/Nadeshiko.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 51,
          name: "ドリトル",
          type: "language",
          img: require("../assets/cards/dolittle.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 52,
          name: "プロデル",
          type: "language",
          img: require("../assets/cards/Prodel.png"),
          action: "attack",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 53,
          name: "Scratch",
          type: "language",
          img: require("../assets/cards/Scratch.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 0,
        },
        {
          id: 55,
          name: "Hacker",
          type: "hack",
          img: require("../assets/cards/hacker2.png"),
          action: "steal",
          value: 30,
          field: "",
          set_id: 0,
        },
        {
          id: 56,
          name: "BootStrap",
          type: "framework",
          img: require("../assets/cards/BootStrap.png"),
          action: "attack",
          value: 20,
          field: "",
          set_id: 3,
        },
      ],
      showAttack: false,
      showOponent: false,
      dalayItem: false,
      oponentTurn: false,
      options: {
        group: "myGroup",
        animation: 200,
      },
      selecteddata: [],
      mydata: [],
      mydata_len: [],
      combo_data: [],
      recent_mydata_len: [],
      recent_selectdata_id: [],
      tmp: 0,
      userId: localStorage.getItem("userId"),
      sampleHp: {
        mine: 300,
        yours: 300,
      },
    };
  },
  created() {
    for (let i = 0; i < this.combo_data_db.length; i++) {
      this.combo_data.push(this.combo_data_db[i]);
    }
    console.log(this.combo_data);
    //初期ドローを行います。6枚もらいます。いえい
    for (let i = this.mydata.length; i < 6; ) {
      this.tmp = Number(Math.floor(Math.random() * 56));
      if (!this.mydata_len.includes(this.tmp)) {
        this.mydata_len.push(this.tmp);
        this.mydata.push(this.data_db[this.mydata_len[i]]);
        i++;
      }
    }
    console.log(this.mydata);
    console.log("初期データ移行完了");

    this.socket.emit("getTurnFlag", this.userId);
    console.log(this.userId);
  },
  mounted() {
    this.socket.on("turnFlag", function (turnFlag) {
      let flag = true;
      if (turnFlag == 1) {
        flag = false;
      }
    });
  },
  // mounted() {
  //   //cardValueを受け取った時の処理
  //   this.socket.on("cardValue", function (cardValue) {
  //     if (cardValue.userId == this.userId) {
  //       //攻撃できなくしたい（相手のターンにする）
  //       this.oponentTurn = true
  //     } else {
  //       //攻撃を受ける処理＋自分のターンにする（攻撃できるようにする）
  //       if (cardValue.selecteddata.length == 1) {
  //         if (cardValue.selecteddata[0].action == "enhancement") {
  //           // 回復の処理
  //           this.sampleHp.yours = this.sampleHp.yours + cardValue.selecteddata[0].value;
  //         } else if (cardValue.selecteddata[0].action == "steal") {
  //           // 吸収の処理
  //           this.sampleHp.yours = this.sampleHp.yours + cardValue.selecteddata[0].value;
  //           this.sampleHp.mine = this.sampleHp.mine - cardValue.selecteddata[0].value;
  //         } else {
  //           // 攻撃の処理
  //           this.sampleHp.mine = this.sampleHp.mine - cardValue.selecteddata[0].value;
  //         }
  //       } else {
  //         // todo: ableattacksから配列を取得してaction_valueを相手のhpから引く
  //         this.sampleHp.mine =
  //           this.sampleHp.mine - this.ableattacks[0].action_value;
  //       }
  //     }
  //   });
  // },
  methods: {
    getTurnFlag() {
      //turn_flagのデータをlocalstorageからもらいます
      this.turn_flag = localStorage.getItem("turn_flag");
      console.log(this.turn_flag);
    },
    //roomIdをサーバーサイドへ送信
    sendRoomId(roomId) {
      this.socket.emit("login", roomId);
    },
    //カードを消します。本来は、ここでデータを送信します。
    useCards: function (index) {
      //処理
      if (this.selecteddata.length == 1) {
        if (this.selecteddata[0].action == "enhancement") {
          // 回復の処理
          this.effect = "enhancement";
          const action = this.selecteddata[0].name_en;
          this.sampleHp.mine = this.sampleHp.mine + this.selecteddata[0].value;
        } else if (this.selecteddata[0].action == "steal") {
          // 吸収の処理
          this.effect = "steal";
          this.sampleHp.yours =
            this.sampleHp.yours - this.selecteddata[0].value;
          this.sampleHp.mine = this.sampleHp.mine + this.selecteddata[0].value;
        } else {
          // 攻撃の処理
          this.effect = "attack";
          this.sampleHp.yours =
            this.sampleHp.yours - this.selecteddata[0].value;
        }
      } else {
        // todo: ableattacksから配列を取得してaction_valueを相手のhpから引く
        console.log(this.ableattacks[0].action_value);
        this.effect = this.ableattacks[0].name_en;
        this.sampleHp.yours =
          this.sampleHp.yours - this.ableattacks[0].action_value;
      }
      this.showAttack = true;
      this.selecteddata.splice(index, this.selecteddata.length);
      // ドロー
      this.recent_mydata_len = [];
      //現在の手札のidリストを初期化しています
      for (let i = 0; i < this.mydata.length; i++) {
        this.recent_mydata_len.push(this.mydata[i].id - 1);
        //現在の手札idをいれました。
      }
      for (let i = this.mydata.length - 1; i < 5; ) {
        this.tmp = Number(Math.floor(Math.random() * 56));
        if (!this.recent_mydata_len.includes(this.tmp)) {
          this.mydata_len.push(this.tmp);
          let pushdata =
            this.data_db[
              this.mydata_len[i - this.mydata.length + this.mydata_len.length]
            ];
          this.mydata.push(pushdata);
          i++;
        }
      }
      let cardValue = {
        userId: this.userId,
        selecteddata: this.selecteddata,
      };
      this.socket.emit("cardValue", cardValue);
    },
    // closeModal: function () {
    //   this.showAttack = false;
    // },
    // 相手の攻撃のエフェクト用
    oponentAttack: function () {
      this.showOponent = true;
    },
    closeOponent: function () {
      this.showOponent = false;
    },
    getCardValue: function () {
      this.showAttack = false;
      this.socket.on("cardValue", function (cardValue) {
        if (cardValue.userId == this.userId) {
          //攻撃できなくしたい（相手のターンにする）
          this.oponentTurn = true;
        } else {
          //攻撃を受ける処理＋自分のターンにする（攻撃できるようにする）
          if (cardValue.selecteddata.length == 1) {
            if (cardValue.selecteddata[0].action == "enhancement") {
              // 回復の処理
              this.sampleHp.yours =
                this.sampleHp.yours + cardValue.selecteddata[0].value;
            } else if (cardValue.selecteddata[0].action == "steal") {
              // 吸収の処理
              this.sampleHp.yours =
                this.sampleHp.yours + cardValue.selecteddata[0].value;
              this.sampleHp.mine =
                this.sampleHp.mine - cardValue.selecteddata[0].value;
            } else {
              // 攻撃の処理
              this.sampleHp.mine =
                this.sampleHp.mine - cardValue.selecteddata[0].value;
            }
          } else {
            // todo: ableattacksから配列を取得してaction_valueを相手のhpから引く
            this.sampleHp.mine =
              this.sampleHp.mine - this.ableattacks[0].action_value;
          }
        }
      });
    },
  },
  computed: {
    ableattacks: function () {
      // selecteddataのidだけを集めた
      let updateddata = this.selecteddata.map((obj) => obj.id);
      // 一致してるものがあるかを判定
      const isIncludes = (arr, target) =>
        arr.every((el) => target.includes(el));
      //recent_selectdataに、idに対応するカードの名前を入れたい
      if (updateddata.length === 0) {
        // 何も選択されていないとき空の配列を返す
        return [];
      } else {
        // updateddataにあるのと一致した攻撃だけを返す
        return this.combo_data_db.filter((combo_data) => {
          return isIncludes(updateddata, combo_data.id_list);
        });
      }
    },
    //発動できるかどうかを判定する
    attack_decision: function () {
      let updateddata = this.selecteddata.map((obj) => obj.id);
      // 一致してるものがあるかを判定
      const isIncludes = (arr, target) =>
        arr.every((el) => target.includes(el));
      if (updateddata.length === 0) {
        return false;
      } else if (updateddata.length === 1) {
        this.cardValue.value = this.selecteddata[0].value;
        return true;
      } else {
        let ableCombo = this.combo_data_db.filter((combo_data) => {
          return isIncludes(updateddata, combo_data.id_list);
        });
        console.log(ableCombo);
        // 完全一致した攻撃だけを返す
        for (let i = 0, n = updateddata.length; i < n; ++i) {
          if (ableCombo.length == 0) {
            return false;
          } else if (updateddata[i] !== ableCombo[0].id_list[i]) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    // コンボ名を取得する
    getComboName: function () {
      let updateddata = this.selecteddata.map((obj) => obj.id);
      console.log(updateddata);
    },
  },
};
</script>

<style scoped>
.oponent {
  height: 200px;
  display: flex;
  justify-content: center;
}

.oponentCard {
  margin-left: 8px;
  margin-right: 8px;
}

.dalayEffect {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30%;
  color: white;
  font-size: 100px;
  background: radial-gradient(#134e61, #102335);
  font: "Oxanium";
  opacity: 0;
  animation: SlideIn 0.4s;
  /* 0.8秒遅らせる */
  animation-delay: 0.8s;
  /* opacityが戻らないようにする */
  animation-fill-mode: forwards;
}

@keyframes SlideIn {
  0% {
    opacity: 0;
    transform: translate(-700px);
  }
  100% {
    opacity: 0.9;
    transform: translate(0);
  }
}
.overlay {
  /*　要素を重ねた時の順番　*/
  z-index: 1;

  /*　画面全体を覆う設定　*/
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  /*　画面の中央に要素を表示させる設定　*/
  display: flex;
  align-items: center;
  justify-content: center;
}

.field {
  height: 300px;
  width: 100%;
  background: rgba(211, 255, 253);
  border: 2px solid #d3fffd;
  box-shadow: 0px 0px 50px #d3fffd;
}

.item {
  margin: 10px;
  width: 12%;
}

.item:hover {
  cursor: grab;
}

.item:active {
  cursor: grabbing;
}

.area {
  display: flex;
  justify-content: stretch;
  width: 1500px;
  height: 300px;
}

.action-list {
  padding: 1rem;
  height: 300px;
  width: 100%;
  border: 2px solid #d3fffd;
  box-shadow: 0px 0px 50px #d3fffd;
  overflow-x: hidden;
}

.field-row {
  display: flex;
  justify-content: space-between;
  padding-top: 1.5rem;
  align-items: end;
}

.text {
  font-weight: 300;
}

.btn {
  margin-right: 1rem;
  width: 100px;
}

.btn.draw {
  color: #fff;
}

.btn.action {
  color: #102335;
  border: 1px solid #d3fffd;
  box-shadow: 0px 0px 20px #d3fffd;
}
</style>
