import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem('user_token')
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      setItem('user_token', data)
    }
  },
  actions: {
  },
  modules: {
  }
})
