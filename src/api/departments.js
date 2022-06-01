import request from '@/utils/request'

export function departmentsList() {
  return request({
    method: 'get',
    url: '/company/department'
  })
}
