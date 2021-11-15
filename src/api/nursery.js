import { axios } from '@/utils/service'
// 获取机构/学校列表
export function fetchQuartersList(data) {
  return axios.get('/business/api/edu/organization/get', { params: data })
}

// 新建机构/学校
export function createQuarters(data) {
  return axios.post('/business/api/edu/organization/new', data)
}

// 更新机构/学校
export function updateQuarters(data) {
  return axios.post('/business/api/edu/organization/update', data)
}

// 删除机构/学校
export function deleteQuarters(data) {
  return axios.post('/business/api/edu/organization/del', data)
}

export function getUnqualifiedStudentList() {
  return axios.get('/business/api/edu/organization/getUnqualifiedStudents')
}

export function getSpecialRecordStudentList() {
  return axios.get('/business/api/edu/organization/getSpecialRecordStudents')
}
// 废弃
export function getOrganizationDetailById(data) {
  return axios.get('/business/api/edu/organization/getOrganizationDetailById', { params: data })
}
// 获取历史记录
export function getUnqualifiedStudentsHistory() {
  return axios.get('/business/api/edu/organization/getUnqualifiedStudentsHistory')
}

