<template>
<div
    id="overlay"
    v-show="bool"
    @click="clickEvent"
>
    <v-card
        @click="stopEvent"
    >
        <v-card-title>遊び方</v-card-title>
        <v-btn
            @click="clickEvent"
        >閉じる
        </v-btn>
    </v-card>
</div>
</template>

<script>
export default {
    props: [
        'bool'
    ],
    methods: {
        clickEvent: function(){
            this.$emit('from-child')
        },
        stopEvent: function(){
            event.stopPropagation()
        }
    }
}
</script>

<style scoped>
#overlay{
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
</style>