import axios from 'axios'
import common from '@/store/modules/common'
const axiosInstance = axios.create({
  baseURL: common.state.loginUrl,
  timeout: 5000
})
export { axiosInstance }
