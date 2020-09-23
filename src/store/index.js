
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  userinfo: {}
}
const getters = {
  userinfo: state => state.userinfo
}
const mutations = {
  SET_INFO: (state, userinfo) => {
    state.userinfo = userinfo
  }
}
const actions = {
  getuserinfo ({commit}, userinfo) {
    commit('SET_INFO', userinfo)
  }

}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
