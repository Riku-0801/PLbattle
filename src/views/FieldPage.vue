<template>
  <v-app>
    <v-container>
      <!-- <div v-show="oponentTurn" class="overlay">
        <p class="judge">相手のターンです</p>
      </div>
      <div v-show="isAlone" class="overlay">
        <p class="alone">相手が入室するまでしばらくお待ちください</p>
      </div>
    -->
      <div v-show="isAlone || oponentTurn" class="overlay">
        <p class="alone">{{ message }}</p>
      </div>
      <!-- <v-btn @click="oponentAttack">相手の攻撃</v-btn> -->
      <!-- 相手の攻撃エフェクト -->
      <div v-show="showOponent" class="overlay" @click="closeOponent">
        <!-- 相手の攻撃情報をここに持ってくる -->
        <div v-for="given in givenCards" :key="given.id">
          <v-card height="475px" width="400px" class="black">
            <v-img :src="search_img_id(given.id)"></v-img>
          </v-card>
        </div>
        <div class="dalayEffect">
          {{ givenAttack.effect }} {{ givenAttack.value }} pt
        </div>
      </div>
      <!-- 自分のhpが0になった時の処理 -->
      <div v-show="judgeLose" class="overwrap items">
        <p class="judge">Lose...</p>
        <v-btn outlined class="btn big" @click="goHome()">
          <span>home</span>
        </v-btn>
      </div>
      <!-- 自分の攻撃エフェクト -->
      <div v-show="showAttack" class="overlay" @click="getCardValue">
        <div class="myEffect">{{ effect }}　{{ damageValue }} pt</div>
      </div>
      <!-- 相手のhpが0になった時の処理 -->
      <div v-show="judgeWin" class="overwrap items">
        <p class="judge">Win!</p>
        <v-btn outlined class="btn big" @click="goHome()">
          <span>home</span>
        </v-btn>
      </div>
      <!-- -------通常画面------- -->
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
            <div v-for="able in ableattacks" :key="able.combo_id">
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
                    :src="search_img_id(select.id)"
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
            <v-card hover class="black">
              <v-img :src="search_img_id(mine.id)"> </v-img>
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
      action_se: new Audio(require("@/assets/sounds/action_se.mp3")),
      damage_se: new Audio(require("@/assets/sounds/damage_se.mp3")),
      click_se: new Audio(require("@/assets/sounds/kako.mp3")),
      effect: "action",
      damageValue: 0,
      cardValue: [
        {
          value: 0,
          name_list: "",
        },
      ],
      turn_flag: 0,
      recieved_cardValue: [],
      // 1) サーバ連結
      socket: io("code--duel.herokuapp.com/"),
      card_db: [
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
          value: 40,
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
      combo_data: [],
      // 普段表示していない要素
      showAttack: false, //自分の攻撃表示　これは別にバックで管理する必要はない
      showOponent: false, //相手の攻撃表示　これは別にバックで管理する必要はない
      dalayItem: false, //なにも使ってない　消していい？
      oponentTurn: false, //行動の可否を決定づける部分　これをバックで管理しよう。
      judgeLose: false,
      judgeWin: false,
      isAlone: false,
      // draganddrop用のデータ
      options: {
        group: "myGroup",
        animation: 200,
      },
      selecteddata: [],
      mydata: [],
      mydata_len: [],
      recent_mydata_len: [],
      recent_selectdata_id: [],
      tmp: 0,
      userId: "",
      sampleHp: {
        mine: 300,
        yours: 300,
      },
      attacksignal: 0,
      givenCards: [],
      givenAttack: {
        effect: "",
        value: "",
      },
      message: "",
    };
  },
  created() {
    const searchParams = new URLSearchParams(window.location.search);
    this.attacksignal = 0;
    //バックエンドからコンボdbを受け取る処理
    this.$axios.get("/get_combo_db").then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        this.combo_data.push(res.data[i]);
      }
    });
    //HPの共有
    this.$axios
      .post("/HP_reload", {
        player_Id: searchParams.get("id"),
      })
      .then((res) => {
        console.log(res.data);
        this.sampleHp.mine = res.data.my_HP;
        this.sampleHp.yours = res.data.enemy_HP;
      });

    //初期ドローを行う。
    //この初期ドローを、バックの機能にして、この時点で手札をバックから貰えるようにする。⇒完了
    this.$axios
      .post("/card_draw", {
        carddata: this.mydata,
        player_Id: searchParams.get("id"),
      })
      .then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          this.mydata.push(res.data[i]);
        }
        console.log(this.mydata);
        console.log("hogehoge");
      });

    //joinするための送信
    this.userId = searchParams.get("id");
    let RoomID = searchParams.get("room");
    this.socket.emit("room-join", RoomID, this.userId);
    //turn_flagに応じて、showAttackなどの表示、非表示を決定する。
    //偶数の時は自分の番
    this.$axios
      .post("/get_turn", { player_Id: searchParams.get("id") })
      .then((res) => {
        if (res.data % 2 == 0) {
          this.oponentTurn = false;
        } else if (res.data == 1) {
          this.oponentTurn = true;
          this.message = "相手が入室するまでしばらくお待ちください";
        } else {
          this.oponentTurn = true;
          this.message = "相手のターンです";
        }
      });
  },
  methods: {
    //強引にフロントエンドのdbからimgを貰ってくる
    search_img_id(id) {
      var select_Id = this.card_db.findIndex((e) => e.id === id);
      return this.card_db[select_Id].img;
    },

    //roomIdをサーバーサイドへ送信
    sendRoomId(roomId) {
      this.socket.emit("login", roomId);
    },
    //カード発動時の処理
    useCards: function (index) {
      this.action_se.play();
      // todo: searchParamsをグローバル変数にできないかな
      const searchParams = new URLSearchParams(window.location.search);
      //ここに、turn_flagを+1する処理を書く。
      this.$axios.post("/control_turn", { player_Id: searchParams.get("id") });
      //処理
      let cardValue = {
        userId: this.userId,
        selecteddata: this.selecteddata,
        roomId: searchParams.get("room"),
      };
      this.socket.emit("cardValue", cardValue, searchParams.get("id"));
      if (this.selecteddata.length == 1) {
        if (this.selecteddata[0].action == "enhancement") {
          // 回復の処理
          this.effect = "enhancement";
          this.damageValue = this.selecteddata[0].value;
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
          this.damageValue = this.selecteddata[0].value;
          this.sampleHp.yours =
            this.sampleHp.yours - this.selecteddata[0].value;
        }
      } else {
        // 攻撃可能な配列を取得してaction_valueを相手のhpから引く
        this.effect = this.ableattacks[0].name_en;
        const isIncludes = (arr, target) =>
          arr.every((el) => target.includes(el));
        let updateddata = this.selecteddata.map((obj) => obj.id);
        this.combo_data.filter((combo_data) => {
          if (isIncludes(updateddata, combo_data.id_list)) {
            if (updateddata.length == combo_data.id_list.length) {
              this.sampleHp.yours =
                this.sampleHp.yours - combo_data.action_value;
              this.damageValue = combo_data.action_value;
            }
          }
        });
      }
      // attackのカットインを表示
      //この、showAttackの処理を、
      /*
      もし、trun_flagが１ならtrue、とかにする。
      */
      this.showAttack = true;
      this.damage_se.play();
      // 出されたカードを削除
      this.selecteddata.splice(index, this.selecteddata.length);

      this.oponentTurn = true;
      this.message = "相手のターンです";
      //バックエンドにデータを送信
      this.$axios
        .post("/HP", {
          HPs: this.sampleHp,
          player_Id: searchParams.get("id"),
        })
        .then((res) => {
          this.sampleHp.mine = res.data.my_HP;
          this.sampleHp.yours = res.data.enemy_HP;
        });
    },
    // カットインを閉じる
    closeOponent: function () {
      this.showOponent = false;
      // カードをドローする処理
      const searchParams = new URLSearchParams(window.location.search);
      this.$axios
        .post("/card_draw", {
          carddata: this.mydata,
          player_Id: searchParams.get("id"),
        })
        .then((res) => {
          console.log(res.data);
          this.mydata = [];
          for (let i = 0; i < res.data.length; i++) {
            this.mydata.push(res.data[i]);
          }
        })
        .catch((e) => {
          console.log(e);
          console.log("axios finished");
        });
      // 自分のhpが０だった時の負け表示
      if (this.sampleHp.mine <= 0) {
        this.judgeLose = true;
      }
    },
    // 自分の攻撃エフェクトを閉じる時に発火する処理
    getCardValue: function () {
      this.showAttack = false;
      if (this.sampleHp.yours <= 0) {
        this.oponentTurn = false;
        this.judgeWin = true;
      }
    },
    // homeボタン
    goHome: function () {
      this.click_se.play();
      this.$router.push("/");
    },
  },
  mounted() {
    let tmp = this;
    this.socket.on("num-player", function (numplayer) {
      console.log("numplayer" + numplayer);
      if (numplayer == 1) {
        tmp.isAlone = true;
      } else {
        tmp.isAlone = false;
      }
    });
    //cardValueを受け取った時の処理
    this.socket.on("card-value", function (cardValue) {
      if (cardValue.userId == tmp.userId) {
        //攻撃できなくしたい（相手のターンにする）
        tmp.oponentTurn = true;
      } else {
        tmp.oponentTurn = false;
        //攻撃を受ける処理＋自分のターンにする（攻撃できるようにする）
        if (cardValue.selecteddata.length == 1) {
          if (cardValue.selecteddata[0].action == "enhancement") {
            // 回復の処理
            tmp.sampleHp.yours =
              tmp.sampleHp.yours + cardValue.selecteddata[0].value;
          } else if (cardValue.selecteddata[0].action == "steal") {
            // 吸収の処理
            tmp.sampleHp.yours =
              tmp.sampleHp.yours + cardValue.selecteddata[0].value;
            tmp.sampleHp.mine =
              tmp.sampleHp.mine - cardValue.selecteddata[0].value;
          } else {
            // 攻撃の処理
            tmp.sampleHp.mine =
              tmp.sampleHp.mine - cardValue.selecteddata[0].value;
          }
        } else {
          const isIncludes = (arr, target) =>
            arr.every((el) => target.includes(el));
          let updateddata = cardValue.selecteddata.map((obj) => obj.id);
          tmp.combo_data.filter((combo_data) => {
            if (isIncludes(updateddata, combo_data.id_list)) {
              if (updateddata.length == combo_data.id_list.length) {
                tmp.sampleHp.mine = tmp.sampleHp.mine - combo_data.action_value;
                tmp.damageValue = combo_data.action_value;
              }
            }
          });
        }
        // 相手の攻撃のカードデータを取得
        tmp.givenCards = [];
        for (let i = 0; i < cardValue.selecteddata.length; i++) {
          tmp.givenCards.push(cardValue.selecteddata[i]);
        }
        // コンポ名を取得する。一枚の場合はeffectが何かを入れる
        if (tmp.givenCards.length == 1) {
          tmp.givenAttack.effect = cardValue.selecteddata[0].action;
          tmp.givenAttack.value = cardValue.selecteddata[0].value;
        } else {
          // 選択されたカードのidリストを取得
          let updateddata = tmp.givenCards.map((obj) => obj.id);
          // コンボデータからそのidリストと一致するコンボを検索
          const isIncludes = (arr, target) =>
            arr.every((el) => target.includes(el));
          // 一致するコンボを取得
          let givenCombo = tmp.combo_data.filter((combo) => {
            return isIncludes(updateddata, combo.id_list);
          });
          tmp.givenAttack.effect = givenCombo[0].name_en;
          tmp.givenAttack.value = givenCombo[0].action_value;
        }
        // 相手の攻撃を表示
        tmp.showOponent = true;
      }
    });
  },

  computed: {
    ableattacks: function () {
      // selecteddataのidだけを集めた
      let updateddata = this.selecteddata.map((obj) => obj.id);
      let canattackdata = updateddata.sort((a, b) => (a < b ? -1 : 1));

      // 一致してるものがあるかを判定
      const isIncludes = (arr, target) =>
        arr.every((el) => target.includes(el));
      //recent_selectdataに、idに対応するカードの名前を入れたい
      if (canattackdata.length === 0) {
        // 何も選択されていないとき空の配列を返す
        return [];
      } else {
        // updateddataにあるのと一致した攻撃だけを返す
        return this.combo_data.filter((combo_data) => {
          return isIncludes(canattackdata, combo_data.id_list);
        });
      }
    },
    //発動できるかどうかを判定する
    attack_decision: function () {
      let updateddata = this.selecteddata.map((obj) => obj.id);
      updateddata.sort(function (first, second) {
        if (first > second) {
          return 1;
        } else if (first < second) {
          return -1;
        } else {
          return 0;
        }
      });
      // 一致してるものがあるかを判定
      const isIncludes = (arr, target) =>
        arr.every((el) => target.includes(el));
      if (updateddata.length === 0) {
        return false;
      } else if (updateddata.length === 1) {
        this.cardValue.value = this.selecteddata[0].value;
        return true;
      } else {
        let ableCombo = this.combo_data.filter((combo_data) => {
          return isIncludes(updateddata, combo_data.id_list);
        });
        // 完全一致した攻撃だけを返す
        for (let i = 0, n = updateddata.length; i < n; ++i) {
          if (ableCombo.length == 0) {
            return false;
          } else if (
            updateddata[i] == ableCombo[0].id_list[i] &&
            updateddata.length == ableCombo[0].id_list.length
          ) {
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
    },
  },
};
</script>

<style scoped>
.items {
  display: flex;
  flex-direction: column;
}

.judge {
  font-size: 4rem;
  animation: neon_blink 2s infinite alternate;
}
.alone {
  font-size: 2.5rem;
  animation: neon_blink 2s infinite alternate;
}

@keyframes neon_blink {
  0% {
    text-shadow: 0 0 10px #00fff2, 0 0 5px #fff, 0 0 13px #d3fffd;
  }
  100% {
    text-shadow: 0 0 30px #00fff2, 0 0 15px #fff, 0 0 40px #d3fffd;
  }
}

.btn {
  color: #ffffff;
  text-align: center;
  text-decoration: none;
  text-decoration-color: transparent;
  margin: 1rem;
  justify-content: center;
  box-shadow: 0 0 0.75rem #d3fffd;
}
.btn.play {
  margin: 0 1rem;
}
.btn.big {
  width: 250px;
  height: 75px;
  margin: 1rem;
  justify-content: center;
  font-size: 28px;
  text-decoration: none;
}

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

.myEffect {
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
.overwrap {
  /*　要素を重ねた時の順番　*/
  z-index: 1;

  /*　画面全体を覆う設定　*/
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);

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
