import { getToken, setToken, removeToken } from '@/utils/auth'
import { getUserInfo, login, getUserDetailById } from '@/api/user'

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

    // 用户信息存储到state
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },

    // 删除token
    removeToken(state) {
      state.token = ''
      // 调用 utils/auth 下面的方法 删除本地token
      removeToken()
    },

    // 清空用户信息
    removeuserInfo(state) {
      state.userInfo = {}
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
      const res2 = await getUserDetailById(res.data.userId)
      console.log(res2)
      // 合并获取到的两个数据
      context.commit('updateUserInfo', { ...res.data, ...res2.data })
    },

    // 退出登录模块
    OutLogin(context) {
      // 封装成一个函数, 这样以后再用到退出登录模块的时候,只需要调用一下即可
      // 删除 token
      context.commit('removeToken')
      // 删除用户信息
      context.commit('removeuserInfo')
    }
  },
  getters: {}
}
