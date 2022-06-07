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

export function importEmployees(data) {
  return request({
    method: 'post',
    url: '/sys/user/batch',
    data
  })
}

/**
 * @description: 保存员工信息
 * @param {*} data
 * @return {*}
 */
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put', // 全量修改
    data
  })
}
