import { axios } from '@/utils/service'
// 获取课程列表
export function fetchCoursesList(data) {
  return axios.get('/business/api/edu/course/get', { params: data })
}

// 新建课程
export function createCourse(data) {
  return axios.post('/business/api/edu/course/new', data)
}

// 更新课程
export function updateCourse(data) {
  return axios.post('/business/api/edu/course/update', data)
}

// 删除课程
export function deleteCourse(data) {
  return axios.post('/business/api/edu/course/del', data)
}

// 获取课程详情
export function fetchCourseDetail(data) {
  return axios.get('/business/api/edu/course/detail', { params: data })
}

// 获取落实详情
export function fetchHomeWorkDetail(data) {
  return axios.get('/business/api/edu/course/getHomeWorkDetail', { params: data })
}
