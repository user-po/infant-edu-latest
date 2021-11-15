import { axiosInstance } from '@/utils/serviceLogin'
// 判断添加教师时，手机号是否用过
export function fetchHomeWorkId(data) {
  return axiosInstance.get('auth/studentwork/selhomeworkid', { params: data })
}
