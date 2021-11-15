import request from '@/utils/request'
import { axiosInstance } from '@/utils/serviceLogin'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function userLogin(data) {
  return axiosInstance.get('auth/user/login', { params: data })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
