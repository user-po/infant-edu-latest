import { axios } from '@/utils/service'
// 获取落实情况信息接口
export function fetchMeasureList(data) {
  return axios.get('/business/api/edu/measuresWorkable/get', { params: data })
}

// 获取落实情况信息接口
export function fetchMeasureDetailList(data) {
  return axios.get('/business/api/edu/measures/detail', { params: data })
}

// 新建机构与课程关系
export function createMeasure(data) {
  return axios.post('/business/api/edu/measuresWorkable/new', data)
}

// 更新机构与课程关系
export function updateMeasure(data) {
  return axios.post('/business/api/edu/measuresWorkable/update', data)
}

// 删除机构与课程关系
export function deleteMeasure(data) {
  return axios.post('/business/api/edu/measuresWorkable/del', data)
}

