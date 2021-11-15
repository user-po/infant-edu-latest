import axios from 'axios'
import common from '@/store/modules/common'
import store from '@/store'
import { getToken } from '@/utils/auth'
axios.defaults.baseURL = common.state.aliUrl
axios.defaults.timeout = 5000
axios.interceptors.request.use(
  config => {
    // do something before request is sent
    const url = config.url
    // 暂不启用
    // if (url !== '/security-uaa/oauth/token') {
    //   if (getToken()) {
    //     const token = JSON.parse(getToken())
    //     if (token.access_token !== '') {
    //       config.headers['Authorization'] = token.token_type + ' ' + token.access_token
    //     }
    //   }
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
export { axios }
