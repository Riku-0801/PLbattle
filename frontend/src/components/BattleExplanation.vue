<template>
  <div id="overlay" v-show="bool" @click="clickEvent">
    <v-card @click="stopEvent" class="demo-card overflow-auto">
      <v-card-title>遊び方</v-card-title>

      <p>対戦形態</p>
      <hr />
      <v-card-text>1vs1</v-card-text>
      <p>目的</p>
      <hr />
      <v-card-text>相手の HP をゼロにする</v-card-text>
      <p>使用カード</p>
      <hr />
      <v-card-text>
        <ul>
          <li>
            言語カード　27 種類
            <ul>
              <li>
                主に攻撃を行うカード。単体でも使用可能。他の言語カードやフレームワークカードと組み合わせて使うこともできる。
              </li>
            </ul>
          </li>
          <li>
            フレームワークカード　19 種類
            <ul>
              <li>
                主に攻撃を行うカード。単体でも使用可能。他のフレームワークカードや言語カードと組み合わせて使うこともできる。
              </li>
            </ul>
          </li>
          <li>
            アタッチメントカード　7 種類
            <ul>
              <li>回復や強化を行うカード。単体でのみ使用可能。</li>
            </ul>
          </li>
          <li>
            ハックカード １種類
            <ul>
              <li>
                相手の HP
                を奪い、自分のものにすることができるカード。単体でのみ使用可能。
              </li>
            </ul>
          </li>
        </ul>
      </v-card-text>

      <v-card-text
        >language に対応した framework を用いると、攻撃力 1.5 倍
        対応する</v-card-text
      >
      <v-card-text>
        OS フィールドの時、そのカードの攻撃力が2倍になる（1-2: macOS, 3-4:
        AndroidOS, 5-6: WindowsOS, 7-8: iOS, 9-10: linuxOS）
      </v-card-text>

      <a href="https://github.com/Riku-0801/PLbattle" target="_blank"
        >GitHubはこちら</a
      >
      <v-btn @click="clickEvent" class="close-btn">閉じる </v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["bool"],
  methods: {
    clickEvent: function () {
      this.$emit("from-child");
    },
    stopEvent: function () {
      event.stopPropagation();
    },
  },
};
</script>

<style scoped>
#overlay {
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

.demo-card {
  padding: 2rem;
  max-width: 50%;
  max-height: 80vh;
}

.demo-card p {
  margin: 1rem;
  margin-top: 2rem;
}

.v-card-text {
  padding: 0;
}

.close-btn {
  margin: 1rem;
}
</style>
