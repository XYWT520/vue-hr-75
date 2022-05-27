import request from '@/utils/request'

export function login(data) {
  // 登录接口
  return request({
    method: 'post',
    url: '/sys/login',
    data
  })
}

export function getInfo(token) {

}

export function logout() {

}
