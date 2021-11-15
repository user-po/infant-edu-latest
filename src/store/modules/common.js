import { region } from '@/store/modules/region'
import { asyncRoutes } from '@/router'
import { filterAsyncRoutes } from '@/store/modules/permission'
import { getToken } from '@/utils/auth'
const state = {
  // baseUrl: 'http://10.12.0.158:8000/api/edu',
  // baseUrl: 'http://10.37.53.62:8000/api/edu',
  // baseUrl: 'https://m170973k01.51mypc.cn/childrenapi',
  // aliUrl: 'https://m170973k01.51mypc.cn/childrenapi',
  baseUrl: 'http://119.3.190.1:6002',
  aliUrl: 'http://127.0.0.1:8000',
  loginUrl: 'http://119.3.190.1:6002',
  fileUrl: 'http://119.3.190.1/uploads/',
  fileUploadUrl: 'http://119.3.190.1:8000/api/edu/files/upload',
  pageSize: 10,
  DIALOGSHOW: 0,
  DIALOGEDIT: 1,
  DIALOGPICK: 2,
  teacherId: 11,
  nurseryId: 17,
  userName: '',
  title: '',
  teacherOrganizationId: 0,
  region,
  currentIndexList: []
}
const mutations = {
  SET_TEACHER_ID: (state, teacherId) => {
    state.teacherId = teacherId
  },
  SET_NURSERY_ID: (state, nurseryId) => {
    state.nurseryId = nurseryId
  },
  SET_TEACHER_ORGANIZATION_ID: (state, teacherOrganizationId) => {
    state.teacherOrganizationId = teacherOrganizationId
  },
  SET_TEACHER_TITLE: (state, title) => {
    state.title = title
  },
  SET_USER_NAME: (state, userName) => {
    state.userName = userName
  }
}

const actions = {
  initData({ commit }, roles) {
    return new Promise(resolve => {
      const token = JSON.parse(getToken())
      console.log(token)
      commit('SET_TEACHER_ID', token.nurseryId)
      commit('SET_NURSERY_ID', token.nurseryId)
      commit('SET_TEACHER_TITLE', token.title)
      commit('SET_TEACHER_ORGANIZATION_ID', token.teacherOrganizationId)
      commit('SET_USER_NAME', token.username)
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
