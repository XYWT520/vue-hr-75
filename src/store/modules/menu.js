import { constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: {
    menuList: [...constantRoutes]
  },
  mutations: {
    updataMenuList(state, list) {
      state.menuList = [...constantRoutes, ...list]
    }
  }
}
