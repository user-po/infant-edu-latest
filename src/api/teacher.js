import { axios } from '@/utils/service'

// 获取老师列表
export function fetchTeacherList(data) {
  return axios.get('/business/api/edu/teacher/get', { params: data })
}

// 新建老师
export function createTeacher(data) {
  return axios.post('/business/api/edu/teacher/new', data)
}

// 更新老师
export function updateTeacher(data) {
  return axios.post('/business/api/edu/teacher/update', data)
}

// 删除老师
export function deleteTeacher(data) {
  return axios.post('/business/api/edu/teacher/del', data)
}
// 获取老师名下的课程信息
export function fetchTeacherCourseList(data) {
  return axios.get('/business/api/edu/teacher/getTeachersCourse', { params: data })
}
// 判断老师的课程有没有录成绩
export function checkCourseIsLogScore(data) {
  return axios.get('/business/api/edu/teacher/checkCourseIsLogScore', { params: data })
}

// 判断某个老师下所有学生某门课程的成绩
export function getTeacherStudentsCourse(data) {
  return axios.get('/business/api/edu/teacher/getTeacherStudentsCourse', { params: data })
}

export function fetchTeacherAllStudents(data) {
  return axios.get('/business/api/edu/teacher/getTeacherAllStudents', { params: data })
}

