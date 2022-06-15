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
      <h1>
        {{file[0].id}}
      </h1>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import BattleExplanation from ".//components/BattleExplanation.vue"
import axios from 'axios';

export default {
    components: {
      BattleExplanation
    },

    data() {
        return {
          file: [{
              id: "",
              name: "",
              type: "",
              dataUrl: ""
          }],
          // モーダルを非表示
          showExplanation: false
        }
    },
    async created() {
		await this.$axios.get('/message')
    .then(res => {
      console.log(res.data)
      this.file = res.data
		})
    .catch(err => {
        console.error(err)
    })
	  },
    methods: {
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