import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from '@/router'
import store from '@/store'
import getPageTitle from './utils/get-page-title'

const widthList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.state.user.token
  if (token) { // 有token 表示已登录
    // 判断 如果有用户信息 就不需要再次请求了
    if (!store.state.user.userInfo.userId) {
      await store.dispatch('user/getUserProfile')
    }

    if (to.path === '/login') {
      // 你已经登陆了, 还要去登录页, 那我就不让你去, 直接把你打回首页
      next('/')
      NProgress.done()
    } else {
      // 你以及登录了, 要去登录页以外的地方, 那我就让你去, 放行
      next()
    }
  } else {
    // 没有token 表示未登录
    if (widthList.includes(to.path)) {
      // 你没有登录, 要去登录页, 那可以去, 放行
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

// 前置路由守卫可以设置多个
router.beforeEach((to, form, next) => {
  // 这里调用了花裤衩封装的方法 get-page-title
  document.title = getPageTitle(to.meta.title)
  next()
})

router.afterEach((to, form) => {
  NProgress.done()
  // console.log(to)
  // console.log(form)
})
// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
