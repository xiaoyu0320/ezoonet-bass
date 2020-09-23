import Vue from 'vue'
import App from './App'
import request from './utils/httpPost'
import Store from './store/index'
Vue.config.productionTip = false
Vue.prototype.$store = Store
Vue.prototype.$http = request
App.mpType = 'app'
const app = new Vue(App)
app.$mount()
getApp().globalData = {uid: '123456'}
Vue.prototype.globalData = getApp().globalData
