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

/**
 * @description: 删除员工
 * @param {*} id 员工id
 * @return {*}
 */
export function delEmployee(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

// 员工管理-新增员工
export function addEmployee(data) {
  return request({
    method: 'post',
    url: `/sys/user/`,
    data
  })
}
