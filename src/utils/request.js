import axios from 'axios'
import store from '@/store'

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
  if (!response.data.success) {
    return Promise.reject(new Error(response.data.message))
  } else {
    return response.data
  }
}, error => {
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

export default service
