import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../network'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isCollapsed: false,
    token: localStorage.getItem("token"),
    userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
  },
  mutations: {
    toggleCollapse(state) {
      state.isCollapsed = !state.isCollapsed;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    removeInfo(state) {
      state.token = '';
      state.userInfo = {};
      localStorage.setItem("token", '');
      sessionStorage.setItem("userInfo", JSON.stringify(''))
    }
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
})
