import { axiosInstance } from '@/utils/serviceLogin'

// 获取token
export function fetchToken(data) {
  return axiosInstance.post('/security-uaa/oauth/token', null, { params: data })
}
