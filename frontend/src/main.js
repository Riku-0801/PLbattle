import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import http from './axios' // 追加

Vue.config.productionTip = false
Vue.prototype.$axios = http

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
