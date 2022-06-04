import request from '@/utils/request'

// 获取员工简单列表
export function getEmployeeSimple(data) {
  return request({
    method: 'get',
    url: '/sys/user/simple',
    data
  })
}

// 获取员工全部列表
export function getEmployees(params) {
  return request({
    method: 'get',
    url: '/sys/user',
    params
  })
}
