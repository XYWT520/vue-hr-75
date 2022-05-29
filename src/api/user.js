import request from '@/utils/request'

export function login(data) {
  // 登录接口
  return request({
    method: 'post',
    url: '/sys/login',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    method: 'post',
    url: '/sys/profile'
  })
}

export function logout() {

}
