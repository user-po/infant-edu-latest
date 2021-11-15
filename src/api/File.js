import { axios } from '@/utils/service'

// 获取文件信息接口
export function getInfo(data) {
  return axios.get('/business/api/edu/files/get', { params: data })
}
// 上传文件列表
export function upload(data) {
  return axios.post('/business/api/edu/files/upload', data)
}

export function uploadPolyvInfo(data) {
  return axios.get('/business/api/edu/files/upload1', { params: data })
}

// 文件更新
export function update(data) {
  return axios.post('/business/api/edu/files/update', data)
}

// 文件展示
export function show(data) {
  return axios.get('/business/api/edu/files/show', { params: data })
}

// 文件删除
export function del(data) {
  return axios.post('/business/api/edu/files/del', data)
}
