import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataUser:"",
    token:"",
    activeNavbar:"",
  },
  mutations: {
    setDataUser(state,peyload){
      state.dataUser = peyload;
    },
    setToken(state,peyload){
      state.token = peyload;
    },
    setActiveNavbar(state,peyload){
      state.activeNavbar = peyload
    }
  },
  actions: {
  },
  modules: {
  }
})
