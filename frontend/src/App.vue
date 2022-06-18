<template>
  <v-app>
    <header>
      <v-app-bar
        elevation='1'
      >
        <v-toolbar-title>PLbattle</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          @click="openModal"
        >遊び方
        </v-btn>
      </v-app-bar>
    </header>
    <BattleExplanation
      v-bind:bool="showExplanation"
      @from-child="closeModal"
    />
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import BattleExplanation from ".//components/BattleExplanation.vue"

export default {
    components: {
      BattleExplanation
    },

    data() {
        return {
          
          // モーダルを非表示
          showExplanation: false
        }
    },
    
    methods: {
    // getDatas: function() {
		// this.$axios.get('/message')
    // .then(res => {
    //   //this.num = []
    //   console.log(res.data)
    //   // for (let i = 0 ; i < 5 ; i++){
    //   //   this.num.push(Number(Math.floor(Math.random() * 10)));
    //   // }
    //   this.file = res.data
		// })
    // .catch(err => {
    //     console.error(err)
    // })
	  // },
        openModal: function(){
            this.showExplanation = true
        },
        closeModal: function(){
            this.showExplanation = false
        },
    }
};
</script>

<style scoped>
</style>