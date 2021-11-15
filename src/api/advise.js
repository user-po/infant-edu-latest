import { axios } from '@/utils/service'

// 获取班级列表
export function fetchAdviseList(data) {
  return axios.get('/business/api/edu/measures/get', { params: data })
}

// 新建班级
export function createNewAdvise(data) {
  return axios.post('/business/api/edu/measures/new', data)
}
