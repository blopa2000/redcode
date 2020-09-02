import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dataUser: "",
    token: "",
    activeNavbar: "",
    loading: false
  },
  mutations: {
    setDataUser(state, peyload) {
      state.dataUser = peyload;
    },
    setToken(state, peyload) {
      state.token = peyload;
    },
    setActiveNavbar(state, peyload) {
      state.activeNavbar = peyload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    }
  },
  actions: {},
  modules: {}
});
