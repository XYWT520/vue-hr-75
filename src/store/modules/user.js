import { getToken, setToken } from '@/utils/auth'
import { login } from '@/api/user'

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
  actions: {
    async userLogin(context, payload) {
      const res = await login(payload)

      context.commit('updateToken', res.data)

      return res
    }
  },
  getters: {}
}
