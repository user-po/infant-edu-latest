import { axios } from '@/utils/service'

// 获取班级列表
export function fetchClassList(data) {
  return axios.get('/business/api/edu/class/get', { params: data })
}

// 新建班级
export function createClass(data) {
  return axios.post('/business/api/edu/class/new', data)
}

// 更新班级
export function updateClass(data) {
  return axios.post('/business/api/edu/class/update', data)
}

// 删除班级
export function deleteClass(data) {
  return axios.post('/business/api/edu/class/del', data)
}

// 获取某个班级下所有学生
export function fetchAllStudents(data) {
  return axios.get('/business/api/edu/class/getAllStudents', { params: data })
}

