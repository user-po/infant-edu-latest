import { axios } from '@/utils/service'
// 获取机构与课程关系
export function fetchRelationShipList(data) {
  return axios.get('/business/api/edu/relationShip/get', { params: data })
}

// 新建机构与课程关系
export function createRelationShip(data) {
  return axios.post('/business/api/edu/relationShip/new', data)
}

// 更新机构与课程关系
export function updateRelationShipList(data) {
  return axios.post('/business/api/edu/relationShip/update', data)
}

// 删除机构与课程关系
export function deleteRelationShipList(data) {
  return axios.post('/business/api/edu/relationShip/del', data)
}
