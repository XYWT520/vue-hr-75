export default {
  namespaced: true,
  state: {
    token: ''
  },
  mutations: {
    updateToken(state, payload) {
      state.token = payload
    }
  },
  actions: {},
  getters: {}
}
