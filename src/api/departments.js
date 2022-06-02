import request from '@/utils/request'

/** 获取部门*/
export function departmentsList() {
  return request({
    method: 'get',
    url: '/company/department'
  })
}

/** 部门新增 */
export function addDepartment(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

/** 根据id查询部门详情*/
export function getDepartDetail(id) {
  return request({
    method: 'get',
    url: '/company/department/' + id
  })
}

/** 根据 id 编辑数据*/
export function updateDepartDetail(data) {
  return request({
    method: 'put',
    url: '/company/department/' + data.id,
    data
  })
}

/** 根据 id 删除数据*/
export function DeleteDepartDetail(id) {
  return request({
    method: 'delete',
    url: '/company/department/' + id
  })
}
