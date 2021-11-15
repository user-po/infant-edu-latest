import { axiosInstance } from '@/utils/serviceLogin'
// 判断添加教师时，手机号是否用过
export function checkPhoneUsed(data) {
  return axiosInstance.get('/auth/user/isusername', { params: data })
}
// 添加教师时获取一个唯一的uniqueid 上传时加到remark字段
export function fetchUniqueID() {
  return axiosInstance.get('/auth/user/getUniqueID')
}
export function updatePassword(data) {
  return axiosInstance.post('/business/api/edu/user/update', data)
}
// 获取消息总数
export function fetchArticleCount(data) {
  return axiosInstance.get('/auth/article/count', { params: data })
}
// 获取消息
export function fetchArticle(data) {
  return axiosInstance.get('/auth/article/selarticle', { params: data })
}
// 消费消息
export function consumeArticle(data) {
  return axiosInstance.get('/auth/article/updates', { params: data })
}

// 获取不及格成绩
export function fetchUnqualifiedStudentsScoresHistory(data) {
  return axiosInstance.get('/business/api/edu/student/getUnQualifiedScoresHistory', { params: data })
}
