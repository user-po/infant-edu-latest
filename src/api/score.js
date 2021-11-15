import { axios } from '@/utils/service'
// 获取学生成绩信息接口
export function fetchStudentScoreList(data) {
  return axios.get('/business/api/edu/score/get', { params: data })
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

// 查询专家分析
export function fetchCommonText(data) {
  return axios.get('/business/api/edu/score/getCommonText', { params: data })
}
// 创建专家分析
export function createCommonText(data) {
  return axios.post('/business/api/edu/score/createCommonText', data)
}
// 删除专家分析
export function deleteCommonText(data) {
  return axios.post('/business/api/edu/score/delCommonText', data)
}
// 根据成绩id获取学生id
export function fetchHomeWorkByScoreID(data) {
  return axios.get('/business/api/edu/score/queryWorkinfoByScored', { params: data })
}
// 上传专家意见分析接口
export function createExpertAdviseRecord(data) {
  return axios.post('/business/api/edu/score/createExpertAdviseRecord', data)
}
// 上传已阅
export function readOk(data) {
  return axios.get('/business/api/edu/score/readOk', { params: data })
}

