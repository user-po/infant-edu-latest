import { axios } from '@/utils/service'
// 获取学生成绩信息接口
export function fetchStudentScoreList(data) {
  return axios.get('/business/api/edu/score/get')
}

// 创建学生成绩接口
export function createStudentScore(data) {
  return axios.post('/business/api/edu/score/new', data)
}

// 更新学生成绩接口
export function updateStudentScore(data) {
  return axios.post('/business/api/edu/score/update', data)
}

// 删除学生成绩接口
export function deleteStudentScore(data) {
  return axios.post('/business/api/edu/score/update', data)
}
