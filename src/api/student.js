import { axios } from '@/utils/service'

// 获取学生列表
export function fetchStudentList(data) {
  return axios.get('/business/api/edu/student/get', { params: data })
}

// 新建学生
export function createStudent(data) {
  return axios.post('/business/api/edu/student/new', data)
}

// 更新学生
export function updateStudent(data) {
  return axios.post('/business/api/edu/student/update', data)
}

// 删除学生
export function deleteStudent(data) {
  return axios.post('/business/api/edu/student/del', data)
}

// 获取不达标课程信息
export function fetchUnqualifiedScoreList(data) {
  return axios.get('/business/api/edu/student/getUnQualifiedScores', { params: data })
}

// 获取达标课程信息
export function fetchQualifiedScoreList(data) {
  return axios.get('/business/api/edu/student/getQualifiedScores', { params: data })
}

// 获取特别记录课程信息
export function fetchSpecialReCordList(data) {
  return axios.get('/business/api/edu/student/getUnQualifiedSpecialRecord', { params: data })
}
// 获取不及格成绩
export function fetchUnqualifiedStudentsScoresHistory(data) {
  return axios.get('/business/api/edu/student/getUnQualifiedScoresHistory',{ params: data })
}
//获取学生缺勤课程数目
export function getAbsenceCourseNum(data) {
  return axios.get('/business/api/edu/student/getAbsenceCourseNum',{ params: data })
}
