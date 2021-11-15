import { axios } from '@/utils/service'

// 获取按照性别分类的
export function groupUnqualifiedStudentsBySex(data) {
  return axios.get('/business/api/edu/DataAnalysis/groupStudentsQuSituationBySex', { params: data })
}
//获取按照年龄分类
export function groupUnqualifiedStudentsByAge(data) {
    return axios.get('/business/api/edu/DataAnalysis/groupStudentsByAge', { params: data })
  }
//获取按照gpa分类
export function groupStudentsQuSituationByScore(data) {
    return axios.get('/business/api/edu/DataAnalysis/groupStudentsQuSituationByScore', { params: data })
  }

//统计达标和不达标的重要指标
export function groupStudentsQuSituationByList(data) {
    return axios.get('/business/api/edu/DataAnalysis/groupStudentsQuSituationByList', { params: data })
}
//统计所有学生的性别
export function groupAllStudentsQuSituationBySex(data){
  return axios.get('/business/api/edu/DataAnalysis/groupAllStudentsQuSituationBySex',{ params: data })
}
//统计所有学生的年龄
export function groupAllStudentsQuSituationByAge(data){
  return axios.get('/business/api/edu/DataAnalysis/groupAllStudentsQuSituationByAge',{ params: data })
}
//统计某个学生的gpa
export function groupStudentsGpaByStuId(data){
  return axios.get('/business/api/edu/DataAnalysis/groupStudentsGpaByStuId',{ params: data })
}
export function getStudentsCompletedCourse(data){
  return axios.get('/business/api/edu/DataAnalysis/getStudentsCompletedCourse',{ params: data })
}
export function getHomeWorkCompleteRateByClassId(data){
  return axios.get('/business/api/edu/DataAnalysis/getHomeWorkCompleteRateByClassId',{ params: data })
}
export function getHomeWorkWordCompleteRateByClassId(data){
  return axios.get('/business/api/edu/DataAnalysis/getHomeWorkWordCompleteRateByClassId',{ params: data })
}
export function getHomeWorkVideoCompleteRateByClassId(data){
  return axios.get('/business/api/edu/DataAnalysis/getHomeWorkVideoCompleteRateByClassId',{ params: data })
}
export function getHomeWorkWordAndVideoCompleteRateByClassId(data){
  return axios.get('/business/api/edu/DataAnalysis/getHomeWorkWordAndVideoCompleteRateByClassId',{ params: data })
}
export function groupGradeStudentsBySex(data){
  return axios.get('/business/api/edu/DataAnalysis/groupGradeStudentsBySex',{ params: data })
}
export function groupGradeStudentsByScore(data){
  return axios.get('/business/api/edu/DataAnalysis/groupGradeStudentsByScore',{ params: data })
}
export function groupGradeStudentsByAge(data){
  return axios.get('/business/api/edu/DataAnalysis/groupGradeStudentsByAge',{ params: data })
}
export function getTeachersFromOrganization(data){
  return axios.get('/business/api/edu/DataAnalysis/getTeachersFromOrganization')
}
export function getClassInfo(data){
  return axios.get('/business/api/edu/DataAnalysis/getClassInfo',{ params: data })
}