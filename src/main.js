import Vue from 'vue'
// 重置CSS样式
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入语言包
import locale from 'element-ui/lib/locale/lang/ja' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// import PageTools from '@/components/pageTools'
// Vue.component(PageTools.name, PageTools)

// 封装自己的插件
import MyUI from '@/components'
Vue.use(MyUI)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 全局注册组件
// Vue.compoonent
// 参数1: 指令名称
// 参数2: 配置对象, 需要定义一个 inserted 钩子函数: 在特定时间节点自动执行,不需要我们手动执行
Vue.directive('remove', {
  // 当指令绑定的标签被插入到真实 DOM 树上时触发
  // 会携带一个参数,ell 真实 DOM 元素
  inserted(el, binding) {
    const points = store.state.user.userInfo.roles.points
    // console.log(points)
    if (!points.includes(binding.value)) {
      el.remove()
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
