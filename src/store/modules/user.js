import { getToken, setToken } from '@/utils/auth'
import { getUserInfo, login } from '@/api/user'

export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    updateToken(state, payload) {
      state.token = payload
      // 存储到本地Cookie
      setToken(payload)
    },

    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    async userLogin(context, payload) {
      const res = await login(payload)

      context.commit('updateToken', res.data)

      return res
    },

    // 获取用户信息
    async getUserProfile(context) {
      const res = await getUserInfo()
      console.log(res)
      context.commit('updateUserInfo', res.data)
    }
  },
  getters: {}
}
