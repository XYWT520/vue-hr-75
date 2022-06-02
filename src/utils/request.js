import axios from 'axios'
import store from '@/store'
import router from '@/router'
// import { Message } from 'element-ui'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://ihrm-java.itheima.net', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 添加请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.state.user.token
    // 如果当前存有token,就加在请求头上
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  }
  , error => {
    return Promise.reject(error)
  })

// 响应拦截器
service.interceptors.response.use(response => {
  // 如果返回的数据里的 success 是 false, 那么我就 return 出去一个 promise 的错误
  if (!response.data.success) {
    return Promise.reject(new Error(response.data.message))
  } else {
    return response.data
  }
}, error => {
  console.dir(error)
  // token 失效
  if (error.response.data.code === 10002) {
    // 删除token 清楚用户数据
    store.dispatch('user/OutLogin')
    // 返回登录页
    // router.push('/login')
    // console.log(router.currentRoute.fullPath)  打印的结果是 /
    // console.log(location.hash)  打印的结果是 #/form/index
    router.push({
      path: '/login',
      query: {
        return_url: location.hash.substring(1) //  打印的结果是 #/form/index  所以可以利用字符串的方法(字符串截取) 把前面的 # 给删除掉
      }
    })
    // Message.error()
  }

  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

export default service
