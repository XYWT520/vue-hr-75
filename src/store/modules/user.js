import { getToken, setToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    token: getToken()
  },
  mutations: {
    updateToken(state, payload) {
      state.token = payload
      // 存储到本地Cookie
      setToken(payload)
    }
  },
  actions: {},
  getters: {}
}
